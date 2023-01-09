import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import {useReactToPrint}  from 'react-to-print';
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from 'react-router-dom';
import axios from 'axios'

type SellType = {
  order_id: string,
  customer: string,
  sold_by: string,
  is_debt: boolean,
  items: {item: string, quantity:number, price:number, amount: number}[][],
  discount: string,
  total: string,
  paid: string
  created_date: string,
  payment_method: string,
};

type CustomerType = {
  id: number,
  name: string,
  contact: string,
  address: string,
  email: string,
  city: string,
  created_date: string,
}

const PurchasePaper: React.FC = () => {
  const componentRef = useRef(null)
  const { order_id } = useParams();
  const [sell, setSell] = useState<SellType[]>([
    {
      order_id: '',
      customer: '',
      sold_by: '',
      is_debt: false,
      items: [[{item: '', quantity: 0, price: 0, amount: 0}]],
      discount: '',
      total: '',
      paid: '',
      created_date: '',
      payment_method: '',
    }
  ]);
  const [customer, setCustomer] = useState<CustomerType>({
    id: 0,
    name: '',
    contact: '',
    address: '',
    email: '',
    city: '',
    created_date: '',
  })

  useEffect(() => {
    axios.get(`/sell/sell/${order_id}`)
         .then(res => {
           if(res.data == 'error') {
             toast.error("SERVER: qalad ayaa dhacay");
             return;
           }
           setSell(res.data);
         }) .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, []);

  useEffect(() => {
    if (sell[0].customer) {
      axios.post('/customers/name', {name: sell[0].customer})
           .then(res => {
             if(res.data == 'error') {
               toast.error("SERVER: qalad ayaa dhacay");
               return;
             }
             console.log(res.data);
             setCustomer(res.data);
           }) .catch(err => {
             toast.error('qalad ayaa dhacay');
           })
    }
  }, [sell])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Box ref={componentRef} sx={{width: 500, backgroundColor:'white', padding:'0 22px', borderRadius: '4px', boxShadow: '1px 1px 20px rgba(0, 0, 0, 0.2)'}}>
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
      <Grid container>
        <Grid item xs={6}>
          <button className="dropBtn" onClick={handlePrint}><DownloadIcon/> export</button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Warqada Dalabka</Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Typography>tixraac:{sell[0].order_id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Address</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>'name'</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>'address/city'</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>'Email'</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>'contact'</Typography>
        </Grid>
        <Grid item xs={12} container style={{paddingTop: '15px', paddingBottom: '15px'}}>
          <Grid item xs={6}>
            <Typography variant="h6">Loo wadaa</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>{customer.name}</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>{customer.address} {customer.city}</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>{customer.email}</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>{customer.contact}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
              <Typography variant="h6">waqtiga dalabka:</Typography>
              <Typography variant="body2">{sell[0].created_date}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography>Alaabta</Typography>
        </Grid>
        <Grid item xs={12}>
      <div className="table-container purchase-paper">
        <table>
          <thead>
            <tr>
              {Object.keys(sell[0].items[0][0]).map((column_head, index) => (
                <th key={ index }>{column_head}</th>
              ))}
            </tr>
          </thead>
          {sell[0].items[0].map((item, index) => (
            <tbody key={index}>
              <tr>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Container style={{display: 'flex', justifyContent: 'end'}}>
            <Typography variant="body2" style={{marginRight: '15px'}}>DISCOUNT</Typography>
            <Typography variant="caption">${sell[0].discount}</Typography>
          </Container>
          <Container style={{display: 'flex', justifyContent: 'end'}}>
            <Typography variant="body2" style={{marginRight: '15px'}}>WADARTA</Typography>
            <Typography variant="caption">${sell[0].total}</Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export type { SellType }
export default PurchasePaper;
