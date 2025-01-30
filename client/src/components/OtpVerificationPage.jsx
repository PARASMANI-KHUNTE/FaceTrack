import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api"; // Assuming API utility is set up

const OtpVerificationPage = ({ onNext, onPrev, email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/verify-otp", { email, otp });
      
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        onNext();
      } else {
        toast.error(response.data.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">OTP Verification</h2>
      <p className="text-gray-600">Enter the OTP sent to {email}</p>
      <input
        type="text"
        name="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleVerifyOtp}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
