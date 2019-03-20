const express=require("express");
const mongoose=require("mongoose");
const session = require('express-session');
const bodyparser=require('body-parser');
const hbs=require("hbs");
const validator=require('validator');
const socketIO=require('socket.io');
const http=require("http");
const synch=require("synchronise");
const multer=require("multer");

const {login}=require("./models/model1.js");
const {online}=require("./models/online.js");
const {file}=require("./models/file.js");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

var app=express();
app.set("view engine","hbs");
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname));

mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/login");

var server=http.createServer(app);
var io=socketIO(server);

var sess;

server.listen(8080,function(){
    console.log("server started on port 8080");
});

app.get("/",function(req,res){
    sess=req.session;
    //console.log(sess.email);
    if(sess.email)
    {     
        res.render("homepage.hbs",{name:sess.email});
    }
    else
    {
        res.redirect("./public/index.html");
    }
});

app.get("/homepage",function(req,res){
    sess=req.session;
    if(sess.email)
    {     
        res.render("homepage.hbs",{name : sess.email});
    }
    else
    {
        res.redirect("./public/index.html");
    }
});

app.post("/signin",function(req,res){
    var user=new login({username:req.body.email,password:req.body.password});
    user.save(function(error){
        if(error)
        {
            io.emit("invalid-email-pass");            
        }
        else
        {
            res.end("succ-signup");
        }
    });
});

app.post("/login",function(req,res){
    login.findOne({username:req.body.email,password:req.body.password},function(err,result) {
        if (err) { /* handle err */
            io.emit("please-check-your-connection");
        }
        if (result) {
            // we have a result
            sess=req.session;
            sess.email=req.body.email;
            var newonlineuser=new  online({username:req.body.email});
            newonlineuser.save(function(error){
                if(error)
                {
                    io.emit("user-alredy-online");
                }
            });
            console.log("accepted");
            res.end("accepted");
        } else {
            // we don't
            io.emit("invalid-email-pass");
            res.redirect("/");
        }
    });
});

app.post("/file-name-share",function(req,res){
    
    login.findOne({username:sess.email},function(err,result){
        if(err)
        {
            console.log("kajdsh");
            io.emit("error-sharing");
        }
        else
        {
            var flag=0;
            var length=result.shared.length;
            for(var i=0;i<length;i++)
            {
                if(result.shared[i]==req.body.filename)
                {
                    flag=1;
                    break;
                }
            }
            if(flag==0)
            {
                login.findOneAndUpdate({username:sess.email},{$push :{shared:req.body.filename}},function(err,result){
                    if(err)
                    {
                        console.log("kajdsh");
                        io.emit("error-sharing");
                    }
                });
            }
        }
    });
    
    file.findOne({file_name:req.body.filename},function(err,result){
        if(err)
        {
            console.log("kajdsh");
            io.emit("error-sharing");
        }
        if(result)
        {
            var flag=0;
            var length=result.sharedby.length;
            for(var i=0;i<length;i++)
            {
                if(result.sharedby[i]==sess.email)
                {
                    flag=1;
                    break;
                }
            }
            if(flag==0)
            {
                file.findOneAndUpdate({file_name:req.body.filename},{$push :{sharedby:sess.email}},function(err,result){
                    if(err)
                    {
                        console.log("kajdsh");
                        io.emit("error-sharing");
                    }
                    else
                    {
                        res.end("succ-share");
                    }
                });
            }
            console.log("askdh");
            io.emit("error-sharing");
        }
        else
        {
            var newfile=new file();
            newfile.file_name=req.body.filename;
            newfile.sharedby.push(sess.email);
            newfile.save(function(error){
                if(error)
                {
                    io.emit("error-sharing");            
                }
                else
                {
                    res.end("succ-share");
                }
           });
        }
    });  
});

app.post("/search-file",function(req,res){
    var people;
    var onlinear=[];
    online.find(function(err,result){
        if(err)
        {
            console.log("hii");
            io.emit("error-searching");
        }
        else
        {
            people=result;
            var flag=0,flag2=0;
            var len=people.length;
            console.log("hii1");
            if(len==0)
            {
                console.log("hii12");
                io.emit("error-seacrhing")
            }
            else{
                console.log("hii132");
                for(var i=0;i<len;i++)
                {
                    file.findOne({file_name: req.body.filename, sharedby: people[i].username},function(err,result){
                        if(err)
                        {
                            console.log("hii1313");
                            io.emit("error-seacrhing");
                        }
                        if(result)
                        {
                            flag=1;
                            var obj={
                                req_file: req.body.filename,
                                provider : people[flag2].username
                            };
                           
                            onlinear.push(obj);
                        }
                        if(flag2==len-1 && flag ==1)
                        {
                            console.log("hii123124");
                            res.end("succ-search",onlinear);
                             io.emit("first-five",{
                                 arr : onlinear
                             });                           
                        }
                        flag2++;
                        
                    });
                }
            }
        }
    });
});


app.post("/request",function(req,res){
    var obj={
        filerequested:req.body.filename,
        requestedby:sess.email
    }
    online.findOneAndUpdate({username:sess.email},{$push :{request : obj}},function(err,result){
        if(err)
        {
            io.emit("unsucc-request");
        }
        else
        {
            res.end("succ-request");
        }
    }); 
});

app.post("/logout",function(req,res){
    req.session.destroy();
    online.findOneAndDelete({username:sess.email},function(err,result){
        if(err)
        {
            res.send("unsucc-logout");
        }
        else
        {
            res.end("succ-logout");
            sess=null;
        }
    }) 
});

app.post('/upload', upload.single('file-to-upload'), (req, res) => {
    res.redirect('/');
  });