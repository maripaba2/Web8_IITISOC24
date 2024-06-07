import { useEffect, useRef } from 'react';
import styles from '../styles/FaceRecognition.module.css';

export default function FaceRecognition() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Initialize the face recognition logic here
  }, []);

  return (
    <div className={styles.faceRecognitionContainer}>
      <h1>Face Recognition</h1>
      <video ref={videoRef} autoPlay></video>
      <button>Capture</button>
    </div>
  );
}
