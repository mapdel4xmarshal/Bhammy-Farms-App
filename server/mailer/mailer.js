const nodemailer = require('nodemailer');
const config = require('../configs');

class Mailer {
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mailerUser,
        pass: config.mailerPassword
      }
    });
  }

  sendMail(mailOptions) {
    return new Promise((resolve) => {
      this._transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          resolve(error);
        } else {
          resolve(info.response);
        }
      });
    });
  }

  sendNotification(name, body) {
    const mailOptions = {
      from: 'notifications@bhammyfarms.com',
      to: 'bhammyfarms@gmail.com',
      subject: `Notification - ${name} `,
      html: body
    };

    return this.sendMail(mailOptions);
  }
}

module.exports = new Mailer();
