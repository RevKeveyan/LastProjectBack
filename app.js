require('dotenv').config();
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

const {signUp, 
        signIn, 
        getUser, 
        updateUser, 
        changePassword,
        verifyUser,
        sendCode,
    } = require('./controllers/AuthController');
const {
        newPost, 
        getPosts,
        deletePost,
        updatePost,
        } = require('./controllers/PostController');

const { PORT,
        HOSTNAME,
        DB 
        } = require('./constants');
const { createUpdateRequest } = require('./validations/updateUserValidation');
const { createUserSignUp } = require('./validations/signUpValudation');
const { createUserSignIn } = require('./validations/signInValidation');
const { authMiddleware } = require('./middleware/authMiddleware');
const { createPost } = require('./validations/postValidation');

mongoose
    .connect(DB,{useNewUrlParser: true, useUnifiedTopology: true})
        .then((res)=> console.log('Connetcted to DB'))
        .catch((error)=> console.log(error));
//---user
app.post('/sign_up', createUserSignUp, signUp);
app.post('/sign_in', createUserSignIn,signIn);
//---
app.get('/me',authMiddleware, getUser);
app.put('/update-user', createUpdateRequest, authMiddleware, updateUser);
app.put('/change-user-password',authMiddleware, changePassword);
//---
app.put('/verify/:data' , verifyUser);
app.put('/send-verify-code', sendCode);
//---

//---posts
app.get('/user/posts',authMiddleware, getPosts);
app.post('/user/new-post',authMiddleware,createPost, newPost);
app.put('/user/update-post',authMiddleware,createPost, updatePost);
app.delete('/user/delete-post',authMiddleware, deletePost);


app.listen(PORT,HOSTNAME, function(err){
    if (err) console.log(err);
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});