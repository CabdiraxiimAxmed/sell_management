import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation();
  const isAuth = () => {
    if (!user.name) return false;
    return true;
  };
  return isAuth() ? (
    <Outlet />
  ) : (
    <Navigate to="/galid" state={{ from: location }} />
  );
};
export default ProtectedRoutes;
