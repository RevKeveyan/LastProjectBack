require("dotenv").config();
const express = require("express");
const multer = require('multer');
const cors = require("cors");
const fileMiddleware = require('./middleware/file'); 
const path = require('path');
const mongoose = require("mongoose");
const http = require('http');
const {Server} = require('socket.io');
const Message = require("./models/mesage.js");

const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(cors({ origin: "*" }));


io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    const message = new Message({
      to:msg.to._id,
      from:msg.from,
      message:msg.message,
      createdAt:msg.to.createdAt,
    });
    message.save();
    io.emit('message', msg);
  });
});

io.on('disconnect', () => {
  console.log('A user disconnected');
});

const {
  signUp,
  signIn,
  getUser,
  updateUser,
  changePassword,
  verifyUser,
  sendCode,
  getAllUsers,
} = require("./controllers/AuthController");
const {
  newPost,
  getUserPosts,
  deletePost,
  updatePost,
  getAllPosts,
  likePost
} = require("./controllers/PostController");

const {
  getMessages
} = require("./controllers/MessageController")

const { PORT, HOSTNAME, DB } = require("./constants");
const { createUpdateRequest } = require("./validations/updateUserValidation");
const { createUserSignUp } = require("./validations/signUpValudation");
const { createUserSignIn } = require("./validations/signInValidation");
const { authMiddleware } = require("./middleware/authMiddleware");
const { createPost, updatePostRequest } = require("./validations/postValidation");

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.use(express.static('public'));

//---user
app.post("/sign_up", createUserSignUp,fileMiddleware.single('image'), signUp);
app.get("/users", authMiddleware, getAllUsers);
app.post("/sign_in", createUserSignIn, signIn);
//---
app.get("/me", authMiddleware, getUser);
app.put("/update-user", createUpdateRequest, authMiddleware, updateUser);
app.put("/change-user-password", authMiddleware, changePassword);
//---
app.put("/verify/:data", verifyUser);
app.put("/send-verify-code", sendCode);
//---

//---posts
app.get("/user/posts", authMiddleware, getUserPosts);
app.post("/user/new-post", authMiddleware, createPost, fileMiddleware.single('image'), newPost);
app.put("/user/update-post", authMiddleware, createPost, fileMiddleware.single('image'), updatePost);
app.delete("/user/delete-post", authMiddleware, deletePost);
app.get("/feeds", authMiddleware, getAllPosts);
app.put("/post/like",authMiddleware, likePost);

//--messages
app.post('/chat-messages', authMiddleware, getMessages);

server.listen(PORT, HOSTNAME, function (err) {
  if (err) console.log(err);
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});


// const arr = ['like1','like2', 'like3'];

//  arr.splice(arr.indexOf('like2'), 1, "newLikes")

// console.log(arr);