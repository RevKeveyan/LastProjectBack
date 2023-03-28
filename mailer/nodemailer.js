const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
        auth: {
            user: 'nakia70@ethereal.email',
            pass: 'WBEYDmuQ5SQmKpeGxz'
        }
    },

);

exports.mailer = (message)=> {
    transporter.sendMail(message, (err, info)=>{
        if(err) return console.log(err);
        console.log('Email sent ',info);
    });
}