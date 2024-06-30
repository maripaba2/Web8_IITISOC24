import { connectToDB } from '../../../utils/database';
import Feedback from '../../../models/Feedback';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(req) {
  const { name, email, feedback } = await req.json();

  try {
    await connectToDB();
    await Feedback.create({ name, email, feedback });

    return NextResponse.json({
      msg: ["Feedback submitted successfully"],
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      console.log(errorList);
      return NextResponse.json({ msg: errorList });
    } else {
      return NextResponse.json({ msg: ["Unable to submit feedback."] });
    }
  }
}
