import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

interface Props {
  top: number,
  left: number,
  order_id: string,
};
const ChangePurchaseStatus: React.FC<Props> = ({ top, left, order_id}) => {

  const [items, setItems] = useState<{item: string, quantity: number, amount: number}[]>([{
    item: '',
    quantity: 0,
    amount: 0,
  }]);
  useEffect(() => {
    axios.get(`/purchase/orders/${order_id}`)
         .then(res => {
           if (res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return;
           }
           setItems(res.data[0].items[0]);
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, [])
  const handleClick = () => {

    // first: checking if the order is received.
    axios.get(`/purchase/orders/${order_id}`)
         .then(res => {
           if (res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return;
           }
           if(res.data[0].purchase_status === 'lahelay') {
             toast.warn('alaabta mar hore ayaa la xareeyay');
             return;
           }

           // storing items and changing the status.
           axios.post('/purchase/received', { order_id, items, status: 'lahelay' })
                .then(res => {
                  if(res.data == 'success') {
                    toast.success('waa lagu guuleystay');
                  }else if (res.data === 'error') {
                    toast.error('SERVER: qalad ayaa dhacay');
                  }
                })
                .catch(err => {
                  toast.error('qalad ayaa dhacay');
                })
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  };

  return (
    <div className="change-purchase-status-container" style={{top: `${top + 64}px`, left: `${left}px`}}>
      <Button variant="contained" color="secondary" fullWidth onClick={handleClick}>xaqiiji</Button>
    </div>
  );
};

export default ChangePurchaseStatus;
