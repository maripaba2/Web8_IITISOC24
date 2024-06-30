import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ msg: ["Email is required"] }, { status: 400 });
  }

  try {
    await connectToDB();
    const logs = await Attendance.find({ email }).sort({ date: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching attendance log:', error);
    return NextResponse.json({ msg: ["Unable to fetch attendance log"] }, { status: 500 });
  }
}
