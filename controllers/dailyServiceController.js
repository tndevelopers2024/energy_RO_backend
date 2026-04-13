const DailyService = require('../models/DailyService');

// @desc    Create a new daily service report
// @route   POST /api/daily-service
// @access  Private (Admin)
exports.createDailyReport = async (req, res) => {
  try {
    const dailyReport = new DailyService(req.body);
    const savedReport = await dailyReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all daily service reports
// @route   GET /api/daily-service
// @access  Private (Admin)
exports.getAllDailyReports = async (req, res) => {
  try {
    const reports = await DailyService.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get daily service report by ID
// @route   GET /api/daily-service/:id
// @access  Private (Admin)
exports.getDailyReportById = async (req, res) => {
  try {
    const report = await DailyService.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a specific entry in a daily service report
// @route   PUT /api/daily-service/:id/entry/:entryId
// @access  Private (Admin)
exports.updateServiceEntry = async (req, res) => {
  try {
    const report = await DailyService.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const entryIndex = report.entries.findIndex(entry => entry._id.toString() === req.params.entryId);
    if (entryIndex === -1) return res.status(404).json({ message: 'Entry not found' });

    // Identify the entry precisely and update it
    report.entries[entryIndex] = { ...report.entries[entryIndex].toObject(), ...req.body };
    
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a specific entry in a daily service report
// @route   DELETE /api/daily-service/:id/entry/:entryId
// @access  Private (Admin)
exports.deleteServiceEntry = async (req, res) => {
  try {
    const report = await DailyService.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.entries = report.entries.filter(entry => entry._id.toString() !== req.params.entryId);
    
    await report.save();
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get unique engineers and branches from active reports
// @route   GET /api/daily-service/metadata
// @access  Private (Admin)
exports.getServiceMetadata = async (req, res) => {
  try {
    // Only get engineers/branches from reports that have entries
    const [engineers, branches] = await Promise.all([
      DailyService.aggregate([
        { $match: { "entries.0": { $exists: true } } },
        { $group: { _id: "$engineerName" } },
        { $sort: { _id: 1 } }
      ]),
      DailyService.aggregate([
        { $match: { "entries.0": { $exists: true } } },
        { $group: { _id: "$branch" } },
        { $sort: { _id: 1 } }
      ])
    ]);
    
    res.json({
      success: true,
      engineers: engineers.map(e => e._id).filter(n => n && n.length > 2),
      branches: branches.map(b => b._id).filter(b => b && b.length > 2)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
