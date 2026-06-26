const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

let pythonProcess = null;
let latestData = null;

// Endpoint to start the Python detection script
router.post('/start', (req, res) => {
  if (pythonProcess) {
    return res.status(400).json({ message: 'Detection process is already running.' });
  }

  const scriptPath = path.join(__dirname, '..', '..', 'crowd_detect.py');
  const { input } = req.body;

  const args = ['--server'];
  args.push('--input', input || '0');

  pythonProcess = spawn('python3', [scriptPath, ...args]);

  pythonProcess.stdout.on('data', (data) => {
    try {
      latestData = JSON.parse(data.toString());
    } catch (e) {
      console.error('Error parsing JSON from Python script:', e);
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Script Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    pythonProcess = null;
    latestData = null;
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python script:', err);
    return res.status(500).json({ message: 'Failed to start detection script.', error: err.message });
  });

  res.status(200).json({ message: 'Detection process started.' });
});

// Endpoint to get the latest frame and data
router.get('/frame', (req, res) => {
  if (!latestData) {
    return res.status(200).json({ message: 'No data available yet. Is the process running?' });
  }
  res.json(latestData);
});

// Endpoint to stop the Python detection script
router.post('/stop', (req, res) => {
  if (pythonProcess) {
    pythonProcess.kill('SIGTERM');
    res.status(200).json({ message: 'Detection process stopped.' });
  } else {
    res.status(400).json({ message: 'No detection process is running.' });
  }
});

module.exports = router;