// models/Attendance.js
import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  markedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
