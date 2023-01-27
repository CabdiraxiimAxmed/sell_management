import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { RootState } from './store';
import { setUser } from '../features/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

interface Props {
  page: string;
}
const ProtectedRoutes: React.FC<Props> = ({ page }) => {
  console.log('protected route.');
  const dispatch = useDispatch();
  const [cookie] = useCookies();
  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation();
  const isAuth = () => {
    if (cookie.login) {
      console.log('authentication');
      if(user.role === 'admin') return 'authenticated';
      for(let permission of user.permissions[0]){
        console.log(permission);
        if (!permission[page]){
          return 'permission_denied';
        }
      }
      return 'authenticated';
    } 
    return false;
  };
  if (isAuth() === 'authenticated') {
    return <Outlet />;
  } else if(isAuth() === 'permission_denied') {
    return <Navigate to="/permission-denied" state={{ from: location }} />
  } else {
    return <Navigate to="/galid" state={{ from: location }} />;
  }
};
// return isAuth() ? (
//   <Outlet />
// ) : (
//     <Navigate to="/galid" state={{ from: location }} />
//   );
export default ProtectedRoutes;
