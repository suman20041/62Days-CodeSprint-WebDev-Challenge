import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import Technology from './pages/Technology';
import Bookmarks from './pages/Bookmarks';
import Progress from './pages/Progress';
import ResourceDetails from './pages/ResourceDetails';
import NotFound from './pages/NotFound';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/technology/:tech" element={<Technology />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/resource/:id" element={<ResourceDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
