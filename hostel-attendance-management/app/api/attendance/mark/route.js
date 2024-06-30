import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ msg: ["Email is required"] }, { status: 400 });
  }

  try {
    await connectToDB();
    const now = new Date();
    const newAttendance = new Attendance({
      email,
      date: now,
      markedAt: now,
    });
    await newAttendance.save();

    return NextResponse.json({ msg: ["Attendance marked successfully"] }, { status: 200 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ msg: ["Unable to mark attendance"] }, { status: 500 });
  }
}
