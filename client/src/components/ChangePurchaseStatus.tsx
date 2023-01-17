import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Props {
  top: number,
  left: number,
  id: number,
};
const ChangePurchaseStatus: React.FC<Props> = ({ top, left, id }) => {
  const [items, setItems] = useState<{ item: string, quantity: number, amount: number }[]>([{
    item: '',
    quantity: 0,
    amount: 0,
  }]);
  useEffect(() => {
    axios.get(`http://localhost:2312/purchase/orders/${id}`)
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return;
        }
        setItems(res.data[0].items[0]);
      })
      .catch(error => {
        toast.error(error.message);
      })
  }, [])
  const handleClick = () => {

    // storing items and changing the status
    axios.post('http://localhost:2312/purchase/received', { id, items, status: 'received' })
      .then(res => {
        if (res.data == 'success') {
          toast.success('waa lagu guuleystay');
        } else if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
        }
      })
      .catch(error => {
        toast.error(error.message);
      })
  };

  return (
    <div className="change-purchase-status-container" style={{ top: `${top + 64}px`, left: `${left}px` }}>
      <Button variant="contained" color="secondary" fullWidth onClick={handleClick}>confirm</Button>
    </div>
  );
};

export default ChangePurchaseStatus;
