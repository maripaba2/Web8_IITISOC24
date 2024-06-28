// utils/sendNotification.js
import nodemailer from 'nodemailer';
import connectToDatabase from './database';
import Attendance from '../models/Attendance';

export async function sendDailyReminders() {
  await connectToDatabase();

  const users = await User.find();
  const currentDate = new Date().toISOString().slice(0, 10);

  for (const user of users) {
    const attendance = await Attendance.findOne({ email: user.email, date: currentDate });

    if (!attendance) {
      await sendReminderEmail(user.email);
    }
  }
}

async function sendReminderEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Attendance Reminder',
    text: 'Please mark your attendance before 11 PM.',
  };

  await transporter.sendMail(mailOptions);
}
