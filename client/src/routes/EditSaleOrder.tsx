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
import axios from 'axios';

type Item = {
  item: string,
  quantity: number,
  price: number,
  amount: number,
}

const EditSale: React.FC = () => {
  console.log("edit sale order");
  const { id } = useParams();
  const navigate = useNavigate();
  const [removedItems, setRemovedItems] = useState<{ name: string, quantity: number }[]>([]);
  const [order, setOrder] = useState<any>({});
  useEffect(() => {
    axios.get(`http://localhost:2312/sell/sell/${id}`)
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
    let customer = data.get('customer');
    let sold_by = data.get('sold-by');
    let total = data.get('total');
    let paid = data.get('paid');
    let discount = data.get('discount');

    if (!customer || !sold_by || !total || !paid || !discount) {
      toast.warn('Please complete the information.');
      return;
    }
    let sendData = { id: order.order_id, customer, sold_by, total, paid, discount, items: order.items };
    axios.post('http://localhost:2312/sell/order/update', sendData)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error");
          return;
        } else if (resp.data === 'success') {
          if (removedItems.length !== 0) {
            axios.post('http://localhost:2312/products/item/quantity/update/sell', { removedItems })
              .then(resp => {
                if (resp.data === 'error') {
                  toast.error('server error');
                  return;
                }
                toast.success('success');
                setTimeout(() => {
                  navigate('/sells');
                }, 2000);
              }).catch(error => {
                toast.error(error.message);
              })
          } else {
            toast.success('success');
            setTimeout(() => {
              navigate('/sells');
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
    let finalItems: any = items.filter((item: Item) => item.item !== name);
    let poppedItem: any = items.filter((item: Item) => item.item === name);
    let paid: number = 0;
    if (parseFloat(order.paid) > 0) {
      paid = Math.round((parseFloat(order.paid) - parseFloat(poppedItem[0].amount)) * 100) / 100;
    }
    let total: number = Math.round((parseFloat(order.total) - parseFloat(poppedItem[0].amount)) * 100) / 100;
    setRemovedItems([...removedItems, { name: poppedItem[0].item, quantity: poppedItem[0].quantity }]);
    setOrder({ ...order, ['items']: [finalItems], paid, total })
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
      <p style={{ fontWeight: 'bold' }}>Sale info</p>
      {order.customer && <Paper elevation={5} >
        <Grid container columnSpacing={2}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Customer *
            </p>
            <TextField
              fullWidth
              required
              name="customer"
              defaultValue={`${order.customer}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Sold By *
            </p>
            <TextField
              fullWidth
              required
              name="sold-by"
              defaultValue={`${order.sold_by}`}
              multiline
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Total *
            </p>
            <TextField
              fullWidth
              required
              name="total"
              value={`${order.total}`}
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
              defaultValue={`${order.discount}`}
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
        </Grid>
      </Paper>}
      <p style={{ fontWeight: 'bold' }}>Items</p>
      {order.customer && <Paper elevation={15} >
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <TableContainer sx={{ maxWidth: 950 }} component={Paper}>
              <Table sx={{ maxWidth: 50 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="table-header-row">
                    <TableCell className="table-header-columns">Name</TableCell>
                    <TableCell className="table-header-columns">
                      Quantity
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
                        {item.item}
                      </TableCell>
                      <TableCell align="left">
                        {item.quantity}
                      </TableCell>
                      <TableCell align="left">
                        $ {item.amount}
                      </TableCell>
                      <TableCell align="left">
                        <IconButton
                          onClick={() => removeItem(item.item)}
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

export default EditSale;
