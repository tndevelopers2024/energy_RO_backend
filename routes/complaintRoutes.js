const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintsByCustomer,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.get('/customer/:mobileNumber', getComplaintsByCustomer);
router.patch('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;
