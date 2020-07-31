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

  auth(host, user, tokenName, token, realm = 'pam') {
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
