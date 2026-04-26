import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
