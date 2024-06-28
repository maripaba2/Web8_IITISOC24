import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';

export const handler = async (req, res) => {
  if (req.method !== 'POST') {
    console.error('Method not allowed');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  await connectToDB();

  const { email } = req.body;

  if (!email) {
    console.error('Email is required');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const attendance = new Attendance({
      email,
      date: new Date().setHours(0, 0, 0, 0),
      markedAt: new Date(),
    });

    await attendance.save();

    return res.status(200).json({ message: 'Attendance marked' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ensure the default export is used
export default handler;
