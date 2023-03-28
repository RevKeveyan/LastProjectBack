const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');
const {  validationResult } = require('express-validator');
const { mailer } = require('../mailer/nodemailer');
const md5 = require('md5');

const generateAccessToken = (user) =>{
  const payload = {...user};
  return jwt.sign(payload, secret, {expiresIn: '24h'});
}

exports.signUp = (req, res) => {
  const data = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid data', errors })
  }
  User.findOne({ email: data.email })
    .then(async(user) => {
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      } else {
        const hashedData = md5(data.email + Date.now());
        const { password } = data;
        const hashPassword = await bcrypt.hashSync(password, 5);
        const user = new User({ ...data, password: hashPassword, confirmationCode: hashedData});
        user
          .save()
          .then((result) => {
            const message = {
              from: 'Rev Kev rkeveyan@list.ru',
              to: 'vernie76@ethereal.email',
              subject: 'Verify your account',
              html: `<p>Click this link to verify your account</p>
              <a href="http://localhost:3000/verify/${hashedData}"><button>Verify</button></a> `
            }
            mailer(message);
            res.status(201).json({ message: 'User created. Verification email sent.' });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Error creating user' });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error finding user' });
    });
};

exports.signIn = async (req, res) =>{
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Invalid data', errors})
    }
    const user = await User.findOne({ email})
        .then(async (user) => {
          if(!user){
            return res.status(401).json({ message: 'Invalid email or password' });
          }
          if(!user.isVerified){
            return res.status(401).json({ message: 'Please verify your account' });
          }
          const validPassword = await bcrypt.compareSync(password, user.password);
          if (validPassword) { 
            const token = generateAccessToken(user);
            return res.status(200).json({user,token}); 
            }
        }).catch((error)=>{
          return res.status(401).json({ message: 'Invalid email or password' });
        });
 
};

exports.getUser = async (req, res) => {
  try {
    const token = req.headers.authentication;
    const decodedData = jwt.verify(token, secret);
    const user = decodedData._doc;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.updateUser = async (req, res) => {
  const data = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid data', errors });
  }
  User.findOne({ email:data.email}).then(async (user) => {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.age = data.age;
    try {
      const updatedUser = await user.save();
      const token = generateAccessToken(updatedUser);
      res.status(200).json({token,user});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user' });
    }
    }).catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error updating user' });
    });  
}
exports.changePassword = async (req, res) => {
  const data = req.body;
  const { verifyCode } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid data', errors });
  }
  User.findOne({ email: data.email }).then(async (user) => {
    if(+verifyCode === +user.verifyCode){
      if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(data.oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }
    const hashPassword = await bcrypt.hash(data.password, 5);
    user.password = hashPassword;
    try {
      const updatedUser = await user.save();
      const token = generateAccessToken(updatedUser);
      res.status(200).json(token);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user' });
    }
  }else{
    res.status(400).json({message: "incorrect code "});
  }
    
  }).catch((error) => {
    console.log(error);
    res.status(500).json({ message: 'Error updating user' });
  });
};

exports.verifyUser = async (req, res) => {
  const {data} = req.params;
  console.log(data);
  User.findOne({confirmationCode:data})
    .then((user) => {
      console.log(user);
      if (user) {
        user.isVerified = true;
        user.confirmationCode = null;
        user.save();
        res.status(200).json({ message: 'Account verified successfully', user});
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error verifying account' });
    });
};

exports.sendCode = async (req, res) => {
  const code = Math.floor(Math.random() * 9000) + 1000;
  const {email} = req.body;
  User.findOne({email}).then((user)=>{
      if(!user){
        res.status(404).json({message: "User not found"});
      }
      const message = {
        from: 'Rev Kev rkeveyan@list.ru',
        to: 'nakia70@ethereal.email',
        subject: 'Verify your account',
        html: `<p>Click this link to verify your account</p>
        verify code: -- ${code}`,
      }
      mailer(message);
      user.verifyCode = code;
      user.save();
  }).catch((err)=>{
       res.status(400).json({message: "incorrect code "});
  });
};
