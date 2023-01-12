import Login from './routes/login';
import Home from './routes/home';
import Supplier from './routes/Supplier';
import Orders from './routes/Orders';
import PurchaseOrder from './routes/PurchaseOrder';
import PurchaseEdit from './routes/PurchaseEdit';
import PurchasePaper from './routes/PurchasePaper';
import SellPaper from './routes/SellPaper';
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
import CustomerInfo from './routes/CustomerInfo';
import ProtectedRoute from './app/ProtectedRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
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
            path="/purchase/edit/:order_id"
            element={<Header children={<PurchaseEdit />} />}
          />
          <Route
            path="/purchase-order/:order_id"
            element={<Header children={<PurchasePaper />} />}
          />
          <Route
            path="/sells/:order_id"
            element={<Header children={<SellPaper />} />}
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
  );
}

export default App;
