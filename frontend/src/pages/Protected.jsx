import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, role, allowedRoles}) => {
  const userRole = localStorage.getItem("role");
  return allowedRoles.includes(userRole) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;