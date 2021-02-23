var express = require('express');
var path = require('path');
var fs =require('fs');

var app = express();

//create users.json if not found
try{
  fs.readFileSync("users.json");
}catch(error){
  fs.writeFileSync("users.json","");
}

//reading the json file
var olddata =fs.readFileSync("users.json");
var users =[];
if (olddata !=""){
  var oldusers=JSON.parse(olddata);
  users=oldusers;
}
fs.writeFileSync("users.json",JSON.stringify(users,null,1));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//login get and post requests
app.get('/',function(req,res){
  res.render('login',{message: ""});
});

app.post('/',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if(username==''&password==''){
    res.render('login',{message:"Please enter a username and a password"});
    return;
  }else if(username==''){
    res.render('login',{message:"Please enter a username"});
    return;
  }else if(password==''){
    res.render('login',{message:"Please enter a password"});
    return;
  }
  var data =fs.readFileSync("users.json");
  users = JSON.parse(data);
  for (var i=0;i<users.length;i++){
    if (users[i].name == username && users[i].pass ==password){
      res.redirect('/home');
      return;
    }
    else if (users[i].name == username && users[i].pass !=password){
      res.render('login',{message:"The password is not correct"});
      return;
    }
  }
  res.render('login',{message:"The username does not exist, please create an account"});
})

//registration get and post requests

app.get('/registration',function(req,res){
  res.render('registration',{message: "",returnToLogin:""});
});

app.post('/register',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if(username==''&password==''){
    res.render('registration',{message:"Please enter a username and a password",returnToLogin:""});
    return;
  }else if(username==''){
    res.render('registration',{message:"Please enter a username",returnToLogin:""});
    return;
  }else if(password==''){
    res.render('registration',{message:"Please enter a password",returnToLogin:""});
    return;
  }  
  for (var i=0;i<users.length;i++){
    if (users[i].name == username){
      res.render('registration',{message:"This username already exists",returnToLogin:""});
      return;
    }
  }
  var data =fs.readFileSync("users.json");
  users = JSON.parse(data);
  var user ={name: username , pass: password};
  users.push(user);
  fs.writeFileSync("users.json",JSON.stringify(users,null,1));
  res.render('registration',{message:"Account created succesfully!",returnToLogin:"Click here to Return to Login"});
});

//get requests..

app.get('/home',function(req,res){
  res.render('home');
});

app.get('/dune',function(req,res){
  res.render('dune');
});

app.get('/fiction',function(req,res){
  res.render('fiction');
});

app.get('/flies',function(req,res){
  res.render('flies');
});

app.get('/grapes',function(req,res){
  res.render('grapes');
});

app.get('/leaves',function(req,res){
  res.render('leaves');
});

app.get('/mockingbird',function(req,res){
  res.render('mockingbird');
});

app.get('/novel',function(req,res){
  res.render('novel');
});

app.get('/poetry',function(req,res){
  res.render('poetry');
});

app.get('/readlist',function(req,res){
  res.render('readlist');
});

app.get('/searchresults',function(req,res){
  res.render('searchresults');
});

app.get('/sun',function(req,res){
  res.render('sun');
});

app.listen(3000);
console.log("server running on http://localhost:3000");