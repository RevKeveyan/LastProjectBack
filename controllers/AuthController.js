const { USERS } = require('../constants');
const models = require('../models/users');
const Users = models.Users; // signUp

exports.signUp = (req, res) => {
    const data = req.body;
    Users.findOne({ email: data.email }) // gtnum enq user tvyal mailov
      .then((user) => { // 
        if (user) { // ete usery ka 
          return res.status(400).json({ message: 'Email already exists' }); // veradarcnum enq massage 
        } else { // ete che 
          const user = new Users(data); // nor mer datat dave enq anum databaseum
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
    const user = await Users.findOne({ email}).exec(); // gtnum enq  {email:email} nuynna inch vor {email}
      if (!user) { // ete chaka apa 
            return res.status(401).json({ message: 'Invalid email or password' });
        }
      if (user.password !== password) { // if passwords don't match, return error response
          return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.status(200).json(user); 
   
};