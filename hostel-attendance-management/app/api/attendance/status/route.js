import { getSession } from 'next-auth/react';
import Attendance from '../../../../models/Attendance';
import connectDB from '../../../../utils/database';

export async function GET(req) {
  await connectDB();
  const session = await getSession({ req });
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
    });
  }

  const { email } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({ email, date: { $gte: today } });

  if (attendance) {
    return new Response(JSON.stringify({ marked: true }), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify({ marked: false }), {
      status: 200,
    });
  }
}
