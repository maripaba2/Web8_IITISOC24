import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  await connectToDB();

  const currentTime = new Date();
  const startOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

  try {
    const existingAttendance = await Attendance.findOne({
      email,
      date: startOfDay,
    });

    if (existingAttendance) {
      return NextResponse.json({ message: 'Attendance already marked for today' }, { status: 400 });
    }

    const isLate = currentTime.getHours() >= 23 || currentTime.getHours() < 6;

    const attendance = new Attendance({
      email,
      date: startOfDay,
      markedAt: currentTime,
    });

    await attendance.save();

  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
