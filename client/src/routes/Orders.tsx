import React, { useEffect, useState } from 'react';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import {
  Box, Stack,
  Typography,
  Button,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
  TextField,
  Autocomplete,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
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
  id: number;
  supplier: string;
  purchase_date: string;
  purchase_status: string;
  business_location: string;
  whole_discount: string;
  total: string;
};
interface Columns {
  id:
    | 'id'
    | 'supplier'
    | 'purchase_date'
    | 'purchase_status'
    | 'business_location'
    | 'whole_discount'
    | 'total';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const Supplier: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: 0,
      supplier: '',
      purchase_date: '',
      purchase_status: '',
      business_location: '',
      whole_discount: '',
      total: '',
    },
  ]);
  const [ordersStore, setOrdersStore] = useState<OrderType[]>([
    {
      id: 0,
      supplier: '',
      purchase_date: '',
      purchase_status: '',
      business_location: '',
      whole_discount: '',
      total: '',
    },
  ]);

  const [purchaseStatusChange, setPurchaseStatusChange] = useState<{
    top: number;
    left: number;
    order_id: string;
    open: boolean;
    status: string;
  }>({
    top: 0,
    left: 0,
    order_id: '',
    open: false,
    status: '',
  });
  const columns: readonly Columns[] = [
    { id: 'id', label: 'id', minWidth: 100, align: 'right' },
    { id: 'supplier', label: 'Supplier', minWidth: 170 },
    { id: 'purchase_date', label: 'purchase_date', minWidth: 170 },
    { id: 'purchase_status', label: 'purchase_status', minWidth: 170 },
    { id: 'business_location', label: 'business_location', minWidth: 170 },
    {
      id: 'whole_discount',
      label: 'Alertquantity',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'total',
      label: 'units',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:2312/purchase/orders')
      .then(res => {
        setOrders(res.data);
        setOrdersStore(res.data);
      })
      .catch(err => {
        // toast if there is an error
        console.log(err);
      });
  }, []);

  const handleFilterStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const status = e.target.name;
    if (isChecked) {
      const filtered = ordersStore.filter((order: OrderType) => {
        return order.purchase_status
          .toLowerCase()
          .includes(status.toLowerCase());
      });
      if (!filtered.length) {
        setOrders([
          {
            id: 0,
            supplier: '',
            purchase_date: '',
            purchase_status: '',
            business_location: '',
            whole_discount: '',
            total: '',
          },
        ]);
        return;
      }
      setOrders(filtered);
    } else {
      setOrders(ordersStore);
    }
  };

  const goOrderPaper = (id: string) => {
    navigate(`/purchase-order/${id}`);
  };

  const filterOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = ordersStore.filter((order: OrderType) => {
      return order.supplier.toLowerCase().includes(term.toLowerCase());
    });
    if (!filtered.length) {
      setOrders([
        {
          id: 0,
          supplier: '',
          purchase_date: '',
          purchase_status: '',
          business_location: '',
          whole_discount: '',
          total: '',
        },
      ]);
      return;
    }
    setOrders(filtered);
  };

  const handlePurchaseStatus = (e: any, order_id: string, status: string) => {
    if (status === 'ladalbay')
      setPurchaseStatusChange({
        top: e.clientY,
        left: e.clientX,
        order_id,
        open: !purchaseStatusChange.open,
        status,
      });
  };

  // const findColor = (status: string) => {
  //   if (status == 'lahelay') return 'success';
  //   return 'error';
  // };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {purchaseStatusChange.open && (
        <ChangePurchaseStatus
          top={purchaseStatusChange.top}
          left={purchaseStatusChange.left}
          order_id={purchaseStatusChange.order_id}
        />
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        style={{ marginBottom: 9 }}
      >
        <Typography variant="h5" gutterBottom>
          Dalabadaadkaaga
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/purchase-order')}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          Dalab
        </Button>
      </Stack>
      <div className="container">
        <div className="search-filters-container">
          <input
            placeholder="search"
            className="search"
            onChange={filterOrders}
          />
          <div className="filters-container">
            <div className="dropdown">
              <button className="dropBtn">
                <BoltIcon /> xaladda
              </button>
              <div className="dropdown-content">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="ladalbay"
                    className="checkbox"
                    onChange={handleFilterStatus}
                  />
                  <span>ladalbay</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="lahelay"
                    className="checkbox"
                    onChange={handleFilterStatus}
                  />
                  <span>lahelay</span>
                </label>
              </div>
            </div>

            <button className="dropBtn">
              <DownloadIcon /> export
            </button>
          </div>
        </div>
        <Paper style={{ marginTop: '10px', overflow: 'hidden' }} elevation={10}>
          <TableContainer sx={{ minHeight: 440, transform: 'translateY(-30px)' }}
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
                      style={{ padding: 0 }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column: Columns, index: number) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={index} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Button onClick={() => goOrderPaper(row.id)} variant="contained">view</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
};

export type { OrderType };
export default Supplier;
