const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// connecting to database
const client = require('./models/connect');
client.connect();

// importing routes
const user = require('./routes/user');
const supplier = require('./routes/supplier');
const purchaseOrder = require('./routes/purchaseOrder');
const sellOrder = require('./routes/sellOrder');
const products = require('./routes/products');
const customer = require('./routes/customer');
const debt = require('./routes/debt');
app.use('/user', user);
app.use('/supplier', supplier);
app.use('/customers', customer);
app.use('/products', products);
app.use('/purchase', purchaseOrder);
app.use('/sell', sellOrder);
app.use('/debt', debt);

app.listen(2312);
