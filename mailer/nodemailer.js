const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
        auth: {
            user: 'myrtie.simonis@ethereal.email',
            pass: 'kmqhbRehqUaC7qS1wS'
        }
    },

);

exports.mailer = (message)=> {
    transporter.sendMail(message, (err, info)=>{
        if(err) return console.log(err);
        console.log('Email sent ',info);
    });
}