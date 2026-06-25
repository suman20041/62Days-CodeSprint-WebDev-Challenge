const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    incident_type: String,
    events: [String],
    report_text: String,
    location_gps: String,
    timestamp: { type: Date, default: Date.now },
    resources_needed: [String],
    dispatch_status: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = mongoose.model('Report', reportSchema);