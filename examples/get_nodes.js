// authorization.js got executed before this.

const proxmox = require('../');

proxmox.get('/nodes').then(res => {
  res = JSON.parse(res.text);
  console.log(res);
});