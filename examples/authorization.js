const proxmox = require('../');

proxmox.auth('localhost:8006', 'root', 'testToken', 'token', 'pam')
.then(() => {
  console.log('authorized');
}).catch((err) => {
  console.log(err);
});
// or
proxmox.auth('localhost:8006', 'root@pam!testToken', 'token').then(() => {
  console.log('authorized');
}).catch((err) => {
  console.log(err);
});