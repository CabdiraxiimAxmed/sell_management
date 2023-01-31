const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const resp = await client.query('SELECT * FROM purchase_order');
    if (resp.rows.length === 0) {
      let result = [
        {
          order_id: '',
          supplier: '',
          purchase_date: '',
          purchase_status: '',
          business_location: '',
          items: [[{ item: '', quantity: 0, price: 0, amount: 0 }]],
          whole_discount: '',
          total: '',
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

router.get('/orders', async (req, res) => {
  try {
    const resp = await client.query(
      'SELECT id, supplier, purchase_date,  purchase_status, is_debt, total, whole_discount, paid FROM purchase_order'
    );
    if (resp.rows.length === 0) {
      let result = [
        {
          id: '',
          purchase_date: '',
          supplier: '',
          purchase_status: '',
          business_location: '',
          whole_discount: '',
          total: '',
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

router.get('/orders/:order_id', async (req, res) => {
  const { order_id } = req.params;
  try {
    const resp = await client.query(
      `SELECT * FROM purchase_order WHERE id = '${order_id}'`
    );
    if (resp.rows.length === 0) {
      let result = [
        {
          order_id: '',
          supplier: '',
          purchase_date: '',
          purchase_status: '',
          business_location: '',
          items: [[{ item: '', quantity: 0, price: 0, amount: 0 }]],
          whole_discount: '',
          total: '',
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

router.post('/order/update', async(req, res) => {
  let {id, supplier, purchase_date, purchase_status, items, total, paid, is_debt } = req.body;
  let formatItemArray = JSON.stringify(items[0]);
  try {
    await client.query(`UPDATE purchase_order set 
      supplier='${supplier}',
      purchase_date='${purchase_date}',
      purchase_status='${purchase_status}',
      items=array['${formatItemArray}']::json[],
      total='${total}',
      paid='${paid}',
      is_debt='${is_debt}'
      WHERE id='${id}'
    `)
    res.send('success')
  } catch(err) {
    res.send('error');
  }
});

router.post('/expense', async (req, res) => {
  let { dateStr } = req.body;
  let daysNo = {
    '01': 31,
    '02': 29,
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
    if (splitted.length < 2 || splitted.length > 2) {
      res.send('correct');
      return;
    }
    const days = daysNo[splitted[0]];
    let result = [];
    for (let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      const resp = await client.query(
        `SELECT id, paid, total, purchase_date FROM purchase_order WHERE purchase_date::text LIKE '%${date}%'`
      );
      if (resp.rows.length === 0) continue;
      result.push(...resp.rows);
    }
    if (result.length == 0) {
      result = [{ order_id: '', paid: '', total: '', order_date: '' }];
    }
    res.send(result);
  } catch (err) {
    res.send('error');
  }
});



router.post('/purchase-order', async (req, res) => {
  let {
    supplier,
    ref,
    purchaseDate,
    purchase_status,
    businessLocation,
    items,
    wholeDiscount,
    total,
  } = req.body;
  let formatItemArray = JSON.stringify(items);
  try {
    if (purchase_status === 'received') {
      for (let item of items) {
        await client.query(
          `UPDATE products set units=units+'${item.itemQuantity}' WHERE name='${item.name}'`
        );
      }
    }
    await client.query(
      `INSERT INTO purchase_order ( supplier, purchase_date, purchase_status, business_location, items, whole_discount, total ) VALUES( '${supplier}', '${purchaseDate}', '${purchase_status}', '${businessLocation}', array['${formatItemArray}']::json[], '${wholeDiscount}', '${total}' )`
    );
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

router.post('/debt', async (req, res) => {
  let { order_id, supplier, recorded_date, amount, initial_amount, is_paid } = req.body;
  initial_amount = parseFloat(initial_amount);
  try {
    await client.query(`INSERT INTO purchase_debt(order_id, supplier, recorded_date, amount, initial_amount, is_paid) 
      VALUES('${order_id}', '${supplier}', '${recorded_date}', '${amount}', '${initial_amount}', '${is_paid}' )
      `)
    await client.query(`UPDATE purchase_order set is_debt='${true}' WHERE id='${order_id}'`)
    res.send('success')
  } catch (err) {
    res.send("error");
  }
});

router.post('/received', async (req, res) => {
  const { id, items, status } = req.body;
  try {
    for (let item of items) {
      await client.query(
        `UPDATE products set units=units+'${item.itemQuantity}' WHERE name='${item.name}'`
      );
    }
    await client.query(
      `UPDATE purchase_order set purchase_status='${status}' WHERE id = '${id}'`
    );
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});


router.post('/payment', async (req, res) => {
  let { id, paid, is_debt, payments } = req.body;
  let formatPayments = JSON.stringify(payments);
  paid = parseFloat(paid);
  try {
    if(is_debt) {
      await client.query(`UPDATE purchase_debt 
        SET amount='${paid}',
        payments='${formatPayments}',
        is_paid='${true}'
        WHERE id='${3}'
        `);
      await client.query(`UPDATE purchase_order set paid='${paid}' WHERE id='${id}'`)
    } else
      await client.query(`UPDATE purchase_order set paid='${paid}' WHERE id='${id}'`)
    res.send('success');
  } catch (err) {
    res.send("error");
  }
});

router.post('/edit', (req, res) => {
  let {
    supplier,
    status,
    items,
    discount,
    taxAmount,
    total,
  } = req.body;
  res.send('success');
});

router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await client.query(
      `DELETE FROM purchase_order WHERE id='${id}'`
    );
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

router.post('/get-supplier-transactions', async (req, res) => {
  const { name } = req.body;
  try {
    const resp = await client.query(
      `SELECT id, supplier, purchase_status,total, paid FROM purchase_order WHERE supplier='${name}'`
    );
    if (resp.rows.length === 0) {
      let result = [
        {
          order_id: '',
          supplier: '',
          purchase_status: '',
          total: '',
          paid: '',
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

router.post('/get-debt-transaction', async (req, res) => {
  const { order_id } = req.body;
  try {
    const resp = await client.query(
      `SELECT * FROM purchase_debt WHERE order_id='${order_id}'`
    );
    if (resp.rows.length === 0) {
      let result = [
        {
          id: 0,
          amount: '',
          order_id: '',
          payments: { recordedDate: '', paidAmount: 0 },
          is_paid: false,
          recordeddate: '',
          supplier: '',
          initialamount: '',
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

router.post('/get-debt-supplier', async (req, res) => {
  const { supplier } = req.body;
  try {
    const resp = await client.query(
      `SELECT * FROM purchase_debt WHERE supplier='${supplier}'`
    );
    if (resp.rows.length === 0) {
      let result = [
        {
          id: 0,
          amount: '',
          order_id: '',
          payments: [
            {
              recordedDate: '',
              paidAmount: 0,
            },
          ],
          is_paid: false,
          recordeddate: '',
          supplier: '',
          initialamount: '',
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


/*
* NOTE this routes returns all monthly expense for the chart to display it.
*/
router.post('/monthly/expense', async(req, res) => {
  const { dateStr } = req.body;
  let daysNo = {
    '01': 31,
    '02': 29,
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
    if (splitted.length < 2 || splitted.length > 2) {
      res.send('correct');
      return;
    }
    const days = daysNo[splitted[0]];
    let result = [];
    let labels = [];
    for (let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      labels.push(date);
      const resp = await client.query(`SELECT * FROM purchase_order WHERE purchase_date='${date}' AND total = paid`);
      if (resp.rows.length === 0) {
        result.push(0);
        continue
      };
      let total = 0;
      for(let order of resp.rows) {
        total = Math.round((total + parseFloat(order.total)) * 100) / 100;
      }
      result.push(total);
    }
    res.send({ labels, datasets: [{ label: 'Expense', data: result, backgroundColor: 'rgba(53, 162, 235, 0.5)' }] });
  } catch(err) {
    res.send('error');
  };
});

router.post('/monthly/report', async(req, res) => {
  const { dateStr } = req.body;
  let daysNo = {
    '01': 31,
    '02': 29,
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
    if (splitted.length < 2 || splitted.length > 2) {
      res.send('correct');
      return;
    }
    const days = daysNo[splitted[0]];
    let units = 0;
    let expense = 0;
    for (let i = 1; i <= days; i++) {
      let day = i < 10 ? `0${i}` : i;
      let date = `${splitted[1]}-${splitted[0]}-${day}`;
      let resp = await client.query(`SELECT * FROM purchase_order WHERE purchase_date = '${date}' AND purchase_status = 'received'`)
      if(resp.rows.length === 0) continue;
      for(let order of resp.rows) {
        let paid = order.paid ? order.paid : 0;
        expense = Math.round((expense + parseFloat(paid))* 100) / 100;
        for(let item of order.items[0]) {
          units += item.itemQuantity;
        }
      }
    }
    res.send({ units, expense }).end();
  } catch(err) {
    res.send('error').end();
  };
});

module.exports = router;
