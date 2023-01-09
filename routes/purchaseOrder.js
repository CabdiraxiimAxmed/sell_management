const express = require('express');
const client = require('../models/connect');
const orderid = require('order-id')('ahmed');
const router = express.Router();

router.get('/', async(req, res) => {
  try {
    const resp = await client.query('SELECT * FROM purchase_order');
    let test = resp.rows;
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "order_date": "",
          "delivery_date": "",
          "supplier": "",
          "purchase_status": "",
          "items": [{item: '', quantity: 0, price: 0, amount: 0}],
          "discount": "",
          "taxamount": "",
          "total": "",
          "paid": ""
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  }catch(err) {
    res.send('err');
  }
});

router.get('/orders', async(req, res) => {
  try {
    const resp = await client.query('SELECT order_id, order_date, delivery_date, supplier, purchase_status, discount, taxAmount, total, paid, payment_option FROM purchase_order');
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "order_date": "",
          "delivery_date": "",
          "supplier": "",
          "purchase_status": "",
          "discount": "",
          "taxamount": "",
          "total": "",
          "paid": ""
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  }catch(err) {
    res.send('err');
  }
});

router.get('/orders/:order_id', async(req, res) => {
  const { order_id } = req.params;
  try {
    const resp = await client.query(`SELECT * FROM purchase_order WHERE order_id = '${order_id}'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "order_date": "",
          "delivery_date": "",
          "supplier": "",
          "purchase_status": "",
          "items": [{item: '', quantity: 0, price: 0, amount: 0}],
          "discount": "",
          "taxamount": "",
          "total": "",
          "paid": ""
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('err');
  }
});
router.post('/expense', async(req, res) => {
  let { dateStr } = req.body;
  let daysNo = {
    01: 31,
    02: 29,
    03: 31,
    04: 30,
    05: 31,
    06: 30,
    07: 31,
    08: 31,
    09: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  try {
    let splitted = dateStr.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
    if(splitted.length < 2 || splitted.length > 2){
      res.send('correct');
      return;
    };
    const days = daysNo[splitted[0]];
    let result = [];
    for(let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      const resp = await client.query(`SELECT order_id, paid, total, order_date FROM purchase_order WHERE order_date::text LIKE '%${date}%'`);
      if(resp.rows.length === 0) continue;
      result.push(...resp.rows);
    }
    if(result.length == 0) {
      result = [{order_id: '', paid: "", total: '', order_date: ''}];
    }
    res.send(result);
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/purchase-order', async(req, res) => {
  let {supplier, status, orderDate, deliveryDate, items, discount, taxAmount, total} = req.body;
  const order_id = orderid.generate();
  let formatItemArray = JSON.stringify(items);
  let paid = 0;
  try {
    let resp = await client.query(`INSERT INTO purchase_order (order_id, supplier, purchase_status, order_date, delivery_date, items, discount, taxAmount, total, paid) VALUES('${order_id}', '${supplier}', '${status}', '${orderDate}', '{"${deliveryDate}"}', array['${formatItemArray}']::json[], '${discount}', '${taxAmount}', '${total}', '${paid}')`);

    if (status == 'lahelay') {
      for(let item of items) {
        await client.query(`UPDATE products set quantity=quantity+'${item.quantity}' WHERE name='${item.item}'`);
      }
    }

    res.send('success');
  } catch(err) {
    res.send('err');
  }
});

router.post('/received', async(req, res) => {
  const { order_id, items, status } = req.body;
  try {
    for(let item of items) {
      await client.query(`UPDATE products set quantity=quantity+'${item.quantity}' WHERE name='${item.item}'`);
    }
    await client.query(`UPDATE purchase_order set purchase_status='${status}' WHERE order_id = '${order_id}'`);
    res.send('success');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/full-payment', async(req, res) => {
  let { paidAmount, prevPaid, order_id, payment_option } = req.body;
  let totalPaid = paidAmount + parseFloat(prevPaid);
  try {
    const resp = await client.query(`UPDATE purchase_order set paid='${totalPaid}', payment_option='${payment_option}' WHERE order_id='${order_id}'`);
    res.send('success');
  } catch(err) {
    res.send('error');
  }
});

router.post('/partial-payment', async(req, res) => {
  let { paidAmount, prevPaid, order_id, total, payment_option, payments, supplier, recordedDate } = req.body;
  let formatPayments = JSON.stringify(payments);
  let totalPaid = paidAmount + parseFloat(prevPaid);
  if(payment_option) {
    let debtAmount = parseFloat(total) - totalPaid;
  try {
      const purch = await client.query(`UPDATE purchase_order set paid='${totalPaid}', payment_option='${payment_option}' WHERE order_id='${order_id}'`);
    const debt = await client.query(`INSERT INTO purch_debt (amount, order_id, is_paid, supplier, recordedDate, initialamount, payments) VALUES('${parseFloat(total) - totalPaid}', '${order_id}', '${false}', '${supplier}', '${recordedDate}', '${debtAmount}', array['${formatPayments}']::json[])`);
      res.send('success');
    } catch(err) {
      console.log(err);
      res.send('error');
    }
  } else {
    try {
      let is_paid = false;
      if (totalPaid === parseFloat(total)){
        is_paid = true;
      }
      const purch = await client.query(`UPDATE purchase_order set paid='${totalPaid}' WHERE order_id='${order_id}'`);
      const debt = await client.query(`UPDATE purch_debt set amount='${parseFloat(total) - totalPaid}', payments=array_append(payments, '${formatPayments}'), is_paid='${is_paid}' WHERE order_id='${order_id}'`);
      res.send('success');
    } catch(err) {
      console.log(err);
      res.send('error');
    }
  }
});

router.post('/edit', (req, res) => {
  let {supplier, status, orderDate, deliveryDate, items, discount, taxAmount, total} = req.body;
  console.log({supplier, status,  items, discount, taxAmount, total});
  res.send('success');
});

router.post('/delete/:order_id', async(req, res) => {
  const { order_id } = req.params;
  try {
    const resp = await client.query(`DELETE FROM purchase_order WHERE order_id='${order_id}'`);
    res.send('success');
  } catch(err) {
    res.send('error');
  }
});

router.post('/get-supplier-transactions', async(req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(`SELECT order_id, supplier, purchase_status,total, paid FROM purchase_order WHERE supplier='${name}'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "supplier": "",
          "purchase_status": "",
          "total": "",
          "paid": ""
        }
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  }catch(err) {
    res.send('error');
  }
});

router.post('/get-debt-transaction', async(req, res) => {
  const { order_id } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM purch_debt WHERE order_id='${order_id}'`);
    if (resp.rows.length === 0) {
        let result = [
          {
            "id": 0,
            "amount": "",
            "order_id": "",
            "payments": [
              {
                "recordedDate": "",
                "paidAmount": 0
              }
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
    console.log(err);
    res.send('error');
  }
});

router.post('/get-debt-supplier', async(req, res) => {
  const { supplier } = req.body;
  try {
    const resp = await client.query(`SELECT * FROM purch_debt WHERE supplier='${supplier}'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "id": 0,
          "amount": "",
          "order_id": "",
          "payments": [
            {
              "recordedDate": "",
              "paidAmount": 0
            }
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
    console.log(err);
    res.send('error');
  }

});



module.exports = router;
