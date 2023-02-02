import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Grid,
  Paper,
  Box,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { OrderType } from './PurchasePaper';
import axios from 'axios';

type Item = {
  name: string,
  itemQuantity: number,
  sale_price: number,
  min_sale_price: number,
  selling_price: number,
  discount: number,
}

const EditPurchase: React.FC = () => {
  console.log('edit purchase');
  const { id } = useParams();
  const navigate = useNavigate();
  const [removedItems, setRemovedItems] = useState<{name: string, quantity: number}[]>([]);
  const [order, setOrder] = useState<any>({});
  useEffect(() => {
    axios.get(`http://localhost:2312/purchase/orders/${id}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
        }
        setOrder(resp.data[0]);
      }).catch(error => {
        toast.error(error.message);
      });
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let supplier = data.get('supplier');
    let purchase_date = data.get('purchase-date');
    let is_debt = data.get('is-debt');
    let total = data.get('total');
    let paid = data.get('paid');
    let purchase_status = data.get('purchase-status');

    if (!supplier || !purchase_date || !is_debt || !total || !paid || !purchase_status) {
      toast.warn('Please complete the information.');
      return;
    }
    let sendData = { id: order.id, supplier, purchase_date, purchase_status, items: order.items, total, paid, is_debt };
    axios.post('http://localhost:2312/purchase/order/update', sendData)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error");
          return;
        } else if (resp.data === 'success') {
          if(removedItems.length !== 0 && purchase_status === 'received') {
            axios.post('http://localhost:2312/products/item/quantity/update', { removedItems })
              .then(resp => {
                if (resp.data === 'error') {
                  toast.error('server error');
                  return;
                }
                toast.success('success');
                setTimeout(() => {
                  navigate('/orders');
                }, 2000);
              }).catch(error => {
                toast.error(error.message);
              })
          } else {
            toast.success('success');
            setTimeout(() => {
              navigate('/orders');
            }, 2000);
          }
        }
      }).catch(error => {
        toast.error(error.message);
      });
  };



  const removeItem = (name: string) => {
    let items: any = order.items[0];
    if (items.length === 1) return;
    let finalItems: any = items.filter((item: Item) => item.name !== name);
    let poppedItem: any = items.filter((item: Item) => item.name === name);
    //setSendData({ name: removedItem[0].name, quantity: removedItem[0].itemQuantity, status: 'subtr' });
    setRemovedItems([...removedItems, { name: poppedItem[0].name, quantity: poppedItem[0].itemQuantity }]);
    let paid: number  = parseFloat(order.paid) - parseFloat(poppedItem[0].selling_price);
    setOrder({ ...order, ['items']: [finalItems], paid })
  };

  return (
    <Box component='form' noValidate onSubmit={handleSubmit}>
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
      <p style={{ fontWeight: 'bold' }}>Purchase info</p>
      {order.purchase_date && <Paper elevation={5} >
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Supplier *
            </p>
            <TextField
              fullWidth
              required
              name="supplier"
              defaultValue={`${order.supplier}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Date *
            </p>
            <TextField
              fullWidth
              required
              name="purchase-date"
              defaultValue={`${order.purchase_date}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Debt *
            </p>
            <TextField
              fullWidth
              required
              name="is-debt"
              defaultValue={`${order.is_debt}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              total *
            </p>
            <TextField
              fullWidth
              required
              name="total"
              defaultValue={`${order.total}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Discount *
            </p>
            <TextField
              fullWidth
              required
              name="discount"
              defaultValue={`${order.whole_discount}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Paid *
            </p>
            <TextField
              fullWidth
              required
              name="paid"
              value={`${order.paid ? order.paid : 0}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Status *
            </p>
            <TextField
              fullWidth
              required
              name="purchase-status"
              defaultValue={`${order.purchase_status}`}
              multiline
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>}
      <p style={{ fontWeight: 'bold' }}>Items</p>
      {order.purchase_date && <Paper elevation={15} >
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <TableContainer sx={{ maxWidth: 950 }} component={Paper}>
              <Table sx={{ maxWidth: 50 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="table-header-row">
                    <TableCell className="table-header-columns">Name</TableCell>
                    <TableCell className="table-header-columns">
                      Purchase Quantity
                    </TableCell>
                    <TableCell className="table-header-columns">
                      Discount
                    </TableCell>
                    <TableCell className="table-header-columns">
                      Total sale
                    </TableCell>
                    <TableCell className="table-header-columns">
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items[0].map((item: Item, index: number) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell align="left">
                        {item.itemQuantity}
                      </TableCell>
                      <TableCell align="left">
                        { item.discount}
                      </TableCell>
                      <TableCell align="left">
                        {item.selling_price}
                      </TableCell>
                      <TableCell align="left">
                        <IconButton
                          onClick={() => removeItem(item.name)}
                          color="primary"
                        >
                          <ClearIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={12}>
            <Button fullWidth variant='contained' type='submit'>Submit</Button>
          </Grid>
        </Grid>
      </Paper>}
    </Box>

  );
}

export default EditPurchase;
