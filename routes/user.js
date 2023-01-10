const express = require('express');
const CryptoJS = require('crypto-js');
const client = require('../models/connect');

const router = express.Router();
router.get('/', async (req, res) => {
  let resp = await client.query('SELECT * FROM user_info');
  for (let user of resp.rows) {
    let bytes = CryptoJS.AES.decrypt(user.password, 'ahmed');
    let decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
    user.password = decryptdPassword;
  }
  if (resp.rows.length === 0) {
    let result = [
      {
        id: 0,
        name: '',
        role: '',
        password: '',
        created_date: '',
        username: '',
        permissions: [''],
        contact: '',
      },
    ];
    res.send(result);
    return;
  }
  res.send(resp.rows);
});

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    let resp = await client.query(
      `SELECT * FROM user_info WHERE username = '${username}'`
    );
    let user = resp.rows[0];
    if (!user) {
      res.send('not_found');
      return;
    }
    let bytes = CryptoJS.AES.decrypt(user.password, 'ahmed');
    let decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
    user.password = decryptdPassword;
    if (resp.rows.length === 0) {
      let result = [
        {
          id: 0,
          name: '',
          role: '',
          password: '',
          created_date: '',
          username: '',
          permissions: [''],
          contact: '',
        },
      ];
      res.send(result);
      return;
    }
    res.send(user);
  } catch (err) {
    res.send('err');
  }
});

router.post('/create-user', async (req, res) => {
  let { name, username, role, contact, password, permissions } = req.body;
  role = role.toLowerCase();
  let permissionJson = JSON.stringify(permissions);
  let hash = CryptoJS.AES.encrypt(password, 'ahmed').toString();
  try {
    await client.query(
      `INSERT INTO user_info (name, username, role, contact, permissions, password, created_date) VALUES('${name}', '${username}', '${role}', '${contact}', array['${permissionJson}']::json[], '${hash}', DEFAULT)`
    );
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

router.post('/update-user', async (req, res) => {
  let { id, name, username, role, contact, password, permissions } = req.body;
  role = role.toLowerCase();
  let permissionJson = JSON.stringify(permissions);
  let hash = CryptoJS.AES.encrypt(password, 'ahmed').toString();
  try {
    const resp = await client.query(
      `UPDATE user_info SET name='${name}', username='${username}', role='${role}', contact='${contact}', password='${hash}', permissions=array['${permissionJson}']::json[] WHERE id='${id}'`
    );
    res.send('success');
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.post('/delete/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const resp = await client.query(
      `DELETE FROM user_info WHERE username='${username}'`
    );
    res.send('success');
  } catch (err) {
    res.send('error');
  }
});

router.post('/login', async (req, res) => {
  let { username, password } = req.body;
  try {
    let resp = await client.query(
      `SELECT * FROM user_info WHERE username = '${username}'`
    );
    let user = resp.rows[0];
    if (!user) {
      res.send('not_found');
      return;
    }
    let bytes = CryptoJS.AES.decrypt(user.password, 'ahmed');
    let decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptdPassword !== password) {
      res.send('not_match');
      return;
    }
    res.send(user);
  } catch (err) {
    res.send('err');
  }
});

module.exports = router;
