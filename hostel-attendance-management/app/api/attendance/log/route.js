import { connectToDB } from '../../../../utils/database';
import Attendance from '../../../../models/Attendance';

export const handler = async (req, res) => {
  if (req.method !== 'GET') {
    console.error('Method not allowed');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  await connectToDB();

  const { email } = req.query;

  if (!email) {
    console.error('Email is required');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const attendanceLog = await Attendance.find({ email });
    return res.status(200).json(attendanceLog);
  } catch (error) {
    console.error('Error fetching attendance log:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ensure the default export is used
export default handler;
