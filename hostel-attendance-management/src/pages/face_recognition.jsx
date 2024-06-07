import { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import styles from '../styles/FaceRecognition.module.css';
import Layout from '../components/Layout';
import Link from 'next/link';
const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Error accessing the camera', err));
    };

    const handleVideoOnPlay = () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoRef.current.width,
          height: videoRef.current.height
        });
        canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      }, 100);
    };

    loadModels();
    videoRef.current.addEventListener('play', handleVideoOnPlay);
  }, []);

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    fetch('/api/face_recognition', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Face recognition result:', data);
    })
    .catch(error => {
      console.error('Error in face recognition', error);
    });
  };

  return (
    <Layout>
    <div className={styles.container}>
    <Link href="/">
          <img src="/main-menu.png" alt="Main Menu" className={styles.menuIcon} />
      </Link>
      <div className={styles.videoContainer}>
        <video ref={videoRef} width="720" height="560" autoPlay muted />
        <canvas ref={canvasRef} width="720" height="560" className={styles.canvas} />
      </div>
      <button onClick={captureImage} className={styles.captureButton}>Capture</button>
    </div>
    </Layout>
  );
};

export default FaceRecognition;
