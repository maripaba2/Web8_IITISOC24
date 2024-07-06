'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
  const { data: session } = useSession();
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [message, setMessage] = useState('Loading models...');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [descriptors, setDescriptors] = useState([]);

  const loadModels = async () => {
    const MODEL_URL = `${window.location.origin}/models`;
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await loadReferenceImages();
      setMessage('Models loaded successfully');
      startVideo();
    } catch (error) {
      console.error('Error loading models:', error);
      setMessage('Failed to load face detection models');
    }
  };

  const loadReferenceImages = async () => {
    const students = ['sathwik.jpg', 'vikas.jpg', 'ganesh.jpg']; // Updated list of student image file names
    const descriptors = [];

    for (const student of students) {
      const img = await faceapi.fetchImage(`/students/${student}`);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (detections) {
        descriptors.push({
          descriptor: detections.descriptor,
          name: student.split('.')[0] // File name is the student's name
        });
      }
    }
    setDescriptors(descriptors);
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
        setMessage('Failed to start webcam');
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const detectFace = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      return;
    }

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptors();

    if (detections.length > 0) {
      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });

      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

      for (const detection of resizedDetections) {
        const bestMatch = findMatch(detection.descriptor);
        if (bestMatch && !attendanceMarked) {
          markAttendance(session.user.email);
          setMessage(`Attendance marked for ${bestMatch.name}`);
        }

        if (bestMatch) {
          const { box } = detection.detection;
          const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.name });
          drawBox.draw(canvasRef.current);
        }
      }
    } else {
      setMessage('No face detected');
    }
  };

  const findMatch = (descriptor) => {
    if (descriptors.length === 0) return null;
    let bestMatch = { distance: 1 };
    for (const reference of descriptors) {
      const distance = faceapi.euclideanDistance(descriptor, reference.descriptor);
      if (distance < bestMatch.distance) {
        bestMatch = { ...reference, distance };
      }
    }
    return bestMatch.distance < 0.6 ? bestMatch : null; // Threshold for a match
  };

  const markAttendance = async (email) => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setAttendanceMarked(true);
        setMessage('Attendance marked successfully!');
      } else {
        console.error('Failed to mark attendance:', data.error);
        setMessage('Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error marking attendance');
    }
  };

  useEffect(() => {
    if (session) {
      loadModels();
      const intervalId = setInterval(detectFace, 1000);

      return () => {
        clearInterval(intervalId);
        stopVideo();
      };
    }
  }, [session]);

  useEffect(() => {
    window.addEventListener('beforeunload', stopVideo);
    return () => {
      window.removeEventListener('beforeunload', stopVideo);
      stopVideo();
    };
  }, []);

  if (!session) {
    return (
      <div>
        <p>Please sign in to mark your attendance.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#1f8ef1' }}>Face Recognition Attendance</h1>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <video ref={videoRef} autoPlay muted style={{ width: '60%', borderRadius: '10px', marginBottom: '20px' }}></video>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default FaceRecognition;
