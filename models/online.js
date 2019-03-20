const mongoose=require('mongoose');
const validator=require('validator');

var schema=mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        validate: [validator.isEmail,'Invalid email']
    },
    request:[{
        filerequested:String,
        requestedby:String
    }]
});
var online=mongoose.model('online', schema);
module.exports={
    online
};