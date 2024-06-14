// // app/api/attendance/mark/route.js
// import { getSession } from 'next-auth/react';
// import Attendance from '../../../../models/Attendance';
// import connectDB from '../../../../utils/database';
// import { v4 as uuidv4 } from 'uuid';
// import cv from '@u4/opencv4nodejs';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req) {
//   await connectDB();
//   const session = await getSession({ req });
//   if (!session) {
//     return new Response(JSON.stringify({ error: 'Not authenticated' }), {
//       status: 401,
//     });
//   }

//   const { email, image } = await req.json();

//   // Decode the base64 image
//   const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
//   const buffer = Buffer.from(base64Data, 'base64');
//   const imagePath = path.join(process.cwd(), `temp-${uuidv4()}.jpg`);

//   fs.writeFileSync(imagePath, buffer);

//   // Use OpenCV to process the image
//   const img = cv.imread(imagePath);
//   const grayImg = img.bgrToGray();
//   const faces = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2).detectMultiScale(grayImg).objects;

//   if (faces.length === 0) {
//     fs.unlinkSync(imagePath); // Clean up temp image
//     return new Response(JSON.stringify({ error: 'No face detected' }), {
//       status: 400,
//     });
//   }

//   // Mark attendance
//   const now = new Date();
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const existingAttendance = await Attendance.findOne({ email, date: { $gte: today } });

//   if (existingAttendance) {
//     fs.unlinkSync(imagePath); // Clean up temp image
//     return new Response(JSON.stringify({ message: 'Attendance already marked' }), {
//       status: 400,
//     });
//   }

//   const newAttendance = new Attendance({
//     email,
//     date: today,
//     markedAt: now,
//   });

//   await newAttendance.save();
//   fs.unlinkSync(imagePath); // Clean up temp image
//   return new Response(JSON.stringify({ success: true }), {
//     status: 201,
//   });
// }
