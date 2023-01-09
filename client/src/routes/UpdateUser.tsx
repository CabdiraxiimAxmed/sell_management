import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Box, Button, Typography } from '@mui/material';
import { UserType } from './UserManagement';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateUser: React.FC = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState<UserType>({
    id: 0,
    name: '',
    username: '',
    role: '',
    password: '',
    created_date: '',
    permissions: [''],
    contact: '',
  })
  const { username } = useParams();
  useEffect(() => {
    axios.get(`/user/${username}`)
         .then(res => {
           setUser(res.data);
         }).catch(err => {
           console.log('error happened');
         })
  }, []);

  const deleteUser = () => {
    axios.post(`/user/delete/${user.username}`, {})
         .then(res => {
           if(res.data === 'success'){
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/user-management');
             }, 2000);
           }
         }).catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  };

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
    if(!name || !username || !password || !contact || !role) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios.post('/user/update-user', { id: user.id, name, username, role, contact, password, permissions})
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
    /* console.log({ name, username, password, role, contact, userManagement}) */
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
          required
          id="name"
          multiline
          defaultValue= {user.name}
          helperText="Magaca"
          name="name"
        />
        <TextField
          required
          id="outlined-password-input"
          multiline
          defaultValue={user.username}
          helperText="username"
          name="username"
        />
        <TextField
          required
          name="contact"
          multiline
          defaultValue={user.contact}
          id="outlined-password-input"
          helperText="contact"
          type="name"
        />
        <TextField
          required
          name="role"
          multiline
          defaultValue={user.role}
          id="outlined-password-input"
          helperText="role"
          type="name"
        />
        <TextField
          required
          name="password"
          multiline
          defaultValue={user.password}
          id="outlined-password-input"
          helperText="password"
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
        <Button fullWidth variant="contained" color="error" onClick={deleteUser}>Delete</Button>
      </Box>
    </div>
  );
};

export default UpdateUser;
