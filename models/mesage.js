const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({ 
    from:{
        type:String
    },
    to:{
        type:String
    },
    message:{
        type:String
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
});

module.exports = mongoose.model('Message', messageSchema);
