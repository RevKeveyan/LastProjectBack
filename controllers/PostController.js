const Post = require("../models/post");
const { secret } = require("../config/config");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.getUserPosts = (req, res) => {
  const userId = req.user._id;
  const posts = Post.find({ userId });
  posts
    .then((result) => {
      const potById = result.filter(userId);
      res.status(200).json({ potById });
    })
    .catch((err) => {
      res.status(400).json({ message: "Posts not found" });
    });
};
exports.getAllPosts = (req, res) => {
  const posts = Post.find({});
  console.log(posts);
  posts
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(400).json({ message: "Posts not found" });
    });
};

exports.newPost = (req, res) => {
  const imageFile = req.file;
  const path = imageFile.path.slice(6);
  const { createdAt } = req.body;
  const userId = req.user._id;
  const userImg = req.user._doc.avatarUrl;
  const userName = req.user._doc.firstName;
  const userLastName = req.user._doc.lastName;
  const { title } = req.body;
  const { description } = req.body;
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid data", errors });
  }

  const post = new Post({
    title,
    description,
    userId,
    userName,
    userLastName,
    createdAt,
    userImg,
    imageUrl: path,
  });
  post
    .save()
    .then((result) => {
      return res.status(201).json({ post, message: "Your post created" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Something goes wrong" });
    });
};

exports.updatePost = (req, res) => {
  const newFileName = req.file;
  const newPath = newFileName.path.slice(6);
  const { updatedAt } = req.body;
  const { id } = req.body;
  const { title } = req.body;
  const { description } = req.body;
  Post.findOne({ _id: id })
    .then((post) => {
      fs.unlink(`./public/${post.imageUrl}`, (err) => console.log(err));
      post.title = title;
      post.description = description;
      post.updatedAt = updatedAt;
      post.imageUrl = newPath;
      post
        .save()
        .then((updatedPost) => {
          res.status(200).json({ updatedPost });
        })
        .catch((err) => {
          res.status(400).json({ message: "Something goes wrong" });
        });
    })
    .catch((err) => {
      res.status(400).json({ message: "Something goes wrong" });
    });
};

exports.deletePost = async (req, res) => {
  const id = req.headers.id;
  const { imageurl } = req.headers;
  Post.deleteOne({ _id: id })
    .then((deletedPost) => {
      fs.unlink(`./public/${imageurl}`, (err) => console.log(err));
      res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Failed to delete post" });
    });
};

exports.likePost = (req, res) => {
  const {postId} = req.body;
  const userId = req.user._doc._id;
  Post.findOne({ _id:postId })
    .then((post) => {
      const likes = post.likes;
      if (likes.includes(userId)) {
        newLikes = likes.filter((elem) => elem !== userId);
        post.likes = newLikes;
        post
          .save()
          .then((result) => {
           return res.status(200).json({ likes: newLikes });
          })
          .catch((err) => {
            return res.status(400).json({ message:"Something goes wrong 1 " });
          });
      }else{
         likes.push(userId);
         post.likes = likes;
         post
         .save()
         .then((result) => {
          return res.status(200).json({ likes });
         })
         .catch((err) => {
          return res.status(400).json({ message:"Something goes wrong 2" });
         });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message:"Post not found" });
    });
};
