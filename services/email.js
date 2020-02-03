const sgMail = require('@sendgrid/mail');
const { config } = require('../config');

class EmailService {
  constructor(){
    sgMail.setApiKey(config.sendgridApiKey);
  }

  async sendEmail({to, from, cc, subject, html}) {
    const msg = {
      to,
      from,
      cc,
      subject,
      html
    };

    const result = await sgMail.send(msg);
    return result;
  }
};

module.exports = EmailService;
