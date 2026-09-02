import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await request.json();
    
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      order = await Order.findOneAndUpdate({ _id: id }, { status }, { new: true });
    }

    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update order status', error: error.message }, { status: 500 });
  }
}
