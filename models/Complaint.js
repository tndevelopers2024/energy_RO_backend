const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  complaintDetails: {
    type: String,
    required: [true, 'Complaint details are required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Process', 'Fixed'],
    default: 'Pending',
    required: true
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
