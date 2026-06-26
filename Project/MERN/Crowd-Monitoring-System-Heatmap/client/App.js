import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [source, setSource] = useState('0'); // Default to webcam
  const pollingInterval = useRef(null);

  const API_URL = '/api/detection';

  const startPolling = () => {
    // Clear any existing interval
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    // Set up a new interval
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/frame`);
        if (res.data && res.data.frame) {
          setData(res.data);
          setError('');
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError('Failed to fetch frame data. Is the backend running?');
      }
    }, 500); // Poll every 500ms
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const handleStart = async () => {
    setError('');
    try {
      await axios.post(`${API_URL}/start`, { input: source });
      setIsDetecting(true);
      startPolling();
    } catch (err) {
      console.error("Error starting detection:", err);
      setError(err.response?.data?.message || 'Failed to start detection.');
    }
  };

  const handleStop = async () => {
    setError('');
    try {
      await axios.post(`${API_URL}/stop`);
      setIsDetecting(false);
      stopPolling();
      setData(null); // Clear the data
    } catch (err) {
      console.error("Error stopping detection:", err);
      setError(err.response?.data?.message || 'Failed to stop detection.');
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopPolling();
      // Also try to stop the backend process if the user just closes the tab
      if (isDetecting) {
        // This is "fire and forget"
        navigator.sendBeacon(`${API_URL}/stop`);
      }
    };
  }, [isDetecting]);

  return (
    <div className="App">
      <h1>Crowd & Cluster Monitoring Dashboard</h1>
      <div className="dashboard">
        <div className="controls">
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Video source (e.g., 0, or path/to/video.mp4)"
            disabled={isDetecting}
          />
          <button onClick={handleStart} disabled={isDetecting} className="start-btn">
            Start Detection
          </button>
          <button onClick={handleStop} disabled={!isDetecting} className="stop-btn">
            Stop Detection
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="stats-container">
          <div className="stat">
            <h3>PEOPLE COUNT</h3>
            <p>{data?.people_count ?? '--'}</p>
          </div>
          <div className="stat">
            <h3>CLUSTER COUNT</h3>
            <p>{data?.cluster_count ?? '--'}</p>
          </div>
        </div>

        <div className="video-container">
          {data?.frame ? (
            <img src={`data:image/jpeg;base64,${data.frame}`} alt="Video Feed" className="video-feed" />
          ) : (
            <p>{isDetecting ? 'Waiting for video stream...' : 'Detection is stopped.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;