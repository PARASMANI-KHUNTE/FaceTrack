import { useState } from "react";

const RegisterEmployee = () => {
  const [newEmployee, setNewEmployee] = useState(null);

  const handleAddEmployee = () => {
    if(newEmployee){
      setNewEmployee(false)
    }else{
      setNewEmployee(true)
    }
  };
  return (
    <>
      <div>
        <button
          onClick={() => {
            handleAddEmployee;
          }}
        >
          Add Employee
        </button>
      </div>
      {newEmployee && (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-64 h-64 border rounded"
            hidden={!isCameraOn}
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured face"
              className="w-64 h-64 border rounded"
            />
          )}
          <div className="flex space-x-4">
            {!isCameraOn ? (
              <button
                onClick={startVideo}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopVideo}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Stop Camera
              </button>
            )}
            <button
              onClick={captureFace}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!isCameraOn}
            >
              Capture Face
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterEmployee;
