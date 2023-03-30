const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ 

    userId:{
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
    createdAt:{
        type:Number,
        require:true,
    },
    updatedAt:{
        type:Number,
        require:true,
        default:null,
    }
});

module.exports = mongoose.model('Post', userSchema);
