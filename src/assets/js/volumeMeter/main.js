/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=0;
var HEIGHT=0;
var rafID = null;

micTesting = function() {
    // grab our canvas
	canvasContext = document.getElementById( "meter" ).getContext("2d");
	
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}

function drawLoop( time ) {
	let vol = meter.volume;
	if(vol >0 && vol<0.8){
		//console.log(document.getElementsByClassName("dot1"));
		$('.dot1').addClass('test__step--inactive');
		$('.dot2').addClass('test__step--inactive');
		$('.dot3').addClass('test__step--inactive');
		$('.dot4').addClass('test__step--inactive');
		$('.dot5').addClass('test__step--inactive');
		$('.dot6').addClass('test__step--inactive');

		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
		// document.getElementsByClassName("dot2").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot3").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot4").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot5").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot6").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot7").style.backgroundColor="#bbb";
		// document.getElementById("dot8").style.backgroundColor="#bbb";
		// document.getElementById("dot9").style.backgroundColor="#bbb";
		// document.getElementById("dot10").style.backgroundColor="#bbb";
		// document.getElementById("dot11").style.backgroundColor="#bbb";
		//document.getElementById("dot12").style.backgroundColor="#bbb";
		//document.getElementById("dot13").style.backgroundColor="#bbb";
	
	}
	if(vol > 0.08 && vol < 0.1){
		$('.dot1').addClass('test__step--inactive');
		$('.dot2').addClass('test__step--inactive');
		$('.dot3').addClass('test__step--inactive');
		$('.dot4').addClass('test__step--inactive');
		$('.dot5').addClass('test__step--inactive');

		$('.dot6').removeClass('test__step--inactive');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
		$('.dot6').addClass('test__step--active');
		// document.getElementsByClassName("dot2").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot3").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot4").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot5").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot6").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot7").style.backgroundColor="#bbb";
		// document.getElementById("dot8").style.backgroundColor="#bbb";
		// document.getElementById("dot9").style.backgroundColor="#bbb";
		// document.getElementById("dot10").style.backgroundColor="#bbb";
		// document.getElementById("dot11").style.backgroundColor="#bbb";
		//document.getElementById("dot12").style.backgroundColor="#bbb";
		//document.getElementById("dot13").style.backgroundColor="#bbb";
	}
	
	if(vol >0.1 && vol<0.2){
		$('.dot1').addClass('test__step--inactive');
		$('.dot2').addClass('test__step--inactive');
		$('.dot3').addClass('test__step--inactive');
		$('.dot4').addClass('test__step--inactive');
		
		$('.dot5').removeClass('test__step--inactive');
		$('.dot6').removeClass('test__step--inactive');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
		$('.dot6').addClass('test__step--active');
		$('.dot5').addClass('test__step--active');
		// document.getElementsByClassName("dot1").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot2").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot3").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot4").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot5").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot6").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot7").style.backgroundColor="#bbb";
		// document.getElementById("dot8").style.backgroundColor="#bbb";
		// document.getElementById("dot9").style.backgroundColor="#bbb";
		// document.getElementById("dot10").style.backgroundColor="#bbb";
		// document.getElementById("dot11").style.backgroundColor="#bbb";
		//document.getElementById("dot12").style.backgroundColor="#bbb";
		//document.getElementById("dot13").style.backgroundColor="#bbb";
	}
	
	if(vol >0.2 && vol<0.4){
		$('.dot1').addClass('test__step--inactive');
		$('.dot2').addClass('test__step--inactive');
		$('.dot3').addClass('test__step--inactive');
		
		$('.dot4').removeClass('test__step--inactive');
		$('.dot5').removeClass('test__step--inactive');
		$('.dot6').removeClass('test__step--inactive');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
		$('.dot6').addClass('test__step--active');
		$('.dot5').addClass('test__step--active');
		$('.dot4').addClass('test__step--active');
		// document.getElementsByClassName("dot1").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot2").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot3").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot4").style.backgroundColor="#1dcb9a";
		// document.getElementsByClassName("dot5").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot6").style.backgroundColor="#bbb";
		// document.getElementsByClassName("dot7").style.backgroundColor="#bbb";
		// document.getElementById("dot8").style.backgroundColor="#bbb";
		// document.getElementById("dot9").style.backgroundColor="#bbb";
		// document.getElementById("dot10").style.backgroundColor="#bbb";
		// document.getElementById("dot11").style.backgroundColor="#bbb";
		//document.getElementById("dot12").style.backgroundColor="#bbb";
		//document.getElementById("dot13").style.backgroundColor="#bbb";
	}
	if(vol >= 0.4 && vol <0.6){
		$('.dot1').addClass('test__step--inactive');
		$('.dot2').addClass('test__step--inactive');
		
		$('.dot3').removeClass('test__step--inactive');
		$('.dot4').removeClass('test__step--inactive');
		$('.dot5').removeClass('test__step--inactive');
		$('.dot6').removeClass('test__step--inactive');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
		$('.dot6').addClass('test__step--active');
		$('.dot5').addClass('test__step--active');
		$('.dot4').addClass('test__step--active');
		$('.dot3').addClass('test__step--active');
	}
	if(vol >0.6 && vol<0.8){
		$('.dot1').addClass('test__step--inactive');
		
		$('.dot2').removeClass('test__step--inactive');
		$('.dot2').addClass('test__step--active');
		$('.dot3').removeClass('test__step--inactive');
		$('.dot3').addClass('test__step--active');
		$('.dot4').removeClass('test__step--inactive');
		$('.dot4').addClass('test__step--active');
		$('.dot5').removeClass('test__step--inactive');
		$('.dot5').addClass('test__step--active');
		$('.dot6').removeClass('test__step--inactive');
		$('.dot6').addClass('test__step--active');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--inactive');
	}
	if(vol >0.8){
		$('.dot1').removeClass('test__step--inactive');
		$('.dot1').addClass('test__step--active');
		$('.dot2').removeClass('test__step--inactive');
		$('.dot2').addClass('test__step--active');
		$('.dot3').removeClass('test__step--inactive');
		$('.dot3').addClass('test__step--active');
		$('.dot4').removeClass('test__step--inactive');
		$('.dot4').addClass('test__step--active');
		$('.dot5').removeClass('test__step--inactive');
		$('.dot5').addClass('test__step--active');
		$('.dot6').removeClass('test__step--inactive');
		$('.dot6').addClass('test__step--active');
		$('.dot7').removeClass('test__step--inactive');
		$('.dot7').addClass('test__step--active');
	}
	// if(vol >0.4 && vol<0.45){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#bbb";
	// 	document.getElementById("dot10").style.backgroundColor="#bbb";
	// 	document.getElementById("dot11").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot12").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot13").style.backgroundColor="#bbb";
	// }
	// if(vol >0.5 && vol<0.55){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot10").style.backgroundColor="#bbb";
	// 	document.getElementById("dot11").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot12").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot13").style.backgroundColor="#bbb";
	// }
	// if(vol >0.6 && vol<0.65){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot10").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot11").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot12").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot13").style.backgroundColor="#bbb";
	// }
	// if(vol >0.7 && vol<0.75){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot10").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot11").style.backgroundColor="#1dcb9a";
	// 	//document.getElementById("dot12").style.backgroundColor="#bbb";
	// 	//document.getElementById("dot13").style.backgroundColor="#bbb";
	// }
	// if(vol >0.75 && vol<0.8){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot10").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot11").style.backgroundColor="#1dcb9a";
	// 	//document.getElementById("dot12").style.backgroundColor="#1dcb9a";
	// 	//document.getElementById("dot13").style.backgroundColor="#bbb";
	// }
	// if(vol >0.8){
	// 	document.getElementById("dot1").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot2").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot3").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot4").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot5").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot6").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot7").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot8").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot9").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot10").style.backgroundColor="#1dcb9a";
	// 	document.getElementById("dot11").style.backgroundColor="#1dcb9a";
	// 	//document.getElementById("dot12").style.backgroundColor="#1dcb9a";
	// 	//document.getElementById("dot13").style.backgroundColor="#1dcb9a";
	// }
    // clear the background
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);

    // check if we're currently clipping
    if (meter.checkClipping())
        canvasContext.fillStyle = "red";
    else
        canvasContext.fillStyle = "green";

    // draw a bar based on the current volume
    canvasContext.fillRect(0, 0, meter.volume*WIDTH*1.4, HEIGHT);

    // set up the next visual callback
    rafID = window.requestAnimationFrame( drawLoop );
}
