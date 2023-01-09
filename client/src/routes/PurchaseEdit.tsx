import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Divider, TextField, Typography, Box, IconButton, Button, Autocomplete } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';

type OrderType = {
  order_id: string,
  order_date: string,
  delivery_date: string,
  supplier: string,
  purchase_status: string,
  items: {item: string, quantity:number, price:number, amount: number}[][],
  discount: string,
  taxamount: string,
  total: string,
  paid: string
};
type ProductNamesType = {
  label: string,
};
const PurchaseOrder: React.FC = () => {
  const { order_id } = useParams();
  const [displayTax, setDisplayTax] = useState<boolean>(false);
  const [tax, setTax] = useState<number>(0);
  const [orders, setOrders] = useState<OrderType[]>([
    {
      order_id: '',
      order_date: '',
      delivery_date: '',
      supplier: '',
      purchase_status: '',
      items: [[{item: '', quantity: 0, price: 0, amount: 0}]],
      discount: '',
      taxamount: '',
      total: '',
      paid: ''
    }
  ]);
  const [displayDiscount, setDisplayDiscount] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [valueHolders, setValueHolders] = useState<any>({});
  const [productNames, setProductNames] = useState<ProductNamesType[]>([{label: ''}]);
  const [supplierNames, setSupplierNames] = useState<ProductNamesType[]>([{label: ''}]);
  const [count, setCount] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let name = e.target.name
    let value: number = parseFloat(e.target.value);
    setValueHolders({
      ...valueHolders,
      [name]: value,
    });
  };
  useEffect(() => {
    axios.get('/products/products-name')
         .then(res => {
           setProductNames(res.data);
         })
         .catch(err => {
           console.log('error happened');
         })
    axios.get('/supplier/supplier-name')
         .then(res => {
           setSupplierNames(res.data);
         })
         .catch(err => {
           console.log('error happened');
         })
    axios.get(`/purchase/orders/${order_id}`)
         .then(res => {
           let counter: number = res.data[0].items[0].length - 1;
           setCount(counter);
           setOrders(res.data);
         })
         .catch(err => {
           console.log('error happened');
         });
  }, []);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const supplier = data.get('supplier');
    const status = data.get('order-status')
    if(!supplier || !status) {
      toast.warn('fadlan xogta dhamestir');
      return;
    }
    let count = Object.keys(valueHolders).length / 2;
    let items = [];
    for(let i = 0; i < count - 1; i++) {
      let itemQuantity = valueHolders[`quantity${i}`];
      let itemPrice = valueHolders[`price${i}`];
      let amount = Math.round((itemQuantity * itemPrice) * 100) / 100;
      if(!data.get(`item${i}`) || !data.get(`quantity${i}`) || !data.get(`price${i}`)){
        toast.warn('fadlan dhameystir xogta');
        return;
      }
      let item = {"item": data.get(`item${i}`), "quantity": itemQuantity, "price": itemPrice, amount}
      console.log({ item });
      items.push(item);
    }

    let taxAmount = getSubTotalAndAllTotal(valueHolders, tax, discount).taxAmount;
    let total = getSubTotalAndAllTotal(valueHolders, tax, discount).total;

    axios.post('/purchase/edit', {supplier, status,  items, discount, taxAmount, total})
         .then(res => {
           if (res.data === 'success') {
             toast.success('waa lagu guuleystaty');
           }
         }).catch(err => {
         })
  };
  const getAmount = (quantity: string, price: string) => {
    let itemQuantity = valueHolders[quantity];
    let itemPrice = valueHolders[price];
    let amount: number = 0.00;
    if(!itemQuantity || !itemPrice) {
      return amount;
    }
    amount = Math.round((itemQuantity * itemPrice) * 100) / 100;
    return amount;
  };
  const removeValueHolders = (quantity: string, price: string) => {
    let data = valueHolders;
    delete data[quantity];
    delete data[price];
    setValueHolders(data)
  };
  let subTotal = getSubTotalAndAllTotal(valueHolders, tax, discount).subTotal;
  let taxAmount = getSubTotalAndAllTotal(valueHolders, tax, discount).taxAmount;
  let total = getSubTotalAndAllTotal(valueHolders, tax, discount).total;
  let orderState = [{label: 'ladalbay'}, {label: 'lahelay'}]
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
      <Grid container rowSpacing={1} columnSpacing ={2} style={{backgroundColor: 'white', borderRadius: '10px'}}>
        {/* Purchase details */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">xogta dalabka</Typography>
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.label === value.label}
            options={supplierNames}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={orders[0].supplier} name="supplier" size="small" />}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.label === value.label}
            options={orderState}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={orders[0].purchase_status} name="order-status" size="small" />}
          />
        </Grid>
        {/* Items to order */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">alaab aad dalbaneyso</Typography>
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.label === value.label}
            options={productNames}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={orders[0].items[0][0].item} name="item0" size="small" />}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="name"
            required
            multiline
            size="small"
            label="Cadadka"
            defaultValue={orders[0].items[0][0].quantity}
            type="number"
            name="quantity0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 0) }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="name"
            required
            size="small"
            multiline
            label="price $"
            defaultValue={orders[0].items[0][0].price}
            type="number"
            name="price0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 0) }
          />
        </Grid>
        <Grid item xs={3}>
          <Box sx={{display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection:'column'}}>
            <Typography variant="body2">qiimamaha</Typography>
            <Typography variant="h6">${getAmount('quantity0', 'price0')}</Typography>
          </Box>
        </Grid>
        {Array.from(Array(count)).map((num, index) => (
          <Grid key={index} item container xs={12} spacing={4}>
            <Grid item xs={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) => option.label === value.label}
                options={productNames}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label={orders[0].items[0][index+1].item} name={`item${index+1}`} size="small" />}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="name"
                required
                size="small"
                label="Cadadka"
                multiline
                type="number"
                value={orders[0].items[0][index+1].quantity}
                name={`quantity${index+1}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 1) }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="name"
                required
                multiline
                size="small"
                label="price $"
                value={orders[0].items[0][index+1].price}
                type="number"
                name={`price${index+1}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 1) }
              />
            </Grid>
            <Grid item xs={1}>
              <Box sx={{display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection:'column'}}>
                <Typography variant="body2">qiimamaha</Typography>
                <Typography variant="h6">${getAmount(`quantity${index+1}`, `price${index+1}`)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box sx={{display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection:'column'}}>
                <IconButton color="warning" onClick={() => {
                  removeValueHolders(`quantity${index+1}`, `price${index+1}`)
                  setCount(count - 1)
                }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={3} style={{paddingTop:'0'}}>
          <IconButton color="primary" onClick={() => setCount(count+1) }>
            <AddIcon />
          </IconButton>
        </Grid>
      <Divider/>
        <Grid item xs={3}>
          <Box sx={{border: '1px dashed grey'}}>
            <Grid container rowSpacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">wadarHore</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" style={{textAlign: 'end'}}>${subTotal}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">canshuurta({tax}%)</Typography>
              </Grid>
              <Grid item xs={3}>
                <Button color="secondary" style={{marginLeft: '17px'}} onClick={() => setDisplayTax(!displayTax) }>badal</Button>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" style={{textAlign: 'end'}}>${taxAmount}</Typography>
              </Grid>
              <Grid item xs={12} className={displayTax? '': 'inactive'}>
                <TextField label="%" variant="filled" type="number" size="small" onChange={(e) => {
                  if(!e.target.value){
                    setTax(0);
                    return
                  }
                  setTax(parseFloat(e.target.value))
                } } />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">discount({discount}$)</Typography>
              </Grid>
              <Grid item xs={3}>
                <Button color="secondary" style={{marginLeft: '17px'}} onClick={() => setDisplayDiscount(!displayDiscount) }>badal</Button>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" style={{textAlign: 'end'}}>${discount}</Typography>
              </Grid>
              <Grid item xs={12} className={displayDiscount? '': 'inactive'}>
                <TextField label="$" variant="filled" type="number" size="small" onChange={(e) => {
                  if(!e.target.value){
                    setDiscount(0);
                    return
                  }
                  setDiscount(parseFloat(e.target.value))
                } } />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Wadarta guud</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" style={{textAlign: 'end'}}>${total}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            <Typography variant="h5">Submit</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
const getSubTotalAndAllTotal = (valueHolders:any, tax: number, discount: number) => {
  let subTotal = 0;
  let taxAmount = 0;
  let total = 0;
  let count = Object.keys(valueHolders).length/2
  for(let i = 0; i < count; i++) {
    let priceName = `price${i}`
    let quantityName = `quantity${i}`
    if(!valueHolders[priceName] || !valueHolders[quantityName]) continue;
    subTotal += Math.round((valueHolders[priceName] * valueHolders[quantityName]) * 100) / 100;
  }
  taxAmount = Math.round(((tax / 100) * subTotal) * 100) / 100;
  total = Math.round((taxAmount + subTotal -discount) * 100) / 100;

  return {subTotal, taxAmount, total};
}

export default PurchaseOrder;
