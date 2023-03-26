const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
        auth: {
            user: 'omer.wisozk@ethereal.email',
            pass: 'uV9jNqJ63j4x9XCY3H'
        }
    },

);

exports.mailer = (message)=> {
    transporter.sendMail(message, (err, info)=>{
        if(err) return console.log(err);
        console.log('Email sent ',info);
    });
}