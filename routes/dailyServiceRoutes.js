const express = require('express');
const router = express.Router();
const { 
  createDailyReport, 
  getAllDailyReports, 
  getDailyReportById,
  updateServiceEntry,
  deleteServiceEntry,
  getServiceMetadata
} = require('../controllers/dailyServiceController');

// All routes are private
router.get('/metadata', getServiceMetadata);
router.post('/', createDailyReport);
router.get('/', getAllDailyReports);
router.get('/:id', getDailyReportById);
router.put('/:id/entry/:entryId', updateServiceEntry);
router.delete('/:id/entry/:entryId', deleteServiceEntry);

module.exports = router;
