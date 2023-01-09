const express = require('express');
const orderid = require('order-id')('ahmed');
const client = require('../models/connect');
const router = express.Router();

router.get('/', async(req, res) => {
  try {
    let resp = await client.query('SELECT * FROM sell_order');
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "customer": "",
          "sold_by": "",
          "is_debt": false,
          "items": [[{"item": "", "quantity": 0, "price": 0, "amount": 0}]],
          "discount": "",
          "total": "",
          "paid": "",
          "created_date": "",
          "payment_method": null
        },
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('error');
  }
});

router.get('/sell/:order_id', async(req, res) => {
  const { order_id } = req.params;
  try {
    let resp = await client.query(`SELECT * FROM sell_order WHERE order_id='${order_id}'`);
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "customer": "",
          "sold_by": "",
          "is_debt": false,
          "items": [[{"item": "", "quantity": 0, "price": 0, "amount": 0}]],
          "discount": "",
          "total": "",
          "paid": "",
          "created_date": "",
          "payment_method": null
        },
      ];
      res.send(result);
      return;
    }
    res.send(resp.rows);
  } catch(err) {
    res.send('error');
  }
});

router.get('/sells', async(req, res) => {
  try {
    let resp = await client.query('SELECT order_id, customer, sold_by, is_debt, discount, total, paid, created_date FROM sell_order');
    if (resp.rows.length === 0) {
      let result = [
        {
          order_id: '',
          customer: '',
          sold_by: '',
          is_debt: false,
          discount: '',
          total: '',
          paid: '',
          created_date: '',
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

router.post('/revenue', async(req, res) => {
  let { dateStr } = req.body;
  let daysNo = {
    January: 31,
    Febuary: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
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
      let day = dateOrdinal(i);
      let date = `${splitted[0]} ${day} ${splitted[1]}`;
      const resp = await client.query(`SELECT order_id, paid, total, created_date FROM sell_order WHERE created_date LIKE '%${date}%'`);
      if(resp.rows.length === 0) continue;
      result.push(...resp.rows);
    }
    if(result.length == 0) {
      result = [{order_id: "", paid: 0, total: 0, created_date: ''}];
    }
    res.send(result);
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/sell-order', async(req, res) => {
  let {customer, sold_by, is_debt, items, discount, total, username, recordedDate} = req.body;
  const order_id = orderid.generate();
  let formatItemArray = JSON.stringify(items);
  let paid;
  try {
    if (customer === 'deg-deg' || !is_debt) {
      paid = total;
      await client.query(`INSERT INTO sell_order (order_id, customer, sold_by, is_debt, items, discount, total, paid, created_date) VALUES('${order_id}', '${customer}', '${username}', '${is_debt}', array['${formatItemArray}']::json[], '${discount}', '${total}', '${paid}', '${recordedDate}')`);
    } else if(is_debt) {
      paid = 0;
      await client.query(`INSERT INTO sell_order (order_id, customer, sold_by, is_debt, items, discount, total, paid, created_date) VALUES('${order_id}', '${customer}', '${username}', '${is_debt}', array['${formatItemArray}']::json[], '${discount}', '${total}', '${paid}', '${recordedDate}')`);

      await client.query(`INSERT INTO sell_debt (sell_id, amount, is_paid, recordeddate, customer, initialAmount) VALUES('${order_id}', '${total}', '${false}', '${recordedDate}', '${customer}', '${total}')`);
    }
    res.send('success');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/pay-sell-debt', async(req, res) => {
  let {customerPaid, paidAmount, payments, total, order_id, customer} = req.body;
  let debtRest = parseFloat(total) - paidAmount;
  let formatPayments = JSON.stringify(payments);
  let is_paid = false;
  if (debtRest <= 0) {
    is_paid = true;
  }
  try {
    await client.query(`UPDATE sell_order SET paid='${paidAmount}' WHERE order_id='${order_id}'`);
    await client.query(`UPDATE sell_debt set amount='${debtRest}', payments=array_append(payments, '${formatPayments}'), is_paid='${is_paid}' WHERE sell_id='${order_id}'`);
    res.send('success');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

function dateOrdinal(dom) {
  if (dom == 31 || dom == 21 || dom == 1) return dom + "st";
  else if (dom == 22 || dom == 2) return dom + "nd";
  else if (dom == 23 || dom == 3) return dom + "rd";
  else return dom + "th";
};

module.exports = router;
