import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserType } from './UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Box, Button, Typography } from '@mui/material';

let permission_pages: string[] = [
  "user-management",
  "supplier",
  "products",
  "add-product",
  "product",
  "product-alert",
  "customer",
  "customer-info",
  "supplier-info",
  "purchase-order",
  "purchase-edit",
  "purchase-paper",
  "sale-paper",
  "edit-sale",
  "order",
  "sales",
  "sale",
  "add-user",
  "add-supplier",
  "update-user",
]

const AddUser: React.FC = () => {
  console.log('add user');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let permissions: {[key: string]: boolean}[] = [];
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let username = data.get('username');
    let role = data.get('role');
    let password = data.get('password');
    let contact = data.get('contact');

    for(let page of permission_pages) {
      let make_it_object: {[key: string]: boolean} = {};
      if(data.get(page) === 'on'){
        make_it_object[page] = true;
        permissions.push(make_it_object);
      } else {
        make_it_object[page] = false;
        permissions.push(make_it_object);
      } 
    }

    if (!name || !username || !password || !contact || !role) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios
      .post('http://localhost:2312/user/create-user', {
        name,
        username,
        role,
        contact,
        password,
        permissions,
      })
      .then(res => {
        if (res.data === 'error') {
          toast.error('qalada ayaa dhacay');
        }
        if (res.data === 'success') {
          toast.success('waa lagu guuleystay');
          setTimeout(() => {
            navigate('/user-management');
          }, 2000);
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
  };
  return (
    <div className="add-user-container">
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
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}
      >
        <TextField id="name" required label="Magaca" type="name" name="name" />
        <TextField
          required
          id="outlined-password-input"
          label="username"
          name="username"
          type="name"
        />
        <TextField
          required
          name="contact"
          id="outlined-password-input"
          label="contact"
          type="name"
        />
        <TextField
          required
          name="role"
          id="outlined-password-input"
          label="role"
          type="name"
        />
        <TextField
          required
          name="password"
          id="outlined-password-input"
          label="password"
          type="password"
        />
        <div></div>
        <div className="role-permissions">
          <Typography variant="h5">Ogolaanshaha</Typography>
          <div className='inner-container'>
            {permission_pages.map((permission: string, index: number) => (
              <div key={index} className="permissions-button">
                <label className="switch">
                  <input type="checkbox" name={permission} />
                  <span>{permission} page</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div></div>
        <Button type="submit" fullWidth variant="contained">
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default AddUser;
