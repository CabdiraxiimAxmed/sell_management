const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.get('/', async(req, res) => {
  try {
    const resp = await client.query('SELECT * FROM customer');
    if(resp.rows.length == 0) {
      let result = [{id: 0, name: '', contact: '', address: '', email: '', city: '', created_date: ''}];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('error');
  }
});

router.post('/name', async(req, res) => {
  const {name} = req.body;


  try {
    const resp = await client.query(`SELECT * FROM customer WHERE name='${name}'`);;
    console.log(resp.rows);
    if (resp.rows.length === 0) {
      let result = [
        {
          "id": 0,
          "name": "",
          "contact": "",
          "address": "",
          "email": "",
          "city": "",
          "created_date": ""
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows[0]);
  } catch(err) {
    res.send('error');
  }
});

router.get('/customer-name', async(req, res) => {
  try {
    let result = [];
    const resp = await client.query('SELECT name FROM customer');
    if(resp.rows.length == 0){
      result = [{label: ''}];
      res.send(result);
      return;
    }
    for(let i = 0; i < resp.rows.length; i++){
      if (i == 0) {
        result.push({label: 'deg-deg'});
      }
      result.push({label: resp.rows[i].name});
    }
    res.send(result);
  } catch(err) {
    res.send('err');
  }
});

router.post('/create', async(req, res) => {
  const { name, address, contact, email, city, created_date } = req.body;
  try {
    await client.query(`INSERT INTO customer(name, address, contact, email, city, created_date) VALUES('${name}', '${address}', '${contact}', '${email}', '${city}', '${created_date}')`);
    res.send('success');
  } catch(err) {
    res.send('error');
  }
});

router.post('/update', async(req, res) => {
  const { name, address, contact, email, city, id } = req.body;
  try {
    await client.query(`UPDATE customer SET name='${name}', address='${address}', contact='${contact}', email='${email}', city='${city}'  WHERE id='${id}'`);
    res.send('success');
  } catch(err) {
    res.send('error');
  }
});
router.post('/delete/:id', async(req, res) => {
  const { id } = req.params;
  try {
    const resp = await client.query(`DELETE FROM customer WHERE id='${id}'`);
    res.send('success');
  } catch(err) {
    res.send("error");
  }
});


router.post('/debt', async(req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM sell_debt WHERE customer='${name}' AND is_paid='false'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "id": 0,
          "amount": "",
          "order_id": "",
          "payments": [
            [
              {
                "recordedDate": "",
                "paidAmount": 0,
              },
            ]
          ],
          "is_paid": false,
          "recordeddate": "",
          "supplier": "",
          "initialamount": ""
        }
      ];
      res.send(result);
      return;
    }

    res.send(resp.rows);

  } catch(err) {
    res.send('error');
  }
});

router.post('/sells', async(req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(`SELECT order_id, customer, is_debt, total, paid FROM sell_order WHERE customer='${name}'`);
    if (resp.rows.length == 0) {
      let result  = [
        {
          order_id: '',
          customer: '',
          is_debt: false,
          total: '',
          paid: '',
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('error');
  };
});


module.exports = router;
