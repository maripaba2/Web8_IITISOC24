import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
