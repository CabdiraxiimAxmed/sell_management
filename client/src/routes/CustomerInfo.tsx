import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  TableBody,
  TextField,
  IconButton,
  Paper,
  TablePagination,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
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
  payments: Payments,
  is_paid: boolean,
  recordeddate: string,
  customer: string,
  initialamount: string,
};

interface Columns {
  id:
  | 'order_id'
  | 'customer'
  | 'is_debt'
  | 'total'
  | 'paid'
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const SupplierInfo: React.FC = () => {
  const itemBoughtRef = useRef(null);
  const debtRef = useRef(null);
  const [editCustomer, setEditCustomer] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [debtId, setDebtId] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
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
      payments: { recordedDate: '', paidAmount: '' },
      is_paid: false,
      recordeddate: '',
      customer: '',
      initialamount: '',
    }

  ])

  const columns: readonly Columns[] = [
    { id: 'order_id', label: 'id', minWidth: 100 },
    { id: 'customer', label: 'Customer', minWidth: 170 },
    { id: 'is_debt', label: 'is_debt', minWidth: 170, align: 'right' },
    {
      id: 'total',
      label: 'total',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `$${value.toLocaleString('en-US')}`,
    },
    {
      id: 'paid',
      label: 'paid',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `$${value.toLocaleString('en-US')}`,
    }
  ];

  useEffect(() => {
    axios.post('http://localhost:2312/customers/name', { name })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return
        }

        setCustomer(res.data);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/customers/sells', { name })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return
        }

        setSells(res.data);
      }).catch(error => {
        toast.error(error.message);
      });

    axios.post('http://localhost:2312/customers/debt', { name })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return
        }

        setDebts(res.data);
      }).catch(error => {
        toast.error(error.message);
      });
  }, []);

  const findDebtByDate = () => {
    if (!date) {
      axios.post('http://localhost:2312/customers/debt', { name })
        .then(res => {
          if (res.data === 'error') {
            toast.error('SERVER: qalad ayaa dhacay');
            return
          }
          setDebts(res.data);
        }).catch(error => {
          toast.error(error.message);
        });
      return;
    }

    axios.post('http://localhost:2312/customers/debt-date', { customer: name, date })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return
        }

        setDebts(res.data);
      }).catch(error => {
        toast.error(error.message);
      });
  }

  const goOrderPaper = (id: string) => {
    navigate(`/sells/${id}`)
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
    if (!debt) {
      return {
        id: 0,
        amount: '',
        order_id: '',
        payments: [[{ recordedDate: '', paidAmount: '' }]],
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
    for (let debt of debts) {
      total += parseFloat(debt.amount);
    }
    if (!total) return 0;
    return total;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const debt: any = findDebtById(debtId);
  
  const handleItemsPrint = useReactToPrint({
    content: () => itemBoughtRef.current,
  });

  const handleDebtPrint = useReactToPrint({
    content: () => debtRef.current,
  });

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
      {editCustomer && <EditCustomer customer={customer} />}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          xogta
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography style={{ fontWeight: 'bold' }}>customer: <span className="debt-section">{debt.customer}</span></Typography>
          <Typography style={{ fontWeight: 'bold' }}>Initial: <span className="debt-section">$ {debt.initialamount}</span></Typography>
          <Typography style={{ fontWeight: 'bold' }}>Current: <span className="debt-section">$ {debt.amount}</span></Typography>
          <Divider />
          <Typography >Payments</Typography>
          <Typography style={{ fontWeight: 'bold' }}>Amount: <span className="debt-section">$ {debt.payments?.paidAmount}</span></Typography>
          <Typography style={{ fontWeight: 'bold' }}>date: <span className="debt-section">{debt.payments?.recordedDate}</span></Typography>
          <Divider />
        </DialogContent>
      </BootstrapDialog>
      <Grid item xs={6}>
        <Button variant="contained" onClick={() => setEditCustomer(!editCustomer)} startIcon={<AddIcon />} style={{ backgroundColor: "#2367d1", fontWeight: 'bold' }}>
          Update
        </Button>
      </Grid>
      <Grid item xs={6}>
        <div className="debt-amount-container">
          <Typography variant="body2">Cadadka deynta</Typography>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}><AttachMoneyIcon />{sumTotalDebt()}</Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h4">Items bought</Typography>
      </Grid>
      <Grid container justifyContent='right' item xs={6}>
        <button className="dropBtn" onClick={handleItemsPrint}>
          <DownloadIcon /> export
        </button>
      </Grid>
      <Grid item xs={12}>
        <Paper ref={itemBoughtRef} style={{ marginTop: '10px', marginBottom: '20px', overflow: 'hidden' }} elevation={5}>
          <TableContainer sx={{ transform: 'translateY(-30px)' }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                    align="left"
                    style={{
                      minWidth: 170,
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sells
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: SellType, index: number) => (
                    <TableRow
                      hover
                      role="row"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell className='table-cell'>
                        <Button
                          onClick={() => goOrderPaper(row.order_id)}
                          variant='text'>{row.order_id}</Button>
                      </TableCell>
                      <TableCell className='table-cell'>{row.customer}</TableCell>
                      <TableCell align='right' className='table-cell'>{row.is_debt ? "true" : 'false'}</TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.total} </TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.paid} </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 25, 100]}
              component="div"
              count={sells.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h4">Debts</Typography>
      </Grid>
      <Grid container justifyContent='right' item xs={6}>
        <button className="dropBtn" onClick={handleDebtPrint}>
          <DownloadIcon /> export
        </button>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="find-debt-by-date"
          label="bisha malinta"
          name="debt"
          onChange={(e) => setDate(e.target.value)}
        />
        <span className="debt-section"><IconButton color="primary" size="large" onClick={findDebtByDate}><SearchIcon /></IconButton></span>
      </Grid>
      <Grid item xs={12}>
        <div ref={debtRef} className="table-container">
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
            {debts.map((debt, index: number) => (
              <tbody key={index}>
                <tr>
                  <td>{debt.id}</td>
                  <td> <Button variant="text" onClick={() => goOrderPaper(debt.sell_id)}>{debt.sell_id}</Button></td>
                  <td style={{ fontWeight: '400' }}>{debt.customer}</td>
                  <td style={{ fontWeight: '400' }}>{debt.recordeddate}</td>
                  <td style={{ fontWeight: '400' }}>${debt.initialamount}</td>
                  <td style={{ fontWeight: '400' }}>${debt.amount}</td>
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
