import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './features/user';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import Login from './routes/login';
import Home from './routes/home';
import PageNotFound from './routes/PageNotFound';
import PermissionDenied from './routes/PermissionDenied';
import Supplier from './routes/Supplier';
import Orders from './routes/Orders';
import PurchaseOrder from './routes/PurchaseOrder';
import EditPurchase from './routes/EditPurchase';
import PurchasePaper from './routes/PurchasePaper';
import SellPaper from './routes/SellPaper';
import EditSale from './routes/EditSaleOrder';
import Inventory from './routes/Inventory';
import AddProduct from './routes/AddProduct';
import ItemAlert from './routes/ItemAlert';
import SellsList from './routes/SellList';
import Customer from './routes/Customer';
import Header from './routes/Header';
import AddUser from './routes/AddUser';
import AddSupplier from './routes/AddSupplier';
import UpdateUser from './routes/UpdateUser';
import Sell from './routes/Sell';
import UserManagement from './routes/UserManagement';
import SupplierInfo from './routes/SupplierInfo';
import ProductInfo from './routes/ProductInfo';
import CustomerInfo from './routes/CustomerInfo';
import ProtectedRoute from './app/ProtectedRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies<string>(['']);

  useEffect(() => {
    if (cookie.login) {
      axios.get(`http://localhost:2312/user/${cookie.login}`)
        .then(resp => {
          if (resp.data === 'error') {
            toast.error('server error');
            return;
          } else if (resp.data === 'not_found') return;
          dispatch(setUser(resp.data));
        }).catch(error => {
          toast.error(error.message);
        })
    }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Router>
        <Routes>
          <Route path="/galid" element={<Login />} />
          <Route element={<ProtectedRoute page='home' />}>
            <Route path="/" element={<Header children={<Home />} />} />
          </Route>
          <Route element={<ProtectedRoute page='user-management' />}>
            <Route
              path="/user-management"
              element={<Header children={<UserManagement />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='supplier' />}>
            <Route
              path="/supplier"
              element={<Header children={<Supplier />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='products' />}>
            <Route
              path="/products"
              element={<Header children={<Inventory />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='product' />}>
            <Route
              path="/products/:name"
              element={<Header children={<ProductInfo />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='add-product' />}>
            <Route
              path="/products/add-product"
              element={<Header children={<AddProduct />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='product-alert' />}>
            <Route
              path="/products/alert"
              element={<Header children={<ItemAlert />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='customer' />}>
            <Route
              path="/customers"
              element={<Header children={<Customer />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='supplier-info' />}>
            <Route
              path="/supplier-info/:name"
              element={<Header children={<SupplierInfo />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='customer-info' />}>
            <Route
              path="/customer-info/:name"
              element={<Header children={<CustomerInfo />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='purchase-order' />}>
            <Route
              path="/purchase-order"
              element={<Header children={<PurchaseOrder />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='purchase-edit' />}>
            <Route
              path="/purchase/edit/:id"
              element={<Header children={<EditPurchase />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='purchase-paper' />}>
            <Route
              path="/purchase-order/:order_id"
              element={<Header children={<PurchasePaper />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='sell-paper' />}>
            <Route
              path="/sells/:order_id"
              element={<Header children={<SellPaper />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='edit-sale' />}>
            <Route
              path="/sale/edit/:id"
              element={<Header children={<EditSale />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='purchase-order' />}>
            <Route path="/orders" element={<Header children={<Orders />} />} />
          </Route>
          <Route element={<ProtectedRoute page='sales' />}>
            <Route path="/sells" element={<Header children={<SellsList />} />} />
          </Route>
          <Route element={<ProtectedRoute page='sale' />}>
            <Route path="/sell" element={<Header children={<Sell />} />} />
          </Route>
          <Route element={<ProtectedRoute page='add-user' />}>
            <Route path="/add-user" element={<Header children={<AddUser />} />} />
          </Route>
          <Route element={<ProtectedRoute page='add-supplier' />}>
            <Route
              path="/add-supplier"
              element={<Header children={<AddSupplier />} />}
            />
          </Route>
          <Route element={<ProtectedRoute page='update-user' />}>
            <Route
              path="/update-user/:username"
              element={<Header children={<UpdateUser />} />}
            />
          </Route>
          <Route path="*" element={ <PageNotFound /> } />
          <Route path="/permission-denied" element={ <PermissionDenied /> } />
        </Routes>
      </Router>

    </>
  );
}

export default App;
