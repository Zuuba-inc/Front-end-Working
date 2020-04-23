import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OpentokService } from './opentok.service';
import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';
import * as OT from '@opentok/client';
import { Common } from 'src/app/services/global/common';
// import jquery
import * as $ from 'jquery';
declare var DetectRTC: any;
declare var micTesting: any;
declare var startInternetSpeed: any;
@Component({
  selector: 'app-opentok-demo',
  templateUrl: './opentok-demo.component.html',
  styleUrls: ['./opentok-demo.component.css']
})
export class OpentokDemoComponent implements OnInit {

  title = 'Angular Basic Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef: ChangeDetectorRef;
  publisher;
  user: any;
  webinarId: any;
  sessionId;
  publishing: Boolean;
  token;
  screenSharingPublisher;
  stopSharing = false;
  sharingMyScreen = false;
  video: any;
  stream: any;
  shareVideoPublisher;
  startVideo;
  canvas: any;
  pdfSharingPublisher;
  pdfSrc: string = '../../assets/images/sample.pdf';
  pageVariable = 1;
  pdfInterval;
  testVideo;
  camerasList = [];
  audioInputList = [];
  audioOutputList = [];
  selectedCamera: any;
  selectedAudioInput: any;
  selectedAudioOutput: any;
  message;
  messageHistory=[];
  messageData;any;
  constructor(
    private webinarAPI: WebinarAPIService,
    private ref: ChangeDetectorRef,
    private opentokService: OpentokService,
    private common: Common
  ) {
    this.changeDetectorRef = ref;
  }

  async ngOnInit() {
    var consumerscreendiv = '<div id="subscriber" class="publishing"></div>';
    var publisherscreendiv = '<div id="publisher"></div>';
    this.webinarId = 454;

    if (this.webinarId) {
      console.log(this.webinarId)
      this.user = localStorage.getItem("currentUser");
      this.user = JSON.parse(this.user);
      var userRole = this.user.uRole.role;
      let dataWebinar;
      dataWebinar = await this.webinarAPI.generateToken(this.webinarId, this.user.id,null);
      var token = JSON.parse(dataWebinar['_body']);
      if (token.statusCode == 200) {

        console.log(token.data.tokenId);
        this.token = token.data.tokenId;
        this.sessionId = token.data.sessionId;
        this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {

          this.session = session;
          
          if (userRole == "MAIN_USER") {
            $('#publisher-screen').html('');
            alert('hello : ' + publisherscreendiv);
            $('#publisher-screen').append(publisherscreendiv);

            this.publisher = OT.initPublisher('publisher', { insertMode: 'append' });
            this.opentokService.connect().then(x => {
              console.log(x);
              if (this.session) {
                if (this.session['isConnected']()) {
                  this.publish();
                }
                this.session.on('sessionConnected', () => this.publish());
                
              }
            });
            this.session.on('signal', (event)=> {
              this.messageData = event.data
              this.messageData = this.messageData.split("#")
                this.messageHistory.push({"message": this.messageData[0], "user":this.messageData[1], "userId":this.messageData[2], "picture":this.messageData[3] })
              this.messageData = " ";
              console.log("Received by Main User")
              console.log(this.messageHistory);
              this.ref.detectChanges();
            });
          } else {
            alert('initiate a session *************' + this.sessionId);
            this.session.on('streamCreated', (event) => {
              alert(event.stream.videoType);
              if (event.stream.videoType === 'screen') {
                // This is a screen-sharing stream published by another client
                $('#consumer-screen').html('');
                $('#consumer-screen').append(consumerscreendiv);
                console.log("This is a screen-sharing stream published by another client");
                //alert("this is screen to consumer--->"+event.stream.videoType)
                this.session.subscribe(event.stream, 'subscriber', {}, (err) => {
                  if (err) {
                    alert(err.message);
                  }
                });
              } else {
                $('#consumer-screen').html('');
                $('#consumer-screen').append(consumerscreendiv);
                this.session.subscribe(event.stream, 'subscriber', {}, (err) => {
                  if (err) {
                    alert(err.message);
                  }
                });
              }
            });
            this.session.on('signal', (event)=> {
              this.messageData = event.data
              this.messageData = this.messageData.split("#")
             // if(this.messageData[2] != this.user.id){
              
                this.messageHistory.push({"message": this.messageData[0], "user":this.messageData[1], "userId":this.messageData[2], "picture":this.messageData[3] })
            //  }
              this.messageData = " ";
              console.log("Received by User")
                  console.log(this.messageHistory);
                  this.ref.detectChanges();
                  
            });
              
            this.opentokService.connect().then(x => {
              console.log(x)
            })
          }
        })
          .catch((err) => {
            console.error(err);
            alert('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
          });
      }
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }

  screenPublish() {
    this.session.publish(this.screenSharingPublisher, (err) => {
      if (err) {
        this.sharingMyScreen = false;
      } else {
        this.publisher.publishVideo(false);
      }
    });
  }

  screenshare() {
    this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {
      OT.registerScreenSharingExtension('chrome', this.common.CHROME_EXTENSION_ID, 2);
      this.session = session;
      var screenContainerElement = document.createElement('div');
      if (this.sharingMyScreen == false) {
        OT.checkScreenSharingCapability(response => {
          console.info(response);
          if (!response.supported || response.extensionRegistered === false) {
            alert('This browser does not support screen sharing.');
          } else {
            alert('Starting Screen Sharing');
            console.log("======" + screenContainerElement + "-----");
            this.sharingMyScreen = true;
            this.publisher.destroy();
            this.screenSharingPublisher = OT.initPublisher('subscriber-sharing', { videoSource: 'screen', publishAudio: true, publishVideo: true });
            if (this.session) {
              if (this.session['isConnected']()) {
                console.log("Inside publish")
                this.screenPublish();
              }
            }
          }
        })
      } else {
        alert("already screen is in sharing mode.........");
      }
    })
  }

  startShareVideo() {
    // if(this.startVideo == true){
    var videoDiv = '<video id="video" width="100%" height="450px" controls autoplay><source  type="video/mp4" ></video>';
    $('#publisher-screen').html('');
    $('#publisher-screen').append(videoDiv);
    $('#video source').attr('src', '../../assets/images/demoVideo.mp4');
    $("#video")[0].load();
    this.startVideo = setInterval(() => {
      this.video = document.querySelector('#video');
      const stream = this.video.captureStream();
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      if (videoTracks.length > 0 && audioTracks.length > 0) {
        this.shareVideo();
      }
    }, 500);

  }
  shareVideo() {
    clearInterval(this.startVideo);
    this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {
      this.session = session;
      this.video = document.querySelector('#video');
      console.log(this.video);
      if (!this.video.captureStream) {
        alert('This browser does not support VideoElement.captureStream(). You must use Google Chrome.');
        return;
      } else {
        alert("Streaming Video");
        this.stream = this.video.captureStream();
        // clearInterval(this.startVideo);
        console.log(this.stream);
        this.publisher.destroy();
        var publish = () => {
          const videoTracks = this.stream.getVideoTracks();
          const audioTracks = this.stream.getAudioTracks();
          console.log(videoTracks);
          console.log(audioTracks);
          if (!this.shareVideoPublisher && videoTracks.length > 0 && audioTracks.length > 0) {
            //clearInterval(startVideo);
            this.stream.removeEventListener('addtrack', publish);
            this.shareVideoPublisher = OT.initPublisher('subscriber-sharing-video', {
              videoSource: videoTracks[0],
              audioSource: audioTracks[0],
              fitMode: 'contain',
              width: 320,
              height: 240
            }, (err) => {
              if (err) {
                this.video.pause();
                alert(err.message);
              } else {
                this.session.publish(this.shareVideoPublisher, function (error) {
                  if (error) {
                    alert("publish failed");
                    // console.error("publish failed");
                  }
                  //here we are recording screen
                  alert('Showing Video *******');
                  this.video.play();
                });

              }
            });
          }
        };
        this.stream.addEventListener('addtrack', publish);
        publish();
      }
    })
  }

  sharePdf() {
    //this.pdfSrc = 
    alert("Show Pdf")
    // var session = OT.initSession(apiKey, sessionId);
    // var container = document.getElementById("pdf-container")
    // if(container.style.display == 'none'){
    //   container.style.display = 'block'
    // }

    console.log($("#pdf-canvas .ng2-pdf-viewer-container>div"));
    var c = [];
    c = $("#pdf-canvas .ng2-pdf-viewer-container>div")
    this.canvas = c[0];
    this.canvas = this.canvas.children[0];
    this.canvas = this.canvas.children[0];
    this.canvas = this.canvas.children[0]
    // this.canvas = this.canvas.children[0]
    console.log(this.canvas);
    // this.canvas = c[0];
    const ctx = this.canvas.getContext('2d');
    const img = this.canvas;
    // Draw a random colour in the Canvas every 1 second
    this.pdfInterval = setInterval(() => {
      ctx.drawImage(img, 33, 71, 104, 124, 21, 20, 87, 104);
    }, 100);

    // Use canvas.captureStream at 1 fps and pass the video track to the Publisher
    console.log(this.canvas);
    console.log(this.canvas.captureStream());
    this.publisher.destroy();
    this.pdfSharingPublisher = OT.initPublisher('sharing-pdf', {
      videoSource: this.canvas.captureStream().getVideoTracks()[0],
      fitMode: 'contain',
    }, (err) => {
      if (err) {
        clearInterval(this.pdfInterval);
        alert(err.message);
      } else {
        alert("publishing pdf");
        this.session.publish(this.pdfSharingPublisher, function (error) {
          if (error) {
            alert("publish failed");
            // console.error("publish failed");
          }
          //here we are recording screen
          alert('Showing PDF *******');
        });
      }
    });
  }

  nextPage() {
    this.pageVariable++;
    clearInterval(this.pdfInterval);
    this.pdfSharingPublisher.destroy();
    setTimeout(() => { this.sharePdf(); }, 500);

  }

  testAudio() {
    var testScreen = document.getElementById("video-test")
    if (testScreen.style.display == 'none') {
      testScreen.style.display = 'block'
    } else {
      testScreen.style.display = 'none'
    }

    DetectRTC.load(() => {
      console.log(DetectRTC)
      DetectRTC.audioOutputDevices.forEach(element => {
        this.audioOutputList.push({ "value": element.id, "label": element.label })
      });
      this.selectedAudioOutput = this.audioOutputList[0];
      this.selectedAudioOutput = this.selectedAudioOutput.value
      console.log(this.selectedAudioOutput);
      DetectRTC.videoInputDevices.forEach(element => {
        this.camerasList.push({ "value": element.id, "label": element.label })
      });
      this.selectedCamera = this.camerasList[0];
      this.selectedCamera = this.selectedCamera.value
      console.log(this.selectedCamera);
      this.camerasListChange();
      this.startCamera();
      DetectRTC.audioInputDevices.forEach(element => {
        this.audioInputList.push({ "value": element.id, "label": element.label })
      });
      this.selectedAudioInput = this.audioInputList[0];
      this.selectedAudioInput = this.selectedAudioInput.value
      console.log(this.selectedAudioInput);
    });
    micTesting();
    this.MeasureConnectionSpeed();
    //startInternetSpeed();
    // this.selectedCamera = this.camerasList[0];

    // ;
  }
 MeasureConnectionSpeed() {
    var imageAddr= '/assets/images/sample_img.jpg'
    var downloadSize = 4995374; 
    var startTime, endTime;
      var download = new Image();
      download.onload = function () {
          endTime = (new Date()).getTime();
          showResults();
      }
      
      download.onerror =  ((err, msg) => {
          alert("Invalid");
      })
      
      startTime = (new Date()).getTime();
      var cacheBuster = "?nnn=" + startTime;
      download.src = imageAddr + cacheBuster;
      
       function showResults() {
          var duration = (endTime - startTime) / 1000;
          var bitsLoaded = downloadSize * 8;
          var speedBps ;
          speedBps = (bitsLoaded / duration).toFixed(2);
          var speedKbps ;
          speedKbps = (speedBps / 1024).toFixed(2);
          var speedMbps = (speedKbps / 1024).toFixed(2);
          alert("Your connection speed is:"
          +speedBps + " bps" 
          +speedKbps + " kbps"
          +speedMbps + " Mbps");
              
        
      }
  }
  async camerasListChange(): Promise<void> {
    this.testVideo = document.getElementById("videoElement")
    var selected = this.selectedCamera;
    var deviceSelection = selected ? {
      deviceId: selected.value
    } : true;
    var audioSelected = this.selectedAudioInput;
    var audioDeviceSelection = audioSelected ? {
      deviceId: audioSelected
    } : true;
    navigator.mediaDevices.getUserMedia({
      video: deviceSelection,
      audio: audioDeviceSelection
    }).then(stream => {
      this.testVideo.srcObject = stream;
    });
  }

  async audioOutputDeviceListChange(): Promise<void> {
    var selected = this.selectedCamera;
    var deviceSelection = selected ? {
      deviceId: selected.value
    } : true;
    var audioSelected = this.selectedAudioOutput;
    var audioDeviceSelection = audioSelected ? {
      deviceId: audioSelected
    } : true;
    console.log(audioDeviceSelection)
    navigator.mediaDevices.getUserMedia({
      video: deviceSelection,
      audio: audioDeviceSelection
    }).then(stream => {
      this.testVideo.srcObject = stream;
    });
  }

  startCamera() {
    this.testVideo = document.getElementById('videoElement');
    console.log(navigator.mediaDevices.getUserMedia);
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
        })
        .catch((err0r) => {
          console.log("Something went wrong!");
        });
    }
  }

  playAudio() {
    var x;
    x = document.getElementById("myAudio");
			x.play();
			// var butnPlay = document.getElementById("playIcon")
			// var butnPause = document.getElementById("pauseIcon")
			// butnPlay.style.display = 'none';
			// butnPause.style.display = 'block';
		}
    register(){
      console.log(this.message);
      this.message= this.message+"#"+this.user.firstName+"#"+this.user.id+"#"+this.user.profilePicture
      console.log("Message:"+this.message);
      // this.messageData.message = this.message;
      // this.messageData.user = this.user;
      this.session.signal({
        type: 'msg',
        data: this.message
        //from: this.user
      },(error) => {
        if (error) {
          console.error('Error sending signal:', error.name, error.message);
        } else {
         this.message = '';
        // this.messageHistory.push({"message": this.message, "user":this.user.firstName, "userId": this.user.id, "picture":this.user.profilePicture})
        }
      });
    }
}

