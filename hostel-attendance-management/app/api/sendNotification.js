import sendLateNotification from '../../../utils/sendNotification';

export default async function handler(req, res) {
  await sendLateNotification();
  res.status(200).json({ message: 'Notifications sent' });
}
