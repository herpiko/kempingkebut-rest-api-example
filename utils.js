const sgMail = require('@sendgrid/mail');
const randomstring = require('randomstring')
const config = require('./config')

module.exports = {

  // Validate body against model's tree
  validate: (model, req, res) => {
    let invalids = Object.keys(model.schema.tree).filter((item) => {
      if (model.schema.tree[item].required && !req.body[item]) {
        return true
      }
    })
    if (invalids.length > 0) {
      res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
      return false;
    }
    return true;
  },

  sendRegistrationChallenge: (emailAddress, verificationCode) => {
    sgMail.setApiKey(config.sendgridAPIKey);
    const msg = {
      to: emailAddress,
      from: 'kemping@kebut',
      subject: 'Email Verification Code: ' + verificationCode,
      text: `Your verification code: ${verificationCode}`,
      html: `<strong>Your verificaion code is ${verificationCode}</strong>`,
    };
    return sgMail.send(msg);
  }
}
