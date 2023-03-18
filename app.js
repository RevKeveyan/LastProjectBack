const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express(); 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
}));



const {signUp, signIn} = require('./controllers/AuthController');
const { PORT,
        HOSTNAME,
        DB 
        } = require('./constants');



mongoose
    .connect(DB,{useNewUrlParser: true, useUnifiedTopology: true}) // avelacnenq {useNewUrlParser: true, useUnifiedTopology: true} 
        .then((res)=> console.log('Connetcted to DB'))
        .catch((error)=> console.log(error));

app.post('/sign_up', signUp);
app.post('/sign_in', signIn); // post enq anum vortev petqa menq email u password uxarkenq stugelu hamar

app.listen(PORT,HOSTNAME, function(err){
    if (err) console.log(err);
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});