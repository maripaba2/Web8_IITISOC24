import { connectToDB } from '../../../../utils/database';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Assuming you have a method to capture the frame
    const frame = await fetch('http://localhost:8000/frame'); // Your Python backend serving the frame
    if (!frame.ok) {
      throw new Error('Failed to fetch frame from backend');
    }
    const frameBlob = await frame.blob();
    return new Response(frameBlob, { status: 200 });
  } catch (error) {
    console.error('Error fetching frame:', error);
    return NextResponse.json({ msg: "Unable to fetch frame" }, { status: 500 });
  }
}
