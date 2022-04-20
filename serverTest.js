var port = 7777;
var io = require('socket.io').listen(port);
console.log('websocket listen on ' + port);
var http = require('http');
var url = require('url');
var util = require('util');

var hostRoom = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];
var player = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];

io.sockets.on('connection', function(socket){

    var client = socket.handshake.address;
    var uuid = socket.id;

    //register
    socket.on('monitor-register', function(data){
        let idx = data.storeId;
        CreateRoom(idx, uuid);
    });

    socket.on('mobile-register', function(data){
        let idx = data.storeId;
        console.log('uuid: ' + uuid + '  store: ' + idx);
        CheckHostRoom(idx, uuid);
    });
    //register check
    // var isRegister = false;
    // for(var i = 0; i < hostRoom.length; i++){
    //     if(hostRoom[i] == uuid){
    //         isRegister = true;
    //         continue;
    //     }
    // }
    // for(var i = 0; i < player.length; i++){
    //     if(player[i] == uuid){
    //         isRegister = true;
    //         continue;
    //     }
    // }
    // if(!isRegister){
    //     console.log('New connection: ' + uuid);
    // }
console.log('New connection: ' + uuid);
    //from mobile
    socket.on('mobile-ready', function(data){
        //手機按下開始鍵，向大螢幕發送遊戲倒數
        console.log('monitor ' + data.storeId + ' start countdown!');
        //socket.to(hostRoom[data.storeId]).emit('monitor-countdown');
    });
    socket.on('mobile-position', function(data){
        //推送座標
        console.log('Get mobile ' + data.storeId + ' pos: ' + data.position);
        socket.to(hostRoom[data.storeId]).emit('monitor-position', {position: data.position});
    });

    //from monitor
    socket.on('monitor-start', function(){
        //倒數結束，開始遊戲
        let idx = FindRoom(uuid);
        console.log('monitor ' + idx + ' Game start!');
        socket.to(player[idx]).emit('mobile-start');
    });
    socket.on('monitor-end', function(data){
        //遊戲結束，顯示結果
        let idx = FindRoom(uuid);
        console.log('monitor ' + idx + ' Game end!');
        //判斷手機結果，發送結果給手機
        GameResult(idx, data.scoreTW, data.scoreJP);
    });
    socket.on('monitor-return', function(){
        //返回主畫面，清空手機連線
        let idx = FindRoom(uuid);
        player[idx] = 'empty';
        console.log('Clear mobile ' + idx);
    });
});