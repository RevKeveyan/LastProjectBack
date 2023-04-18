const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({ 

    userId:{
        type:String,
        require:true,
    },
    userName:{
        type:String,
        require:true,
    },
    userLastName:{
        type:String,
        require:true,
    },
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    imageUrl: { 
        type: String,
        default:null,
    },
    createdAt:{
        type:Number,
        require:true,
    },
    updatedAt:{
        type:Number,
        require:true,
        default:null,
    },
    userImg:{
        type: String,
        default:null,
    },
    likes: [ String ]
});

module.exports = mongoose.model('Post', postSchema);
