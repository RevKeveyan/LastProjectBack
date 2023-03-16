const express = require('express');
const app = express(); 

const {getUsers} = require('./controllers/UserController');
const { PORT,
    HOSTNAME 
    } = require('./constants');

app.get('/sing_up', getUsers);

app.listen(PORT,HOSTNAME, function(err){
    if (err) console.log(err);
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});