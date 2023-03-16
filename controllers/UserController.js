const { USERS } = require('../constants');

exports.getUsers = (req, res) =>{
    const data = JSON.stringify(USERS);
    res.end(data);
}