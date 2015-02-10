//SETTINGS
var port = 3000;
var express = require('express');
var app = express();

//GAME
var users = [];


//RETURN HELLO WORLD ON BASE
app.get('/', function (req, res) {
  res.send('Hello World!')
})

//SET PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));

//CREATE SERVER
var server = app.listen(port,function(){
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
});


var screen = null;
var screenId = null;

//COLOR FUNCTION
function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

//SOCKET IO
var io = require('socket.io')(server);
io.on('connection',function(socket){
   // console.log('something connected');
    
     //CONNECT SCREEN
    socket.on('connect screen',function(data){
      console.log("screen connected : "+data.screen);
      screen = socket;//set screen socket
      screenId = socket.id;
      
      
    
    });
    
    
    
    
    //CONNECT MOBILE USER
    socket.on('connect mobile',function(data){
        

        //CREATE USER
        var color = getRandomColor();
        var user = {};
        user.id = socket.id;
        user.username = data.user;
        user.color = color;
        users.push(user);//add to users
        
        screen.emit("add user",user);//send to screen
        socket.emit("on color",color)
        console.log("mobile user connected : "+data.user+" | "+socket.id);
    

     
    });
    
    
    
    function getUser(id){
      var foundUser = null;
      
      for(var i = 0;i<users.length;i++){
        var user = users[i];
     
        if (user.id == id) {
            foundUser = i;
        }
      }
      
      return foundUser;
    }
    
    
    
    //ON UPDATE
    socket.on('update',function(data){
      var userIndex = getUser(socket.id);
      if (userIndex!=null) {
        console.log("update : "+users[userIndex]);
        screen.emit("update",users[userIndex],data);//send to screen
      }
      
    })
   
    
    
    
    socket.on('disconnect', function(){
      var userIndex = getUser(socket.id);
      if (userIndex!=null) {
        screen.emit("remove user",users[userIndex]);
        console.log("remove user",users[userIndex].username);
        users.splice(userIndex,1);//remove user
      }

      
      if (socket.id == screenId) {
        console.log("screen disconnected : "+socket.id);
        io.sockets.emit("screen disconnected");//show error
      }
        
      
    });
})





/*
//var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//app.use(app.static(__dirname + '/public'));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});*/