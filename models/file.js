const mongoose=require('mongoose');
const validator=require('validator');

var schema=mongoose.Schema({
    file_name :{
        type :String,
        required : true,
        unique :true,
        trim : true
    },
    sharedby :[{
        type :String
    }]
});
var file=mongoose.model('file', schema);
module.exports={
    file
};