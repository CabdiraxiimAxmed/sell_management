const express = require('express');
const orderid = require('order-id')('ahmed');
const client = require('../models/connect');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let resp = await client.query('SELECT * FROM sell_order');
    if (resp.rows.length === 0) {
      let result = [
        {
          "order_id": "",
          "customer": "",
          "sold_by": "",
          "is_debt": false,
          "items": [[{ "item": "", "quantity": 0, "price": 0, "amount": 0 }]],
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
  } catch (err) {
    res.send('error');
  }
});

router.get('/sell/:order_id', async (req, res) => {
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
          "items": [[{ "item": "", "quantity": 0, "price": 0, "amount": 0 }]],
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
  } catch (err) {
    res.send('error');
  }
});

router.get('/sells', async (req, res) => {
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
  } catch (err) {
    res.send('error');
  }
});

router.post('/order/update', async (req, res) => {
  let { id, customer, sold_by, total, paid, discount, items } = req.body
  let formatItemArray = JSON.stringify(items[0]);

  try {
    await client.query(`UPDATE sell_order set 
      customer='${customer}',
      sold_by='${sold_by}',
      items=array['${formatItemArray}']::json[],
      total='${total}',
      paid='${paid}',
      discount='${discount}'
      WHERE order_id='${id}'
    `)
    res.send('success');
  } catch (err) {
    res.send('error').end();
  }
});

router.post('/revenue', async (req, res) => {
  let { dateStr } = req.body;

  let daysNo = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };
  //


  try {
    let splitted = dateStr.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
    if (splitted.length < 2 || splitted.length > 2) {
      res.send('correct');
      return;
    }

    const days = daysNo[splitted[0]];
    let result = [];
    for (let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      const resp = await client.query(`SELECT order_id, paid, total, created_date FROM sell_order WHERE created_date='${date}'`);
      if (resp.rows.length === 0) continue;
      result.push(...resp.rows);
    }
    if (result.length == 0) {
      result = [{ order_id: "", paid: 0, total: 0, created_date: '' }];
    }
    res.send(result);
  } catch (err) {
    res.send('error');
  }
});


router.post('/sell-order', async (req, res) => {
  let { customer, is_debt, products, discount, total, username } = req.body;
  const order_id = orderid.generate();

  for (let item of products) {
    let insufficientItems = await client.query(`SELECT * FROM products WHERE units < '${item.quantity}'`);
    if (insufficientItems.rows.length > 0) {
      return res.send({ item: insufficientItems.rows[0].name, message: 'not_enough' });
    }
  }
  let formatItemArray = JSON.stringify(products);
  let paid;
  try {
    if (customer === 'deg-deg' || !is_debt) {
      paid = total;
      await client.query(`INSERT INTO sell_order (order_id, customer, sold_by, is_debt, items, discount, total, paid) VALUES('${order_id}', '${customer}', '${username}', '${is_debt}', array['${formatItemArray}']::json[], '${discount}', '${total}', '${paid}')`);
    } else if (is_debt) {
      paid = 0;
      await client.query(`INSERT INTO sell_order (order_id, customer, sold_by, is_debt, items, discount, total, paid, created_date) VALUES('${order_id}', '${customer}', '${username}', '${is_debt}', array['${formatItemArray}']::json[], '${discount}', '${total}', '${paid}', '${recordedDate}')`);

      await client.query(`INSERT INTO sell_debt (sell_id, amount, is_paid, recordeddate, customer, initialAmount) VALUES('${order_id}', '${total}', '${false}', '${recordedDate}', '${customer}', '${total}')`);
    }
    for (let item of products) {
      await client.query(`UPDATE products set units=units-'${item.quantity}' WHERE name='${item.item}'`);
    }
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

router.post('/pay', async (req, res) => {
  let { paidAmount, payments, order_id, customer } = req.body;
  let formatPayments = JSON.stringify(payments);
  let is_paid = true;
  try {
    await client.query(`UPDATE sell_debt set amount='${paidAmount}', payments='${formatPayments}', is_paid='${is_paid}' WHERE sell_id='${order_id}'`);
    await client.query(`UPDATE sell_order SET paid='${paidAmount}' WHERE order_id='${order_id}'`);
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

function dateOrdinal(dom) {
  if (dom == 31 || dom == 21 || dom == 1) return dom + "st";
  else if (dom == 22 || dom == 2) return dom + "nd";
  else if (dom == 23 || dom == 3) return dom + "rd";
  else return dom + "th";
};

/* This routes is the number of units sold and number of revenue. */
router.post('/units/report', async (req, res) => {
  /* Change the date */
  const { dateStr } = req.body;

  let daysNo = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };
  try {
    let units = 0;
    let revenue = 0;
    let splitted = dateStr.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
    if (splitted.length < 2 || splitted.length > 2) {
      res.send('correct');
      return;
    }
    const days = daysNo[splitted[0]];
    for (let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      let resp = await client.query(`SELECT * FROM sell_order WHERE created_date = '${date}'`)
      if(resp.rows.length === 0) continue;
      for(let order of resp.rows) {
        let paid = order.paid ? order.paid : 0;
        revenue = Math.round((revenue + parseFloat(paid))* 100) / 100;
        for(let item of order.items[0]) {
          units += item.quantity;
        }
      }
    }
    res.send({ units, revenue }).end();

  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/monthly/units_sold', async (req, res) => {
  let { dateStr } = req.body

  let daysNo = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };

  try {
    let splitted = dateStr.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
    const days = daysNo[splitted[0]];
    let result = [];
    let labels = [];
    for (let i = 1; i <= days; i++) {

      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      const resp = await client.query(`SELECT items FROM sell_order WHERE created_date='${date}'`);
      labels.push(date);
      if (resp.rows.length === 0) {
        result.push(0);
        continue;
      }
      let units = 0;
      for (let items of resp.rows) {
        for (let item of items.items[0]) {
          units = Math.round((units + item.quantity) * 100) / 100

        }
      }
      result.push(units);
    }
    res.send({ labels, datasets: [{ label: 'number items sold', data: result, backgroundColor: 'rgba(53, 162, 235, 0.5)' }] });
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

router.post('/monthly/revenue', async (req, res) => {

  let { dateStr } = req.body

  let daysNo = {
    '01': 31,
    '02': 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };

  try {
    let splitted = dateStr.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
    const days = daysNo[splitted[0]];
    let result = [];
    let labels = [];
    for (let i = 1; i <= days; i++) {

      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      const resp = await client.query(`SELECT * FROM sell_order WHERE created_date='${date}' AND total = paid`);
      labels.push(date);
      if (resp.rows.length === 0) {
        result.push(0);
        continue;
      }
      let total = 0;
      for(let order of resp.rows) {
        total = Math.round((total + parseFloat(order.total)) * 100) / 100;
      }
      result.push(total);
    }
    res.send({ labels, datasets: [{ label: 'Revenue', data: result, backgroundColor: 'rgba(53, 162, 235, 0.5)' }] });
  } catch (error) {
    res.send('error');
  }
});

module.exports = router;
