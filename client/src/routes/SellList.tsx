import React, { useEffect, useState,useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify';
import {
  Stack,
  Typography,
  Button,
  MenuItem,
  Paper,
  TablePagination,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';
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

interface Columns {
  id:
  | 'order_id'
  | 'customer'
  | 'sold_by'
  | 'discount'
  | 'total'
  | 'paid'
  | 'created_date';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const SellsList: React.FC = () => {
  const navigate = useNavigate();
  const componentRef = useRef(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
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

  const columns: readonly Columns[] = [
    { id: 'order_id', label: 'id', minWidth: 100, align: 'right' },
    { id: 'customer', label: 'Customer', minWidth: 170 },
    { id: 'sold_by', label: 'sold_by', minWidth: 170 },
    {
      id: 'total',
      label: 'total',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `$${value.toLocaleString('en-US')}`,
    },
    {
      id: 'discount',
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
    {
      id: 'created_date',
      label: 'created_date',
      minWidth: 100,
      align: 'right',
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:2312/sell/sells')
      .then(res => {
        setSells(res.data);
        setSellsStore(res.data);
      })
      .catch(error => {
        toast.error(error.message);
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
    if (name == 'deyn-ku-maqan' && checked) {
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
  const customerPage = (customer: string) => {
    navigate(`/customer-info/${customer}`)
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} style={{ marginBottom: 9 }}>
        <Typography variant="h5" gutterBottom>
          Sell order list
        </Typography>
        <Button variant="contained" onClick={() => navigate('/sell')} startIcon={<AddIcon />} style={{ backgroundColor: "#2367d1", fontWeight: 'bold' }}>
          Sell Order
        </Button>
      </Stack>
      <div className="container">
        <div className="search-filters-container">
          <input placeholder="search" className="search" onChange={filterOrders} />
          <div className="filters-container">
            <div className="dropdown">
              <button className="dropBtn"><BoltIcon /> xaladda</button>
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
              <button className="dropBtn"><ViewWeekIcon /> columns</button>
              <div className="dropdown-content">
                {Object.keys(sells[0]).map((column_head: string, index: number) => (
                  <label key={index} className="switch">
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
            <button onClick={handlePrint} className="dropBtn"><DownloadIcon /> export</button>
          </div>
        </div>
        <Paper ref={componentRef} style={{ marginTop: '10px', overflow: 'hidden' }} elevation={10}>
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
                {sells
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: SellType, index: number) => (
                    <TableRow
                      hover
                      role="row"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell
                        className='table-cell'
                        align="right">
                        <Button
                          onClick={() => goOrderPaper(row.order_id)}
                          variant='text'>{row.order_id}</Button>
                      </TableCell>
                      <TableCell className='table-cell'><Button onClick={() => customerPage(row.customer)} variant='text'>{row.customer}</Button></TableCell>
                      <TableCell className='table-cell'> {row.sold_by} </TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.total} </TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.discount} </TableCell>
                      <TableCell className='table-cell' align="right"> $ {row.paid} </TableCell>
                      <TableCell className='table-cell' align="right">{row.created_date} </TableCell>
                      <TableCell className='table-cell'>
                        <SellMenuButton order_id={row.order_id} is_debt={row.is_debt} total={row.total} paid={row.paid} customer={row.customer} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={sells.length}
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
const SellMenuButton: React.FC<SellMenuButtonType> = ({ order_id, total, paid, is_debt, customer }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isDisabled = () => {
    let paidAmount: number = parseFloat(paid)
    let totalAmount: number = parseFloat(total)
    if (paidAmount >= totalAmount) return true;
    return false;
  }

  const handleClose = (page: string) => {
    let recorded_date = moment().format('MMMM Do YYYY, h:mm:ss a');
    if (page == 'paid') {
      let payments = {recorded_date, paid_amount: total};
      axios.post('http://localhost:2312/sell/pay', { order_id, paidAmount: total, customer, payments, is_debt })
        .then(resp => {
          if (resp.data === 'success') toast.success("success");
          else if (resp.data === 'error') toast.error("server error");
        })
        .catch(error => {
          toast.error(error.message);
        });
    } else if (page == 'delete') {
      axios.post(`http://localhost:2312/purchase/delete/${order_id}`)
        .then(res => {
          if (res.data === 'success') {
            toast.success('success');
            navigate('/orders');
          } else if (res.data === 'error') {
            toast.error('SERVER: qalad ayaa dhacay');
          }
        })
        .catch(error => {
          toast.error(error.message);
        })
    };
    setAnchorEl(null);
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
        <MenuItem onClick={() => handleClose('paid')} disableRipple disabled={isDisabled()}>
          <AttachMoneyIcon />
          bixi lacag
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleClose('delete')} disableRipple sx={{ color: 'red' }}>
          <DeleteIcon style={{ color: 'red' }} />
          Tir
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

export default SellsList;
