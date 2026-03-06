export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { StoreType, getCSVTemplate, getAllowedStoreTypes } from '../../../../lib/csv-templates';
import { FileParser, ParseResult } from '../../../../lib/csv-parser';
import JSZip from 'jszip';
import crypto from 'crypto';

// ── Same working upload function used in single-product upload ────────────────
async function uploadToCloudinary(file: File, folder = 'nirali-sai-boutique'): Promise<{ secure_url: string; public_id: string }> {
  let apiKey: string, apiSecret: string, cloudName: string;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    if (!match) throw new Error('Invalid CLOUDINARY_URL format');
    [, apiKey, apiSecret, cloudName] = match;
  } else {
    apiKey = process.env.CLOUDINARY_API_KEY || '';
    apiSecret = process.env.CLOUDINARY_API_SECRET || '';
    cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    if (!apiKey || !apiSecret || !cloudName)
      throw new Error('Cloudinary credentials missing — check CLOUDINARY_URL or CLOUDINARY_API_KEY/SECRET/CLOUD_NAME in .env');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const bytes = await file.arrayBuffer();
  const blob = new Blob([Buffer.from(bytes)], { type: file.type });

  const form = new FormData();
  form.append('file', blob, file.name);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const storeType = formData.get('storeType') as StoreType;
    const csvFile = formData.get('csvFile') as File;
    const zipFile = formData.get('zipFile') as File;

    if (!storeType) {
      return NextResponse.json({ error: 'Store type is required' }, { status: 400 });
    }
    if (!getAllowedStoreTypes().includes(storeType)) {
      return NextResponse.json(
        { error: `Invalid store type. Allowed types: ${getAllowedStoreTypes().join(', ')}` },
        { status: 400 }
      );
    }
    if (!csvFile) {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
    }
    if (!zipFile) {
      return NextResponse.json({ error: 'ZIP file containing images is required' }, { status: 400 });
    }

    // ── STEP 1: Read CSV ──────────────────────────────────────────────────────
    let fileBuffer: Buffer;
    try {
      fileBuffer = Buffer.from(await csvFile.arrayBuffer());
      console.log(`[STEP 1 ✅] CSV read OK — size: ${fileBuffer.length} bytes`);
    } catch (err) {
      console.error('[STEP 1 ❌] Failed to read CSV file:', err);
      return NextResponse.json(
        { error: 'STEP 1 FAILED: Could not read CSV file', details: (err as Error).message },
        { status: 400 }
      );
    }

    // ── STEP 2: Parse CSV ─────────────────────────────────────────────────────
    let parseResult: ParseResult;
    try {
      parseResult = FileParser.parse(storeType, fileBuffer, csvFile.name);
      console.log(`[STEP 2 ✅] CSV parsed — ${parseResult.products.length} products, ${parseResult.errors.length} errors`);
    } catch (err) {
      console.error('[STEP 2 ❌] CSV parsing crashed:', err);
      return NextResponse.json(
        { error: 'STEP 2 FAILED: CSV parsing crashed', details: (err as Error).message },
        { status: 400 }
      );
    }

    if (parseResult.errors.length > 0) {
      console.error('[STEP 2 ❌] CSV has validation errors:', parseResult.errors);
      return NextResponse.json(
        { error: 'STEP 2 FAILED: CSV validation errors', details: parseResult.errors },
        { status: 400 }
      );
    }

    if (parseResult.products.length === 0) {
      return NextResponse.json(
        { error: 'STEP 2 FAILED: No valid products found in CSV file' },
        { status: 400 }
      );
    }

    // ── STEP 3: Read ZIP ──────────────────────────────────────────────────────
    let zipBuffer: Buffer;
    try {
      zipBuffer = Buffer.from(await zipFile.arrayBuffer());
      console.log(`[STEP 3 ✅] ZIP read OK — size: ${zipBuffer.length} bytes`);
    } catch (err) {
      console.error('[STEP 3 ❌] Failed to read ZIP file:', err);
      return NextResponse.json(
        { error: 'STEP 3 FAILED: Could not read ZIP file', details: (err as Error).message },
        { status: 400 }
      );
    }

    // ── STEP 4: Extract ZIP ───────────────────────────────────────────────────
    const imageFiles = new Map<string, Buffer>();
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipBuffer);
      const processedFiles: string[] = [];

      for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
        if (!zipEntry.dir) {
          const fileName = relativePath.split('/').pop() || relativePath;
          const fileContent = await zipEntry.async('nodebuffer');
          imageFiles.set(fileName, fileContent);
          processedFiles.push(fileName);
        }
      }

      console.log(`[STEP 4 ✅] ZIP extracted — ${imageFiles.size} files found:`, processedFiles);

      if (imageFiles.size === 0) {
        return NextResponse.json(
          { error: 'STEP 4 FAILED: ZIP file is empty or has no valid files' },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error('[STEP 4 ❌] Failed to extract ZIP:', err);
      return NextResponse.json(
        { error: 'STEP 4 FAILED: Could not extract ZIP file', details: (err as Error).message },
        { status: 400 }
      );
    }

    // ── STEP 5: Process each product ──────────────────────────────────────────
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
      warnings: parseResult.warnings,
      productLog: [] as { product: string; status: string; step: string; detail: string }[]
    };

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'];
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.heic': 'image/heic',
      '.heif': 'image/heif',
    };

    for (const productData of parseResult.products) {
      const productName = productData.productName;
      const imageFileName = productData.imageName;

      console.log(`\n[PRODUCT] Processing: "${productName}" — image: "${imageFileName}"`);

      // 5a: Check imageName exists in CSV row
      if (!imageFileName) {
        const msg = `No imageName field found in CSV row for "${productName}"`;
        console.error(`  [5a ❌] ${msg}`);
        results.failed++;
        results.errors.push(msg);
        results.productLog.push({ product: productName, status: 'FAILED', step: '5a - Missing imageName in CSV', detail: msg });
        continue;
      }

      // 5b: Check image file extension is allowed
      const ext = imageFileName.toLowerCase().slice(imageFileName.lastIndexOf('.'));
      if (!allowedExtensions.includes(ext)) {
        const msg = `"${imageFileName}" has unsupported extension "${ext}". Allowed: ${allowedExtensions.join(', ')}`;
        console.error(`  [5b ❌] ${msg}`);
        results.failed++;
        results.errors.push(msg);
        results.productLog.push({ product: productName, status: 'FAILED', step: '5b - Invalid image extension', detail: msg });
        continue;
      }

      // 5c: Check image exists in ZIP
      if (!imageFiles.has(imageFileName)) {
        const zipFileList = Array.from(imageFiles.keys()).join(', ');
        const msg = `Image "${imageFileName}" not found in ZIP. Files available in ZIP: [${zipFileList}]`;
        console.error(`  [5c ❌] ${msg}`);
        results.failed++;
        results.errors.push(msg);
        results.productLog.push({ product: productName, status: 'FAILED', step: '5c - Image not found in ZIP', detail: msg });
        continue;
      }

      // 5d: Upload to Cloudinary
      let uploadResult: { secure_url: string; public_id: string };
      try {
        const imageBuffer = imageFiles.get(imageFileName)!;
        const uint8Array = new Uint8Array(imageBuffer);
        const mimeType = mimeTypes[ext] ?? 'image/jpeg';
        const imageFile = new File([uint8Array], imageFileName, { type: mimeType });

        console.log(`  [5d] Uploading "${imageFileName}" (${uint8Array.length} bytes, type: ${mimeType})...`);
        uploadResult = await uploadToCloudinary(imageFile, `nirali-sai-${storeType}`);
        console.log(`  [5d ✅] Uploaded: ${uploadResult.secure_url}`);
      } catch (err) {
        const msg = `Cloudinary upload failed for "${imageFileName}": ${(err as Error).message}`;
        console.error(`  [5d ❌] ${msg}`);
        results.failed++;
        results.errors.push(msg);
        results.productLog.push({ product: productName, status: 'FAILED', step: '5d - Cloudinary upload failed', detail: msg });
        continue;
      }

      // 5e: Save to MongoDB
      try {
        const newProduct = new Product({
          name: productData.productName,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          image: uploadResult.secure_url,
          cloudinary_public_id: uploadResult.public_id,
          brand: storeType,
          status: 'Active',
          storeType: storeType,
          attributes: productData.attributes
        });

        await newProduct.save();
        results.successful++;
        console.log(`  [5e ✅] Saved to DB: "${productName}"`);
        results.productLog.push({ product: productName, status: 'SUCCESS', step: '5e - Saved to DB', detail: uploadResult.secure_url });
      } catch (err) {
        const msg = `MongoDB save failed for "${productName}": ${(err as Error).message}`;
        console.error(`  [5e ❌] ${msg}`);
        results.failed++;
        results.errors.push(msg);
        results.productLog.push({ product: productName, status: 'FAILED', step: '5e - MongoDB save failed', detail: msg });
      }
    }

    console.log(`\n[DONE] Successful: ${results.successful}, Failed: ${results.failed}`);

    return NextResponse.json({
      success: true,
      message: 'Bulk upload completed',
      results: {
        total: parseResult.products.length,
        successful: results.successful,
        failed: results.failed,
        warnings: results.warnings,
        errors: results.errors,
        productLog: results.productLog  // ← full per-product breakdown
      }
    });

  } catch (error) {
    console.error('[FATAL ❌] Bulk upload crashed:', error);
    return NextResponse.json(
      { error: 'Bulk upload failed (unexpected crash)', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const storeType = url.searchParams.get('storeType') as StoreType;

    if (!storeType) {
      return NextResponse.json(
        { error: 'Store type is required as query parameter' },
        { status: 400 }
      );
    }

    if (!getAllowedStoreTypes().includes(storeType)) {
      return NextResponse.json(
        { error: `Invalid store type. Allowed types: ${getAllowedStoreTypes().join(', ')}` },
        { status: 400 }
      );
    }

    const template = getCSVTemplate(storeType);
    const csvContent = template.headers.join(',') + '\n';

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${template.fileName}"`,
      },
    });

  } catch (error) {
    console.error('Template download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}