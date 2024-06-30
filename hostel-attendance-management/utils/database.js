import mongoose from 'mongoose';

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "hostel_attendance_management",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
    throw new Error('Database connection error');
  }
};

export { connectToDB };
