import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DeliverySetting from '@/lib/models/DeliverySetting';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const { category, weight, charge } = await request.json();
    
    const setting = await DeliverySetting.findByIdAndUpdate(
      id,
      { category, weight, charge },
      { new: true, runValidators: true }
    );
    
    if (!setting) {
      return NextResponse.json({ message: 'Delivery setting not found' }, { status: 404 });
    }
    return NextResponse.json(setting);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'A delivery rule for this category and weight already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error updating delivery setting', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    
    const setting = await DeliverySetting.findByIdAndDelete(id);
    if (!setting) {
      return NextResponse.json({ message: 'Delivery setting not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Delivery setting deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error deleting delivery setting', error: error.message }, { status: 500 });
  }
}
