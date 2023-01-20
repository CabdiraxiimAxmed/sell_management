import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import DownloadIcon from '@mui/icons-material/Download';
import { useParams } from 'react-router-dom';
import axios from 'axios'

type OrderType = {
  id: string,
  supplier: string,
  purchase_date: string,
  purchase_status: string,
  items: [[{
    name: string,
    itemQuantity: number,
    sale_price: number,
    min_sale_price: number,
    selling_price: number,
    discount: number,
  }]];
  whole_discount: string,
  total: string,
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
      id: '',
      supplier: '',
      purchase_date: '',
      purchase_status: '',
      items: [[{
        name: '',
        itemQuantity: 0,
        sale_price: 0,
        min_sale_price: 0,
        selling_price: 0,
        discount: 0,
      }]],
      whole_discount: '',
      total: '',
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
    axios.get(`http://localhost:2312/purchase/orders/${order_id}`)
      .then(res => {
        if (res.data == 'error') {
          toast.error("SERVER: qalad ayaa dhacay");
          return;
        }
        setOrder(res.data);
      }).catch(error => {
        toast.error(error.message);
      })
  }, []);

  useEffect(() => {
    if (order[0].supplier) {
      axios.post('http://localhost:2312/supplier/supplier', { name: order[0].supplier })
        .then(res => {
          if (res.data == 'error') {
            toast.error("SERVER: qalad ayaa dhacay");
            return;
          }
          setSupplier(res.data[0]);
        }).catch(error => {
          toast.error(error.message);
        })
    }
  }, [order])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Box ref={componentRef} sx={{ width: 500, backgroundColor: 'white', padding: '0 22px', borderRadius: '4px', boxShadow: '1px 1px 20px rgba(0, 0, 0, 0.2)' }}>
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
          <button className="dropBtn" onClick={handlePrint}><DownloadIcon /> export</button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Warqada Dalabka</Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Typography>tixraac: #{order[0].id}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Address</Typography>
          <Typography variant="body2" style={{ color: '#7d7d7d' }}>{supplier.name}</Typography>
          <Typography variant="body2" style={{ color: '#7d7d7d' }}>{supplier.address} {supplier.city}</Typography>
          <Typography variant="body2" style={{ color: '#7d7d7d' }}>{supplier.email}</Typography>
          <Typography variant="body2" style={{ color: '#7d7d7d' }}>{supplier.contact}</Typography>
        </Grid>
        <Grid item xs={12} container style={{ paddingTop: '15px', paddingBottom: '15px' }}>
          <Grid item xs={6}>
            <Typography variant="h6">Loo wadaa</Typography>
            <Typography variant="body2" style={{ color: '#7d7d7d' }}>Nasiib</Typography>
            <Typography variant="body2" style={{ color: '#7d7d7d' }}>Bakara Mogadishu/Somali</Typography>
            <Typography variant="body2" style={{ color: '#7d7d7d' }}>nasiib@gmail.com</Typography>
            <Typography variant="body2" style={{ color: '#7d7d7d' }}>2345345</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <Typography variant="h6">waqtiga dalabka:</Typography>
              <Typography variant="body2">{order[0].purchase_date}</Typography>
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
                  <th>item name</th>
                  <th>quantity</th>
                  <th>price</th>
                  <th>discount</th>
                  <th>amount</th>
                </tr>
              </thead>
              {order[0].items[0].map((item, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.itemQuantity}</td>
                    <td>$ {item.sale_price}</td>
                    <td>$ {item.discount}</td>
                    <td>$ {item.selling_price}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Container style={{ display: 'flex', justifyContent: 'end' }}>
            <Typography variant="body2" style={{ marginRight: '15px' }}>DISCOUNT</Typography>
            <Typography variant="caption">$ {order[0].whole_discount}</Typography>
          </Container>
          <Container style={{ display: 'flex', justifyContent: 'end' }}>
            <Typography variant="body2" style={{ marginRight: '15px' }}>WADARTA</Typography>
            <Typography variant="caption">${order[0].total}</Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export type { OrderType }
export default PurchasePaper;
