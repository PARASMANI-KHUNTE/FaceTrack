import FaceRecognition from "../utilsComponents/FaceRecognition";
const Attendance = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance</h2>
      <p className="text-gray-600">Track employee attendance here.</p>
      <FaceRecognition />

    </div>
  );
};

export default Attendance;