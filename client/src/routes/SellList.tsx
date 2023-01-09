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
import axios from 'axios';

type SellType = {
    order_id: string,
    customer: string,
    sold_by: string,
    is_debt: boolean,
    discount: string,
    total: string,
    paid: string,
    created_date: string
  };
type ColumnDisplayType = {
  order_id: boolean,
  customer: boolean,
  sold_by: boolean,
  is_debt: boolean,
  discount: boolean,
  total: boolean,
  paid: boolean,
  created_date: boolean
};

const SellsList: React.FC = () => {
  console.log('inside sell list');
  const navigate = useNavigate();
  const [sells, setSells] = useState<SellType[]>([
    {
      order_id: '',
      customer: '',
      sold_by: '',
      is_debt: false,
      discount: '',
      total: '',
      paid: '',
      created_date: ''
    }
  ]);
  const [sellsStore, setSellsStore] = useState<SellType[]>([
    {
      order_id: '',
      customer: '',
      sold_by: '',
      is_debt: false,
      discount: '',
      total: '',
      paid: '',
      created_date: ''
    }
  ]);
  const [columnDisplay, setColumnDisplay] = useState<ColumnDisplayType>({
    order_id: true,
    customer: true,
    sold_by: true,
    is_debt: true,
    discount: true,
    total: true,
    paid: true,
    created_date: true
  });
  useEffect(() => {
    axios.get('/sell/sells')
         .then(res => {
           setSells(res.data);
           setSellsStore(res.data);
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, [])

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => { // change function name
    setColumnDisplay({
      ...columnDisplay,
      [e.target.name]: e.target.checked
    });
  };

  const handleDebtStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const checked = e.target.checked;
    if(name == 'deyn-ku-maqan' && checked) {
      const filtered = sellsStore.filter((sell: SellType) => {
        return parseFloat(sell.paid) < parseFloat(sell.total);
      })
      if (!filtered.length) {
        setSells([
          {
            order_id: '',
            customer: '',
            sold_by: '',
            is_debt: false,
            discount: '',
            total: '',
            paid: '',
            created_date: ''
          }
        ])
        return;
      }
      setSells(filtered);
    } else {
      setSells(sellsStore);
    }
  };

  const goOrderPaper = (id: string) => {
    navigate(`/sells/${id}`)
  };

  const filterOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = sellsStore.filter((sell: SellType) => {
      return sell.customer.toLowerCase().includes(term.toLowerCase());
    })
    if (!filtered.length) {
      setSells([
        {
          order_id: '',
          customer: '',
          sold_by: '',
          is_debt: false,
          discount: '',
          total: '',
          paid: '',
          created_date: ''
        }
      ])
      return;
    }
    setSells(filtered);
  };

  const display = (column_head: string) => {
    return columnDisplay[column_head as keyof ColumnDisplayType];
  }

  return (
    <>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{marginBottom : 9}}>
          <Typography variant="h5" gutterBottom>
            Alaab gadmatay
          </Typography>
          <Button variant="contained" onClick={() => navigate('/sells')} startIcon={<AddIcon />} style={{backgroundColor:"#2367d1", fontWeight: 'bold'}}>
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
                  name='deyn-ku-maqan'
                  className="checkbox"
                  onChange={handleDebtStatus}
                />
                <span>deyn ku maqan</span>
              </label>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropBtn"><ViewWeekIcon/> columns</button>
            <div className="dropdown-content">
              {Object.keys(sells[0]).map((column_head: string, index: number) => (
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
              {Object.keys(sells[0]).map((column_head, index) => (
                <th className={display(column_head)? '': 'inactive'}>{column_head}</th>
              ))}
            </tr>
          </thead>

          {sells.map((sell, index) => (
            <tbody>
              <tr>
                <td className={display('order_id')? '': 'inactive'}><Button variant="text" onClick={() => goOrderPaper(sell.order_id) }>{sell.order_id}</Button></td>
                <td className={display('customer')? '': 'inactive'}>{sell.customer}</td>
                <td className={display('sold_by')? '': 'inactive'}>{sell.sold_by}</td>
                <td className={display('is_debt')? '': 'inactive'}>{sell.is_debt? 'true' : 'false'}</td>
                <td className={display('discount')? '': 'inactive'}>${sell.discount}</td>
                <td className={display('total')? '': 'inactive'}>${sell.total}</td>
                <td className={display('paid')? '': 'inactive'}>${sell.paid}</td>
                <td className={display('created_date')? '': 'inactive'}>{sell.created_date}</td>
                <td>
                  <SellMenuButton order_id={sell.order_id} total={sell.total} paid={sell.paid} is_debt={sell.is_debt} customer={sell.customer} />
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

type SellMenuButtonType = {
  order_id: string,
  total: string,
  paid: string,
  is_debt: boolean,
  customer: string,
}
const SellMenuButton:React.FC<SellMenuButtonType> = ({ order_id, total, paid, is_debt, customer }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);


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

  const handleClickClose = (value: number) => {
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
        is_debt={is_debt}
        order_id={order_id}
        customer={customer}
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
  selectedValue: number;
  onClose: (value: number) => void;
  paid: string;
  total: string;
  is_debt: boolean;
  order_id: string;
  customer: string,
}

function Payment(props: PaymentProps) {
  const navigate = useNavigate();
  const { onClose, selectedValue, open, paid, total, is_debt, order_id, customer } = props;
  let paidAmount: number = parseFloat(paid);
  const [customerPaid, setCustomerPaid] = useState<number>(0);

  const sendPaymentData = () => {
    let recordedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    let paidAmount: number = parseFloat(paid) + customerPaid;
    let totalAmount: number = parseFloat(total)
    let payments: {paidAmount: number, recordedDate: string}[] = [{ paidAmount: customerPaid, recordedDate }];
    if (customerPaid < 1) {
      toast.warn('lacagtu wey yartahay');
      return;
    } else if(!customerPaid) {
      toast.warn('fadlan geli lacagta');
      return;
    } else if (customerPaid > totalAmount) {
      toast.warn('lacagtu wey badantahay');
      return;
    }
    axios.post('/sell/pay-sell-debt', {customerPaid, paidAmount, payments, total, order_id, customer})
         .then(res => {
           if(res.data == 'success') {
             toast.success('waa lagu guuleystay');
           } else if (res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
           }
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         });
  }

  const handleClose = () => {
    onClose(selectedValue);
  };


  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerPaid(parseFloat(e.target.value));
  }

  const handleListItemClick = (value: string) => {
    sendPaymentData();
    onClose(customerPaid);
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Lacag bixinta</DialogTitle>
      <List sx={{ pt: 0 }}>
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

export default SellsList;
