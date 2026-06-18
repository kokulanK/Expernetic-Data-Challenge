import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout = () => {
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username') || 'User';
  const [isStaff, setIsStaff] = useState(localStorage.getItem('is_staff') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    const fetchUserRole = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsStaff(res.data.is_staff);
        localStorage.setItem('is_staff', res.data.is_staff);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchUserRole();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const baseClass = "px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ";
    const isActive = location.pathname === path;
    
    if (path === '/admin/users') {
      return isActive 
        ? baseClass + "bg-red-500 text-white shadow-md shadow-red-500/20" 
        : baseClass + "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20";
    }

    return isActive 
      ? baseClass + "bg-primary text-white shadow-md shadow-blue-500/20" 
      : baseClass + "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-gray-800/80 shadow-sm sticky top-0 z-10 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white p-1.5 rounded-xl shadow-md">🏠</span>
            Airbnb Intelligence
          </h1>
          <nav className="flex items-center gap-2">
            <Link to="/" className={getLinkClass('/')}>Dashboard</Link>
            <Link to="/predict" className={getLinkClass('/predict')}>Predict</Link>
            <Link to="/insights" className={getLinkClass('/insights')}>Insights</Link>
            <Link to="/geospatial" className={getLinkClass('/geospatial')}>Map</Link>
            {isStaff && (
              <Link to="/admin/users" className={getLinkClass('/admin/users')}>Manage Users</Link>
            )}
            <div className="h-5 w-[1px] bg-gray-300 dark:bg-gray-700 mx-2"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hi, {username}</span>
              <button 
                onClick={handleLogout}
                className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Expernetic Data Engineering. All rights reserved.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;
