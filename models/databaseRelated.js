const client = require('./connect');
const CryptoJS = require("crypto-js");
let bytes  = CryptoJS.AES.decrypt('U2FsdGVkX18DrYZQYpcLWVTRvLflQqlj+wWXpWeHQG8=', 'ahmed');
let decryptdPassword = bytes.toString(CryptoJS.enc.Utf8);
console.log({ decryptdPassword });
