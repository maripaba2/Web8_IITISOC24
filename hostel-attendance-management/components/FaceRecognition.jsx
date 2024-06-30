'use client';

import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';

const FaceRecognition = ({ onFaceMatch }) => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const handleVideoPlay = async () => {
    setIsRecognizing(true);
    const labeledDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    const intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (results.some((result) => result.label !== 'unknown')) {
        onFaceMatch();
        clearInterval(intervalId);
        setIsRecognizing(false);
      }
    }, 1000);
  };

  const loadLabeledImages = () => {
    const labels = ['User1'];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 1; i++) {
          const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  return (
    <div className="face-recognition-container">
      <video
        ref={videoRef}
        onPlay={handleVideoPlay}
        autoPlay
        muted
        className="face-recognition-video"
      />
      {!isRecognizing && <div className="face-recognition-overlay">Face recognition is active...</div>}
    </div>
  );
};

export default FaceRecognition;
