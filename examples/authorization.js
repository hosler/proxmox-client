const proxmox = require('../');

proxmox.auth('localhost:8006', 'root', 'testToken', 'token', 'pam');
// or
proxmox.auth('localhost:8006', 'root@pam!testToken', 'token');