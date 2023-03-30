const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
        auth: {
            user: 'parker.steuber26@ethereal.email',
            pass: 'b3tx2egm2c9Gw8GZfq'
        }
    },

);

exports.mailer = (message)=> {
    transporter.sendMail(message, (err, info)=>{
        if(err) return console.log(err);
        console.log('Email sent ',info);
    });
}