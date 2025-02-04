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
      hours: {type : Number},
    },
  ],
  leaves: [
    {
      date: { type: Date, required: true }, // Date of the leave
      reason: { type: String, required: true }, // Reason for the leave
    },
  ],
}, { timestamps: true });




// Pre-save hook: calculate hours for each entry where checkOut is set
employeeSchema.pre("save", function (next) {
  this.checkInOut.forEach((entry) => {
    if (entry.checkIn && entry.checkOut) {
      const diffMs = entry.checkOut - entry.checkIn; // milliseconds
      const totalHours = diffMs / (1000 * 60 * 60);  // convert to hours
      entry.hours = parseFloat(totalHours.toFixed(2));
    }
  });
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
