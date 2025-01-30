import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";
import api from "../utils/api";
import { jwtDecode } from "jwt-decode";

const EmployeeForm = () => {
  const [step, setStep] = useState(1);
  const [employerId, setEmployerId] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    shift: "",
    task: "",
    faceEmbedding: null,
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isFrameFrozen, setIsFrameFrozen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmployerId(decoded.userId);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(value => value !== "" && value !== null);
    setIsSubmitDisabled(!allFieldsFilled);
  }, [formData]);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setIsFrameFrozen(false);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureFace = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const detections = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detections) {
        setFormData(prevFormData => ({ ...prevFormData, faceEmbedding: detections.descriptor }));
        setIsFrameFrozen(true);
        stopCamera();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/employers/employee-register', { ...formData, employerId });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
        {step === 1 && (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded" />
            <motion.button type="button" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setStep(2)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Next</motion.button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full p-2 border rounded" />
            <select value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })} className="w-full p-2 border rounded">
              <option value="">Select Shift</option>
              <option value="day">Day</option>
              <option value="night">Night</option>
              <option value="afternoon">Afternoon</option>
            </select>
            <input type="text" placeholder="Task" value={formData.task} onChange={(e) => setFormData({ ...formData, task: e.target.value })} className="w-full p-2 border rounded" />
            {isCameraOpen && (
              <div>
                <video ref={videoRef} autoPlay className="w-full h-auto rounded" />
                <motion.button type="button" className="w-full p-2 bg-red-500 text-white rounded mt-2" onClick={captureFace}>Capture Face</motion.button>
              </div>
            )}
            <motion.button type="button" className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={startCamera}>Open Camera</motion.button>
            <motion.button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={isSubmitDisabled} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Submit</motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
