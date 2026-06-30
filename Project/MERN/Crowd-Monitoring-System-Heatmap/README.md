<div align="center">

# 👥 MERN-Stack Crowd and Cluster Monitoring System
### A full-stack web application that uses a Python backend for computer vision and a MERN stack for a real-time monitoring dashboard.
<img width="800" height=auto alt="image" src="https://github.com/user-attachments/assets/04ecfdc7-9ab7-4a47-b0fd-4e12260c7fbf" />

<br>

### 🔗 Original repository: [https://github.com/riyahal/Crowd-Cluster-Monitoring-Heatmap](https://github.com/riyahal/Crowd-Cluster-Monitoring-Heatmap)

</div>

<br>

## TABLE OF CONTENTS

* <b>[📝 Overview](#overview)</b>

  * [🧩 Core Features](#core-features)
* <b>[⚙️ Technology Stack](#technology-stack)</b>
* <b>[🔄 Workflow](#workflow)</b>
  * [🖧 Diagram](#diagram)
  * [📝 Steps](#steps)
* <b>[📁 Project Structure](#project-structure)</b>
* <b>[🚀 How To Run](#-how-to-run)</b>
* <b>[✅ Final Notes](#final-notes)</b>
* <b>[📜 License](#license)</b>

---

## Overview

This project utilizes **Python** and **OpenCV** to process video feeds, detect individuals using **MobileNetSSD**, and apply the **DBSCAN algorithm** to identify high-density clusters. It visualizes this data using a color-coded heatmap overlay.

### Core Features

* 📹 **Real-time Video Processing and Person Detection** (OpenCV)
* 🧠 **Deep Learning Detection** (MobileNet SSD)
* 🌡️ **Dynamic Heatmap Generation**
* 📊 **Person Cluster Identification** (DBSCAN)
* 🚨 **Crowd/Cluster Alerts** (Threshold-based warnings)

---

## Technology Stack

### Backend
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
* **Node.js & Express** – Manages the web server, handles API requests, and spawns the Python script.

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* **React** – Builds the interactive user interface for the web dashboard.

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
* **MongoDB** – (Optional) For logging crowd data over time.

### Computer Vision & ML
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy)
* **Python** – Runs the core detection and clustering logic.
* **OpenCV** – Handles real-time video processing.
* **scikit-learn (DBSCAN)** – Identifies person clusters.
* **NumPy** – Performs numerical operations for image and data manipulation.

---

## Workflow

### Diagram

```text
React UI → Express API → Python Script (OpenCV, DBSCAN) → JSON (Frame + Data) → React UI
```

### Steps

1.  **Frontend**: The user clicks "Start" on the React dashboard.
2. 📞 **API Call**: An API request is sent to the Express server (`/api/detection/start`).
3. 🐍 **Process Spawning**: The Node.js server spawns the `crowd_detect.py` script in "server mode".
4. 🤖 **Detection**: The Python script captures the video feed, performs person detection, clustering, and heatmap generation.
5. 📤 **Data Stream**: The script outputs a continuous stream of JSON objects (containing the processed frame and counts) to its standard output.
6. 📡 **Backend Cache**: The Node.js server reads this output and caches the latest data in memory.
7. 🔄 **Polling**: The React frontend periodically polls an API endpoint (`/api/detection/frame`) to get the latest cached data.
8. 🖥️ **Display**: The frontend renders the received frame and updates the statistics, creating a live dashboard experience.

---

## Project Structure

```sh
crowd-monitoring-heatmap-system/
├── client/                  # React frontend (UI)
├── server/                  # Node.js (Express) backend
│   ├── routes/
│   │   └── detection.js
│   └── server.js
├── crowd_detect.py          # Python script for detection
├── mobilenet/               # MobileNet SSD model files
├── .env.example             # Environment variable template
├── docker-compose.yml       # Docker service for MongoDB
├── package.json             # Root package.json for concurrent execution
└── README.md                # This file
```

---

## 🚀 How To Run

### Prerequisites
* **Node.js and npm**: Download here
* **Python 3.8+**: Download here

### 1. Clone the Repository

```bash
git clone https://github.com/abhisek2004/62Days-CodeSprint-WebDev-Challenge/Project/MERN/Crowd-Monitoring-System-Heatmap.git
cd Crowd-Monitoring-System-Heatmap
```

### 2. Create a virtual environment

<i>**Windows:**</i>

```bash
python -m venv myenv
```

<i>**macOS / Linux:**</i>

```bash
python3 -m venv myenv
```

### Activate it:

<i>**Windows:**</i>

```bash
env\Scripts\activate
```

<i>**macOS / Linux:**</i>

```bash
source env/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the App

```bash
python3 crowd_detect.py
```
---

## Final Notes

* Increase/reduce **`CLUSTER_DISTANCE`** to change clustering sensitivity.
* Heatmap builds over time → more accurate in dense areas.

---

## License

MIT License. Free to modify and distribute with attribution. Read license here at [LICENSE.md](LICENSE.md).

