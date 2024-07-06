import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';
import { sendLateArrivalNotification } from '../../../../utils/email';

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  await connectToDB();

  const currentTime = new Date();
  const isLate = currentTime.getHours() >= 23;

  try {
    const attendance = new Attendance({
      email,
      date: new Date().setHours(0, 0, 0, 0),
      markedAt: currentTime,
    });

    await attendance.save();

    if (isLate) {
      await sendLateArrivalNotification(email);
    }

    return NextResponse.json({ message: 'Attendance marked' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
