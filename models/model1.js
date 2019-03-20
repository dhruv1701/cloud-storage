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
    password:{
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    shared:[]
});
var login=mongoose.model('login1', schema);
module.exports={
    login
};