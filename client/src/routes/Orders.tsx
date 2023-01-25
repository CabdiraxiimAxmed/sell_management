import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { styled, alpha } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Menu, { MenuProps } from '@mui/material/Menu';
import {
  TablePagination,
  Stack,
  Typography,
  Button,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BoltIcon from '@mui/icons-material/Bolt';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChangePurchaseStatus from '../components/ChangePurchaseStatus';
import axios from 'axios';
import moment from 'moment';

type OrderType = {
  id: number;
  supplier: string;
  purchase_date: string;
  purchase_status: string;
  is_debt: boolean;
  total: string;
  whole_discount: string;
  paid: string;
};
interface Columns {
  id:
  | 'id'
  | 'supplier'
  | 'purchase_date'
  | 'purchase_status'
  | 'is_debt'
  | 'total'
  | 'whole_discount'
  | 'paid';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const Order: React.FC = () => {
  console.log('Order page');
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const componentRef = useRef(null);
  const [orders, setOrders] = useState<OrderType[]>([
    {
      id: 0,
      supplier: '',
      purchase_date: '',
      purchase_status: '',
      is_debt: false,
      total: '',
      whole_discount: '',
      paid: '',
    },
  ]);
  const [ordersStore, setOrdersStore] = useState<OrderType[]>([
    {
      id: 0,
      supplier: '',
      purchase_date: '',
      purchase_status: '',
      is_debt: false,
      total: '',
      whole_discount: '',
      paid: '',
    },
  ]);

  const [purchaseStatusChange, setPurchaseStatusChange] = useState<{
    top: number;
    left: number;
    id: number;
    open: boolean;
    status: string;
  }>({
    top: 0,
    left: 0,
    id: 0,
    open: false,
    status: '',
  });
  const columns: readonly Columns[] = [
    { id: 'id', label: 'id', minWidth: 100, align: 'right' },
    { id: 'supplier', label: 'Supplier', minWidth: 170 },
    { id: 'purchase_date', label: 'purchase_date', minWidth: 170 },
    { id: 'purchase_status', label: 'purchase_status', minWidth: 170 },
    { id: 'is_debt', label: 'is_debt', minWidth: 170, align: 'right' },
    {
      id: 'total',
      label: 'total',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `$${value.toLocaleString('en-US')}`,
    },
    {
      id: 'whole_discount',
      label: 'discount',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'paid',
      label: 'paid',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `$${value.toLocaleString('en-US')}`,
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:2312/purchase/orders')
      .then(res => {
        setOrders(res.data);
        setOrdersStore(res.data);
      })
      .catch(error => {
        toast.error(error.message);
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
            is_debt: false,
            total: '',
            whole_discount: '',
            paid: '',
          },
        ]);
        return;
      }
      setOrders(filtered);
    } else {
      setOrders(ordersStore);
    }
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
          is_debt: false,
          total: '',
          whole_discount: '',
          paid: '',
        },
      ]);
      return;
    }
    setOrders(filtered);
  };

  const handlePurchaseStatus = (e: any, id: number, status: string) => {
    if (status === 'ordered')
      setPurchaseStatusChange({
        top: e.clientY,
        left: e.clientX,
        id,
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

  const supplierPage = (page: string) => {
    navigate(`/supplier-info/${page}`);
  };
  const goOrder = (id: number) => {
    navigate(`/purchase-order/${id}`);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      {purchaseStatusChange.open && (
        <ChangePurchaseStatus
          top={purchaseStatusChange.top}
          left={purchaseStatusChange.left}
          id={purchaseStatusChange.id}
        />
      )}
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        style={{ marginBottom: 9 }}
      >
        <Typography variant="h5" gutterBottom>
          Orders
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/purchase-order')}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          Order
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
                <BoltIcon /> status
              </button>
              <div className="dropdown-content">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="ordered"
                    className="checkbox"
                    onChange={handleFilterStatus}
                  />
                  <span>ordered</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="received"
                    className="checkbox"
                    onChange={handleFilterStatus}
                  />
                  <span>received</span>
                </label>
              </div>
            </div>

            <button onClick={handlePrint} className="dropBtn">
              <DownloadIcon /> export
            </button>
          </div>
        </div>
        <Paper ref={componentRef} style={{ marginTop: '10px', overflow: 'hidden' }} elevation={10}>
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
                      style={{ padding: 0 }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell className='table-cell' align="right"><Button onClick={() => goOrder(row.id)} variant='text'> {row.id} </Button></TableCell>
                      <TableCell className='table-cell' onClick={() => supplierPage(row.supplier)}><Button variant='text'>{row.supplier}</Button></TableCell>
                      <TableCell className='table-cell'> {row.purchase_date} </TableCell>
                      <TableCell className='table-cell'> <Button
                        onClick={(e) => handlePurchaseStatus(e, row.id, row.purchase_status)}
                        variant='text'>{row.purchase_status}</Button> </TableCell>
                      <TableCell className='table-cell' align="right">{row.is_debt? 'true': 'false'} </TableCell>
                      <TableCell className='table-cell' align="right">$ {row.total} </TableCell>
                      <TableCell className='table-cell' align="right">$ {row.whole_discount} </TableCell>
                      <TableCell className='table-cell' align="right">$ {row.paid? row.paid: 0} </TableCell>
                      <TableCell align='center' className='table-cell'>
                        <OrderMenuButton id={row.id} total={row.total} paid={row.paid} supplier = {row.supplier} is_debt={row.is_debt} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Paper>
      </div>
    </>
  );
};

interface OrderMenuProps {
  id: number;
  paid: string;
  total: string;
  supplier: string;
  is_debt: boolean;
}

const OrderMenuButton: React.FC<OrderMenuProps> = ({ id, paid, total, supplier, is_debt }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const viewOrder = () => {
    navigate(`/purchase-order/${id}`);
  }

  const paidOrder = () => {
    let recorded_date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let payments = {recorded_date, paid_amount: total};
    axios.post("http://localhost:2312/purchase/payment", { id, paid: total, is_debt, payments})
      .then(resp => {
        if (resp.data === 'success') toast.success("success")
        else if (resp.data === 'error') toast.error("error happened");
      })
      .catch(error => {
        toast.error(error.message);
      })
  }

  const debt = () => {
    /* order_id, supplier, total recorded_date */
    let recorded_date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let data = { order_id: id, supplier, initial_amount: total, amount: 0, recorded_date, is_paid: false };
    axios.post("http://localhost:2312/purchase/debt",  data)
      .then(resp => {
          if (resp.data === 'success') {
              toast.success('success');
          } else if (resp.data === 'error') {
              toast.error('server error');
          }
      })
      .catch(error => {
          toast.error(error.message);
      })
  }

  const editOrder = () => {
      navigate(`/purchase/edit/${id}`)
    };

  const deleteOrder = () => {
    axios.post('http://localhost:2312/purchase/delete', { id: id })
      .then(resp => {
        if (resp.data === 'success') {
          toast.success("success");
        } else if (resp.data === 'error') {
          toast.error("error happened");
        }
      })
      .catch(error => {
        toast.error(error.message);
      })
      ;
  }

  const handleClose = (action: string) => {
    switch (action) {
      case "view":
        viewOrder();
        break;
      case "edit":
        editOrder();
        break;
      case "paid":
        paidOrder();
        break;
      case "debt":
        debt();
        break;
      case "delete":
        deleteOrder();
        break;
      default:
        break;
    }
    setAnchorEl(null);
  }

  const isDisablePaid = () => parseFloat(paid) >= parseFloat(total);

  return (
    <>
      <IconButton color="primary" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose("view")} disableRipple>
          <ViewWeekIcon />
          View
        </MenuItem>
        <MenuItem onClick={() => handleClose("edit")} disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem disabled={isDisablePaid()} onClick={() => handleClose("paid")} disableRipple>
          <PaidIcon />
          Paid
        </MenuItem>
        <MenuItem disabled={is_debt || isDisablePaid()}  style={{ color: '#ffcc00' }} onClick={() => handleClose("debt")} disableRipple>
          <AttachMoneyIcon style={{ color: '#ffcc00' }} />
          Debt
        </MenuItem>
        <MenuItem style={{ color: "red" }} onClick={() => handleClose("delete")} disableRipple>
          <DeleteIcon style={{ color: "red" }} />
          Delete
        </MenuItem>
      </StyledMenu>
    </>
  )
}

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
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
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

export type { OrderType };
export default Order;
