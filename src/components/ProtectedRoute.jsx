import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Add a proper loader component here
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;