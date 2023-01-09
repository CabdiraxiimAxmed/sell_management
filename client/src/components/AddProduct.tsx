import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import moment from 'moment';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [close, setClose] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let alertquantity = data.get('alertquantity');
    let price = data.get('price');
    if(!name || !price || !alertquantity) {
      toast.warn('fadlan buuxi');
      return;
    }
    axios.post('/products/create', { name, alertquantity, price })
         .then(res => {
           if(res.data === 'error') {
             toast.error('SERVER: qalada ayaa dhacay');
           } else if(res.data === 'success') {
             toast.success('waa lagu guuleystay');
             setTimeout(() => {
               navigate('/inventory');
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
          name="quantity"
          id="outlined-password-input"
          label="cadadka"
          type="name"
        />
        <TextField
          required
          name="alertquantity"
          id="outlined-password-input"
          label="alert quantity"
          type="name"
        />
        <TextField
          required
          name="price"
          id="outlined-password-input"
          label="qiimaha"
          type="name"
        />
        <div></div>
        <Button type="submit" fullWidth variant="contained" >Submit</Button>
      </Box>
    </div>
  );
};

export default AddProduct;
