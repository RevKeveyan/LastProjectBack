const Post = require('../models/post');
const {secret} = require('../config/config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.getPosts = (req, res) => {
    const token = req.headers.authentication;
    const decodedData = jwt.verify(token, secret);
    const userId = decodedData._doc._id;
    const posts = Post.find({userId});
    posts
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch((err)=>{
        res.status(400).json({message:"Posts not found"});
    });
}

exports.newPost = (req, res) => {
    const createdAt = Date.now();
    const token = req.headers.authentication;
    const decodedData = jwt.verify(token, secret);
    const userId = decodedData._doc._id;
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid data', errors })
    }
    const post = new Post({...data, userId, createdAt});

    post
        .save()
        .then((result)=>{
        return res.status(201).json({post, message: "Your post created"});
    })
        .catch((err)=>{
        return res.status(400).json({message: "Something goes wrong"});
    });
}

exports.updatePost = (req, res) => {
    const {id} = req.body;
    const {title} = req.body;
    const {description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid data', errors })
    }
    Post.findOne({_id:id})
    .then((post)=>{
        post.title = title;
        post.description = description; 
        post.updatedAt = Date.now();
        post.save().then((updatedPost)=>{
            res.status(200).json({updatedPost});
        }).catch((err)=>{
            res.status(400).json({message:"Something goes wrong"});
        })
    }).catch((err)=>{
        res.status(400).json({message:"Something goes wrong"});
    })
}

exports.deletePost = async (req, res) => {
    const id = req.headers.id;
    Post.deleteOne({ _id: id })
      .then((deletedPost) => {
        res.status(200).json({ message: 'Post deleted successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({ message: 'Failed to delete post' });
      });
  };