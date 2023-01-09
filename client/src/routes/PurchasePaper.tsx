import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import {useReactToPrint}  from 'react-to-print';
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from 'react-router-dom';
import axios from 'axios'

type OrderType = {
  order_id: string,
  order_date: string,
  delivery_date: string,
  supplier: string,
  purchase_status: string,
  items: {item: string, quantity:number, price:number, amount: number}[][],
  discount: string,
  taxamount: string,
  total: string,
  paid: string
};

type SupplierType = {
  id: number,
  name: string,
  contact: string,
  address: string,
  created_date: string,
  email: string,
  city: string,
}

const PurchasePaper: React.FC = () => {
  const componentRef = useRef(null)
  const { order_id } = useParams();
  const [order, setOrder] = useState<OrderType[]>([
    {
      order_id: '',
      order_date: '',
      delivery_date: '',
      supplier: '',
      purchase_status: '',
      items: [[{item: '', quantity: 0, price: 0, amount: 0}]],
      discount: '',
      taxamount: '',
      total: '',
      paid: ''
    }
  ]);
  const [supplier, setSupplier] = useState<SupplierType>({
    id: 0,
    name: '',
    contact: '',
    address: '',
    created_date: '',
    email: '',
    city: '',
  })

  useEffect(() => {
    axios.get(`/purchase/orders/${order_id}`)
         .then(res => {
           if(res.data == 'error') {
             toast.error("SERVER: qalad ayaa dhacay");
             return;
           }
           setOrder(res.data);
         }) .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, []);

  useEffect(() => {
    if (order[0].supplier) {
      axios.post('/supplier/supplier', {name: order[0].supplier})
           .then(res => {
             if(res.data == 'error') {
               toast.error("SERVER: qalad ayaa dhacay");
               return;
             }
             setSupplier(res.data[0]);
           }) .catch(err => {
             toast.error('qalad ayaa dhacay');
           })
    }
  }, [order])

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
          <Typography>tixraac:{order[0].order_id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Address</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>{supplier.name}</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>{supplier.address} {supplier.city}</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>{supplier.email}</Typography>
          <Typography variant="body2" style={{color: '#7d7d7d'}}>{supplier.contact}</Typography>
        </Grid>
        <Grid item xs={12} container style={{paddingTop: '15px', paddingBottom: '15px'}}>
          <Grid item xs={6}>
            <Typography variant="h6">Loo wadaa</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>Nasiib</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>Bakara Mogadishu/Somali</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>nasiib@gmail.com</Typography>
            <Typography variant="body2" style={{color: '#7d7d7d'}}>2345345</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
              <Typography variant="h6">waqtiga dalabka:</Typography>
              <Typography variant="body2">{order[0].order_date}</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
              <Typography variant="h6">waqtiga keenida:</Typography>
              <Typography variant="body2">{order[0].delivery_date}</Typography>
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
              {Object.keys(order[0].items[0][0]).map((column_head, index) => (
                <th key={ index }>{column_head}</th>
              ))}
            </tr>
          </thead>
          {order[0].items[0].map((item, index) => (
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
            <Typography variant="caption">${order[0].discount}</Typography>
          </Container>
          <Container style={{display: 'flex', justifyContent: 'end'}}>
            <Typography variant="body2" style={{marginRight: '15px'}}>CANSHUUR</Typography>
            <Typography variant="caption">{order[0].taxamount}%</Typography>
          </Container>
          <Container style={{display: 'flex', justifyContent: 'end'}}>
            <Typography variant="body2" style={{marginRight: '15px'}}>RAR:</Typography>
            <Typography variant="caption">$0.00</Typography>
          </Container>
          <Container style={{display: 'flex', justifyContent: 'end'}}>
            <Typography variant="body2" style={{marginRight: '15px'}}>WADARTA</Typography>
            <Typography variant="caption">${order[0].total}</Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export type { OrderType }
export default PurchasePaper;