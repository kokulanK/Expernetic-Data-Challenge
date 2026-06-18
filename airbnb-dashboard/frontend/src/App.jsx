import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ModelInsights from './pages/ModelInsights';
import GeospatialExplorer from './pages/GeospatialExplorer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminManage from './pages/AdminManage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="predict" element={<Prediction />} />
          <Route path="insights" element={<ModelInsights />} />
          <Route path="geospatial" element={<GeospatialExplorer />} />
          <Route path="admin/users" element={<AdminManage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
