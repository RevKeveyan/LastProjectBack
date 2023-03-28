const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ 

    firstName:{
        type:String,
        require:true,
    },
    age:{
        type:Number,
        required:true
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
    confirmationCode:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        require:true,
        default:false,
    },
    verifyCode:{
        type:Number,
        require:true,
        default:null,
    },
});

module.exports = mongoose.model('User', userSchema);
