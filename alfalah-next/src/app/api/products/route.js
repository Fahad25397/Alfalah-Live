import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 0;

    const skip = (page - 1) * limit;

    let query = Product.find().sort({ order: 1, createdAt: -1 });
    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const products = await query;
    const total = await Product.countDocuments();

    if (limit > 0) {
      return NextResponse.json({
        data: products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      });
    } else {
      return NextResponse.json(products);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const formData = await request.formData();
    
    const name = formData.get('name');
    const urduName = formData.get('urduName') || '';
    const category = formData.get('category');
    const description = formData.get('description');
    const order = formData.get('order') || 0;
    
    let variants = formData.get('variants');
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    const imageFile = formData.get('imageFile');
    const imageUrlFallback = formData.get('image');
    let imageUrl = imageUrlFallback;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadImage(buffer);
    }

    if (!imageUrl) {
      return NextResponse.json({ message: 'Image is required' }, { status: 400 });
    }

    const newProduct = new Product({ 
      name, urduName, category, description, image: imageUrl, variants, order: parseInt(order) 
    });
    
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add product', error: error.message }, { status: 500 });
  }
}
