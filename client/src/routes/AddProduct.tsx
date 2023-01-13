import React from 'react';
import {
  Paper,
  TextField,
  Grid,
  Autocomplete,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct: React.FC = () => {
  let Category = [{ label: 'first' }, { label: 'second' }, { label: 'third' }];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let name = data.get('name');
    let units = data.get('units');
    let category = data.get('category');
    let subCategory = data.get('sub-category');
    let alertQuantity = data.get('alert-quantity');
    let barType = data.get('bar-type');
    let purchaseCost = data.get('purchase-cost');
    let salePrice = data.get('sale-price');
    let minSalePrice = data.get('min-sale-price');
    let minQntyOrder = data.get('min-quantity-order');
    axios
      .post('http://localhost:2312/products/create', {
        name,
        units,
        category,
        subCategory,
        alertQuantity,
        barType,
        purchaseCost,
        salePrice,
        minSalePrice,
        minQntyOrder,
      })
      .then(resp => {
        if (resp.data === 'success') toast.success('success');
        else if (resp.data === 'error') toast.error('error happened');
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
      <Paper elevation={10}>
        <Grid style={{ padding: 10 }} container columnSpacing={1}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Product name *
            </p>
            <TextField
              fullWidth
              required
              name="name"
              label="product name"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Units*
            </p>
            <TextField
              fullWidth
              required
              name="units"
              label="Units"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              {' '}
              Category *
            </p>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              options={Category}
              sx={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Please select"
                  name="category"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Sub Category *
            </p>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              options={Category}
              sx={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Please select"
                  name="sub-category"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Alert Quantity *
            </p>
            <TextField
              fullWidth
              required
              name="alert-quantity"
              label="alert quantity"
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ marginTop: '20px', padding: '20px' }} elevation={10}>
        <Grid style={{ padding: 10 }} container columnSpacing={1}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Cost *
            </p>
            <TextField
              fullWidth
              required
              name="purchase-cost"
              label="purchase cost"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Sell price*
            </p>
            <TextField
              fullWidth
              required
              name="sale-price"
              label="sale price"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              {' '}
              Min sale price *
            </p>
            <TextField
              fullWidth
              required
              name="min-sale-price"
              label="min sale price"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Min qnty order *
            </p>
            <TextField
              fullWidth
              required
              name="min-quantity-order"
              label="min quantity order"
              size="small"
            />
          </Grid>

          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Bar Type *
            </p>
            <TextField
              fullWidth
              required
              name="bar-type"
              label="bar type"
              size="small"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained">
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default AddProduct;
