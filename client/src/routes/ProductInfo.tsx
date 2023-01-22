import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ProductType } from '../routes/Inventory';
import { Grid, Button, Paper, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductInfo: React.FC = () => {
  const navigate = useNavigate();
  let [product, setProduct] = useState<{ [key: string]: ProductType }>({});
  let { name } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:2312/products/${name}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
          return;
        }
        setProduct(resp.data);
      }).catch(error => {
        toast.error(error.message);
      })
  }, [])
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let name = data.get('name');
    let units = data.get('units');
    let category = data.get('category');
    let subCategory = data.get('sub-category');
    let alertQuantity = data.get('alert-quantity');
    let barCode = data.get('bar-code');
    let purchaseCost = data.get('purchase-cost');
    let salePrice = data.get('sale-price');
    let minSalePrice = data.get('min-sale-price');
    let minQntyOrder = data.get('min-quantity-order');
    if (!name || !salePrice) {
      toast.warn(`Please fill name and sale price field`);
      return;
    }
    let sendData = { id: product.id, name, units, category, subCategory, alertQuantity, barCode, salePrice, purchaseCost, minSalePrice, minQntyOrder };
    axios.post('http://localhost:2312/products/update', sendData)
      .then(resp => {
        if(resp.data === 'error') {
          toast.error('server error');
          return;
        }
        toast.success('success');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      }).catch(error => {
        toast.error(error.message);
      })
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
      {product.name && <Paper onSubmit = {handleSubmit} component='form' elevation={10}>
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Product name *
            </p>
            <TextField
              fullWidth
              required
              name="name"
              defaultValue={`${product.name}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Category *
            </p>
            <TextField
              fullWidth
              required
              name="category"
              defaultValue={`${product.category}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Sub Category *
            </p>
            <TextField
              fullWidth
              required
              name="sub-category"
              defaultValue={`${product.sub_category}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Units *
            </p>
            <TextField
              fullWidth
              required
              name="units"
              defaultValue={`${product.units}`}
              multiline
              size="small"
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
              defaultValue={`${product.alert_quantity}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Cost *
            </p>
            <TextField
              fullWidth
              required
              name="purchase-cost"
              defaultValue={`${product.purchase_cost}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Sale Price *
            </p>
            <TextField
              fullWidth
              required
              name="sale-price"
              defaultValue={`${product.sale_price}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Min Sale Price *
            </p>
            <TextField
              fullWidth
              required
              name="min-sale-price"
              defaultValue={`${product.min_sale_price}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Min Quantity Order *
            </p>
            <TextField
              fullWidth
              required
              name="min-quantity-order"
              defaultValue={`${product.min_quantity_order}`}
              multiline
              size="small"
            />

          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
             Bar Code *
            </p>
            <TextField
              fullWidth
              required
              name="bar-code"
              defaultValue={`${product.bar_code}`}
              multiline
              size="small"
            />

          </Grid>
          <Grid item xs={12}> <br/> </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant='contained' color='primary' type='submit'>submit</Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth color='secondary' variant='contained'>delete</Button>
          </Grid>
          <Grid item xs={12}> <br/> </Grid>
        </Grid>
      </Paper>
      }
    </>
  );
}

export default ProductInfo;
