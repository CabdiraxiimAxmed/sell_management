import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import moment from 'moment';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [close, setClose] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let created_date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let name = data.get('name');
    let email = data.get('email');
    let address = data.get('address');
    let city = data.get('city');
    let contact = data.get('contact');
    if(!name || !contact || !contact || !email || !city) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios.post('/customers/create', { name, contact, address, email, city, created_date })
         .then(res => {
           if(res.data === 'error') {
             toast.error('qalada ayaa dhacay');
           } else if(res.data === 'success') {
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/customers');
             }, 2000);
           };
         })
         .catch(err => {
           toast.error('qalada ayaa dhacay');
         })
  };

  return (
    <div className={close?"add-customer-container inactive":"add-customer-container"}>
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

export default AddCustomer;
