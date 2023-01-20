import React, { useEffect, useState } from 'react';
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

type ColumnDisplayType = {
  id: boolean;
  supplier: boolean;
  purchase_status: boolean;
  total: boolean;
  paid: boolean;
};

type Payments = {
  recordedDate: string;
  paidAmount: string;
};

type DebtType = {
  id: number;
  amount: string;
  order_id: string;
  payments: Payments[];
  is_paid: boolean;
  recordeddate: string;
  supplier: string;
  initialamount: string;
};
/*
 * id  supplier purchase_status total  paid
 * */
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
      payments: [{ recordedDate: '', paidAmount: '' }],
      is_paid: false,
      recordeddate: '',
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
      .catch(err => {
        toast.error('qalad ayaa dhacay');
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
        payments: [{ recordedDate: '', paidAmount: '' }],
        is_paid: false,
        recordeddate: '',
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
          xogta
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography style={{ fontWeight: 'bold' }}>
            supplier: <span className="debt-section">${debt.supplier}</span>
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Asal: <span className="debt-section">${debt.initialamount}</span>
          </Typography>
          <Typography style={{ fontWeight: 'bold' }}>
            Hadda: <span className="debt-section">${debt.amount}</span>
          </Typography>
          <Divider />
          <Typography>Diwaanka bixinta</Typography>
          {debt.payments.map((payment: Payments, index: number) => (
            <div key={index}>
              <Typography style={{ fontWeight: 'bold' }}>
                cadadka:{' '}
                <span className="debt-section">${payment.paidAmount}</span>
              </Typography>
              <Typography style={{ fontWeight: 'bold' }}>
                xilliga:{' '}
                <span className="debt-section">{payment.recordedDate}</span>
              </Typography>
              <Divider />
            </div>
          ))}
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
      <Grid item xs={12}>
        <Typography variant="h4">Alaab ka gadatay</Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper style={{ marginTop: '10px', overflow: 'hidden' }} elevation={5}>
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
      <Grid item xs={12}>
        <Typography variant="h4">Deynta laguugu leeyahay</Typography>
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
      <Grid item xs={6}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>order_id</th>
                <th>supplier</th>
                <th>waqtiga</th>
                <th>asal</th>
                <th>hartay</th>
              </tr>
            </thead>
            {debts.map((debt, index) => (
              <tbody>
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
                  <td style={{ fontWeight: '400' }}>{debt.recordeddate}</td>
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
