const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Reference to Users
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to employer user
  department: { type: String },
  embeddings: { 
    type: [[Number]], // Array of arrays of numbers
    required: true,
    validate: {
        validator: function(arr) {
            return arr.every(innerArr => 
                Array.isArray(innerArr) && innerArr.every(num => typeof num === 'number' && !isNaN(num))
            );
        },
        message: "Embeddings must be a 2D array of valid numbers."
    }
}
,  
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
