"use strict";
const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = function(receivers) {
    this.receivers = receivers;

    this.send = function (text, title) {
        let transporter = nodemailer.createTransport({
            host: process.env.mail_host, // mail server
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.mail_id, // mail id
                pass: process.env.mail_pw // mail password
            }
        });

        if (transporter) {
            transporter.sendMail({
                from: process.env.mail_id, // sender address
                to: `${this.receivers}`, // list of receivers
                subject: title, // Subject line
                text: text, // plain text body
            }, function () {
                console.log('mail sent');
            });
        } else {
            console.log('mail server connect failed');
        }
    }
};





