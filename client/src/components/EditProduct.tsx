import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ProductType } from '../routes/Inventory';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Props {
  product: ProductType;
}
const EditCustomer: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const deleteCustomer = () => {
    toast.error('dhisma ayaa ku socda');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let alertquantity = data.get('alert-quantity');
    let price = data.get('price');
    let barcode = data.get('barcode');
    if (!name || !price || !alertquantity || !barcode) {
      toast.warn('fadlan buuxi');
      return;
    }

    axios
      .post('/products/update', {
        id: product.id,
        name,
        price,
        alertquantity,
        barcode,
      })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalada ayaa dhacay');
        }
        if (res.data === 'success') {
          toast.success('waa lagu guuleystay');
          setTimeout(() => {
            navigate('/inventory');
          }, 2000);
        }
      })
      .catch(err => {
        toast.error('qalada ayaa dhacay');
      });
  };

  return (
    <div className="edit-customer-container">
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}
      >
        <TextField
          required
          id="name"
          multiline
          defaultValue={product.name}
          helperText="Magaca"
          name="name"
        />
        <TextField
          required
          id="outlined-password-input"
          multiline
          type="number"
          defaultValue={product.alertquantity}
          helperText="alert quantity"
          name="alert-quantity"
        />
        <TextField
          required
          name="price"
          multiline
          defaultValue={product.price}
          id="outlined-password-input"
          helperText="qiimaha"
          type="number"
        />
        <TextField
          required
          name="barcode"
          multiline
          defaultValue={product.barcode}
          id="outlined-password-input"
          helperText="barcode"
          type="name"
        />
        <div></div>
        <Button type="submit" fullWidth variant="contained">
          Submit
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={deleteCustomer}
        >
          Delete
        </Button>
      </Box>
    </div>
  );
};

export default EditCustomer;
