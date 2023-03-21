const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');

const generateAccessToken = (id,email, password) =>{
  const payload = {
    id,
    email,
    password,
  };
  return jwt.sign(payload, secret, {expiresIn: '24h'});
}


exports.signUp = (req, res) => {
    const data = req.body;
    User.findOne({ email: data.email }) // gtnum enq user tvyal mailov
      .then((user) => { // 
        if (user) { // ete usery ka 
          return res.status(400).json({ message: 'Email already exists' }); // veradarcnum enq massage 
        } else { // ete che 
          const {password} = data;
          const hashPassword = bcrypt.hashSync(password,5);

          const user = new User({...data, password:hashPassword}); // nor mer datat dave enq anum databaseum
            user
             .save() // pahum enq 
              .then((result) => {
                  // etet hajoxvec artacum enq
                  console.log(result); 
                  res.status(201).json(result);
                })
              .catch((error) => { 
                  // ete che apa error
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
    const { email, password } = req.body; // hanum enq email password body-ic
    const user = await User.findOne({ email}).exec(); // gtnum enq  {email:email} nuynna inch vor {email}
      if (!user) { // ete chaka apa 
            return res.status(401).json({ message: 'Invalid email or password' });
    }
    const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) { // if passwords don't match, return error response
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateAccessToken(user._id,user.email,user.password);
    
      res.status(200).json({user,token}); 
};

exports.getUser = async (req, res) => {
  try {
    const token = req.headers.authentication;
    const decodedData = jwt.verify(token, secret);
    const { email } = decodedData;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const validPassword = bcrypt.compare(decodedData.password, user.password);
      if (!validPassword) { 
          return res.status(401).json({ message: 'Invalid email or password' });
      }
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
};
