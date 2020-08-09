// authorization.js got executed before this.

const proxmox = require('../');

proxmox.post('/nodes/{node}/qemu/{vmid}/config', {name: "newName"}).then(res => {
  res = JSON.parse(res.text).data;
  console.log(res);
});