const mongoose = require('mongoose');
const Customer = require('../models/Customer');



// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
const getCustomers = async (req, res) => {
  try {


    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    // Convert empty string email to undefined so it doesn't trigger unique sparse index
    if (req.body.email && req.body.email.trim() === '') {
      req.body.email = undefined;
    } else if (!req.body.email) {
      req.body.email = undefined;
    }

    // email and mobileNumber no longer need to be unique
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.mobileNumber) {
        return res.status(400).json({ success: false, error: 'This mobile number is already registered to another customer.' });
      }
      return res.status(400).json({ success: false, error: 'This email address is already registered to another customer.' });
    } else {
      res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
  }
};

// @desc    Update a specific service completion status
// @route   PATCH /api/customers/:id/services/:index
// @access  Public
const updateServiceStatus = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { isACMC, ...reportData } = req.body;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const serviceIndex = parseInt(index);
    if (isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex > 2) {
      return res.status(400).json({ success: false, error: 'Invalid service index' });
    }

    // Determine which fields to update based on ACMC status
    const updateTarget = isACMC ? 'acmc' : '';
    const statusField = isACMC ? `acmcServicesCompleted.${serviceIndex}` : `servicesCompleted.${serviceIndex}`;
    const reportField = isACMC ? `acmcServiceReports.${serviceIndex}` : `serviceReports.${serviceIndex}`;

    const updateQuery = {
      $set: {
        [statusField]: true,
        [reportField]: reportData
      }
    };

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Activate ACMC for a customer
// @route   PATCH /api/customers/:id/acmc/activate
// @access  Public
const activateAcmc = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Set ACMC fields
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    customer.isACMC = true;
    customer.acmcStartDate = startDate;
    customer.acmcExpiryDate = expiryDate;
    // Reset ACMC service cycle
    customer.acmcServicesCompleted = [false, false, false];
    customer.acmcServiceReports = [];

    await customer.save();

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Cancel ACMC for a customer
// @route   PATCH /api/customers/:id/acmc/cancel
// @access  Public
const cancelAcmc = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    customer.isACMC = false;

    await customer.save();

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};


// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;



    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    await customer.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Update customer details
// @route   PATCH /api/customers/:id
// @access  Public
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Convert empty string email to undefined so it doesn't trigger unique sparse index
    if (req.body.email && req.body.email.trim() === '') {
      req.body.email = undefined;
    } else if (req.body.hasOwnProperty('email') && !req.body.email) {
      req.body.email = undefined;
    }

    // email and mobileNumber no longer need to be unique
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.mobileNumber) {
        return res.status(400).json({ success: false, error: 'This mobile number is already registered to another customer.' });
      }
      return res.status(400).json({ success: false, error: 'This email address is already registered to another customer.' });
    }
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Get all unique products
// @route   GET /api/customers/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Customer.distinct('productNameAndModel');
    const defaults = [
      'Energy Aqua Dolphin',
      'Energy Aqua Natural',
      'Energy Aqua Delphino',
      'Energy Aqua Clean Water'
    ];

    // Merge defaults and existing, remove duplicates, sort
    const allProducts = [...new Set([...defaults, ...products])].sort();

    res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Search customers by name or phone (collapses duplicates for same person/location)
// @route   GET /api/customers/search
// @access  Public
const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, data: [] });

    const searchRegex = new RegExp(q, 'i');
    
    const customers = await Customer.aggregate([
      {
        $match: {
          $or: [
            { userName: searchRegex },
            { mobileNumber: searchRegex }
          ]
        }
      },
      {
        $group: {
          _id: { 
            mobile: "$mobileNumber", 
            address: "$address" 
          },
          userName: { $first: "$userName" },
          mobileNumber: { $first: "$mobileNumber" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          doorNo: { $first: "$doorNo" },
          street: { $first: "$street" },
          area: { $first: "$area" },
          pincode: { $first: "$pincode" }
        }
      },
      { $limit: 10 },
      { $sort: { userName: 1 } }
    ]);

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateServiceStatus,
  activateAcmc,
  cancelAcmc,
  updateCustomer,
  getProducts,
  deleteCustomer,
  searchCustomers
};
