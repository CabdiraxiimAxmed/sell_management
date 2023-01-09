import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Divider, TextField, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditCustomer from '../components/EditCustomer';
import axios from 'axios';


type CustomerType = {
  id: number,
  name: string,
  contact: string,
  address: string,
  email: string,
  city: string,
  created_date: string,
};

type SellType = {
  order_id: string,
  customer: string,
  is_debt: boolean,
  total: string,
  paid: string,
};

type ColumnDisplayType = {
  order_id: boolean,
  customer: string,
  is_debt: boolean,
  total: boolean,
  paid: boolean,
};

type Payments = {
  recordedDate: string,
  paidAmount: string,
};

type DebtType = {
  id: number,
  amount: string,
  sell_id: string,
  payments: Payments[][],
  is_paid: boolean,
  recordeddate: string,
  customer: string,
  initialamount: string,
};

const SupplierInfo: React.FC = () => {
  const [editCustomer, setEditCustomer] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [debtId, setDebtId] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const { name } = useParams();

  const navigate = useNavigate();


  const [customer, setCustomer] = useState<CustomerType>({
    id: 0,
    name: '',
    contact: '',
    address: '',
    email: '',
    city: '',
    created_date: '',
  }
  );
  const [sells, setSells] = useState<SellType[]>([
    {
      order_id: '',
      customer: '',
      is_debt: false,
      total: '',
      paid: '',
    }
  ]);

  const [debts, setDebts] = useState<DebtType[]>([
    {
      id: 0,
      amount: '',
      sell_id: '',
      payments: [[{recordedDate: '', paidAmount: ''}]],
      is_paid: false,
      recordeddate: '',
      customer: '',
      initialamount: '',
    }

  ])

  useEffect(() => {
    axios.post('/customers/name', { name })
         .then(res => {
           if(res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return
           }

           setCustomer(res.data);
         }).catch(err => {
           toast.error('qalad ayaa dhacay');
         });

    axios.post('/customers/sells', { name })
         .then(res => {
           if(res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return
           }

           setSells(res.data);
         }).catch(err => {
           toast.error('qalad ayaa dhacay');
         });

    axios.post('/customers/debt', { name })
         .then(res => {
           if(res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return
           }

           setDebts(res.data);
         }).catch(err => {
           toast.error('qalad ayaa dhacay');
         });
  }, []);

  const findDebtByDate = () => {
    if (!date) {
      axios.post('/customers/debt', { name })
           .then(res => {
             if(res.data === 'error') {
               toast.error('SERVER: qalad ayaa dhacay');
               return
             }
             setDebts(res.data);
           }).catch(err => {
             toast.error('qalad ayaa dhacay');
           });
      return;
    }

    axios.post('/customers/debt-date', { customer: name, date })
         .then(res => {
           if(res.data === 'error') {
             toast.error('SERVER: qalad ayaa dhacay');
             return
           }

           setDebts(res.data);
         }).catch(err => {
           toast.error('qalad ayaa dhacay');
         });
  }

  const goOrderPaper = (id: string) => {
    navigate(`/purchase-order/${id}`)
  };

  const findColor = (status: string) => {
    if (status == 'lahelay') return 'success';
    return 'error'
  };

  const handleClickOpen = (id: number) => {
    setDebtId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const findDebtById = (id: number) => {
    let debt: any = debts.find(debt => debt.id == id);
    if(!debt) {
      return {
        id: 0,
        amount: '',
        order_id: '',
        payments: [[{recordedDate: '', paidAmount: ''}]],
        is_paid: false,
        recordeddate: '',
        supplier: '',
        initialamount: '',
      }
    }
    return debt;
  };

  const sumTotalDebt = () => {
    let total: number = 0;
    for(let debt of debts) {
      total += parseFloat(debt.amount);
    }
    return total;
  };

  const debt: any = findDebtById(debtId);

  return (
    <Grid container>
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
      {editCustomer &&  <EditCustomer customer={customer} />}

    <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          xogta
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography style={{fontWeight: 'bold'}}>customer: <span className="debt-section">{debt.customer}</span></Typography>
          <Typography style={{fontWeight: 'bold'}}>Asal: <span className="debt-section">${debt.initialamount}</span></Typography>
          <Typography style={{fontWeight: 'bold'}}>Hadda: <span className="debt-section">${debt.amount}</span></Typography>
          <Divider/>
          <Typography >Diwaanka bixinta</Typography>
          {debt.payments.map((payment: Payments[], index: number) => (
            <>
              <Typography style={{fontWeight: 'bold'}}>cadadka: <span className="debt-section">${payment[0].paidAmount}</span></Typography>
              <Typography style={{fontWeight: 'bold'}}>xilliga: <span className="debt-section">{payment[0].recordedDate}</span></Typography>
              <Divider/>
            </>
          ))}
        </DialogContent>
      </BootstrapDialog>
      <Grid item xs={6}>
        <Button variant="contained" onClick={() => setEditCustomer(!editCustomer) } startIcon={<AddIcon />} style={{backgroundColor:"#2367d1", fontWeight: 'bold'}}>
          Update
        </Button>
      </Grid>
      <Grid item xs={6}>
        <div className="debt-amount-container">
          <Typography variant="body2">Cadadka deynta</Typography>
          <Typography variant="h5" style={{fontWeight: 'bold'}}><AttachMoneyIcon />{sumTotalDebt()}</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">Alaab ka gadatay</Typography>
      </Grid>
      <Grid item xs={12}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Object.keys(sells[0]).map((column_head, index) => (
                  <th key={index}>{column_head}</th>
                ))}
              </tr>
            </thead>
            {sells.map((sell, index) => (
              <tbody key={index}>
                <tr>
                  <td> <Button variant="text" onClick={() => goOrderPaper(sell.order_id) }>{sell.order_id}</Button></td>
                  <td>{sell.customer}</td>
                  <td>{sell.is_debt? 'true' : 'false'}</td>
                  <td>${sell.total}</td>
                  <td>${sell.paid}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">Deynta aad leeyahay</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="find-debt-by-date"
          label="bisha malinta"
          name="debt"
          onChange={(e) => setDate(e.target.value) }
        />
        <span className="debt-section"><IconButton color="primary" size="large" onClick={findDebtByDate}><SearchIcon/></IconButton></span>
      </Grid>
      <Grid item xs={12}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>order_id</th>
                <th>customer</th>
                <th>waqtiga</th>
                <th>asal</th>
                <th>hartay</th>
              </tr>
            </thead>
            {debts.map((debt, index) => (
              <tbody>
                <tr>
                  <td>{debt.id}</td>
                  <td> <Button variant="text" onClick={() => goOrderPaper(debt.sell_id) }>{debt.sell_id}</Button></td>
                  <td style={{ fontWeight: '400'}}>{debt.customer}</td>
                  <td style={{ fontWeight: '400'}}>{debt.recordeddate}</td>
                  <td style={{ fontWeight: '400'}}>${debt.initialamount}</td>
                  <td style={{ fontWeight: '400'}}>${debt.amount}</td>
                  <td><Button variant="contained" color="primary" onClick={() => handleClickOpen(debt.id)}>Open</Button></td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </Grid>
    </Grid>
 );
};
/* Dialog Bootstrap */
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}


export default SupplierInfo;
