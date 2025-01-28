const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Users
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to employer user
  department: { type: String },
  embeddings: { type: [Number], required: true }, // For face recognition or other purposes
  shift: { type: String }, // Shift details (e.g., "Morning", "Evening", etc.)
  tasks: { type: [String], default: [] }, // Task details can be expanded further if needed
  checkInOut: [
    {
      date: { type: Date, required: true }, // Date of check-in/out
      checkIn: { type: Date }, // Check-in timestamp
      checkOut: { type: Date }, // Check-out timestamp
    },
  ],
  hours: [
    {
      date: { type: Date, required: true }, // Date of work
      duration: { type: Number, default: 0 }, // Work duration in hours
    },
  ],
  leaves: [
    {
      date: { type: Date, required: true }, // Date of the leave
      reason: { type: String, required: true }, // Reason for the leave
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
