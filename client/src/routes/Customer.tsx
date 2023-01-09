import React, { useEffect, useState } from 'react';
import Header, { DrawerHeader } from './Header';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Box, Stack, Typography, Button } from '@mui/material';

import AddCustomer from '../components/AddCustomer';
import EditCustomer from '../components/EditCustomer';

type CustomerType = {
  id: number,
  name: string,
  contact: string,
  address: string,
  email: string,
  city: string,
  created_date: string,
};
type ColumnDisplayType = {
  id: boolean,
  name: boolean,
  contact: boolean
  address: boolean
  email: boolean,
  city: boolean,
  created_date: boolean,
};
const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [addCustomer, setAddCustomer] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerType[]>([
    {
      id: 0,
      name: '',
      contact: '',
      address: '',
      email: '',
      city: '',
      created_date: '',
    }
  ]);
  const [customersStore, setCustomersStore] = useState<CustomerType[]>([
    {
      id: 0,
      name: '',
      contact: '',
      address: '',
      email: '',
      city: '',
      created_date: '',
    }
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    id: false,
    name: true,
    contact: false,
    address: true,
    email: false,
    city: true,
    created_date: true,
  });
  useEffect(() => {
    axios.get('/customers')
         .then(res => {
           setCustomers(res.data);
           setCustomersStore(res.data);
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, [])

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => { // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked
    });
  };

  const updateSupplier = (name: string) => {
    navigate(`/customer-info/${name}`)
  };

  const filterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = customersStore.filter((customer: CustomerType) => {
      return customer.name.toLowerCase().includes(term.toLowerCase());
    })
    if (!filtered.length) {
      setCustomers([
        {
          id: 0,
          name: '',
          contact: '',
          address: '',
          email: '',
          city: '',
          created_date: '',
        }
      ])
      return;
    }
    setCustomers(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  }
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
      {addCustomer && <AddCustomer />}
      {/* {editCustomer && <EditCustomer />} */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginBottom : 9}}>
          <Typography variant="h5" gutterBottom>
            Macaamiisha
          </Typography>
          <Button variant="contained" onClick={() => setAddCustomer(!addCustomer) } startIcon={<AddIcon />} style={{backgroundColor:"#2367d1", fontWeight: 'bold'}}>
            macamiil
          </Button>
        </Stack>
  <div className="container">
      <div className="search-filters-container">
        <input placeholder="search" className="search" onChange={filterUser}/>
        <div className="filters-container">
          <div className="dropdown">
            <button className="dropBtn"><ViewWeekIcon/> columns</button>
            <div className="dropdown-content">
              {Object.keys(customers[0]).map((column_head: string, index: number) => (
                <label className="switch">
                  <input
                    type="checkbox"
                    name={column_head}
                    className="checkbox"
                    onChange={handleClick}
                  checked={columnDisplay[column_head as keyof ColumnDisplayType]}
                  />
                  <span>{column_head}</span>
                </label>
              ))}
            </div>
          </div>
    <button className="dropBtn"><DownloadIcon/> export</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {Object.keys(customers[0]).map((column_head, index) => (
                <th className={display(column_head)? '': 'inactive'}>{column_head}</th>
              ))}
            </tr>
          </thead>

          {customers.map((customer: CustomerType, index: number) => (
            <tbody key={index}>
              <tr onClick={() => updateSupplier(customer.name) }>
                <td className={display('id')? '': 'inactive'}>{customer.id}</td>
                <td className="user-name">{customer.name}</td>
                <td className={display('contact')? '': 'inactive'}>{customer.contact}</td>
                <td className={display('address')? '': 'inactive'}>{customer.address}</td>
                <td className={display('created_date')? '': 'inactive'}>{customer.created_date}</td>
                <td className={display('email')? '': 'inactive'}>{customer.email}</td>
                <td className={display('city')? '': 'inactive'}>{customer.city}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>

    </>
  );
};
export default Customers;
