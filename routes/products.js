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

router.post('/item', async (req, res) => {
  let { term } = req.body;
  try {
    let item = await client.query(
      `SELECT id, name, units, alert_quantity, purchase_cost, sale_price, min_sale_price, min_quantity_order FROM products WHERE name='${term}'`
    );
    res.send(item.rows);
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/create', async (req, res) => {
  const {
    name,
    units,
    category,
    subCategory,
    alertQuantity,
    barType,
    purchaseCost,
    salePrice,
    minSalePrice,
    minQntyOrder,
  } = req.body;
  try {
    await client.query(
      `INSERT INTO products ( name, units, category, sub_category, alert_quantity, bar_code, purchase_cost, sale_price, min_sale_price, min_quantity_order ) VALUES('${name}', '${units}','${category}', '${subCategory}', '${alertQuantity}', '${barType}', '${purchaseCost}', '${salePrice}', '${minSalePrice}', '${minQntyOrder}')`
    );
    res.send('success');
  } catch (err) {
    console.error(err);
    res.send('error');
  }
});

module.exports = router;
