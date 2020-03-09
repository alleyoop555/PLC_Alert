const PLC = require('./PLC');
const Teams = require('./Teams');
const mail = require('./mail');

const url = 'https://outlook.office.com/webhook/02d3c323-b950-4bd4-9a5d-23335098f84d@3f3ebfe8-12f5-473a-9e36-8a92fe2ac335/IncomingWebhook/1b2ec8a371994ffc8b0ba55e516d1994/965be417-4776-4763-9428-365327c39c24';
const proxy = 'http://10.110.15.60:8080/';
const urls = [url];
const proxies = [proxy];
const group = new Teams(urls, proxies);
// group.sendMessage('hi', 'good morning'); /* test multiple groups */

const receivers = ['guowei1595@gmail.com'];
const mailer = new mail(receivers);
// mailer.send('testing', 'Fire Alert!!!');

// const plc = new PLC('10.110.217.100', 4096, [group], mail);
// plc.connect();

