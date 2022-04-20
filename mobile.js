var myElement = document.getElementById('dot');
var hammertime = new Hammer(myElement);
var isConnect = false;
var isRegist = false;
var state = 'connect';
var socket = io('http://192.168.0.162:7777', {secure: true});
    socket.on('connect', function(){
        console.log('connect to server');
        isConnect = true;
        mobileStatus = 'mobile_ready';
        $("#content_test").html("Ready");
        $("#content_test").css("color", "#3c763b");
        socket.emit('mobile-register', {storeId:1});
    });
    socket.on('mobile-connected', function(data){
    console.log('Connect result: ' + data.result + ' Msg: ' + data.message);
    if(data.result){
        console.log('mobile-register');
        isRegist = true;
        }
    else{
        console.log('Connect fail please restart this page.');
    }
    });
    socket.on('mobile-start', function(){
        console.log('mobile start playing');
        mobileStatus = 'mobile-start';
    });
    socket.on('monitor-score', function(data){
        $('#canvas_play').hide();
        $('#canvas_result').show();
        $('#bg2').hide();
        $('#bg3').show();
        $('#bottom1').hide();
        $('#bottom2').show();
        $('body').css('background-color', '#bfd858');
        mobileStatus = 'moblie_end';
        console.log('game result: ' + data.score);
        if(data.score >= 100){
            $('#label_score').html('100');
            $('#label_score').css('margin-left', '40vw');
        }
        else if(data.score > 0){
            $('#label_score').html(data.score.toString());
            $('#label_score').css('margin-left', '45vw');
        }
        else if(data.score == 0){
            $('#label_score').html('0');
            $('#label_score').css('margin-left', '50vw');
        }
        if(data.score < 60){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score1.png');
        }
        else if(data.score >= 60 && data.score <= 80){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score2.png');
        }
        else if(data.score > 80){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score3.png');
        }
        $('#c_game').hide();
        $('#c_result').show();
      });

var clientId = '';
clientId = uuid(22, 16);
var isConnect = false;
var mobileStatus = 'connecting';
var isPlaying = false;
var isEnding = false;

$('#btn_start').click((function() {
    if(isRegist){
        $('#bg1').hide();
        $('#bg2').show();
        mobileStatus = 'countdown';
        socket.emit('moblie_countdown',{storeId:1});
        console.log('moblie_countdown');
        SetText("Countdown", "#3c763b");
        //status:countdown
        $('#canvas_start').hide();
        $('#canvas_play').show();
    }
    else{
        alert('其他人正在遊玩，請排隊');
    }
}));

var isDragging = false;
const vw = document.documentElement.clientWidth;
console.log(vw);
const dragMid = vw/2;
const dragLeft = dragMid - (vw*0.1);
const dragRight = dragMid + (vw*0.07);
hammertime.on('pan', function(ev) {
    var elem = ev.target;
    //currentDrag = ev.target.getAttribute("id");
    // DRAG STARTED
    if (!isDragging) {
        isDragging = true;
        lastPosX = elem.offsetLeft;
        lastPosY = elem.offsetTop;
        //console.log("dragging");
    }

    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;

    if (posX <= dragLeft) {
        //console.log('left');
        socket.emit('mobile-position',{storeId:1, position:'left'});
        posX = dragLeft;
    }
    else if(posX >= dragRight) {
        //console.log('right');
        socket.emit('mobile-position',{storeId:1, position:'right'});
        posX = dragRight;
    }
    elem.style.marginLeft = posX + "px";
    //elem.style.top = posY + "px";

    // DRAG ENDED
    if (ev.isFinal) {
        isDragging = false;
        //elem.style.left = "";
        //elem.style.top = "";
        //console.log("drop");
        elem.style.marginLeft =  "49vw";
        socket.emit('mobile-position',{storeId:1, position:'middle'});
    }
});

$('#btn_instruct').click((function() {
    $('#canvas_start').hide();
    $('#canvas_instruct').show();
}));
$('#img_instructX').click((function() {
    $('#canvas_start').show();
    $('#canvas_instruct').hide();
}));

function SendPos(){
    var dotPosX = document.getElementById("dot").style.marginLeft;
    if(dotPosX == '49vw'){
        console.log('middle');
    }
    else if(dotPosX > 522.5){
        console.log('right');
    }
    else if(dotPosX <= 522.5){
        console.log('left');
    }
    socket.emit('mobile-position', {positionX:1, positionY:1});
}

function SetText(_text, _color){
    $("#content_test").html(_text);
    $("#content_test").css("color", _color);
}

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}