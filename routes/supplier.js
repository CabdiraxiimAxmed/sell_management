const express = require("express");
const router = express.Router();
const client = require('../models/connect');


router.get('/', async(req, res) => {
  let resp = await client.query('SELECT * FROM supplier');
  if(resp.rows.length == 0) {
    let result = [{id: 0, name: '', contact: '', address: '', created_date: '', email: '', city: ''}];
    res.send(result);
    return;
  }
  res.send(resp.rows);
});
router.get('/supplier-name', async(req, res) => {
  try {
    let result = [];
    const resp = await client.query('SELECT name FROM supplier');
    if(resp.rows.length == 0){
      result = [{label: ''}];
      res.send(result);
      return;
    }
    for(let supplier of resp.rows){
      result.push({label: supplier.name});
    }
    res.send(result);
  } catch(err) {
    console.log(err);
    res.send('err');
  }
});

router.post('/supplier', async(req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM supplier WHERE name='${name}'`);
    if (resp.rows.length === 0) {
      let result = [{"id": 0, "name": "", "contact": "", "address": "", "created_date": "", "email": '', "city": ''}];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('error');
  }
});

router.post('/create-supplier', async(req, res) => {
  let {name, contact, address, email, city} = req.body;
  try {
    let resp = await client.query(`INSERT INTO supplier (name, contact, address, email, city, created_date) VALUES('${name}', '${contact}','${address}','${email}', '${city}', DEFAULT)`);
    res.send('success');
  }catch(err) {
    res.send('error');
  }
});

router.post('/update-supplier', async(req, res) => {
  let { id, name, contact, address} = req.body;
  try {
    const resp = await client.query(`UPDATE supplier SET name='${name}',  contact='${contact}', address='${address}' WHERE id='${id}'`);
    res.send('success');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/delete/:id', async(req, res) => {
  const { id } = req.params;
  try {
    const resp = await client.query(`DELETE FROM supplier WHERE id ='${id}'`);
    res.send('success');
  } catch(err) {
    res.send("error");
  }
});

router.post('/get-supplier', async(req, res) => {
  const { id } = req.body;
  try {
    const resp = await client.query(`SELECT name FROM supplier WHERE id = '${id}'`);
    if (resp.rows.length == 0) {
      let result = [{"name": ""}];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/get-debt', async(req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM purch_debt WHERE supplier='${name}' AND is_paid='false'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "id": 0,
          "amount": "",
          "order_id": "",
          "payments": [
            {
              "recordedDate": "",
              "paidAmount": 0,
            },
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

router.post("/get-debt-date", async(req, res) => {
  const { supplier, date } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM purch_debt WHERE supplier='${supplier}' AND recordedDate LIKE '%${date}%'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "id": 0,
          "amount": "",
          "order_id": "",
          "payments": [
            {
              "recordedDate": "",
              "paidAmount": 0,
            },
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
module.exports = router;
