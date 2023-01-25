import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

type Item = {
name: string,
alert_quantity: string;
}

type Notification = {
  items: Item[],
  count: string
}

const ItemAlert: React.FC = () => {
  console.log('item alert');
  const [notification, setNotification] = useState<Notification>({
    items: [{name: '', alert_quantity: ''}],
    count: '',
  });
  const [isNotification, setIsNotification] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:2312/products/alert/quantity')
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
          return;
        } else if (resp.data.items.length === 0) {
          setIsNotification(false);
          return;
        }
        setNotification(resp.data);
        setIsNotification(true);
      })
      .catch(error => {
        toast.error(error.message);
      })
  }, []);
  /* item is less than quantity*/
  return (
    <>
      <div className='alert-notification-container '>
        {isNotification ? notification.items.map((item: Item, index: number) => (
          <div key={index} className='card'>
            <p>{item.name} quantity is less than {item.alert_quantity} units.</p>
          </div>
        )): (
          <div className='card'>
            <p>There is no notification</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemAlert;
