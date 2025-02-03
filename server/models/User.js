const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  googleId: {
    type: String,
  },
  profileUrl: {type: String,
    trim: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  organization: { type: String },
  department: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  url: { type: String },
  role: { type: String, enum: ['admin', 'employer', 'employee'], required: true },
  employeeId : { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
