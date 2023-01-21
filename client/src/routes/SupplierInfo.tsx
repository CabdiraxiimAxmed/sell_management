import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  TextField,
  IconButton,
  Paper,
  TablePagination,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';

type OrderType = {
  id: string;
  supplier: string;
  purchase_status: string;
  total: string;
  paid: string;
};

type Payments = {
  recorded_date: string;
  paidAmount: string;
};

type DebtType = {
  id: number;
  amount: string;
  order_id: string;
  payments: Payments;
  is_paid: boolean;
  recorded_date: string;
  supplier: string;
  initialamount: string;
};
interface Columns {
  id:
  | 'id'
  | 'supplier'
  | 'purchase_status'
  | 'total'
  | 'paid'
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}


const SupplierInfo: React.FC = () => {
  const navigate = useNavigate();
  const itemBoughtRef = useRef(null);
  const debtRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [debtId, setDebtId] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const { name } = useParams();

  const columns: readonly Columns[] = [
    { id: 'id', label: 'id', minWidth: 100 },
    { id: 'supplier', label: 'Supplier', minWidth: 170 },
    { id: 'purchase_status', label: 'purchase_status', minWidth: 170, align: 'right' },
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

  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: '',
      supplier: '',
      purchase_status: '',
      total: '',
      paid: '',
    },
  ]);
  const [debts, setDebts] = useState<DebtType[]>([
    {
      id: 0,
      amount: '',
      order_id: '',
      payments: { recorded_date: '', paidAmount: '' },
      is_paid: false,
      recorded_date: '',
      supplier: '',
      initialamount: '',
    },
  ]);

  useEffect(() => {
    axios
      .post('http://localhost:2312/purchase/get-supplier-transactions', {
        name,
      })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return;
        }

        setOrders(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });

    axios
      .post('http://localhost:2312/supplier/get-debt', { name })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return;
        }

        setDebts(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, []);

  const findDebtByDate = () => {
    if (!date) {
      axios
        .post('http://localhost:2312/supplier/get-debt', { name })
        .then(res => {
          if (res.data === 'error') {
            toast.error('SERVER: qalad ayaa dhacay');
            return;
          }

          setDebts(res.data);
        })
        .catch(error => {
          toast.error(error.message);
        });
      return;
    }

    axios
      .post('http://localhost:2312/supplier/get-debt-date', {
        supplier: name,
        date,
      })
      .then(res => {
        if (res.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
          return;
        }

        setDebts(res.data);
      })
      .catch(err => {
        toast.error('qalad ayaa dhacay');
      });
  };

  const goOrderPaper = (id: string) => {
    navigate(`/purchase-order/${id}`);
  };

  const findColor = (status: string) => {
    if (status == 'lahelay') return 'success';
    return 'error';
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
        payments: { recorded_date: '', paidAmount: '' },
        is_paid: false,
        recorded_date: '',
        supplier: '',
        initialamount: '',
      };
    }
    return debt;
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

  const sumTotalDebt = () => {
    let total: number = 0;
    for (let debt of debts) {
      total += parseFloat(debt.amount);
    }
    if (!total) return 0;
    return total;
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
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography style={{ fontWeight: 'bold' }}>
            supplier: <span className="debt-section">{debt.supplier}</span>
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            initial amount: <span className="debt-section">${debt.initial_amount}</span>
          </Typography>
          <Divider />
          <Typography>recorded payment</Typography>
            <div>
              <Typography style={{ fontWeight: 'bold' }}>
                paid_amount:
                <span className="debt-section">${debt.payments?.paid_amount}</span>
              </Typography>
              <Typography style={{ fontWeight: 'bold' }}>
                paid_date:
                <span className="debt-section">{debt.payments?.recorded_date}</span>
              </Typography>
              <Divider />
            </div>
        </DialogContent>
      </BootstrapDialog>
      <Grid item xs={6}>
        <Button
          variant="contained"
          onClick={() => navigate('/update-supplier')}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          Update
        </Button>
      </Grid>
      <Grid item xs={6}>
        <div className="debt-amount-container">
          <Typography variant="body2">Debt</Typography>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            <AttachMoneyIcon />
            {sumTotalDebt()}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h4">Items you bought</Typography>
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
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: OrderType, index: number) => (
                    <TableRow
                      hover
                      role="row"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell className='table-cell'>
                        <Button
                          onClick={() => goOrderPaper(row.id)}
                          variant='text'>{row.id}</Button>
                      </TableCell>
                      <TableCell className='table-cell'>{row.supplier}</TableCell>
                      <TableCell align='right' className='table-cell'>{row.purchase_status ? "true" : 'false'}</TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.total} </TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.paid} </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 25, 100]}
              component="div"
              count={orders.length}
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
          onChange={e => setDate(e.target.value)}
        />
        <span className="debt-section">
          <IconButton color="primary" size="large" onClick={findDebtByDate}>
            <SearchIcon />
          </IconButton>
        </span>
      </Grid>
      <Grid item xs={12}>
        <div ref={debtRef} className="table-container">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>order_id</th>
                <th>supplier</th>
                <th>date</th>
                <th>initial amount</th>
                <th>paid</th>
              </tr>
            </thead>
            {debts.map((debt, index: number) => (
              <tbody key={index}>
                <tr>
                  <td>{debt.id}</td>
                  <td>
                    {' '}
                    <Button
                      variant="text"
                      onClick={() => goOrderPaper(debt.order_id)}
                    >
                      {debt.order_id}
                    </Button>
                  </td>
                  <td style={{ fontWeight: '400' }}>{debt.supplier}</td>
                  <td style={{ fontWeight: '400' }}>{debt.recorded_date}</td>
                  <td style={{ fontWeight: '400' }}>${debt.initialamount}</td>
                  <td style={{ fontWeight: '400' }}>${debt.amount}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(debt.id)}
                    >
                      Open
                    </Button>
                  </td>
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
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default SupplierInfo;
