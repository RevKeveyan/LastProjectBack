const Message = require("../models/mesage.js");

exports.getMessages = (req,res) => {
  const {from} = req.body;
  const {to} = req.body;
    const messages = Message.find({
        $or: [
          { from:from , to:to },
          { from:to, to:from }
        ]
      })
      console.log(messages);
      messages
      .then((result)=>{
        res.status(200).json({result})
      }).catch((err)=>{
        res.status(400).json({messages:'Error'});
      })
}