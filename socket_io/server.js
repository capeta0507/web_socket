var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var moment = require('moment');

// MongoDB Client + dbo + ObjectId (變數設定)
var MongoClient = require('mongodb').MongoClient;
var dbo = require('mongodb').Db
var ObjectId = require('mongodb').ObjectId;
// mLab Mongodb 連線 要有 { useNewUrlParser: true } 選項
var url = 'mongodb://davidtpe:DavidTPE4255@ds345587.mlab.com:45587/chat-room';
MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) console.log(err);
    dbo = db.db("chat-room");  // 指向 chat-room 資料庫
    console.log('MongoDB 連線 chat-room...成功');
});

app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});
// 設定連線 處理(Connection + socket.on + io.emit)
io.on('connection', function(socket){
    // console.log('a user connected');
    socket.on('chat message',(sendMessage) => {
        // console.log('收到 : ', sendMessage);
        sendMessage.timestamp = moment().valueOf();  //在 Server端 加入時間撮記
        io.emit('chat message',sendMessage);

        // 寫入 mongodb (mLab)(database:chat-room)(collection:chat-room)
        // 準備新的訊息
        let newvalues = {   name: sendMessage.getName, 
                            message: sendMessage.getMes,
                            timestamp:sendMessage.timestamp };
        dbo.collection("real-time-chat").insertOne(newvalues, function(err, result){
            console.log('寫入 MongoDB ...' + sendMessage.getName + ":" + sendMessage.getMes)
            // console.log(result.ops);
        });
});
    socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~
    });
});
  
http.listen(3000, function(){
  console.log('listening on *:3000');
});