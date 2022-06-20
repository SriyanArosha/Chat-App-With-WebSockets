const express = require('express');
const app = express();
const redis	= require('redis');
const client = redis.createClient();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

const corsOptions ={
    origin:'http://localhost:4000', 
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

server.listen((4000), () => {
    console.log("Server listening on port "+4000);
});

app.get('/',function (req,res){
    res.sendFile(__dirname + '/template.html');
});

io.on('connection',function (socket) {
    const subscribe = redis.createClient();
    subscribe.subscribe('pubsub');
    
    subscribe.on("message",function (channel, message) {
	socket.send(message);
    });
    socket.on('message',function (msg) {
	client.publish('pubsub',msg);
    });
    
    socket.on('disconnect',function () {
	subscribe.quit();
    });

});