import { useState } from "react";
import { motion } from "framer-motion";


const EmployeeRegistration = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  const handleNext = (data) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}>
        
        {/* Pass handleNext so we can store employeeId */}
        {step === 1 && <FaceDetectionForm onNext={(employeeId) => handleNext({ employeeId })} />}
        {step === 2 && <PersonalInfoForm onNext={handleNext} onPrev={handlePrev} employeeId={userData.employeeId} />}

        {step === 3 && <OtpVerificationPage onNext={handleNext} onPrev={handlePrev} email={userData.user_email} />}

        {step === 4 && <DepartmentShiftTaskForm onSubmit={handleNext} onPrev={handlePrev} />}
      
      </motion.div>
    </div>
  );
};

export default EmployeeRegistration;
