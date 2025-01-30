import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
const FaceDetectionForm = ({ onNext }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [employeeId, setEmployeeId] = useState(null);
   const [userId, setUserId] = useState("");
   // Decode the token to get the userId
     useEffect(() => {
       const token = localStorage.getItem("token");
       if (token) {
         const decoded = jwtDecode(token);
         setUserId(decoded.userId);
       }
     }, []);
   
    useEffect(() => {
      const loadModels = async () => {
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");
          await faceapi.nets.faceLandmark68Net.loadFromUri("/weights");
          await faceapi.nets.faceRecognitionNet.loadFromUri("/weights");
          console.log("Models loaded successfully");
          setModelsLoaded(true);
        } catch (error) {
          console.error("Error loading models:", error);
        }
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
      if (!modelsLoaded) {
        alert("Face detection models are still loading. Please wait.");
        return;
      }
      if (!videoRef.current || !canvasRef.current) return;
  
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      
      try {
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
      } catch (error) {
        console.error("Error detecting face:", error);
        alert("Face detection failed. Ensure models are loaded and try again.");
      }
    };
  
    const sendEmbeddingToBackend = async (embedding) => {
        try {
          const response = await api.post("/employers/face-recognition", { embedding, id: userId });
          console.log("Face embedding sent successfully:", response.data);
          setEmployeeId(response.data.employeeId); // Store employeeId
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
        <button 
  onClick={() => {
    stopVideo();
    if (employeeId) {
      onNext(employeeId); // Pass employeeId
    } else {
      alert("Please capture and register a face first.");
    }
  }} 
  className="bg-gray-500 text-white px-4 py-2 rounded"
>
  Next
</button>

      </div>
    );
  };
export default FaceDetectionForm;
