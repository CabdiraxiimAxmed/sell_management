import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserType } from './UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Box, Button, Typography } from '@mui/material';

const AddUser: React.FC = () => {

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e)
    let permissions = [];
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let username = data.get('username');
    let role = data.get('role');
    let password = data.get('password');
    let contact = data.get('contact');
    let userManagement = data.get('user-management');
    let supplier = data.get('supplier');
    let purchaseOrder = data.get('purchase-order');
    let orders = data.get('orders');
    if (userManagement == 'on'){
      permissions.push('user-management');
    }
    if (supplier == 'on'){
      permissions.push('supplier');
    }
    if (purchaseOrder == 'on'){
      permissions.push('purchase-order');
    }
    if (orders == 'on'){
      permissions.push('orders');
    }
    if(!name || !username || !password || !contact || !role) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios.post('/user/create-user', { name, username, role, contact, password, permissions})
         .then(res => {
           if(res.data === 'error') {
             toast.error('qalada ayaa dhacay');
           };
           if(res.data === 'success') {
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/user-management');
             }, 2000);
           };
         })
         .catch(err => {
           toast.error('qalada ayaa dhacay');
         })
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
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
        <TextField
          id="name"
          required
          label="Magaca"
          type="name"
          name="name"
        />
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
          <div className="permissions-button">
            <label className="switch">
              <input type="checkbox" name="user-management" />
                <span>cinwaanada</span>
            </label>
            <label className="switch">
              <input type="checkbox" name="supplier" />
              <span>supplier</span>
            </label>
            <label className="switch">
              <input type="checkbox" name="purchase-order" />
              <span>alaab dalbasho</span>
            </label>
            <label className="switch">
              <input type="checkbox" name="orders" />
              <span>dalabkaaga</span>
            </label>
          </div>
        </div>
        <div></div>
        <Button type="submit" fullWidth variant="contained" >Submit</Button>
      </Box>
    </div>
  );
};

export default AddUser;
