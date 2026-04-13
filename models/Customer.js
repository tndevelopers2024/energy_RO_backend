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
  },
  address: {
    type: String,
    required: [true, 'Installation address is required'],
    trim: true,
  },
  doorNo: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  locationLink: {
    type: String,
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
    required: [true, 'Card number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
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
  unitSerialNumber: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
  weddingAnniversary: {
    type: Date,
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

// Combine address fields before saving
customerSchema.pre('save', function() {
  if (this.doorNo || this.street || this.area || this.pincode) {
    const parts = [
      this.doorNo,
      this.street,
      this.area,
      this.pincode ? `Pincode: ${this.pincode}` : ''
    ].filter(part => part && part.trim() !== '');
    
    if (parts.length > 0) {
      this.address = parts.join(', ');
    }
  }
});

module.exports = mongoose.model('Customer', customerSchema);
