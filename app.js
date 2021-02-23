var express = require('express');
var path = require('path');
var fs =require('fs');
var session = require('express-session');
var app = express();

//create users.json if not found
try{
  fs.readFileSync("users.json");
}catch(error){
  fs.writeFileSync("users.json","");
}

//reading the users json file
var olddata =fs.readFileSync("users.json");
var users =[];
if (olddata !=""){
  var oldusers=JSON.parse(olddata);
  users=oldusers;
}
fs.writeFileSync("users.json",JSON.stringify(users,null,1));


//create usersLists.json if not found
try{
  fs.readFileSync("usersLists.json");
}catch(error){
  fs.writeFileSync("usersLists.json","");
}

//reading the usersLists
var listsOldData =fs.readFileSync("usersLists.json");
var usersLists =[];
if (listsOldData !=""){
  var oldLists=JSON.parse(listsOldData);
  usersLists=oldLists;
}
fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//Session handling

app.use(session({
  'secret': 'thisIsSecret'
}))


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
      req.session.username=username;
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

app.get('/searchresults',function(req,res){
  res.render('searchresults',{flies:"hidden",grapes:"hidden",leaves:"hidden",sun:"hidden",dune:"hidden",mockingbird:"hidden",message:"Book not found"});
});


//Search
app.post('/search',function(req,res){
  let text=req.body.Search.toLowerCase();

  let fliesText="hidden";
  let grapesText="hidden";
  let leavesText="hidden";
  let sunText="hidden";
  let duneText="hidden";
  let mockingbirdText="hidden";
  let messageText="Book not found";
    
  if("lord of the flies".includes(text)){
    fliesText="";
    messageText="";
  }
  if("the grapes of wrath".includes(text)){
    grapesText="";
    messageText="";
  }
  if("leaves of grass".includes(text)){
    leavesText="";
    messageText="";
  }
  if("the sun and her flowers".includes(text)){
    sunText="";
    messageText="";
  }
  if("dune".includes(text)){
    duneText="";
    messageText="";
  }
  if("to kill a mockingbird".includes(text)){
    mockingbirdText="";
    messageText="";
  }
  res.render('searchresults',{flies:fliesText,grapes:grapesText,leaves:leavesText,sun:sunText,dune:duneText,mockingbird:mockingbirdText,message:messageText});
});

//get requests..


app.get('/dune',function(req,res){
  res.render('dune',{message:""});
});

app.post('/addDune',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("Dune")){
        res.render('dune',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("Dune");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('dune',{message:"Book added to your want to read list!"});

      return;
    }
  }

  usersLists.push({username:user,movies:["Dune"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('dune',{message:"Book added to your want to read list!"});

});


//Flies 
app.get('/flies',function(req,res){
  res.render('flies',{message:""});
});

app.post('/addFlies',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("Flies")){
        res.render('flies',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("Flies");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('flies',{message:"Book added to your want to read list!"});
      return;
    }
  }

  usersLists.push({username:user,movies:["Flies"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('flies',{message:"Book added to your want to read list!"});

});


//Grapes
app.get('/grapes',function(req,res){
  res.render('grapes',{message:""});
});

app.post('/addGrapes',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("Grapes")){
        res.render('grapes',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("Grapes");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('grapes',{message:"Book added to your want to read list!"});
      return;
    }
  }

  usersLists.push({username:user,movies:["Grapes"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('grapes',{message:"Book added to your want to read list!"});

});


//Leaves
app.get('/leaves',function(req,res){
  res.render('leaves',{message:""});
});

app.post('/addLeaves',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("Leaves")){
        res.render('leaves',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("Leaves");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('leaves',{message:"Book added to your want to read list!"});
      return;
    }
  }

  usersLists.push({username:user,movies:["Leaves"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('leaves',{message:"Book added to your want to read list!"});

});


//MockingBird
app.get('/mockingbird',function(req,res){
  res.render('mockingbird',{message:""});
});

app.post('/addMockingBird',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("MockingBird")){
        res.render('mockingbird',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("MockingBird");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('mockingbird',{message:"Book added to your want to read list!"});

      return;
    }
  }

  usersLists.push({username:user,movies:["MockingBird"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('mockingbird',{message:"Book added to your want to read list!"});

});


//Sun
app.get('/sun',function(req,res){
  res.render('sun',{message:""});
});

app.post('/addSun',function(req,res){
  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  
  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      if (usersLists[i].movies.includes("Sun")){
        res.render('sun',{message:"Book Already in your want to read list"});
        return;
      }
      usersLists[i].movies.push("Sun");
      fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
      res.render('sun',{message:"Book added to your want to read list!"});
      return;
    }
  }

  usersLists.push({username:user,movies:["Sun"]})
  fs.writeFileSync("usersLists.json",JSON.stringify(usersLists,null,1));
  res.render('sun',{message:"Book added to your want to read list!"});

});


//readList

app.get('/readlist',function(req,res){

  var user=req.session.username;
  var data =fs.readFileSync("usersLists.json");
  usersLists = JSON.parse(data);
  userMovies=[];

  for (var i=0;i<usersLists.length;i++){
    if (usersLists[i].username == user){
      userMovies=usersLists[i].movies;
    }
  }

  let fliesText="hidden";
  let grapesText="hidden";
  let leavesText="hidden";
  let sunText="hidden";
  let duneText="hidden";
  let mockingbirdText="hidden";
  
  if(userMovies.includes("Flies")){
    fliesText="";
  }
  if(userMovies.includes("Dune")){
    duneText="";
  }
  if(userMovies.includes("Grapes")){
    grapesText="";
  }
  if(userMovies.includes("Leaves")){
    leavesText="";
  }
  if(userMovies.includes("Sun")){
    sunText="";
  }
  if(userMovies.includes("MockingBird")){
    mockingbirdText="";
  }
  res.render('readlist',{flies:fliesText,grapes:grapesText,leaves:leavesText,sun:sunText,dune:duneText,mockingbird:mockingbirdText});

});


app.get('/home',function(req,res){
  res.render('home');
});


app.get('/fiction',function(req,res){
  res.render('fiction');
});

app.get('/novel',function(req,res){
  res.render('novel');
});

app.get('/poetry',function(req,res){
  res.render('poetry');
});

if(process.env.PORT){
	app.listen(process.env.PORT,function(){console.log("Server started")});
}
else{
app.listen(3000,function(){console.log("server running on http://localhost:3000")});
}