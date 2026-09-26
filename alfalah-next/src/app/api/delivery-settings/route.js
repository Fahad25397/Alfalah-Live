import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import DeliverySetting from '@/lib/models/DeliverySetting';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const settings = await DeliverySetting.find({});
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching delivery settings', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const { category, weight, charge } = await request.json();

    if (!category || !weight || charge === undefined) {
      return NextResponse.json({ message: 'Category, weight, and charge are required' }, { status: 400 });
    }

    const setting = new DeliverySetting({ category, weight, charge });
    await setting.save();
    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'A delivery rule for this category and weight already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error creating delivery setting', error: error.message }, { status: 500 });
  }
}
