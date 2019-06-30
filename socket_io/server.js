var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});
// 設定連線 處理(Connection + socket.on + io.emit)
io.on('connection', function(socket){
    // console.log('a user connected');
    socket.on('chat message',(sendMseeage) => {
        // console.log('message: ', sendMseeage);
        io.emit('chat message',sendMseeage);
    });
    socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~
    });
});
  

http.listen(3000, function(){
  console.log('listening on *:3000');
});