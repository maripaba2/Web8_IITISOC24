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
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionTimeout, setDetectionTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${window.location.origin}/models`;
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await loadReferenceImages();
        setMessage('Models loaded successfully');
        setIsLoading(false);
        startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
        setMessage('Failed to load face detection models');
      }
    };

    const loadReferenceImages = async () => {
      const students = ['sathwik.jpg', 'vikas.jpg', 'ganesh.jpg', 'sudheendra.jpg'];
      const descriptors = [];

      for (const student of students) {
        const img = await faceapi.fetchImage(`/students/${student}`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
          descriptors.push({
            descriptor: detections.descriptor,
            name: student.split('.')[0],
          });
        }
      }
      setDescriptors(descriptors);
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              detectFace();
            };
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
          setMessage('Failed to start webcam');
        });
    };

    const stopVideo = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    const detectFace = async () => {
      if (!videoRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        for (const detection of resizedDetections) {
          const bestMatch = findMatch(detection.descriptor);
          if (bestMatch && !attendanceMarked) {
            if (!faceDetected) {
              setFaceDetected(true);
              setMessage(`Hello ${bestMatch.name}`);
              if (detectionTimeout) clearTimeout(detectionTimeout);
              setDetectionTimeout(setTimeout(() => {
                markAttendance(session.user.email);
                setMessage(`Attendance marked for ${bestMatch.name}`);
                setAttendanceMarked(true);
                setTimeout(stopAndRestartVideo, 1000); // Stop and restart video after marking attendance
              }, 3000));
            }

            const { box } = detection.detection;
            const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.name });
            drawBox.draw(canvasRef.current);
          }
        }
      } else {
        if (faceDetected) {
          setFaceDetected(false);
          setMessage('No face detected');
          if (detectionTimeout) clearTimeout(detectionTimeout);
        }
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
      return bestMatch.distance < 0.6 ? bestMatch : null;
    };

    const markAttendance = async (email) => {
      try {
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          setAttendanceMarked(true);
          setMessage('Attendance marked successfully!');
          if (data.isLate) {
            alert('You have marked your attendance late. Please check your email for details.');
          }
        } else {
          console.error('Failed to mark attendance:', data.error);
          setMessage('Failed to mark attendance');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error marking attendance');
      }
    };

    const stopAndRestartVideo = () => {
      stopVideo();
      setTimeout(startVideo, 1000); // Restart video after 1 second
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startVideo();
      } else {
        stopVideo();
      }
    };

    if (session) {
      const checkAttendance = async () => {
        try {
          const response = await fetch(`/api/attendance/log?email=${session.user.email}`);
          const data = await response.json();
          const lastAttendance = new Date(data.lastAttendance);
          const now = new Date();
          const hoursDifference = Math.abs(now - lastAttendance) / 36e5;

          if (hoursDifference > 1) {
            setAttendanceMarked(true);
            setMessage('YOUR ATTENDANCE HAS ALREADY BEEN MARKED');
          } else {
            loadModels();
            const intervalId = setInterval(detectFace, 500);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            return () => {
              clearInterval(intervalId);
              stopVideo();
              document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
          }
        } catch (error) {
          console.error('Error fetching attendance log:', error);
        }
      };
      checkAttendance();
    }

    window.addEventListener('beforeunload', stopVideo);
    return () => {
      window.removeEventListener('beforeunload', stopVideo);
      stopVideo();
    };
  }, [session]);

  if (!session) {
    return (
      <div>
        <p>Please sign in to mark your attendance.</p>
      </div>
    );
  }

  if (attendanceMarked) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: '#1f8ef1' }}>YOUR ATTENDANCE HAS ALREADY BEEN MARKED</h1>
        <button onClick={() => window.location.href = '/attendance'} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#1f8ef1', color: '#fff', border: 'none' }}>View Log</button>
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
      <p className="message">{message}</p>
    </div>
  );
};

export default FaceRecognition;
