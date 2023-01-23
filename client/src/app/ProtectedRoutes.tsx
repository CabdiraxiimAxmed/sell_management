import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { RootState } from './store';
import { setUser } from '../features/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const [cookie] = useCookies();
  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation();
    const isAuth = () => {
      if (cookie.login) {
        return true;
      }
      return false;
  };
  return isAuth() ? (
    <Outlet />
  ) : (
    <Navigate to="/galid" state={{ from: location }} />
  );
};
export default ProtectedRoutes;
