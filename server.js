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
    var isRegister = false;
    for(var i = 0; i < hostRoom.length; i++){
        if(hostRoom[i] == uuid){
            isRegister = true;
            continue;
        }
    }
    for(var i = 0; i < player.length; i++){
        if(player[i] == uuid){
            isRegister = true;
            continue;
        }
    }
    if(!isRegister){
        console.log('New connection: ' + uuid);
    }
//console.log('New connection: ' + uuid);
    //from mobile
    socket.on('mobile_ready', function(data){
        //手機連線成功
        console.log('mobile ' + data.storeId + ' ready!');
        //socket.to(hostRoom[data.storeId]).emit('monitor-ready');
    });
    socket.on('moblie_countdown', function(data){
        //手機按下開始鍵，向大螢幕發送遊戲倒數
        if(uuid == player[data.storeId]){
        	console.log('mobile ' + data.storeId + ' start countdown!');
        	socket.to(hostRoom[data.storeId]).emit('monitor-countdown');
        }
    });
    // socket.on('moblie_start', function(data){
    //     //倒數結束，遊戲開始
    //     console.log('mobile ' + data.storeId + ' start gaming!');
    //     socket.to(hostRoom[data.storeId]).emit('monitor-start');
    // });
    socket.on('mobile-position', function(data){
        //推送座標
        //console.log('Get mobile ' + data.storeId + ' pos: ' + data.position);
        if(uuid == player[data.storeId]){
        	socket.to(hostRoom[data.storeId]).emit('monitor-position', {position: data.position});
        }
    });
    // socket.on('moblie_end', function(data){
    //     //遊戲結束
    //     console.log('mobile ' + data.storeId + ' end game!');
    //     socket.to(hostRoom[data.storeId]).emit('monitor-end');
    // });

    //from monitor
    socket.on('monitor-countdown', function(){
        //倒數
        let idx = FindRoom(uuid);
        console.log('monitor ' + idx + ' Countdown!');
        //socket.to(hostRoom[idx]).emit('mobile-countdown');
    });
    socket.on('monitor-start', function(){
        //倒數結束，開始遊戲
        let idx = FindRoom(uuid);
        console.log('monitor ' + idx + ' Game start!');
        socket.to(player[idx]).emit('mobile-start');
    });
    socket.on('monitor-score', function(data){
        //遊戲結束，顯示結果
        let idx = FindRoom(uuid);
        console.log('monitor ' + idx + ' Game end!' + data.score);
        socket.to(player[idx]).emit('monitor-score', {score:data.score});
        //判斷手機結果，發送結果給手機
        //GameResult(idx, data.scoreTW, data.scoreJP);
    });
    socket.on('monitor-return', function(){
        //返回主畫面，清空手機連線
        let idx = FindRoom(uuid);
        player[idx] = 'empty';
        console.log('Clear mobile ' + idx);
        socket.to(hostRoom[idx]).emit('mobile-return');
    });
    socket.on('monitor-clear', function(){
        //返回主畫面，清空手機連線
        let idx = FindRoom(uuid);
        player[idx] = 'empty';
        console.log('Clear mobile ' + idx);
    });
    function CreateRoom(idx, uid){
		if(hostRoom[idx] == 'empty'){
			hostRoom[idx] = uid;
			//socket.emit('monitor-connected', { result: true, message: ' '})
			console.log('Create room' + idx + ' success!');
		}
		else{
			socket.emit('monitor-connected', { result: false, message: 'Room exits!'})
			console.log('Room' + idx + ' exists!');

		}
	}
	function CheckHostRoom(idx, uid){
		if(hostRoom[idx] == 'empty'){
			console.log('Room' + idx + " not found.");
			socket.emit('mobile-connected', { result: false, message: 'Room is not exits.'});
		}
		else{
			console.log('Room' + idx + " is Ready.");
			CheckPlayerExist(idx, uid);
		}

	}
	function CheckPlayerExist(idx, uid){
		if(player[idx] == 'empty'){
			player[idx] = uid;
			console.log('player' + idx + " in!  id: " + player[idx]);
			socket.emit('mobile-connected', { result: true, message: ' '});
			socket.to(hostRoom[idx]).emit('playerIn');
		}
		else{
			console.log('player' + idx + " up to limit!");
			socket.emit('mobile-connected', { result: false, message: 'player up to limit.'});
		}
	}
	function FindRoom(id){
	let idx = -1;
	for (var i = 0; i < hostRoom.length; i++) {
			if(hostRoom[i] == id) {
				idx = i;
				continue;
			}
		}
		return idx;
}
});

