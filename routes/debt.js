const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.post('/sells/date', async(req, res) => {
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

      const resp = await client.query(`SELECT customer, amount, recordeddate FROM sell_debt WHERE recordeddate LIKE '%${date}%' AND is_paid='${false}'`);
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

router.post('/purchase/date', async(req, res) => {
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

      const resp = await client.query(`SELECT supplier, amount, recordeddate FROM purch_debt WHERE recordeddate LIKE '%${date}%' AND is_paid='${false}'`);
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

function dateOrdinal(dom) {
  if (dom == 31 || dom == 21 || dom == 1) return dom + "st";
  else if (dom == 22 || dom == 2) return dom + "nd";
  else if (dom == 23 || dom == 3) return dom + "rd";
  else return dom + "th";
};

module.exports = router;
