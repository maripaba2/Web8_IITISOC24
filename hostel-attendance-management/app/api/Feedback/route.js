// app/api/feedback/route.js
import { getSession } from 'next-auth/react';
import Feedback from '../../../models/Feedback';
import connectDB from '../../../utils/database';

export async function POST(req) {
  await connectDB();
  const { name, email, feedback } = await req.json();

  const newFeedback = new Feedback({
    name,
    email,
    feedback,
  });

  await newFeedback.save();
  return new Response(JSON.stringify({ success: true }), {
    status: 201,
  });
}
