import React, { useState, useEffect } from 'react';
import { Grid, Divider, TextField, Typography, Box, IconButton, Button, Autocomplete, ToggleButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';

type ProductNamesType = {
  label: string,
};

type ItemType = {
  id: number,
  name: string,
  supplier: string,
  quantity: number,
  alerquantity: number,
  barcode: string,
  price: string,
}

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.value);
  const [selected, setSelected] = useState<boolean>(false);
  const [customerOptions, setCustomerOptions] = useState<string>('')
  const [displayDiscount, setDisplayDiscount] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [valueHolders, setValueHolders] = useState<any>({});
  const [productNames, setProductNames] = useState<ProductNamesType[]>([{label: ''}]);
  const [customerNames, setCustomerNames] = useState<ProductNamesType[]>([{label: ''}]);
  const [count, setCount] = useState<number>(0);

  const [items, setItems] = useState<ItemType[]>([
    {
      id: 0,
      name: '',
      supplier: '',
      quantity: 0,
      alerquantity: 0,
      barcode: '',
      price: '',
    }
  ]);


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
           toast.error('qalad ayaa dhacay');
         })
    axios.get('/customers/customer-name')
         .then(res => {
           setCustomerNames(res.data);
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
    axios.get('/products')
         .then(res => {
           setItems(res.data);
         })
         .catch(err => {
           toast.error('qalad ayaa dhacay');
         })
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const customer = data.get('customer');
    let recordedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    if(!customer) {
      toast.warn('fadlan xogta dhamestir');
      return;
    }
    let count = Object.keys(valueHolders).length / 2;
    let items = [];
    for(let i = 0; i < count; i++) {
      let itemQuantity = valueHolders[`quantity${i}`];
      let itemPrice = valueHolders[`price${i}`];
      let amount = Math.round((itemQuantity * itemPrice) * 100) / 100;
      if(!data.get(`item${i}`) || !data.get(`quantity${i}`)){
        toast.warn('fadlan dhameystir xogta');
        return;
      }
      let item = {"item": data.get(`item${i}`), "quantity": itemQuantity, "price": valueHolders[`price${i}`], amount}
      items.push(item);
    }

    let total = getSubTotalAndAllTotal(valueHolders,  discount).total;
    axios.post('/sell/sell-order', {customer, is_debt: selected,  items, discount, total, username: user.username, recordedDate})
           .then(res => {
             if(res.data == 'success') {
               toast.success('waa lagu guuleystay');
               setTimeout(() => {
                 navigate('/sells');
               }, 2000);
             } else if (res.data == 'error') {
               toast.error('server: qalad ayaa dhacay');
             }
           }).catch(err => {
             toast.error('qalad ayaa dhacay');
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

  const handleItemPrice = (index: number, name: string) => {
    let foundItem: any = items.find(item => item.name == name)
    setValueHolders({
      ...valueHolders,
      [`price${index}`]: parseFloat(foundItem.price),
    });
  };

  const debtDisable = () => {
    if(customerOptions === 'deg-deg' || !customerOptions) return true;
    return false;
  };

  let subTotal = getSubTotalAndAllTotal(valueHolders, discount).subTotal;
  let total = getSubTotalAndAllTotal(valueHolders, discount).total;
  let sellState = [{label: 'taala'}, {label: 'baxday'}];
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
          <Typography variant="subtitle1">xogta bixinta</Typography>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.label === value.label}
            onInputChange={(event, newInputValue) => {
              setCustomerOptions(newInputValue);
            }}
            options={customerNames}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="customer alaabta" name="customer" size="small" />}
          />
        </Grid>
        <Grid item xs={2}>
          <ToggleButton
            value="check"
            color="primary"
            disabled={debtDisable()}
            selected={selected}
            onChange={() => {
              setSelected(!selected);
            }}
          >
            Deyn
          </ToggleButton>
        </Grid>
        {/* Items to order */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">alaab aad bixineyso</Typography>
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            isOptionEqualToValue={(option, value) => option.label === value.label}
            options={productNames}
            sx={{ width: 250 }}
            onInputChange={(event, newInputValue) => {
              handleItemPrice(0, newInputValue);
            }}
            renderInput={(params) => <TextField {...params} label="alaabta" name="item0" size="small" />}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="name"
            required
            size="small"
            label="Cadadka"
            type="number"
            name="quantity0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 0) }
          />
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">qiimaha: ${valueHolders['price0']}</Typography>
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
                onInputChange={(event, newInputValue) => {
                  handleItemPrice(index+1, newInputValue);
                }}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} label="alaabta" name={`item${index+1}`} size="small" />}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="name"
                required
                size="small"
                label="Cadadka"
                type="number"
                name={`quantity${index+1}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 1) }
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">qiimaha: ${valueHolders[`price${index+1}`]}</Typography>
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
            <Typography variant="h5">submit</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};


const getSubTotalAndAllTotal = (valueHolders:any, discount: number) => {
  let subTotal = 0;
  let total = 0;
  let count = Object.keys(valueHolders).length/2
  for(let i = 0; i < count; i++) {
    let priceName = `price${i}`
    let quantityName = `quantity${i}`
    if(!valueHolders[priceName] || !valueHolders[quantityName]) continue;
    subTotal += Math.round((valueHolders[priceName] * valueHolders[quantityName]) * 100) / 100;
  }
  total = Math.round((subTotal -discount) * 100) / 100;

  return {subTotal, total};
}

export default Sell;
