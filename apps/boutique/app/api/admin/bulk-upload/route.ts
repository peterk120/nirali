import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { StoreType, getCSVTemplate, getAllowedStoreTypes } from '../../../../lib/csv-templates';
import { FileParser, ParseResult } from '../../../../lib/csv-parser';
import { uploadFile } from '../../../../lib/cloudinary';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse form data
    const formData = await request.formData();
    const storeType = formData.get('storeType') as StoreType;
    const csvFile = formData.get('csvFile') as File;
    const zipFile = formData.get('zipFile') as File;

    // Validate inputs
    if (!storeType) {
      return NextResponse.json(
        { error: 'Store type is required' },
        { status: 400 }
      );
    }

    if (!getAllowedStoreTypes().includes(storeType)) {
      return NextResponse.json(
        { error: `Invalid store type. Allowed types: ${getAllowedStoreTypes().join(', ')}` },
        { status: 400 }
      );
    }

    if (!csvFile) {
      return NextResponse.json(
        { error: 'CSV file is required' },
        { status: 400 }
      );
    }

    if (!zipFile) {
      return NextResponse.json(
        { error: 'ZIP file containing images is required' },
        { status: 400 }
      );
    }

    // Read file content
    const fileBuffer = Buffer.from(await csvFile.arrayBuffer());

    // Parse and validate file
    console.log(`Parsing ${csvFile.name} for store type: ${storeType}`);
    const parseResult: ParseResult = FileParser.parse(storeType, fileBuffer, csvFile.name);
    
    console.log(`Parse result: ${parseResult.products.length} products, ${parseResult.errors.length} errors`);
    
    if (parseResult.errors.length > 0) {
      console.error('Parse errors:', parseResult.errors);
      return NextResponse.json(
        { 
          error: 'File validation failed',
          details: parseResult.errors 
        },
        { status: 400 }
      );
    }

    if (parseResult.products.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found in CSV file' },
        { status: 400 }
      );
    }

    // Process ZIP file and extract images
    console.log('Processing ZIP file...');
    const zipBuffer = Buffer.from(await zipFile.arrayBuffer());
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer);
    
    // Create a map of filename to file content
    const imageFiles = new Map<string, Buffer>();
    const processedFiles = [];
    
    for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir) { // Only process files, not directories
        const fileName = relativePath.split('/').pop() || relativePath;
        const fileContent = await zipEntry.async('nodebuffer');
        imageFiles.set(fileName, fileContent);
        processedFiles.push(fileName);
      }
    }
    
    console.log(`Found ${imageFiles.size} images in ZIP:`, processedFiles);

    // Process products and save to database
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
      warnings: parseResult.warnings
    };

    for (const productData of parseResult.products) {
      try {
        // Check if the image file exists in the ZIP
        const imageFileName = productData.imageName;
        if (!imageFiles.has(imageFileName)) {
          results.failed++;
          results.errors.push(`Image file "${imageFileName}" not found in ZIP file`);
          continue;
        }

        // Upload image to Cloudinary
        console.log(`Uploading image: ${imageFileName}`);
        const imageBuffer = imageFiles.get(imageFileName)!;
        // Convert buffer to Uint8Array first
        const uint8Array = new Uint8Array(imageBuffer);
        const imageFile = new File([uint8Array], imageFileName, { type: 'image/jpeg' });
        
        const uploadResult = await uploadFile(imageFile, `nirali-sai-${storeType}`);
        console.log(`Image uploaded successfully: ${uploadResult.secure_url}`);

        // Create product with dynamic attributes and Cloudinary URL
        const newProduct = new Product({
          name: productData.productName,
          description: productData.description,
          category: productData.category,
          price: productData.price,
          stock: productData.stock,
          image: uploadResult.secure_url,
          cloudinary_public_id: uploadResult.public_id,
          brand: storeType, // Use storeType as brand
          status: 'Active',
          storeType: storeType,
          attributes: productData.attributes
        });

        // Save to database
        await newProduct.save();
        results.successful++;
        console.log(`Product saved successfully: ${productData.productName}`);
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to save product "${productData.productName}": ${(error as Error).message}`);
        console.error(`Product save error for "${productData.productName}":`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk upload completed successfully`,
      results: {
        total: parseResult.products.length,
        successful: results.successful,
        failed: results.failed,
        warnings: results.warnings,
        errors: results.errors
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { 
        error: 'Bulk upload failed',
        details: (error as Error).message 
      },
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

    // Get CSV template for the specified store type
    const template = getCSVTemplate(storeType);
    
    // Generate CSV content with headers
    const csvContent = template.headers.join(',') + '\n';
    
    // Return CSV file as download
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