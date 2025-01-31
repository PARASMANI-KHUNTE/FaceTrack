import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import { toast } from "react-toastify";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [userId, setUserId] = useState("");
  const [embedding, setEmbedding] = useState(null);
  const [responseData, setResponseData] = useState("");

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
        setEmbedding(detection.descriptor); // Store the embedding in state
        stopVideo();
      } else {
        alert("No face detected. Please try again.");
      }
    } catch (error) {
      console.error("Error detecting face:", error);
      alert("Face detection failed. Ensure models are loaded and try again.");
    }
  };

  const handleCheckIn = async () => {
    if (!embedding) {
      alert("Please capture your face first.");
      return;
    }
    await sendEmbeddingToBackend("Checkin");
  };

  const handleCheckOut = async () => {
    if (!embedding) {
      alert("Please capture your face first.");
      return;
    }
    await sendEmbeddingToBackend("Checkout");
  };

  const sendEmbeddingToBackend = async (action) => {
    try {
      const response = await api.post(`/employers/employee${action}`, { embedding, id: userId });
      console.log(`Face embedding sent successfully for ${action}:`, response.data);
      setCapturedImage("");
      setResponseData(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error(`Error sending embedding for ${action}:`, error);
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
        <button onClick={handleCheckIn} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!embedding}>
          Check In
        </button>
        <button onClick={handleCheckOut} className="bg-red-500 text-white px-4 py-2 rounded" disabled={!embedding}>
          Check Out
        </button>
      </div>
    </div>
  );
};

export default FaceRecognition;
