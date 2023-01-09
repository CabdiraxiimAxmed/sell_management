const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const resp = await client.query('SELECT * FROM products');
    if (resp.rows.length === 0) {
      let result = [
        {
          id: 0,
          name: '',
          supplier: '',
          quantity: '',
          alertquantity: '',
          barcode: '',
          price: '',
        },
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch (err) {
    res.send('err');
  }
});

router.get('/products-name', async (req, res) => {
  try {
    let result = [];
    const resp = await client.query('SELECT name FROM products');
    if (resp.rows.length == 0) {
      result = [{ label: '' }];
      res.send(result);
      return;
    }
    for (let product of resp.rows) {
      result.push({ label: product.name });
    }
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send('err');
  }
});

router.post('/update', async (req, res) => {
  let { id, name, alertquantity, price, barcode } = req.body;
  try {
    await client.query(
      `UPDATE products SET name='${name}', alertquantity='${alertquantity}', price='${price}', barcode='${barcode}' WHERE id='${id}'`
    );
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/create', async (req, res) => {
  const { name, quantity, alertquantity, price } = req.body;
  try {
    let resp = await client.query(
      `INSERT INTO products (name, quantity, alertquantity, price) VALUES('${name}', '${quantity}','${alertquantity}', '${price}')`
    );
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

module.exports = router;
