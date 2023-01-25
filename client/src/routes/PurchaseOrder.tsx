import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Box,
  Button,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

type ProductNamesType = {
  label: string;
};
type PurchasedItemType = {
  id: number;
  name: string;
  unist: string;
  alert_quantity: string;
  purchase_cost: string;
  sale_price: string;
  min_sale_price: string;
  min_quantity_order: string;
};
const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [wholeDiscount, setWholeDiscount] = useState<number>(0);
  const [productNameRef, setProductNameRef ] = useState<React.ChangeEvent<HTMLInputElement>>();
  const [quantity, setQuantity] = useState<{ [key: number]: number }>({});
  const [itemDiscount, setItemDiscount] = useState<{ [key: number]: number }>(
    {}
  );
  const [valueHolders, setValueHolders] = useState<any>({});
  const [itemTerm, setItemTerm] = useState<string>('');
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItemType[]>([
    {
      id: 0,
      name: '',
      unist: '',
      alert_quantity: '',
      purchase_cost: '',
      sale_price: '',
      min_sale_price: '',
      min_quantity_order: '',
    },
  ]);
  const [supplierNames, setSupplierNames] = useState<ProductNamesType[]>([
    { label: '' },
  ]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    axios
      .get('http://localhost:2312/supplier/supplier-name')
      .then(res => {
        setSupplierNames(res.data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const supplier = data.get('supplier');
    const ref = data.get('reference-no');
    const purchaseDate = data.get('purchase-date');
    const purchase_status = data.get('purchase-status');
    const businessLocation = data.get('business-location');
    let items = [];
    for (let item of purchasedItems) {
      if (!item.name) continue;
      let discount = itemDiscount[item.id];
      let itemQuantity = quantity[item.id];
      if (!item.name) continue;
      if (!discount) {
        discount = 0;
      }
      if (!itemQuantity) {
        itemQuantity = 1;
      }
      let result = {
        name: item.name,
        itemQuantity: itemQuantity,
        sale_price: item.sale_price,
        min_sale_price: item.min_sale_price,
        selling_price: Math.floor((itemQuantity * parseFloat(item.sale_price) - discount) * 100) / 100,
        discount,
      };
      items.push(result);
    }
    let finalData = {
      supplier,
      ref,
      purchaseDate,
      purchase_status,
      businessLocation,
      items,
      wholeDiscount,
      total: getTotal(),
    };
    axios
      .post('http://localhost:2312/purchase/purchase-order/', finalData)
      .then(resp => {
        if (resp.data === 'success') {
          toast.success('success');
          setTimeout(() => {
            navigate('/orders');
          }, 2000);
        } else if (resp.data === 'error') {
          toast.error('server error');
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const purchaseStatus = [
    { label: 'received' },
    { label: 'pending' },
    { label: 'ordered' },
  ];

  const handlePurchaseQuantityChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = parseFloat(event.target.value);
    if (!value || Number.isNaN(value)) {
      setQuantity({ ...quantity, [id]: 1 });
      return;
    }
    setQuantity({ ...quantity, [id]: value });
  };

  const handlePurchaseDiscountChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = parseFloat(event.target.value);
    if (!value || Number.isNaN(value)) {
      setItemDiscount({ ...quantity, [id]: 0 });
      return;
    }
    setItemDiscount({ ...quantity, [id]: value });
  };

  const getItem = () => {
    if (!itemTerm) {
      toast.error('write item name');
      return;
    }
    productNameRef!.target.focus();
    axios
      .post('http://localhost:2312/products/item', { term: itemTerm })
      .then(resp => {
        let existedItem = purchasedItems.filter(item => item.name === itemTerm);
        if (existedItem.length >= 1) {
          toast.warn('item exist');
          return;
        }
        setPurchasedItems([...purchasedItems, ...resp.data]);
      })
      .catch(error => {
        toast.error(error.message);
      });
    setItemTerm("");
  };

  const removeItem = (id: number, index: number) => {
    setPurchasedItems(purchasedItems.filter(item => item.id !== id));
    let newQuantity = { ...quantity };
    delete newQuantity[id];
    setQuantity(prevState => newQuantity);
    let newDiscount = { ...itemDiscount };
    delete newDiscount[id];
    setItemDiscount(prevState => newDiscount);
  };
  const handleWholeDiscountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value: number = parseFloat(event.target.value);
    if (!value) value = 0;
    setWholeDiscount(value);
  };

  const getTotal = () => {
    let total: number = 0;
    for (let item of purchasedItems) {
      let discount = itemDiscount[item.id];
      let itemQuantity = quantity[item.id];
      if (!item.name) continue;
      if (!discount) {
        discount = 0;
      }
      if (!itemQuantity) {
        itemQuantity = 1;
      }
      total += Math.floor((parseFloat(item.sale_price) * itemQuantity - discount) * 100) / 100;
    }
    return total - wholeDiscount;
  };

  const handleProductNameChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemTerm(e.target.value);
    setProductNameRef(e);
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
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
      <h1 style={{ transform: 'translateY(-10px)' }}>Purchase Order</h1>
      <Paper style={{ transform: 'translateY(-20px)' }} elevation={10}>
        <Grid style={{ padding: 10 }} container columnSpacing={1}>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              supplier: *
            </p>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              options={supplierNames}
              sx={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  name="supplier"
                  label="Please Select"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Reference No: *
            </p>
            <TextField
              fullWidth
              required
              name="reference-no"
              label="Reference No"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Date: *
            </p>
            <TextField
              fullWidth
              required
              name="purchase-date"
              size="small"
              type="date"
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Purchase Status *
            </p>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              options={purchaseStatus}
              sx={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  name="purchase-status"
                  label="Please Select"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <p style={{ transform: 'TranslateY(10px)', fontWeight: 'bold' }}>
              Business Location *
            </p>
            <TextField
              fullWidth
              required
              name="business-location"
              label="business location"
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ marginTop: '20px' }} elevation={10}>
        <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              required
              name="product-name"
              value={itemTerm}
              multiline
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProductNameChange(e)}
              label="product name"
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <Button onClick={getItem} variant="text" startIcon={<AddIcon />}>
              add new product
            </Button>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <TableContainer sx={{ maxWidth: 950 }} component={Paper}>
              <Table sx={{ maxWidth: 50 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="table-header-row">
                    <TableCell className="table-header-columns">#</TableCell>
                    <TableCell className="table-header-columns">Name</TableCell>
                    <TableCell className="table-header-columns">
                      Purchase Quantity
                    </TableCell>
                    <TableCell className="table-header-columns">
                      Discount
                    </TableCell>
                    <TableCell className="table-header-columns">
                      Total sale
                    </TableCell>
                    <TableCell className="table-header-columns">
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchasedItems
                    .slice(1)
                    .map((item: PurchasedItemType, index: number) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.id}
                        </TableCell>
                        <TableCell align="left">{item.name}</TableCell>
                        <TableCell align="left">
                          <input
                            className="purchase-order-input"
                            defaultValue="1"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handlePurchaseQuantityChange(item.id, e)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <input
                            className="purchase-order-input"
                            defaultValue="0"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handlePurchaseDiscountChange(item.id, e)}
                          />
                        </TableCell>
                        <TableCell align="left">
                          {getItemSalePrice(
                            item.sale_price,
                            quantity[item.id],
                            itemDiscount[item.id]
                          )}
                          $
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            onClick={() => removeItem(item.id, index)}
                            color="primary"
                          >
                            <ClearIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={4}>
            <TextField
              onChange={handleWholeDiscountChange}
              size="small"
              label="all item discount"
            />
          </Grid>
          <Grid item xs={2}>
            <p style={{ fontWeight: 'bold' }}>Total: {getTotal()} $</p>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Button type="submit" fullWidth variant="contained">
            submit
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};

const getItemSalePrice = (
  price: string,
  quantity: number,
  discount: number
) => {
  let priceInt = parseFloat(price);
  if (!quantity) quantity = 1;
  if (!discount) discount = 0;
  return Math.floor((priceInt * quantity - discount) * 100) / 100;
};

export default PurchaseOrder;
