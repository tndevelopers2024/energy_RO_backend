const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    unique: true,
  },
  address: {
    type: String,
    required: [true, 'Installation address is required'],
    trim: true,
  },
  dateOfInstallationOrService: {
    type: Date,
  },
  productNameAndModel: {
    type: String,
    trim: true,
  },
  cardNumber: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  invoiceDate: {
    type: Date,
  },
  orderNo: {
    type: String,
    trim: true,
  },
  orderDate: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['Installation', 'Service'],
    default: 'Installation',
  },
  servicesCompleted: {
    type: [Boolean],
    default: [false, false, false],
  },
  serviceReports: [{
    visitDate: Date,
    visitType: String,
    tdsRaw: String,
    tdsTreated: String,
    workDetails: String,
    partsReplaced: String,
    invoiceNo: String,
    amount: String,
    remarks: String
  }],
  isACMC: {
    type: Boolean,
    default: false,
  },
  acmcStartDate: {
    type: Date,
  },
  acmcExpiryDate: {
    type: Date,
  },
  acmcServicesCompleted: {
    type: [Boolean],
    default: [false, false, false],
  },
  acmcServiceReports: [{
    visitDate: Date,
    visitType: String,
    tdsRaw: String,
    tdsTreated: String,
    workDetails: String,
    partsReplaced: String,
    invoiceNo: String,
    amount: String,
    remarks: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
