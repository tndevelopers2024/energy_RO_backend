const mongoose = require('mongoose');

const dailyServiceEntrySchema = new mongoose.Schema({
  siNo: { type: Number },
  complaintNo: { type: String },
  customerName: { type: String },
  address: { type: String },
  phone: { type: String },
  // Legacy field — kept for backward compatibility with old records
  customerDetails: { type: String },
  product: { type: String },
  visitType: { type: String },
  status: { type: String },
  timeIn: { type: String },
  timeOut: { type: String },
  workDetails: { type: String },
  sparesReplaced: { type: String },
  result: { type: String },
  receiptNo: { type: String },
  receiptDate: { type: String },
  // Legacy field — kept for backward compatibility with old records
  receiptDetails: { type: String },
  charges: {
    spares: { type: Number, default: 0 },
    visit: { type: Number, default: 0 },
    contracts: { type: Number, default: 0 }
  }
});

const dailyServiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  engineerName: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  entries: [dailyServiceEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('DailyService', dailyServiceSchema);
