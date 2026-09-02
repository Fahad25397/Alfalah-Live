import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { customer, items, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const order = new Order({ customer, items, totalAmount });
    const createdOrder = await order.save();

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create order', error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 0;
    const skip = (page - 1) * limit;

    let query = Order.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const orders = await query;
    const total = await Order.countDocuments();

    if (limit > 0) {
      return NextResponse.json({
        data: orders,
        pagination: { total, page, pages: Math.ceil(total / limit) }
      });
    } else {
      return NextResponse.json(orders);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders', error: error.message }, { status: 500 });
  }
}
