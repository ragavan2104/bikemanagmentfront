import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InventoryPage from './pages/InventoryPage';
import { UserRole } from './types';

const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: UserRole[] 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  console.log('DashboardRouter - Current user:', user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log('DashboardRouter - User role:', user.role, 'Admin role:', UserRole.ADMIN);

  return user.role === UserRole.ADMIN ? (
    <Navigate to="/admin" />
  ) : (
    <Navigate to="/worker" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardRouter />} />
          <Route
            path="/worker"
            element={
              <ProtectedRoute allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={[UserRole.WORKER, UserRole.ADMIN]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
