const nodemailer = require('nodemailer');
const config = require('config');
const pug = require('pug');
const path = require('path');

const DEFAULT_EMAIL_ACCOUNT = 'main';

const sendEmail = (configs) => {    
    const emailAcc = configs.account || config.get(`emails.${DEFAULT_EMAIL_ACCOUNT}`);
    if(!emailAcc) {
        console.error(`Email account named ${EMAIL_ACCOUNT} is absent in configs!`);
        return false;
    }
    if(!emailAcc.address) {
        console.error(`Email account named ${EMAIL_ACCOUNT} has no address set!`);
    }
    if(!emailAcc.password) {
        console.error(`Email account named ${EMAIL_ACCOUNT} has no password set!`);
    }
    if(!configs.recipientAddress) {        
        console.error('Recipient email address has not been set!');
        return false;
    }
    if(!configs.subject) {
        console.error('Email subject has not been set!');
        return false;
    }    
    if(!configs.template) {
        console.error('Email template has not been set!');
        return false;
    }
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailAcc.address,
            pass: emailAcc.password
        }
    });
    
    const compiledFunction = pug.compileFile(path.join(__dirname, `templates/${configs.template}.pug`));
    const html = compiledFunction({ ...configs.template_data });    
    const mailOptions = {
        from: emailAcc.address,
        to: configs.recipientAddress,
        subject: configs.subject,
        html: html
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.error(error);
        }        
    });
}

module.exports = sendEmail;