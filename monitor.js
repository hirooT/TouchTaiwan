var isConnect = false;
var state = 'connect';
var myElement = document.getElementById('character');
var hammertime = new Hammer(myElement);
var score = 0;
var hp=3;
var rotateStatus = 0;
var posStatus = 'middle';
var x = 0;
var SI_blackCloud = setInterval(blackCloud, 4000);
var SI_blackCloud2;
var SI_whiteCloud = setInterval(whiteCloud, 2500);
var SI_raining;
var SI_detectRin;

var audio_bgm = document.getElementById("audio-bgm");
var audio_stone = document.getElementById("audio-stone");
var audio_water = document.getElementById("audio-water");

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context;
context = new window.AudioContext;

setTimeout(() => {
        SI_blackCloud2 = setInterval(blackCloud2, 4000);
    }, 2000);
$('#btn_start').click((function() {
    audio_stone.volume = 0.1;
    audio_water.play();
    audio_stone.play();
    audio_bgm.play();
    $('#bg1').hide();
    $('#bg2').show();
    mobileStatus = 'countdown';
    console.log('moblie_countdown');
    SetText("Countdown", "#3c763b");
    //status:countdown
    $('#canvas_start').hide();
    $('#canvas_play').show();

    console.log('monitor countdown');
    step_countdown();

}));

$('#btn_instruct').click((function() {
    $('#canvas_start').hide();
    $('#canvas_instruct').show();
}));
$('#img_instructX').click((function() {
    $('#canvas_start').show();
    $('#canvas_instruct').hide();
}));

$('#barWater').css('width', '12vw');

function SetText(_text, _color){
    $("#content_test").html(_text);
    $("#content_test").css("color", _color);
}

//rain
function rain(){
    const rain = document.createElement('img');
    var raintype = Math.floor(Math.random() * 5);
    rain.setAttribute('class', 'rain');
    rain.setAttribute('src','assets/texture/monitor_rainDrop.png');
    rain.classList.add('rain')
    switch(raintype){
        case 0:
            rain.setAttribute('rType', '0');
            rain.style.width = '5%';
            break;
        case 1:
            rain.setAttribute('rType', '1');
            rain.style.width = '3%';
            break;  
        case 2:
            rain.setAttribute('rType', '2');
            rain.style.width = '3%';
            break;
        case 3:
            rain.setAttribute('src','assets/texture/stone1.png');
            rain.setAttribute('rType', '3');
            rain.style.width = '9%';
            break;
        case 4:
            rain.setAttribute('src','assets/texture/stone2.png');
            rain.setAttribute('rType', '4');
            rain.style.width = '9%';
            break;
    }
    rain.style.left = Math.random() * 100 + 'vw'

    rain.style.amationDuration = Math.random() * 2 + 3 + 's'

    rain.innerHTML = '&#128167;'
    var rainBox = document.getElementById('rainBox');
    rainBox.appendChild(rain);

    setTimeout(() => {
        rain.remove()
    }, 5000);
}
function blackCloud(){
    const cloud = document.createElement('img');
    cloud.setAttribute('class', 'cloud1');
    //cloud.classList.add('cloud1');
    cloud.setAttribute('src','assets/texture/cloud1.png');
    let val = (Math.random() * -5) -3;
    cloud.style.top = val + 'vw';

    cloud.style.amationDuration = Math.random() * 2 + 3 + 's'
    var cloudBox = document.getElementById('cloud1Box');
    cloudBox.appendChild(cloud);

    setTimeout(() => {
        cloud.remove()
    }, 20000);
}
function blackCloud2(){
    const cloud = document.createElement('img');
    cloud.setAttribute('class', 'cloud1');
    //cloud.classList.add('cloud1');
    cloud.setAttribute('src','assets/texture/cloud2.png');
    let val = (Math.random() * -5) -3;
    cloud.style.top = val + 'vw';

    cloud.style.amationDuration = Math.random() * 2 + 3 + 's'
    var cloudBox = document.getElementById('cloud2Box');
    cloudBox.appendChild(cloud);

    setTimeout(() => {
        cloud.remove()
    }, 20000);
}
function whiteCloud(){
    const cloud = document.createElement('img');
    cloud.setAttribute('class', 'cloud1');
    //cloud.classList.add('cloud1');
    cloud.setAttribute('src','assets/texture/cloud3.png');
    let val = (Math.random() * 20) + 15;
    cloud.style.top = val + 'vw';
    let Cscale = Math.floor((Math.random() * 10)) +30;
    cloud.style.width = Cscale + '%';
    cloud.style.amationDuration = Math.random() * 2 + 3 + 's'
    var cloudBox = document.getElementById('cloud3Box');
    cloudBox.appendChild(cloud);

    setTimeout(() => {
        cloud.remove();
    }, 20000);
}
function detectRain(){
    if(mobileStatus == 'monitor_start'){
        //collider check
        var rainCount = document.getElementById("rainBox").childElementCount;
        //console.log(rainCount);
        if(rainCount > 0){
            for(var i = 0; i < rainCount; i++){
            var raindrop = document.getElementById("rainBox").children[i].getBoundingClientRect();
            var rdX = (raindrop.left) + (raindrop.width/2);
            var rdY = raindrop.top;
            var characterX = (myElement.getBoundingClientRect().left) + ($(window).width()*0.61/2);
            var characterY = myElement.getBoundingClientRect().top;
            var rdDeltaX = Math.abs(rdX - characterX);
            var rdDeltaY = Math.abs(rdY - characterY);
            var rainType = document.getElementById("rainBox").children[i].getAttribute('rType');
            //console.log('rdDeltaX ' + rdDeltaX);
            audio_stone.volume = 1;
            if(rdDeltaX <= 100 && rdDeltaY <= 15){
                //console.log('catch');
                if(rainType == 0){
                    $('#scroeBox').append('<img class="scoreBoxAnimate" src="assets/texture/monitor_score10.png">');
                    score += 10;
                    audio_water.currentTime = 0;
                    audio_water.muted = false;
                    audio_water.play();
                }
                else if(rainType == 1){
                    $('#scroeBox').append('<img class="scoreBoxAnimate" src="assets/texture/monitor_score5.png">');
                    score += 5;
                    audio_water.currentTime = 0;
                    audio_water.muted = false;
                    audio_water.play();
                }
                else if(rainType == 2){
                    $('#scroeBox').append('<img class="scoreBoxAnimate" src="assets/texture/monitor_score1.png">');
                    score += 1;
                    audio_water.currentTime = 0;
                    audio_water.muted = false;
                    audio_water.play();
                }
                else if(rainType == 3){
                    hp--;
                    HPcheck();
                    if(rotateStatus == 0){
                        $('#character').attr('src', 'assets/texture/character_hurtR.png');
                    }
                    else{
                        $('#character').attr('src', 'assets/texture/character_hurt.png');
                    }
                    const characterHit = setTimeout(()=>{
                        $('#character').attr('src', 'assets/texture/monitor_character.png');
                    },500);
                    audio_stone.currentTime = 0;
                    audio_water.muted = false;
                    audio_stone.play();
                }
                else if(rainType == 4){
                    hp--;
                    HPcheck();
                    if(rotateStatus == 0){
                        $('#character').attr('src', 'assets/texture/character_hurtR.png');
                    }
                    else{
                        $('#character').attr('src', 'assets/texture/character_hurt.png');
                    }
                    const characterHit = setTimeout(()=>{
                        $('#character').attr('src', 'assets/texture/monitor_character.png');
                    },500);
                    audio_stone.currentTime = 0;
                    audio_water.muted = false;
                    audio_stone.play();
                    audio_stone.play();
                }
                var barValue = (score/100)*(51)+12;
                //console.log(score);
                if(score >= 100){
                    $('#barFull').css('display', 'block');
                }
                else{
                    $('#barWater').css('width', barValue.toString()+'vw');
                }
                document.getElementById("rainBox").children[i].remove();
                break;
            }
            //console.log(rdDeltaX);
            }
        }
    }
}
var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var currentDrag;
var lastD = 0;

hammertime.on('pan', function(ev) {
	//console.log(ev.deltaX);
	if(ev.deltaX > lastD){
		//console.log('+');
		//$('#character').css('transform', 'rotateY(180deg)');
        $('#character').attr('src', 'assets/texture/monitor_characterR.png');
		rotateStatus = 0;
	}
	else if(ev.deltaX < lastD){
		//console.log('-');
		//$('#character').css('transform', 'rotateY(0deg)');
        $('#character').attr('src', 'assets/texture/monitor_character.png');
		rotateStatus = -1;
	}
	lastD = ev.deltaX;

	var elem = ev.target;
    currentDrag = ev.target.getAttribute("id");
    // DRAG STARTED
    if (!isDragging) {
        isDragging = true;
        lastPosX = elem.offsetLeft;
        lastPosY = elem.offsetTop;
        //console.log("dragging");
    }
    var posX = ev.deltaX + lastPosX;
    var posY = ev.deltaY + lastPosY;

    elem.style.left = posX + "px";
    //elem.style.top = posY + "px";

    // DRAG ENDED
    if (ev.isFinal) {
        isDragging = false;
        //elem.style.left = "";
        //elem.style.top = "";
        //console.log("drop");
    }
});
var posTimer = setInterval(UpdatePos, 50);
function UpdatePos(){
    if(posStatus == 'right'){
        var cPos = myElement.getBoundingClientRect().left;
        cPos += 10;
        myElement.style.left = cPos + 'px';
        //$('#character').css('transform', 'rotateY(180deg)');
    }
    else if(posStatus == 'left'){
        var cPos = myElement.getBoundingClientRect().left;
        cPos -= 10;
        myElement.style.left = cPos + 'px';
        //$('#character').css('transform', 'rotateY(0deg)');
    }
}
function step_countdown(){
    mobileStatus = 'monitor_countdown';
    x = 3;
    var timer_countdown = setInterval(function(){
    x--;
    $('.filling-word').html(x);
    $('.filling-word').css('color', 'red');
    console.log(x);
    if(x == 1){clearInterval(timer_countdown);
        console.log('end countdown');
        step_start();
        }
    },1000);
    isConnect = true;
    mobileStatus = 'monitor_countdown';
    $("#content_test").html("Countdown");
    $("#content_test").css("color", "#3c763b");
    SetText("Countdown", "#3c763b");
    $('#canvas_start').hide();
    $('#canvas_play').show();
    $('#bg1').hide();
    $('#bg2').show();
    $('#barWater').css('width', '12vw');
    score = 0;
}
function step_start(){
    mobileStatus = 'monitor_start';
    x = 31;
    var timer_countdown = setInterval(function(){
    x--;
    $('.filling-word').html(x);
    $('.filling-word').css('color', '#0e6eb8');
    
    if(x == 29){
        console.log('startGame');
        isConnect = true;
        mobileStatus = 'monitor_start';
        console.log(mobileStatus);
        $("#content_test").html("Start");
        $("#content_test").css("color", "#3c763b");
        $("#rainBox").html('');
        console.log('startRain!');
        SI_raining = setInterval(rain, 1000);
        SI_detectRin = setInterval(detectRain, 100);
    }
    if(x == 0){clearInterval(timer_countdown);
        console.log('end game');
        step_end();
        }
    },1000);
}
function step_end(){
    mobileStatus = 'monitor-end';
    clearInterval(SI_raining);
    clearInterval(SI_detectRin);
    $("#content_test").html("End");
    $("#content_test").css("color", "#3c763b");
    $("#cloud1Box").hide();
    $("#cloud2Box").hide();
    $('#canvas_play').hide();
    $('#canvas_result').show();
    $('#bg2').hide();
    $('#bg3').show();
    $('#bottom1').hide();
    $('#bottom2').show();
    $('body').css('background-color', '#bfd858');
    if(score >= 100){
        $('#label_score').html('100');
        $('#label_score').css('margin-left', '40vw');
    }
    else if(score > 0){
        $('#label_score').html(score.toString());
        $('#label_score').css('margin-left', '45vw');
    }
    else if(score == 0){
        $('#label_score').html('0');
        $('#label_score').css('margin-left', '50vw');
    }
    if(score < 60){
        $('#img_rainScore').attr('src', 'assets/texture/mobile_score1.png');
    }
    else if(score >= 60 && score <= 80){
        $('#img_rainScore').attr('src', 'assets/texture/mobile_score2.png');
    }
    else if(score > 80){
        $('#img_rainScore').attr('src', 'assets/texture/mobile_score3.png');
    }
}

function HPcheck(){
    if(hp == 0){
        $('#hp1').hide();
        console.log('die');
        console.log('monitor end');
        mobileStatus = 'monitor-end';
        clearInterval(SI_raining);
        clearInterval(SI_detectRin);
        $("#content_test").html("End");
        $("#content_test").css("color", "#3c763b");
        $("#cloud1Box").hide();
        $("#cloud2Box").hide();
        $('#canvas_play').hide();
        $('#canvas_result').show();
        $('#bg2').hide();
        $('#bg3').show();
        $('#bottom1').hide();
        $('#bottom2').show();
        $('#hp1').show();
        $('#hp2').show();
        $('#hp3').show();
        hp = 3;
        x = 0;
        $('.filling-word').html('');
        $('body').css('background-color', '#bfd858');
        if(score >= 100){
            $('#label_score').html('100');
            $('#label_score').css('margin-left', '40vw');
        }
        else if(score > 0){
            $('#label_score').html(score.toString());
            $('#label_score').css('margin-left', '45vw');
        }
        else if(score == 0){
            $('#label_score').html('0');
            $('#label_score').css('margin-left', '50vw');
        }
        if(score < 60){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score1.png');
        }
        else if(score >= 60 && score <= 80){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score2.png');
        }
        else if(score > 80){
            $('#img_rainScore').attr('src', 'assets/texture/mobile_score3.png');
        }
    }
    else if(hp == 1){
        $('#hp2').hide();
    }
    else if(hp == 2){
        $('#hp3').hide();
    }
}

function toFB(){
    window.open('https://www.facebook.com/kmcpao/');
}
function toWebsite(){
    window.open('https://kmcpao.kinmen.gov.tw/');
}
function toRestart(){
    window.location.reload();
}
