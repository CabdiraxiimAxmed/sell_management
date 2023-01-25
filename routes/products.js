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
      res.send(result).end();
      return;
    }
    res.send(resp.rows).end();
  } catch (err) {
    res.send('err').end();
  }
});

router.get("/:name", async(req, res) => {
  let { name } = req.params;
  try {
    let item = await client.query(`SELECT * FROM products WHERE name='${name}'`);
    if(item.rows.length === 0) {
      return res.send({
        id:0,
        name:"",
        units:"",
        category:"",
        sub_category:"",
        alert_quantity:"",
        purchase_cost:"",
        sale_price:"",
        min_sale_price:"",
        min_quantity_order:"",
        bar_code:"",
        created_date:""
      }).end();
    }
    res.send(item.rows[0]).end();
  } catch(err) {
    res.send("error").end();
  }
})

router.get('/products/name', async (req, res) => {
  try {
    let result = [];
    const resp = await client.query('SELECT name FROM products');
    if (resp.rows.length == 0) {
      result = [{ label: '' }];
      res.send(result).end();
      return;
    }
    for (let product of resp.rows) {
      result.push({ label: product.name });
    }
    res.send(result).end();
  } catch (err) {
    res.send('err').end();
  }
});

router.get('/alert/quantity', async(req, res) => {
  try {
    let items = await client.query('SELECT name, alert_quantity FROM products WHERE units < alert_quantity');
    if (items.length === 0) items = [];
    res.send({ items: items.rows, count: items.rows.length }).end();
  } catch(err) {
    res.send('error').end();
  }
});

router.post('/update', async (req, res) => {
  let {id, name, units, category, subCategory, alertQuantity, barCode, salePrice, purchaseCost, minSalePrice, minQntyOrder } = req.body;
  try {
    await client.query(
      `UPDATE products SET name='${name}',
      alert_quantity='${alertQuantity}',
      sale_price='${salePrice}',
      bar_code='${barCode}',
      category='${category}',
      sub_category='${subCategory}',
      units='${units}',
      min_sale_price='${minSalePrice}',
      min_quantity_order='${minQntyOrder}',
      purchase_cost='${purchaseCost}'
      WHERE id='${id}'`
    );
    res.send('success').end();
  } catch (err) {
    res.send('error').end();
  }
});

router.post('/item', async (req, res) => {
  let { term } = req.body;
  try {
    let item = await client.query(
      `SELECT id, name, units, alert_quantity, purchase_cost, sale_price, min_sale_price, min_quantity_order FROM products WHERE name='${term}'`
    );
    res.send(item.rows).end();
  } catch (err) {
    res.send('error').end();
  }
});

router.post('/item/quantity/update', async(req, res) => {
  let { removedItems } = req.body;
  try {
    for(let item of removedItems) {
      await client.query(`UPDATE products set units=units-'${item.quantity}' WHERE name='${item.name}'`);
    }
    res.send('success').end().end();
  } catch(err) {
    res.send('error').end().end();
  }
})

router.post('/item/quantity/update/sell', async(req, res) => {
  let { removedItems } = req.body;
  try {
    for(let item of removedItems) {
      await client.query(`UPDATE products set units=units+'${item.quantity}' WHERE name='${item.name}'`);
    }
    res.send('success').end().end();
  } catch(err) {
    res.send('error').end().end();
  }
})

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
    res.send('success').end();
  } catch (err) {
    res.send('error').end();
  }
});

module.exports = router;
