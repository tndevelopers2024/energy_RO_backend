const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.patch('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;
