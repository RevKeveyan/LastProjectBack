const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id:{
        type:String,
        require:true,
    },
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
});

module.exports = mongoose.model('Users', postSchema);
// exports.models = Users: mongoose.model('Users', postSchema),
    // User: mongoose.model('User', getSchema),
