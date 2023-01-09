import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'

type CustomerType = {
  id: number,
  name: string,
  contact: string,
  address: string,
  email: string,
  city: string,
  created_date: string,
};
interface Props {
  customer: CustomerType
}
const EditCustomer: React.FC<Props> = ({ customer }) =>{
  const navigate = useNavigate();
  const deleteCustomer = () => {
    toast.error('dhisma ayaa ku socda');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let email = data.get('email');
    let city = data.get('city');
    let address = data.get('address');
    let contact = data.get('contact');
    if(!name || !email || !address || !contact || !city) {
      toast.warn('fadlan buuxi');
      return;
    }

    axios.post('/customers/update', { id: customer.id, name, email, city, contact, address})
         .then(res => {
           if(res.data === 'error') {
             toast.error('qalada ayaa dhacay');
           };
           if(res.data === 'success') {
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/customers');
             }, 2000);
           };
         })
         .catch(err => {
           console.log('this is the error');
           console.log(err);
           toast.error('qalada ayaa dhacay');
         })
  };

  return (
    <div className="edit-customer-container">
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
          defaultValue= {customer.name}
          helperText="Magaca"
          name="name"
        />
        <TextField
          required
          id="outlined-password-input"
          multiline
          defaultValue={customer.contact}
          helperText="username"
          name="contact"
        />
        <TextField
          required
          name="address"
          multiline
          defaultValue={customer.address}
          id="outlined-password-input"
          helperText="address"
          type="name"
        />
        <TextField
          required
          name="email"
          multiline
          defaultValue={customer.email}
          id="outlined-password-input"
          helperText="address"
          type="name"
        />
        <TextField
          required
          name="city"
          multiline
          defaultValue={customer.city}
          id="outlined-password-input"
          helperText="city"
          type="name"
        />
        <div></div>
        <Button type="submit" fullWidth variant="contained" >Submit</Button>
        <Button fullWidth variant="contained" color="error" onClick={deleteCustomer}>Delete</Button>
      </Box>
    </div>
  );
};

export default EditCustomer;
