import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {
  Stack,
  Typography,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableBody,
  TableRow,
} from '@mui/material';

export type ProductType = {
  id: number;
  name: string;
  units: number;
  category: string;
  sub_category: string;
  alert_quantity: number;
  purchase_cost: number;
  sale_price: number;
  min_sale_price: number;
  min_quantity_order: number;
  bar_code: string;
  created_date: string;
};

interface Columns {
  id:
    | 'id'
    | 'name'
    | 'units'
    | 'category'
    | 'sub_category'
    | 'alert_quantity'
    | 'purchase_cost'
    | 'sale_price'
    | 'min_sale_price'
    | 'min_quantity_order'
    | 'bar_code'
    | 'created_date';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [products, setProducts] = useState<ProductType[]>([
    {
      id: 0,
      name: '',
      units: 0,
      category: '',
      sub_category: '',
      alert_quantity: 0,
      purchase_cost: 0,
      sale_price: 0,
      min_sale_price: 0,
      min_quantity_order: 0,
      bar_code: '',
      created_date: '',
    },
  ]);
  const [productsStore, setProductsStore] = useState<ProductType[]>([
    {
      id: 0,
      name: '',
      units: 0,
      category: '',
      sub_category: '',
      alert_quantity: 0,
      purchase_cost: 0,
      sale_price: 0,
      min_sale_price: 0,
      min_quantity_order: 0,
      bar_code: '',
      created_date: '',
    },
  ]);

  const columns: readonly Columns[] = [
    { id: 'id', label: 'id', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    {
      id: 'units',
      label: 'units',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { id: 'category', label: 'Category', minWidth: 170 },
    { id: 'sub_category', label: 'Sub Category', minWidth: 170 },
    {
      id: 'alert_quantity',
      label: 'Alertquantity',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'purchase_cost',
      label: 'PurchaseCost',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'sale_price',
      label: 'Sale Price',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'min_sale_price',
      label: 'Min Sale Price',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'min_quantity_order',
      label: 'Min Quantity Order',
      minWidth: 100,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { id: 'bar_code', label: 'Bar Code', minWidth: 170 },
    { id: 'created_date', label: 'Created Date', minWidth: 170 },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:2312/products')
      .then(res => {
        setProducts(res.data);
        setProductsStore(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, []);

  const filterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    const filtered = productsStore.filter((product: ProductType) => {
      return product.name.toLowerCase().includes(term.toLowerCase());
    });
    if (!filtered.length) {
      setProducts([
        {
          id: 0,
          name: '',
          units: 0,
          category: '',
          sub_category: '',
          alert_quantity: 0,
          purchase_cost: 0,
          sale_price: 0,
          min_sale_price: 0,
          min_quantity_order: 0,
          bar_code: '',
          created_date: '',
        },
      ]);
      return;
    }
    setProducts(filtered);
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

  return (
    <>
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
          Badeecada
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products/add-product')}
          startIcon={<AddIcon />}
          style={{ backgroundColor: '#2367d1', fontWeight: 'bold' }}
        >
          badeeco
        </Button>
      </Stack>
      <div className="container">
        <div className="search-filters-container">
          <input
            placeholder="search"
            className="search"
            onChange={filterUser}
          />
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Paper style={{ marginTop: '10px', overflow: 'hidden' }} elevation={10}>
          <TableContainer
            sx={{ transform: 'translateY(-30px)' }}
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
                        padding: '2px',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: ProductType, index: number) => (
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
                          <TableCell
                            style={{ padding: '0' }}
                            key={index}
                            align={column.align}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
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
export default Products;
