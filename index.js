const http = require('superagent'),
      debug = require('debug'),
      log = debug('proxmox:debug'),
      error = debug('proxmox:error'),
      logHttp = debug('proxmox:http'),
      Cookies = require('js-cookie');

log.color = '208';
logHttp.color = '208';
error.color = '9';

class Proxmox {
  constructor() {
    this.baseUrl = '';
    this.tokenInfo = '';
    this.token = '';
    this.authorized = false;
    this.username = '';
    this.password = '';
    this.csrftoken = '';
    this.ticket = '';
    this.Proxmox = Proxmox;
  }

  auth(host, user, password, tokenName, token) {
    return new Promise((resolve, reject) => {
      this.baseUrl = `http://${host}/api2/json`;
      this.token = token;

      if (!this.ticket) {
        this.tokenInfo = user;
        this.call('POST', '/access/ticket', { "username": user, "password": password }, true).then((res) => {
          if(res.status != 200) {
            this.authorized = false;
            error('authorization failed');
            return reject({code: 401, message: "Unauthorized"});
          }
          this.authorized = true;
          log('authorization successfull');
          console.log(res.body.data);
          this.ticket = res.body.data.ticket;
          this.csrftoken = res.body.data.CSRFPreventionToken;
          Cookies.set('PVEAuthCookie', this.ticket, {sameSite: 'None', secure: true});
          return resolve();
        }).catch((err) => {
          this.authorized = false;
          console.log("ERROR");
          error('authorization failed');
          return reject({code: err.status, message: (err.response && err.response.res ? err.response.res.statusMessage : 'Unknown Error')});
        });
        return;
      }
      log('got authorization details');
      this.call('GET', '/', '').then((res) => {
        if(res.status != 200) {
          this.authorized = false;
          error('authorization failed');
          return reject({code: 401, message: "Unauthorized"});
        }
        this.authorized = true;
        log('authorization successfull');
        return resolve();
      }).catch((err) => {
        this.authorized = false;
        error('authorization failed');
        return reject({code: err.status, message: err.response.res.statusMessage});
      });
      //this.tokenInfo = `${user}@${realm}!${tokenName}`;
    });
  }

  async call(method, path, body, skipAuthorizationCheck) {
    return new Promise((resolve, reject) => {
      if(!this.authorized && !skipAuthorizationCheck) {
        error('401 Unauthorized');
        return reject({code: 401, message: 'Unauthorized'});
      }
      method = method.toLowerCase()
      var req = http[method](`${this.baseUrl}${path}`);
      var contentType = 'application/x-www-form-urlencoded';
      //req.set('cookie', `VEAuthCookie=${this.ticket}`);
      req.set('CSRFPreventionToken', `${this.csrftoken}`)
      // if(body == undefined) {
      //   body = {};
      // }
      if(typeof body == 'string') {
        try {
          body = JSON.parse(body);
        } catch(e) {

        }
      }
      if(typeof body == 'object') {
        //body = JSON.stringify(body);
        console.log(body);
        contentType = 'application/json';
        contentType = 'application/x-www-form-urlencoded';
      }
      if(method == 'POST' &&  method == 'PUT') {
        req.set('Content-Type', contentType);
      }
      logHttp(`${method.toUpperCase()} ${this.baseUrl}${path}`);
      return req.send(body).then((res) => {
        logHttp(`${method.toUpperCase()} ${this.baseUrl}${path} => ${res.status}`);
        return resolve(res);
      }).catch((err) => {
        if(typeof err.status == "number") {
          logHttp(`${method.toUpperCase()} ${this.baseUrl}${path} => ${err.status}`);
          error(err);
        }
        return reject(err);
      });
    });
    
  }

  get(path) {
    return this.call('GET', path, '');
  }
  post(path, body) {
    return this.call('POST', path, body);
  }
  async put(path, body) {
    return this.call('PUT', path, body);
  }
  async delete(path) {
    return this.call('DELETE', path, '');
  }
  async del(path) {
    return this.call('DELETE', path, '');
  }
}

var proxmox = module.exports = exports = new Proxmox();
