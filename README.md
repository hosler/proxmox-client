# proxmox-client
A node.js client for the Proxmox API

<p>
<a href="https://www.npmjs.com/package/proxmox-client" rel="nofollow"><img src="https://img.shields.io/npm/dw/proxmox-client.svg?logo=npm" alt="npm downloads" style="max-width:100%;"></a>
<a href="https://www.npmjs.com/package/proxmox-client" rel="nofollow"><img src="https://img.shields.io/npm/v/proxmox-client.svg?logo=npm" alt="npm version" style="max-width:100%;"></a>
<a href="https://github.com/BeefoIO/proxmox-client/blob/master/LICENSE" rel="nofollow"><img src="https://img.shields.io/npm/l/proxmox-client.svg?logo=github" alt="NpmLicense"></a>
<a href="https://github.com/BeefoIO/proxmox-client/blob/master/" rel="nofollow"><img src="https://img.shields.io/badge/Accepting%20Commits-True-green.svg" alt="Conventional Commits"></a>
<a href="https://github.com/BeefoIO/proxmox-client/blob/master/" rel="nofollow"><img src="https://img.shields.io/github/package-json/v/BeefoIO/proxmox-client.svg" alt="Conventional Commits"></a>

## (Get) Usage example

```js
const proxmox = require('proxmox-client');

proxmox.auth('localhost:8006', 'root@pam!testToken', 'token').then(() => {
  proxmox.get('/nodes').then((res) => {
    if(res.status !== 200) {
      console.log("statusCode is not 200");
    }
    res = JSON.parse(res.text).data;
    console.log(res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
  }).catch((err) => {
  console.log(err);
});
```

## (Post) Usage example

```js
const proxmox = require('proxmox-client');

proxmox.auth('localhost:8006', 'root@pam!testToken', 'token').then(() => {
  proxmox.post('/nodes/testnode/qemu/100/status/reboot', {timeout: 1500}).then((res) => {
    if(res.status !== 200) {
      console.log("statusCode is not 200");
    }
    res = JSON.parse(res.text).data;
    console.log(res);
  })
  .catch((err) => {
    console.log('Error:', err);
  });
  }).catch((err) => {
    console.log(err);
  });
});
```

## API

### `proxmox.auth(host, user, tokenName, token, realm = 'pam'): Promise`

Stores the auth information

### `proxmox.auth(host, tokenInfo, token): Promise`

Stores the auth information

### `proxmox.get(path): Promise`

Sends a GET Request to the defined path and returns a superagent request

### `proxmox.post(path, body): Promise`

Sends a POST Request to the defined path with the defined body and returns a superagent request

### `proxmox.put(path, body): Promise`

Sends a PUT Request to the defined path with the defined body and returns a superagent request

### `proxmox.delete(path): Promise`

Sends a DELETE Request to the defined path and returns a superagent request

### `proxmox.del(path): Promise`

Sends a DELETE Request to the defined path and returns a superagent request

## License

GPL-3.0
