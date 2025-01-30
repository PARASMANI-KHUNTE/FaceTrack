import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceRecognition = ({ onNext }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      })
      .catch((err) => console.error("Error starting camera:", err));
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);
    
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      await sendEmbeddingToBackend(detection.descriptor);
      stopVideo();
    } else {
      alert("No face detected. Please try again.");
    }
  };

  const sendEmbeddingToBackend = async (embedding) => {
    try {
      const response = await axios.post("http://localhost:3000/face-recognition", { embedding });
      console.log("Face embedding sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending embedding:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} autoPlay muted className="w-64 h-64 border rounded" hidden={!isCameraOn}></video>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {capturedImage && <img src={capturedImage} alt="Captured face" className="w-64 h-64 border rounded" />}
      <div className="flex space-x-4">
        {!isCameraOn ? (
          <button onClick={startVideo} className="bg-green-500 text-white px-4 py-2 rounded">Start Camera</button>
        ) : (
          <button onClick={stopVideo} className="bg-red-500 text-white px-4 py-2 rounded">Stop Camera</button>
        )}
        <button onClick={captureFace} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={!isCameraOn}>
          Capture Face
        </button>
      </div>
      <button onClick={onNext} className="bg-gray-500 text-white px-4 py-2 rounded">Next</button>
    </div>
  );
};

export default FaceRecognition;
