var isScanned = false;
var html5QrcodeScanner;
var currentCode = "";
var _url = "https://hiroot.github.io/itriTouchTaiwan2022/";
const html5QrCode = new Html5Qrcode("reader");
var scanArray = [];

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    //alert(decodedText.toString());
    console.log(decodedText);
    if(!isScanned){
    	isScanned = true;
    	currentCode = decodedText;
	    let str = currentCode.replace(_url, "");
	    const element = document.getElementById('detailUrl');
		element.remove();
		var iframe = document.createElement('iframe');
	    iframe.setAttribute('id', 'detailUrl');
	    iframe.src = str;
	    document.getElementById('c_detail').appendChild(iframe);
	    checkArray(str);
		$(".c_detail").show();
		$(".c_scan").hide();
		console.log("detect");
	    }
	// html5QrCode.stop().then((ignore) => {
	//   // QR Code scanning is stopped.
	// }).catch((err) => {
	//   // Stop failed, handle it.
	// });
};
const config = { fps: 10, qrbox: { width: 250, height: 250 } };
function onStart(){
	$(".c_start").hide();
	$(".c_scan").show();

	html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
}

function onExit(){
	$(".c_detail").hide();
	$(".c_scan").show();
	isScanned = false;
	if(scanArray.length >= 2){
		$("#btn_form").show();
	}
}
function onForm(){
	window.open("https://forms.gle/TppfvRf25RtK1hjH9");
	//window.location.href="https://forms.gle/TppfvRf25RtK1hjH9";
}

function checkArray(url){
	if(scanArray.length == 0){
		scanArray.push(url);
		console.log("add first.");
	}
	else if (scanArray.length > 0){
		let isSame = false;
		for(var i = 0; i < scanArray.length; i++){
			if(scanArray[i] == url){
				isSame = true;
				console.log("same url");
				break;
			}
		}
		if(!isSame){
			scanArray.push(url);
			console.log("new url");
		}
	}
	console.log(scanArray.toString());
}