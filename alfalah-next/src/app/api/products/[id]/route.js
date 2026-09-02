import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function PUT(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const formData = await request.formData();
    
    const updateData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'imageFile' && key !== 'variants') {
        updateData[key] = value;
      }
    }
    
    let variants = formData.get('variants');
    if (typeof variants === 'string') {
      try {
        updateData.variants = JSON.parse(variants);
      } catch (e) {
        // ignore invalid JSON
      }
    }

    const imageFile = formData.get('imageFile');
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      updateData.image = await uploadImage(buffer);
    } else if (formData.get('image')) {
      updateData.image = formData.get('image');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete product', error: error.message }, { status: 500 });
  }
}
