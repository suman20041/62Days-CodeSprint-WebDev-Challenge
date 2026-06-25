const express = require('express');
const axios = require('axios');
const Report = require('../models/Report');
const { sendSmsAlerts } = require('../services/twilioService');

const router = express.Router();

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

// Proxy to Python service for live data
router.get('/incident_data', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/data`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Python service:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from CV service' });
    }
});

// Get historical incidents
router.get('/history', async (req, res) => {
    try {
        const incidents = await Report.find().sort({ timestamp: -1 }).limit(50);
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Trigger dispatch
router.post('/dispatch', async (req, res) => {
    const { incidentData } = req.body;

    if (!incidentData || !Array.isArray(incidentData.resources_needed) || incidentData.resources_needed.length === 0) {
        return res.status(400).json({ error: 'Incident data with resources_needed is required.' });
    }

    try {
        // 1. Send SMS alerts. The service now looks up numbers on the backend.
        const dispatchResults = await sendSmsAlerts(incidentData);

        // 2. Log the incident to DB with dispatch status
        const newReport = new Report({
            incident_type: incidentData.incident_type,
            events: incidentData.events,
            report_text: incidentData.final_report,
            location_gps: incidentData.location_gps,
            resources_needed: incidentData.resources_needed,
            dispatch_status: dispatchResults,
        });
        await newReport.save();

        res.status(200).json({ message: 'Dispatch initiated', results: dispatchResults });
    } catch (error) {
        console.error('Dispatch error:', error);
        res.status(500).json({ error: 'Failed to process dispatch request.' });
    }
});

module.exports = router;