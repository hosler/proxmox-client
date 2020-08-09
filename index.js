const http = require('superagent'),
      debug = require('debug'),
      log = debug('proxmox:log'),
      error = debug('proxmox:error'),
      logHttp = debug('proxmox:http');

class Proxmox {
  constructor() {
    this.baseUrl = '';
    this.tokenInfo = '';
    this.token = '';
    this.Proxmox = Proxmox;
  }

  auth(host, user, tokenName, token, realm = 'pam') {
    log('got authorization details');
    this.baseUrl = `https://${host}/api2/json`;
    this.token = token;
    if(!token || !token.length) {
      this.tokenInfo = user;
      this.token = tokenName;
      return;
    }
    this.tokenInfo = `${user}@${realm}!${tokenName}`;
    return;
  }

  async call(method, path, body) {
    method = method.toLocaleLowerCase()
    var req = http[method](`${this.baseUrl}${path}`);
    var contentType = 'application/x-www-form-urlencoded';
    req.set('Authorization', `PVEAPIToken=${this.tokenInfo}=${this.token}`);
    if(body == undefined) {
      body = {};
    }
    if(typeof body == 'string') {
      try {
        body = JSON.parse(body);
      } catch(e) {

      }
    }
    if(typeof body == 'object') {
      body = JSON.stringify(body);
      coontentType = 'application/json';
    }
    if(method == 'POST' &&  method == 'PUT') {
      req.set('Content-Type', contentType);
    }
    logHttp(`sending ${method.toLocaleUpperCase()} request to ${this.baseUrl}${path}`);
    req.send(body).catch();
    if(req === undefined || req === "undefined") {
      req = { data: "error" }
    }
    return req;
  }

  async get(path) {
    var response =	await this.call('GET', path, '');
    if(typeof response === undefined || response === "undefined") {
      response = { data: "error" }
    }
   return response
  }
  async post(path, body) {
    var response =	await this.call('POST', path, body);
    if(typeof response === undefined || response === "undefined") {
      response = { data: "error" }
    }
   return response
  }
  async put(path, body) {
    var response = await this.call('PUT', path, body);
    if(typeof response === undefined || response === "undefined") {
      response = { data: "error" }
    }
    return response
  }
  async delete(path) {
    var response = await this.call('DELETE', path, '');
    if(typeof response === undefined || response === "undefined") {
      response = { data: "error" }
    } 
    return response
  }
  async del(path) {
    var response = await this.call('DELETE', path, '');
    if(typeof response === undefined || response === "undefined") {
      response = { data: "error" }
    } 
    return response
  }
}

var proxmox = module.exports = exports = new Proxmox();
