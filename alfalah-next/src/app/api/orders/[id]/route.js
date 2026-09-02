import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ _id: id });
    }
    
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch order', error: error.message }, { status: 500 });
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
    
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    let deletedOrder = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedOrder = await Order.findByIdAndDelete(id);
    } else {
      deletedOrder = await Order.findOneAndDelete({ _id: id });
    }

    if (!deletedOrder) return NextResponse.json({ message: `Order #${id} not found` }, { status: 404 });
    return NextResponse.json({ message: 'Order deleted successfully', id });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete order', error: error.message }, { status: 500 });
  }
}
