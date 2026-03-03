import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Test brand filtering
    const boutiqueProducts = await Product.find({ brand: 'boutique' });
    const allProducts = await Product.find();
    
    // Add brand field to existing products if missing
    const productsWithoutBrand = await Product.find({ brand: { $exists: false } });
    if (productsWithoutBrand.length > 0) {
      await Product.updateMany(
        { brand: { $exists: false } },
        { $set: { brand: 'boutique' } }
      );
      console.log(`Added brand field to ${productsWithoutBrand.length} products`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Brand filtering test successful',
      totalProducts: allProducts.length,
      boutiqueProducts: boutiqueProducts.length,
      productsWithoutBrand: productsWithoutBrand.length,
      sampleProducts: boutiqueProducts.slice(0, 3).map(p => ({
        id: p._id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price
      }))
    });
  } catch (error) {
    console.error('Brand filtering test error:', error);
    return NextResponse.json(
      { success: false, error: 'Brand filtering test failed' },
      { status: 500 }
    );
  }
}