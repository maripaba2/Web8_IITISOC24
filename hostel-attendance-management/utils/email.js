import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendLateArrivalNotification = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Late Arrival Notification',
    text: 'You have been marked as late for attendance.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendLateArrivalNotification };
