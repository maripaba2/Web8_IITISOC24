'use client';

import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function FaceRecognitionPage() {
  const { data: session } = useSession();
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const response = await axios.post('/api/attendance/mark', { image: imageSrc, email: session.user.email });
    if (response.data.success) {
      setMessage('Attendance marked successfully');
    } else {
      setMessage('Failed to mark attendance');
    }
  };

  if (!session) {
    return <p>You need to be signed in to view this page</p>;
  }

  return (
    <div className="face-recognition">
      <h1 className="head_text text-center">
        <span className="blue_gradient">Face Recognition</span>
      </h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam"
      />
      <button onClick={capture}>Mark Attendance</button>
      {message && <p>{message}</p>}
    </div>
  );
}
