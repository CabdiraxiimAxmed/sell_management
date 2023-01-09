import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserType } from './UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Box, Button, Typography } from '@mui/material';

const AddSupplier: React.FC = () => {

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let email = data.get('email');
    let address = data.get('address');
    let city = data.get('city');
    let contact = data.get('contact');
    if(!name || !contact || !contact || !email || !city) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios.post('/supplier/create-supplier', { name, contact, address, email, city})
         .then(res => {
           if(res.data === 'error') {
             toast.error('qalada ayaa dhacay');
           };
           if(res.data === 'success') {
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/supplier');
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
          name="contact"
          id="outlined-password-input"
          label="contact"
          type="name"
        />
        <TextField
          required
          name="address"
          id="outlined-password-input"
          label="address"
          type="name"
        />
        <TextField
          required
          name="email"
          id="outlined-password-input"
          label="Email"
          type="name"
        />
        <TextField
          required
          name="city"
          id="outlined-password-input"
          label="Caasimada"
          type="name"
        />
        <div></div>
        <Button type="submit" fullWidth variant="contained" >Submit</Button>
      </Box>
    </div>
  );
};

export default AddSupplier;
