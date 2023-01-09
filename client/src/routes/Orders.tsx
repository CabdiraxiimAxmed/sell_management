import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Header, { DrawerHeader } from './Header';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify';
import { Box, Stack, Typography, Button, MenuItem, Avatar, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog, TextField, Autocomplete } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChangePurchaseStatus from '../components/ChangePurchaseStatus';
import axios from 'axios';

type OrderType = {
  order_id: string,
  order_date: string,
  delivery_date: string,
  supplier: string,
  purchase_status: string,
  discount: string,
  taxamount: string,
  total: string,
  paid: string,
  payment_option: string
};
type ColumnDisplayType = {
  order_id: boolean,
  order_date: boolean,
  delivery_date: boolean,
  supplier: boolean,
  purchase_status: boolean,
  discount: boolean,
  taxamount: boolean,
  total: boolean,
  paid: boolean,
  payment_option: boolean,
};

const Supplier: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderType[]>([
    {
      order_id: '',
      order_date: '',
      delivery_date: '',
      supplier: '',
      purchase_status: '',
      discount: '',
      taxamount: '',
      total: '',
      paid: '',
      payment_option: '',
    }
  ]);
  const [ordersStore, setOrdersStore] = useState<OrderType[]>([
    {
      order_id: '',
      order_date: '',
      delivery_date: '',
      supplier: '',
      purchase_status: '',
      discount: '',
      taxamount: '',
      total: '',
      paid: '',
      payment_option: '',
    }
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    order_id: true,
    order_date: true,
    delivery_date: false,
    supplier: true,
    purchase_status: true,
    discount: true,
    taxamount: true,
    total: true,
    paid: true,
    payment_option: true,
  });

  const [purchaseStatusChange, setPurchaseStatusChange] = useState<{top: number, left: number, order_id: string, open: boolean, status: string}>({
    top: 0, left: 0, order_id: '', open: false, status: '',
  })

  useEffect(() => {
    axios.get('/purchase/orders')
         .then(res => {
           setOrders(res.data);
           setOrdersStore(res.data);
         })
         .catch(err => {
           // toast if there is an error
           console.log(err);
         })
  }, [])

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => { // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked
    });
  };

  const handleFilterStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const status = e.target.name;
    if(isChecked) {
      const filtered = ordersStore.filter((order: OrderType) => {
        return order.purchase_status.toLowerCase().includes(status.toLowerCase());
      })
      if (!filtered.length) {
        setOrders([
          {
            order_id: '',
            order_date: '',
            delivery_date: '',
            supplier: '',
            purchase_status: '',
            discount: '',
            taxamount: '',
            total: '',
            paid: '',
            payment_option: '',
          }
        ])
        return;
      }
      setOrders(filtered);
    } else {
      setOrders(ordersStore);
    }
  };

  const goOrderPaper = (id: string) => {
    navigate(`/purchase-order/${id}`)
  };

  const filterOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = ordersStore.filter((order: OrderType) => {
      return order.supplier.toLowerCase().includes(term.toLowerCase());
    })
    if (!filtered.length) {
      setOrders([
        {
          order_id: '',
          order_date: '',
          delivery_date: '',
          supplier: '',
          purchase_status: '',
          discount: '',
          taxamount: '',
          total: '',
          paid: '',
          payment_option: '',
        }
      ])
      return;
    }
    setOrders(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  }

  const handlePurchaseStatus = (e: any, order_id: string, status: string) => {
    if (status === 'ladalbay')
      setPurchaseStatusChange({top: e.clientY, left: e.clientX, order_id, open: !purchaseStatusChange.open, status})
  }

  const findColor = (status: string) => {
    if (status == 'lahelay') return 'success';
    return 'error'
  };

  return (
    <>
      {purchaseStatusChange.open && <ChangePurchaseStatus top={purchaseStatusChange.top} left={purchaseStatusChange.left} order_id={purchaseStatusChange.order_id}/>}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginBottom : 9}}>
          <Typography variant="h5" gutterBottom>
            Dalabadaadkaaga
          </Typography>
          <Button variant="contained" onClick={() => navigate('/purchase-order')} startIcon={<AddIcon />} style={{backgroundColor:"#2367d1", fontWeight: 'bold'}}>
            Dalab
          </Button>
        </Stack>
  <div className="container">
      <div className="search-filters-container">
        <input placeholder="search" className="search" onChange={filterOrders}/>
        <div className="filters-container">
          <div className="dropdown">
            <button className="dropBtn"><BoltIcon/> xaladda</button>
            <div className="dropdown-content">
              <label className="switch">
                <input
                  type="checkbox"
                  name='ladalbay'
                  className="checkbox"
                  onChange={handleFilterStatus}
                />
                <span>ladalbay</span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  name='lahelay'
                  className="checkbox"
                  onChange={handleFilterStatus}
                />
                <span>lahelay</span>
              </label>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropBtn"><ViewWeekIcon/> columns</button>
            <div className="dropdown-content">
              {Object.keys(orders[0]).map((column_head: string, index: number) => (
                <label className="switch">
                  <input
                    type="checkbox"
                    name={column_head}
                    className="checkbox"
                    onChange={handleClick}
                  checked={columnDisplay[column_head as keyof ColumnDisplayType]}
                  />
                  <span>{column_head}</span>
                </label>
              ))}
            </div>
          </div>
    <button className="dropBtn"><DownloadIcon/> export</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {Object.keys(orders[0]).map((column_head, index) => (
                <th className={display(column_head)? '': 'inactive'}>{column_head}</th>
              ))}
            </tr>
          </thead>

          {orders.map((order, index) => (
            <tbody>
              <tr>
                <td className={display('order_id')? '': 'inactive'}><Button variant="text" onClick={() => goOrderPaper(order.order_id) }>{order.order_id}</Button></td>
                <td className={display('order_date')? '': 'inactive'}>{order.order_date}</td>
                <td className={display('delivery_date')? '': 'inactive'}>{order.delivery_date}</td>
                <td className={display('supplier')? '': 'inactive'}>{order.supplier}</td>
                <td className={display('purchase_status')? '': 'inactive'}><Button variant="contained" color = {findColor(order.purchase_status)} onClick={(e) => handlePurchaseStatus(e, order.order_id, order.purchase_status) }>{order.purchase_status}</Button></td>
                <td className={display('discount')? '': 'inactive'}>${order.discount}</td>
                <td className={display('taxamount')? '': 'inactive'}>${order.taxamount}</td>
                <td className={display('total')? '': 'inactive'}>${order.total}</td>
                <td className={display('paid')? '': 'inactive'}>${order.paid}</td>
                <td className={display('payment_option')? '': 'inactive'}>{order.payment_option}</td>
                <td>
                  <OrderMenuButton order_id={order.order_id} total={order.total} paid={order.paid} payment_option={order.payment_option} supplier={order.supplier} />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
    </>
  );
};

/* Menu items of columns */
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 130,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '2px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

type OrderMenuButtonType = {
  order_id: string,
  total: string,
  paid: string,
  payment_option: string,
  supplier: string,
}
const OrderMenuButton:React.FC<OrderMenuButtonType> = ({ order_id, total, paid, payment_option, supplier }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<{option: string, price: number}>({option: '', price: 0});
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  useEffect(() => {
  }, [selectedValue])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isDisabled = () => {
    let paidAmount: number = parseFloat(paid)
    let totalAmount: number = parseFloat(total)
    if(paidAmount >= totalAmount) return true;
    return false;
  }

  const handleClose = (page: string) => {
    if(page == 'pay'){
      setOpen(true);
    }else if(page == 'edit'){
      navigate(`/purchase/edit/${order_id}`);
    } else if (page == 'delete') {
      axios.post(`/purchase/delete/${order_id}`)
           .then(res => {
             if(res.data === 'success') {
               toast.success('waa lagu guuleystay');
               navigate('/orders');
             } else if (res.data === 'error') {
               toast.error('SERVER: qalad ayaa dhacay');
             }
           })
           .catch(err => {
             toast.error('qalad ayaa dhacay');
           })
    };
    setAnchorEl(null);
  };

  const handleClickClose = (value: {option: string, price: number}) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
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
      <Payment
        selectedValue={selectedValue}
        open={open}
        onClose={handleClickClose}
        paid={paid}
        total={total}
        payment_option={payment_option}
        order_id={order_id}
        supplier={supplier}
      />
      <IconButton color="primary" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose('pay') } disableRipple disabled={isDisabled()}>
          <AttachMoneyIcon />
          bixi lacag
        </MenuItem>
        <MenuItem onClick={() => handleClose('edit') } disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleClose('delete') } disableRipple sx={{color: 'red'}}>
          <DeleteIcon style={{color: 'red'}}/>
          Tir
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
/* payment section */

interface PaymentProps {
  open: boolean;
  selectedValue: {option: string, price: number};
  onClose: (value: {option: string, price: number}) => void;
  paid: string;
  total: string;
  payment_option: string;
  order_id: string;
  supplier: string,
}

function Payment(props: PaymentProps) {
  const navigate = useNavigate();
  const { onClose, selectedValue, open, paid, total, payment_option, order_id, supplier } = props;
  let paidAmount: number = parseFloat(paid);
  const [option, setOption] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const sendPaymentData = () => {
    let recordedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    let paidAmount: number = parseFloat(paid) + selectedValue.price;
    let totalAmount: number = parseFloat(total)
    if(!option && !price) {
      toast.warn('fadlan buuxi meelaha');
      return;
    }
    if(option == 'dhammaan' || payment_option === 'dhammaan'){
      let payments: {recordedDate: string, paidAmount: number} = {recordedDate, paidAmount: price};
      if(paidAmount > totalAmount) {
        toast.warn('lacagta wey ka badantahay wadarta');
        return;
      }
      if(paidAmount < totalAmount) {
        toast.warn('lacagta wey ka yartahay wadarta');
        return;
      }
      axios.post("/purchase/full-payment", { paidAmount: price, order_id, prevPaid: paid, payment_option: option, payments })
           .then(res => {
             if(res.data === 'success') {
               toast.success('waa lagu guuleystay');
               setTimeout(() => {
                 navigate('/orders');
               }, 2000);
             } else if (res.data == 'error') {
               toast.error('server: qalad ayaa dhacay');
             }
           })
           .catch(err => {
             toast.error('qalad ayaa dhacay');
           })
    } else if (option === 'qeyb' || payment_option === 'qeyb'){
      let payments: {recordedDate: string, paidAmount: number} = {recordedDate, paidAmount: price};
      if (price == 0) {
        toast.warn('lacagtu waa iney ka badantahay 0');
        return;
      } else if(price == totalAmount) {
        toast.warn('lacagta waa iney ka yartahay wadarta');
        return;
      } else if (price > totalAmount || (parseFloat(paid) + price) > totalAmount) {
        toast.warn('lacagta waa ineysan ka badan wadarta');
        return;
      }
      axios.post('/purchase/partial-payment', { paidAmount: price, order_id, prevPaid: paid, total, payment_option: option, payments, supplier, recordedDate })
           .then(res => {
             if (res.data == 'success') {
               toast.success('waa lagu guuleystay');
             } else if(res.data == 'error') {
               toast.error('server: qalad ayaa dhacay');
             }
           })
           .catch(er => {
             toast.error('qalad ayaa dhacay');
           })
    }
  }
  const handleClose = () => {
    onClose(selectedValue);
  };


  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value));
  }

  const handleListItemClick = (value: string) => {
    sendPaymentData();
    onClose({option, price});
  };

  const options = [{label: 'dhammaan'}, {label: 'qeyb'}];

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Lacag bixinta</DialogTitle>
      <List sx={{ pt: 0 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onInputChange={(event, newValue) => setOption(newValue) }
          options={options}
          className={paidAmount > 0 ? 'inactive' : ''}
          sx={{ width: 230, marginLeft: 4 }}
          renderInput={(params) => <TextField {...params} name='options' size="small" />}
        />
        <ListItem>
          <ListItem>
            <TextField
              required
              size="small"
              label="qiimaha"
              type="number"
              onChange={handlePriceChange}
            />
          </ListItem>
        </ListItem>
        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <Button variant="contained" color="primary">submit</Button>
        </ListItem>
      </List>
    </Dialog>
  );
}

export type { OrderType };
export default Supplier;
