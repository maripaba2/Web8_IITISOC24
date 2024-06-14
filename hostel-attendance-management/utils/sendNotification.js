import nodemailer from 'nodemailer';
import Attendance from '../models/Attendance';
import connectDB from './database';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendLateNotification = async () => {
  await connectDB();

  const now = new Date();
  now.setHours(23, 0, 0, 0);

  const lateAttendances = await Attendance.find({ markedAt: { $gte: now } });

  lateAttendances.forEach(attendance => {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: attendance.email,
      subject: 'Late Departure Notification',
      text: `You marked your attendance late on ${attendance.markedAt}. Please ensure to mark it before 11:00 PM next time.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });
};

export default sendLateNotification;
