import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './features/user';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import Login from './routes/login';
import Home from './routes/home';
import Supplier from './routes/Supplier';
import Orders from './routes/Orders';
import PurchaseOrder from './routes/PurchaseOrder';
import EditPurchase from './routes/EditPurchase';
import PurchasePaper from './routes/PurchasePaper';
import SellPaper from './routes/SellPaper';
import EditSale from './routes/EditSaleOrder';
import Inventory from './routes/Inventory';
import AddProduct from './routes/AddProduct';
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
          if(resp.data === 'error') {
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
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Header children={<Home />} />} />
            <Route
              path="/user-management"
              element={<Header children={<UserManagement />} />}
            />
            <Route
              path="/supplier"
              element={<Header children={<Supplier />} />}
            />
            <Route
              path="/products"
              element={<Header children={<Inventory />} />}
            />
            <Route
              path="/products/:name"
              element={<Header children={<ProductInfo />} />}
            />
            <Route
              path="/products/add-product"
              element={<Header children={<AddProduct />} />}
            />

            <Route
              path="/customers"
              element={<Header children={<Customer />} />}
            />
            <Route
              path="/supplier-info/:name"
              element={<Header children={<SupplierInfo />} />}
            />
            <Route
              path="/customer-info/:name"
              element={<Header children={<CustomerInfo />} />}
            />
            <Route
              path="/purchase-order"
              element={<Header children={<PurchaseOrder />} />}
            />
            <Route
              path="/purchase/edit/:id"
              element={<Header children={<EditPurchase />} />}
            />
            <Route
              path="/purchase-order/:order_id"
              element={<Header children={<PurchasePaper />} />}
            />
            <Route
              path="/sells/:order_id"
              element={<Header children={<SellPaper />} />}
            />
            <Route
              path="/sale/edit/:id"
              element={<Header children={<EditSale />} />}
            />
            <Route path="/orders" element={<Header children={<Orders />} />} />
            <Route path="/sells" element={<Header children={<SellsList />} />} />
            <Route path="/sell" element={<Header children={<Sell />} />} />
            <Route path="/add-user" element={<Header children={<AddUser />} />} />
            <Route
              path="/add-supplier"
              element={<Header children={<AddSupplier />} />}
            />
            <Route
              path="/update-user/:username"
              element={<Header children={<UpdateUser />} />}
            />
          </Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
