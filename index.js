const http = require('superagent');

class Proxmox {
  constructor() {
    this.baseUrl = '';
    this.user = '';
    this.tokenName = '';
    this.token = '';
    this.realm = '';
    this.Proxmox = Proxmox;
  }

  connect(host, user, tokenName, token, realm = 'pam') {
    this.baseUrl = `https://${host}/api2/json`;
    this.user = user;
    this.tokenName = tokenName;
    this.token = token;
    this.realm = realm;
  }

  async call(method, path, body) {
    method = method.toLocaleLowerCase();
    var req = http[method](`${this.baseUrl}${path}`);
    req.set('Authorization', `PVEAPIToken=${this.user}@${this.realm}!${this.tokenName}=${this.token}`);
    if(body == undefined) {
      body = '';
    }
    if(method !== 'get' &&  method !== 'delete') {
      req.set('Content-Type', 'application/x-www-form-urlencoded');
    }
    req.send(body);
    return req;
  }

  async get(path) {
    return await this.call('GET', path, '');
  }
  async post(path, body) {
    return await this.call('POST', path, body);
  }
  async put(path, body) {
    return await this.call('PUT', path, body);
  }
  async delete(path) {
    return await this.call('DELETE', path, '');
  }
  async del(path) {
    return await this.call('DELETE', path, '');
  }
}

var proxmox = module.exports = exports = new Proxmox();