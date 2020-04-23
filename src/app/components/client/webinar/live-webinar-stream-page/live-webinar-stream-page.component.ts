import { Component, OnInit, ChangeDetectorRef, Inject, HostListener, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import { AuthapiserviceService } from "src/app/services/coach/global/authapiservice.service";
import * as $ from 'jquery';
import { Common } from 'src/app/services/global/common';
import { OpentokService } from 'src/app/components/client/webinar/opentok-demo/opentok.service';
import { DOCUMENT } from '@angular/platform-browser';
import * as moment from 'moment'; // add this 1 of 4
import Swal from "sweetalert2";
declare var DetectRTC: any;
declare var micTesting: any;
declare var startInternetSpeed: any;

@Component({
  selector: 'app-live-webinar-stream-page',
  templateUrl: './live-webinar-stream-page.component.html',
  styleUrls: ['./live-webinar-stream-page.component.css']
})

export class LiveWebinarStreamPageComponent implements OnInit, AfterViewInit {

  consumerscreendiv: any = '<div id="subscriber" class="publishing"></div>';
  publisherscreendiv: any = '<div id="publisher"></div>';
  webinarHasStarted = false;webinarTime: any; webinarRegistrationTime: any;
  showCntDwn: boolean = false;
  elem; fullScreen: boolean = false;

  changeDetectorRef: ChangeDetectorRef;

  sharingMyScreen: boolean = false;

  screenSharingPublisher: any;

  webinarId;
  userId;
  registrationTime;
  webinarInfo: any = {
    mainUser: {},
    webinarOffer: {}
  };
  user: any = {
    uRole: {}
  };
  joiniCount = 0;
  joiniArray = [];
  showPubScrn: boolean = false;

  webinarMst: any;

  // used in presentation header dropdown
  videoLinks: any = [];

  pdfLinks: any = [];

  startVideo: any;

  canvas: any;

  pdfInterval: any;

  pdfSharingPublisher: any;

  pdfSrc: any = "";

  camerasList = [];
  audioInputList = [];
  audioOutputList = [];

  selectedCamera: any;
  selectedAudioInput: any;
  selectedAudioOutput: any;

  testVideo: any;

  token: any;
  sessionId: any;
  session: any;
  publisher: any;
  messageData: any = {};
  messageBy: any = {};
  messageTo: any = {};
  messageHistory = [];
  streams: Array<OT.Stream> = [];
  video: any;
  stream: any;
  shareVideoPublisher;
  publishing: Boolean;
  data: any = {};
  archiveId;
  message;
  chatlength;
  streamStarted = 'Stopped';
  sidePanelOpened = true;
  disableMessageSendButton = true;
  microPhone = 'on';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private webinar: WebinarAPIService,
    private authService: AuthapiserviceService,
    private webinarAPI: WebinarAPIService,
    private common: Common,
    private opentokService: OpentokService,
    private ref: ChangeDetectorRef, @Inject(DOCUMENT) private documentEle: any,
    private _ngZone: NgZone) {
    this.changeDetectorRef = ref;
    /*document.addEventListener('fullscreenchange', this.closeFullscreen);
    document.addEventListener('webkitfullscreenchange', this.closeFullscreen);
    document.addEventListener('mozfullscreenchange', this.closeFullscreen);
    document.addEventListener('MSFullscreenChange', this.closeFullscreen);*/

  }

  async ngOnInit() {
    this.elem = document.documentElement;
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.webinarId = params['id'];
        localStorage.setItem("webinarId", this.webinarId);
      } else {
        this.webinarId = localStorage.getItem("webinarId");
      }
    })
    // this.checkToken();

    this.checkToken();


  }

  ngAfterViewInit() {
  }

  checkToken() {

    this.$time = document.getElementById('time');
    this.update(this);

    var token = localStorage.getItem("token");
    console.log(token)
    if (token == null) {
      localStorage.setItem("urlAfterLogin", "/liveWebinarPage");
      this.router.navigate(['/login']);
    } else {
      this.checkWebinarStatus();
    }
  }
  async checkWebinarStatus() {
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let webinar:any = await this.webinar.getWebinar(this.webinarId, 'all');

     
      if (webinar.status == 'SUCCESS') {
        this.webinarInfo = webinar;
        // bind the webinarinfo module related data coming from response
        this.webinarInfo = this.webinarInfo.data.webinar;
        this.chatlength = this.webinarInfo.webinarChatDetails.length
        console.log(this.webinarInfo)
        this.user = localStorage.getItem("currentUser");
        this.user = JSON.parse(this.user);
        if(this.user.uRole.role == 'MAIN_USER' && this.webinarInfo.mainUser.id != this.user.mainUser.id){
          this.user.uRole.role = 'CLIENT'
        }
        let date = new Date(this.webinarInfo.webinarLiveDtl.webinarLiveDate);
        //var webinarTime = new Date(this.webinarInfo.webinarLiveDtl.webinarLiveTime)
        var userEventTime = this.webinarInfo.webinarLiveDtl.webinarLiveTime.split('T');
            var webinarTime = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
        this.webinarTime = months[date.getMonth()]+" " + date.getDate()+ "," +date.getFullYear()+" "+webinarTime.getHours()+":"+webinarTime.getMinutes()
        this.webinarRegistrationTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+webinarTime.getHours()+":"+webinarTime.getMinutes();
        this.registrationTime = this.webinarTime;
        console.log(this.webinarTime)

        // TODO: REMOVE THIS LINE AFTER TESTING
       // this.webinarInfo.status = 'Published';
        
        if (this.webinarInfo.status == 'Active' || this.webinarInfo.status == 'STARTED') {
          if (this.user.uRole.role == "MAIN_USER") {

            // show test modal on first time visit
            this.settingsClick()

            await this.createSessionId();

            // populate presentation dropdown with data
            this.webinarInfo.webinarPresentationDetailList.forEach((item) => {
              if (item.fileType == "pdf") {
                this.pdfLinks.push(item);
              } else if (item.fileType == "video") {
                this.videoLinks.push(item);
              }
            })
            if (this.webinarInfo.webinarStartTime != null) {
              this.showCountDown();
            }

            // $("p").hover(function(){
            //   $(this).css("background-color", "yellow");
            //   }, function(){
            //   $(this).css("background-color", "pink");
            // });

            $( "#presentation-drop-down" ).hover(
              function() {

                console.log("mouse entered");

                $(".dropdown-menu").show();
              }, function() {

                console.log("mouse left");

                // $(".dropdown-menu").hide();
              }
            );

            $( ".dropdown-menu").hover(
              function() {

                console.log("mouse entered");

                $(".dropdown-menu").show();
              }, function() {

                console.log("mouse left");

                $(".dropdown-menu").hide();
              }
            );

          } else {
             // hide count down div upon webinar start
             $("#start-count-down").hide();
            var user;
            this.webinarInfo.webinarRegisteredUsers.forEach(element => {
              if (element.appUserId == this.user.id) {
                console.log(new Date(element.registrationTime));
                user = element;
                //user.registrationTime = this.webinarRegistrationTime;
              }
            });
            if (user != undefined || user != null) {
              await this.selectTime(user.registrationTime);
              // alert("Creating Session id")
              // $("#count-down").hide();
              // await this.createSessionId();
              // await this.initOpenTok();
            } else {
              alert("You have not registered for this webinar please register")
              this.router.navigate(['/registerForWebinar'], { queryParams: { id: this.webinarId } });
            }
          }

        } else {
          if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null) {
            // reenter the Angular zone and display done
            this._ngZone.run(() => { 
              // console.log('Outside Done!'); 
              this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'true' } });
            });
          } else {
            this._ngZone.run(() => { 
              // console.log('Outside Done!'); 
              this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'false' } });
            });
          }
          

        }
      }else{
          this.serverError(webinar);
      }

  }

  async selectTime(event) : Promise<void>{
    console.log(event);
    //var test1= moment(event).utcOffset(this.webinarInfo.webinarLiveDtl.liveTimezone).format("YYYY-MM-DDTHH:mmZ");
    //console.log(test1);
    //var date = new Date(test1)
    var userEventTime = event.split('T');
    var date = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
    console.log(date);
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.registrationTime = months[date.getMonth()] + " " + date.getDate() + "," + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    //var countDownDate = new Date(this.registrationTime).getTime()
    localStorage.setItem("webinarRegistrationTime", this.registrationTime);
    this.coutdown();
  }
  coutdown() {
    //this.registrationTime = localStorage.getItem('webinarRegistrationTime')

    var countDownTime = new Date(this.registrationTime).getTime();
    var self = this;
    var timer = setInterval(async function () {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down 
      this.distance = countDownTime - now;
      // Time calculations for days, hours, minutes and seconds
      var days, hours, minutes, seconds;

      if (this.distance) {
        days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        document.getElementById("daysLeft").innerHTML = days;
        document.getElementById("hoursLeft").innerHTML = hours;
        document.getElementById("minLeft").innerHTML = minutes;
        document.getElementById("secLeft").innerHTML = seconds;
      }
      if (this.distance < 0) {
        //alert("Webinar is going to start");
        $("#count-down").hide();
        $("#webinar-starting-soon").show();
        clearInterval(timer)
        //alert()
        this.webinarHasStarted = true;
        await self.createSessionId();
        await self.initOpenTok();
       
       
      }
    }, 1000);
  }
  showCountDown() {
    this.showCntDwn = true;

    let counterEle: any = document.getElementsByClassName("counter");

    let i = 1;

    let self = this;

    let timer = setInterval(function () {

      if (i >= counterEle.length) {
        clearInterval(timer);
        $("#start-count-down").hide();
        self.initOpenTok();


      }
      if (i < counterEle.length) {
        // remove active class from prev element
        counterEle[i - 1].classList.remove("active");

        // add active class to current element
        counterEle[i].classList.add("active");

        i++;
      }
    }, 1000);
  }

  async publish() {
    alert("Publishing")

    this.session.publish(this.publisher, async (err) => {
      if (err) {
        alert(err.message);
      } else {
        if (this.webinarHasStarted == false) {
           this.publishing = true;
           this.webinarHasStarted = true;
           if(this.webinarInfo.webinarStartTime == null){
             var data:any = await this.webinarAPI.saveLiveWebinarStartTime( this.webinarId, (new Date()).getTime(),(new Date()).getTime());
             var webinarRes = data;
             console.log(webinarRes);
             this.webinarInfo.webinarStartTime = webinarRes.startTime;
           }
           this.startStopWatch();
           if(this.webinarInfo.webinarChatDetails && this.webinarInfo.webinarChatDetails.length > 0)
            this.updateCoahMessages();
           if(this.webinarInfo.webinarOffer && (this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null))
            this.showOffer();
         }
         console.log("Webinar video on")

        
        this.data = await this.webinarAPI.archiveWebinar(this.webinarId);
        this.archiveId = this.data.data.archiveId;
      }
    });
  }

  noOfJoine: number = 0;

  async createSessionId() {
    let dataWebinar:any;
    if (this.user.uRole.role == 'MAIN_USER') {
      dataWebinar = await this.webinarAPI.streamWebinar(this.webinarId, this.user.id);
      var token =dataWebinar
      if (token.statusCode == 200) {
        this.token = token.data.tokenId;
        this.sessionId = token.data.webinarMst.streamSession;
      }
    } else {
      if(this.webinarInfo.webinarStartTime == null) {

      let webinar: any = await this.webinar.getWebinar(this.webinarId, 'all');

      if (webinar && webinar["_body"]) {
      // .subscribe(async webinar => {
        this.data =webinar;
        if (this.data.status == 'SUCCESS') {
          this.data = this.data.data.webinar;
          if(this.data.webinarStartTime != null)
          this.webinarInfo.webinarStartTime = this.data.webinarStartTime
          this.data = {};
         
        }
      // })
      }
    }
      dataWebinar = await this.webinarAPI.generateToken(this.webinarId, this.user.id, null);
          var token :any = dataWebinar;
          this.webinarHasStarted = true;
          if (token.statusCode == 200) {
            this.token = token.data.tokenId;
            this.sessionId = token.data.sessionId;
          
          }
    }
    
          // populate messages for the webinar
          alert("Populating webinar messages");
          this.data = await this.webinarAPI.getWebinarMessages(this.webinarId, this.registrationTime);
         
          this.data = this.data.data;
          if (this.data != null) {
            this.data.forEach(e => {
              this.messageHistory.push({
                "message": e.message,
                "user": e.messageBy.firstName + " " + e.messageBy.lastName,
                "userId": e.messageBy.id,
                "picture": e.messageBy.profilePicture,
                "initials": e.messageBy.firstName.charAt(0) + e.messageBy.lastName.charAt(0),
                "messageId": e.id,
                "likeCount": e.webinarMessageLikes.length
              })
            })
          }
          console.log(this.data);
          this.data = {};
    if (this.token && this.sessionId) {
      this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {
        this.session = session;
        this.opentokService.connect().then(x => {
          // console.log("Session Connected: ")
          // console.log(x);
        })
        this.session.on('signal', (event) => {
          this.data = JSON.parse(event.data)
          if (this.data.type == 'message') {
            var username = [];
            username = this.data.userName.split(" ")
            var userInitial = '';
            username.forEach(e => {
              userInitial = userInitial + e.charAt(0);
            })
            // console.log(userInitial)
            this.messageHistory.push({
              "message": this.data.message,
              "user": this.data.userName,
              "userId": this.data.userId,
              "picture": this.data.profilePicture,
              "initials": userInitial,
              "messageId": this.data.messageId,
              "likeCount": 0
            })
            console.log("Received by User")
            console.log(this.messageHistory);
            this.ref.detectChanges();
          } else if (this.data.type == 'endWebinar') {
            console.log(this.data);
            //alert(this.webinarHasStarted)
            this.webinarHasStarted = false;
            alert("Webinar Ended")
            $("#count-down").show();
            this.stopStopWatch();
            document.getElementById("count-down").innerHTML = "Thanks For attending the webinar"
            // alert(this.webinarHasStarted)
            if (this.user.uRole.role == "CLIENT") {
              if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null) {
                // reenter the Angular zone and display done
                this._ngZone.run(() => { 
                  // console.log('Outside Done!'); 
                  this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'true' } });
                });
              } else {
                this._ngZone.run(() => { 
                  // console.log('Outside Done!'); 
                  this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'false' } });
                });
              }
            }
          } else {
            this.messageHistory.forEach(e => {
              console.log(e.messageId + ":" + this.data.messageId)
              if (e.messageId == this.data.messageId) {
                if (this.data.likeMessage == 'Unliked message successfully') {
                  e.likeCount--;
                } else {
                  e.likeCount++;
                }

              }
            })
            console.log("Received by User")
            console.log(this.messageHistory);
            this.ref.detectChanges();
          }
        });
        this.session.on('connectionCreated', (event) => {
          console.log(event.connection.connectionId + ":" + this.session.connection.connectionId)
          console.log(event.connection.data)
          var eventData = event.connection.data;
          eventData = JSON.parse(eventData);
          console.log(eventData)

          if (eventData.mainUserId != this.webinarInfo.mainUser.id) {
            // todo: increment total joinee count
            this.noOfJoine = this.noOfJoine + 1;

            console.log("this.noOfJoine", this.noOfJoine);

            var obj: any = {};
            obj.user = eventData.userid;
            obj.time = $('#time').html();
            obj.present = true;
            this.watched.push(obj);
            console.log("No Of Joine Array");
            console.log(this.watched);
            var username = [];
            username = eventData.username.split(" ")
            var userInitial = '';
            username.forEach(e => {
              userInitial = userInitial + e.charAt(0);
            })
            this.joiniArray.push({ "userName": eventData.username, "initial": userInitial, "id": eventData.userid, "photo": eventData.profilepicture })
            this.ref.detectChanges();
            // this.initOpenTok();
          }
          console.log(this.joiniArray)

        })
        this.session.on('connectionDestroyed', async (event) => {
          //  console.log(event.connection.connectionId + ":" + this.session.connection.connectionId)
          // console.log(event.connection.data)
          alert("Connection destroyed");
          var eventData = event.connection.data;
          eventData = JSON.parse(eventData);
          // console.log(eventData)

          let dataObj = JSON.parse(event.connection.data);

          var index = 0;
          for (var i = 0; i < this.joiniArray.length; i++) {
            // console.log(this.joiniArray[i].id + ":" + eventData.userid)
            if (this.joiniArray[i].id == eventData.userid) {
              index = i;
            }
          }
          console.log(eventData.mainUserId + ":" + this.webinarInfo.mainUser.id);
          if (eventData.mainUserId == this.webinarInfo.mainUser.id) {
            $("#webinar-starting-soon").show();

            if (this.webinarHasStarted == true) {
              alert("Webinar Paused")
              //this.stopStopWatch();
              this.streamStarted = 'Paused';
              $("#webinar-starting-soon .counting h5").text("Some error occured, Webinar will be resumed soon");
              //document.getElementById("count-down").innerHTML = "Some error occured, Webinar will be resumed soon"
            } else {
              alert("Webinar Ended")
              this.stopStopWatch();
              this.streamStarted = 'Ended';
              $("#webinar-starting-soon .counting h5").text("Thanks For attending the webinar");
              //document.getElementById("count-down").innerHTML = "Thanks For attending the webinar"

              if (this.user.uRole.role == "CLIENT") {
                if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
                  this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'true' } });
                } else {
                  this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer: 'false' } });
                }
              }

            }

          }

          // console.log(index);
          this.joiniArray.splice(index, 1);


          // logic for setting present to false
          for (var i = 0; i < this.watched.length; i++) {
            if (this.watched[i].user == dataObj.userid) {
              this.watched[i].time = $('#time').html();
              this.watched[i].present = false;
            }
          }
        })
      })
        .catch((err) => {
          console.error(err);
          alert('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
        });
    }
  }
  async initOpenTok() {
    var consumerscreendiv = '<div id="subscriber" class="publishing"></div>';
    var publisherscreendiv = '<div id="publisher"></div>';

    if (this.webinarId) {
      var userRole = this.user.uRole.role;
      this.showPubScrn = true;
      if (userRole == "MAIN_USER") {
        $('#publisher-screen').html('');
        $('#publisher-screen').append(publisherscreendiv);
        this.publisher = OT.initPublisher('publisher', {
          insertMode: 'append',
          width: 'auto',
          height: '100vh',
          style: {buttonDisplayMode: 'off'}
        });
        if (this.session) {
          if (this.session['isConnected']()) {


            this.publish();
          }
          this.session.on('sessionConnected', () => this.publish());
          if(this.microPhone == 'off')
          this.publisher.publishAudio(false);
        }
      } else {
        alert('initiate a session *************' + this.sessionId);

        this.session.on('streamCreated', async (event) => {
         // alert(event.stream.videoType);
         
            if(this.streamStarted == 'Stopped'){
              this.startStopWatch();
              if(this.webinarInfo.webinarChatDetails || this.webinarInfo.webinarChatDetails.length > 0)
              this.updateCoahMessages();
              if(this.webinarInfo.webinarOffer && (this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null))
              this.showOffer();
              if(this.webinarInfo.webinarChatDetails && this.webinarInfo.webinarChatDetails.length > 0)
              this.updateCoahMessages();
              this.streamStarted = 'Started';
            }else if(this.streamStarted == 'Paused'){
              console.log("Webinar start time:"+this.webinarInfo.webinarStartTime)
              if(this.webinarInfo.webinarChatDetails || this.webinarInfo.webinarChatDetails.length > 0)
              this.updateCoahMessages();
              if(this.webinarInfo.webinarOffer && (this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null))
              this.showOffer();
              if(this.webinarInfo.webinarChatDetails && this.webinarInfo.webinarChatDetails.length > 0)
              this.updateCoahMessages();
              //this.startStopWatch();
              this.streamStarted = 'Started';
            }
          if ($("#webinar-starting-soon").is(':visible')) {
            $("#webinar-starting-soon").hide();
          }
          $("#clinetLoader").hide();
          if (event.stream.videoType === 'screen') {
            // This is a screen-sharing stream published by another client
            $('#consumer-screen').html('');
            $('#consumer-screen').append(consumerscreendiv);
            console.log("This is a screen-sharing stream published by another client");

            //alert("this is screen to consumer--->"+event.stream.videoType)
            this.session.subscribe(event.stream, 'subscriber', {
              width: 'auto',
              height: '100vh'
            }, (err) => {
              if (err) {
                alert(err.message);
              }
            });
          } else {
            $('#consumer-screen').html('');
            $('#consumer-screen').append(consumerscreendiv);
            this.session.subscribe(event.stream, 'subscriber', {
              width: 'auto',
              height: '100vh'
            }, (err) => {
              if (err) {
                alert(err.message);
              }
            });
          }
        });
        this.session.on('streamDestroyed', (event)=>{
         // alert("Stream destroyed");
          $('#clinetLoader').show();
          console.log(event);
        })
      }
    }
  }

  async sendMessage() {
    console.log(this.message);
    //  this.message= this.message+"#"+this.user.firstName+"#"+this.user.id+"#"+this.user.profilePicture
    if (this.session) {
      this.disableMessageSendButton = false;
      console.log("Message:" + this.message);
      this.messageData = {};
      this.messageData.description = this.message;
      this.messageBy.id = this.user.id;
      this.messageData.messageBy = this.messageBy;
      if (this.messageTo.id) {
        this.messageData.messageTo = this.messageTo;
      }

      this.messageData = await this.webinarAPI.saveMessages(this.webinarId, this.messageData,this.registrationTime);
     
      if (this.messageData.status == "SUCCESS") {
        this.data.type = "message";
        this.messageData = this.messageData.data;
        this.data.message = this.message;
        this.data.userName = this.user.firstName + " " + this.user.lastName
        this.data.userId = this.user.id;
        this.data.profilePicture = this.user.profilePicture
        this.data.messageId = this.messageData.id;
        this.session.signal({
          type: 'msg',
          data: JSON.stringify(this.data)
        }, (error) => {
          if (error) {
            console.error('Error sending signal:', error.name, error.message);
          } else {
            this.disableMessageSendButton = true;
            this.message = '';
            this.messageData = {};
            this.messageBy = {};
            this.messageTo = {};
            this.data = {};
            this.ref.detectChanges();
          }
        });
      }else{
        this.disableMessageSendButton = true;
        alert("Unable to send message");
      }
    } else {
      alert("You Cannot send a message until the webinar has started")
    }
  }

  async likeMessage(messageId) {
    this.messageData = await this.webinarAPI.saveLikes(this.webinarId, messageId, this.user.id);
   
    if (this.messageData.status == "SUCCESS") {
      this.data.type = "like";
      this.data.messageId = messageId;
      this.data.likeMessage = this.messageData.message;
      console.log()
      this.session.signal({
        type: 'msg',
        data: JSON.stringify(this.data)
      }, (error) => {
        if (error) {
          console.error('Error sending signal:', error.name, error.message);
        } else {
          this.message = '';
          this.messageData = {};
          this.data = {};
        }
      });
    }
  }

  reply(msg) {
    this.messageTo.id = msg.userId;
    var firstName = msg.user.split(" ");
    
    this.message = "@" + firstName[0];
    console.log(this.message)
  }
  showJoineList() {
    if ($(".tabs__tab--chat").hasClass("active")) {
      $(".tabs__tab--chat").removeClass("active")
      $(".tabs__tab--attds").addClass("active")
      $("#webinarJoineList").show();
      $("#webinarChatBox").hide();
    }
  }

  videoShared: any = false;
  screenShared = false;
  screenPublish() {
    this.session.publish(this.screenSharingPublisher, (err) => {
      if (err) {
        this.screenShared = false;
      } else {
        this.publisher.publishVideo(false);
      }
    });
  }
  screenshare() {
    OT.registerScreenSharingExtension('chrome', this.common.CHROME_EXTENSION_ID, 2);
    //var screenContainerElement = document.createElement('div');
    if (this.webinarHasStarted == true) {
      if (this.screenShared == false) {
        //alert(this.screenShared)
        OT.checkScreenSharingCapability(response => {
          console.info(response);
          if (!response.supported || response.extensionRegistered === false) {
            alert('This browser does not support screen sharing.');
          } else {
           // alert('Starting Screen Sharing');
            // console.log("======" + screenContainerElement + "-----");
            this.screenShared = true;
            this.publisher.destroy();
           
            //this.publisher.destroy();
            if (this.shareVideoPublisher) {
              this.shareVideoPublisher.destroy();
            }
            if (this.pdfSharingPublisher) {
              this.pdfSharingPublisher.destroy();
            }
            this.screenSharingPublisher = OT.initPublisher('subscriber-sharing',
              {
                videoSource: 'screen', publishAudio: true, publishVideo: true,
                style: {buttonDisplayMode: 'off'}
              });
            if (this.session) {
              if (this.session['isConnected']()) {
                console.log("Inside publish")
                this.screenPublish();
              }
             
            }
            this.screenSharingPublisher.on("mediaStopped", (event) => {
              this.screenShared = false;
             
              if (this.screenShared == false && this.pdfShared == false) {
                this.initOpenTok();
              }
            });
            this.screenSharingPublisher.on('streamDestroyed', (event) => {
              this.screenShared = false;
             
              if (this.videoShared == false && this.pdfShared == false) {
                this.initOpenTok();
              }
            });
          }
        })
      } else {
        alert("already screen is in sharing mode.........");
      }
    }
    else {
      alert("Please Start the webinar first");
    }
  }
  startShareVideo(video) {
    var videoDiv = '<video crossOrigin="anonymous" id="video" width="100%" height="450px" controls autoplay><source  type="video/mp4" ></video>';
    $('#publisher-screen').html('');
    $('#publisher-screen').append(videoDiv);
    $('#video source').attr('src', video.filePath);
    $("#video")[0].load();
    var videoEle = document.getElementById('video');

    let self = this;
    
    this.videoShared = true;
   // alert(this.videoShared)
    this.ref.detectChanges();
   // alert("Video share:" +this.videoShared)
    videoEle.onplay = function () {
    //  alert("Inside Play")
     
      self.video = document.querySelector('#video');
      const stream = self.video.captureStream();
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
     console.log(videoTracks)
     console.log(audioTracks)
      if (videoTracks.length > 0 || audioTracks.length > 0) {
        console.log(videoTracks)
        self.shareVideo();
      }
    };
    this.pdfSrc = "";
    

  }
  shareVideo() {
    clearInterval(this.startVideo);
    console.log(this.webinarHasStarted);
    if (this.webinarHasStarted == true) {
      this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {
        this.session = session;

        this.video = document.querySelector('#video');
        console.log(this.video);
        if (!this.video.captureStream) {
          alert('This browser does not support VideoElement.captureStream(). You must use Google Chrome.');
          return;
        } else {
         // alert("Streaming Video");
          this.stream = this.video.captureStream();
          clearInterval(this.startVideo);
          console.log(this.stream);
          this.publisher.destroy();
          console.log(this.pdfSharingPublisher)
          if (this.pdfSharingPublisher) {
            console.log("Stoping pdfSharing")
            this.pdfShared = false
            this.pdfSharingPublisher.destroy();
           
          }
          if (this.screenSharingPublisher) {
            this.screenSharingPublisher.destroy();
          }
          var publish = () => {
            const videoTracks = this.stream.getVideoTracks();
            const audioTracks = this.stream.getAudioTracks();
            console.log(videoTracks);
            console.log(audioTracks);
            if (videoTracks.length > 0 || audioTracks.length > 0) {
              //clearInterval(startVideo);  
              this.stream.removeEventListener('addtrack', publish);
              this.shareVideoPublisher = OT.initPublisher('subscriber-sharing-video', {
                videoSource: videoTracks[0],
                audioSource: audioTracks[0],
                fitMode: 'contain',
                width: 320,
                height: 240,
                style: {buttonDisplayMode: 'off'}
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
                   // alert('Showing Video *******');
                    this.video.play();
                  });

                }
                if(this.microPhone == 'off'){
                  this.shareVideoPublisher.publishAudio(false);
                }
              });
              this.shareVideoPublisher.on('destroyed', async () => {
                this.videoShared = false
               
                $('#publisher-screen').html('');

                if (this.pdfShared == false && this.screenShared == false) {
                  this.initOpenTok();
                }
              });
            }
          }
          this.stream.addEventListener('addtrack', publish);
          publish();
        };
      })
    } else {
      alert("Please start the webinar first")
    }
  }

  sharePdf() {
   // alert("Show Pdf")
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
      style: {buttonDisplayMode: 'off'}
    }, (err) => {
      if (err) {
        clearInterval(this.pdfInterval);
        alert(err.message);
      } else {
      //  alert("publishing pdf");
        this.session.publish(this.pdfSharingPublisher, function (error) {
         
          if (error) {
            console.log(error);
        //    alert("publish failed");
            // console.error("publish failed");
          }
          //here we are recording screen
        
        //  alert('Showing PDF *******');
        });
      }
     // alert(this.microPhone)
      if(this.microPhone == 'off'){
        this.pdfSharingPublisher.publishAudio(false);
      }
     
    });

    this.pdfSharingPublisher.on('destroyed', async () => {
      clearInterval(this.pdfInterval);
      if (this.videoShared == false && this.screenShared == false && this.pdfShared == false) {
        this.initOpenTok();
      }
    });

  }

  setPdfSrc(pdf) {
    if (this.webinarHasStarted == true) {

      console.log("in setPdfSrc(pdf) clicked pdf is::", pdf);

      // set pdfSrc for binding to work on pdfViewer
      if(pdf.filePath)
      this.pdfSrc = pdf.filePath;
      

    } else {
      alert("Please start the webinar first")
    }
    // this.pdfShared = true;
    // this.showPubScrn = false;

    // this.onPdfLoad(null, true);

  }

  pdfShared: boolean = false;

  onPdfLoad(pdf: any) {

    console.log("pdf completely loaded");
    if (!this.pdfShared) {
      this.sharePdf();
      this.pdfShared = true;
      var pdf: any = document.getElementById("pdf-container");
      pdf.style.display = 'block';
      if (this.shareVideoPublisher) {
        console.log("Destroy share video")
        this.shareVideoPublisher.destroy();
      }
      if (this.screenSharingPublisher) {
        this.screenSharingPublisher.destroy();
      }
    }
  }

  pageVariable: any = 1;

  nextPage() {
    this.pageVariable++;
    //clearInterval(this.pdfInterval);
     this.pdfSharingPublisher.destroy();
   //this.session.unpublish(this.pdfSharingPublisher);
    //this.setPdfSrc(this.pdfSrc)
   setTimeout(() => { this.sharePdf(); }, 500);

  }

  prevPage() {
    if (this.pageVariable >= 1) {
      this.pageVariable--;
     // clearInterval(this.pdfInterval);
     this.pdfSharingPublisher.destroy();
      //this.setPdfSrc(this.pdfSrc)
      setTimeout(() => { this.sharePdf(); }, 500);
    } else {
      alert("First Page has been reached");
    }
  }

  stopPdfSharing() {
  //  alert("Stop PDF Sharing");
    //$('#closePresentation').addClass("hidden");
    //  $('#publisher-screen').removeClass("hidden");
    this.showPubScrn = true;
    var pdf = document.getElementById("pdf-container");
    pdf.style.display = 'none';
    this.pdfShared = false;
    this.pdfSharingPublisher.destroy();
  }

  stopVideoSharing() {
    // $('#stopVideoSharing').addClass("hidden");
    this.videoShared = false;
    this.showPubScrn = true;
    this.shareVideoPublisher.destroy();
  }
  stopScreenSharing() {
    this.screenShared = false;
    this.screenSharingPublisher.destroy();
  }
  showChatBox() {
    if ($(".tabs__tab--attds").hasClass("active")) {
      $(".tabs__tab--attds").removeClass("active")
      $(".tabs__tab--chat").addClass("active")
      $("#webinarJoineList").hide();
      $("#webinarChatBox").show();
    }
  }

  onOffMicroPhone() {
    var x = document.getElementById("microPhnOnOff");
    if (x.innerHTML == 'On') {
     
      if(this.screenShared == true){
        this.publisher.publishAudio(false);
      }else if(this.pdfShared == true){ 
          this.pdfSharingPublisher.publishAudio(false)
      }else {
        this.publisher.publishAudio(false);
      }
      document.getElementById("microPhnOnOff").innerHTML = 'Off';
      this.microPhone = 'off'

    } else {
      document.getElementById("microPhnOnOff").innerHTML = 'On';
      if(this.screenShared == true){
        this.publisher.publishAudio(true);
      }else if(this.pdfShared == true){
        this.pdfSharingPublisher.publishAudio(true)
      }else {
        this.publisher.publishAudio(true);
      }
      this.microPhone = 'on'
    }
  }
  onOfCamera() {
    var x = document.getElementById("cameraPhnOnOff");
    if (x.innerHTML == 'On') {
      this.publisher.publishVideo(false);
      document.getElementById("cameraPhnOnOff").innerHTML = 'Off';
    } else {
      document.getElementById("cameraPhnOnOff").innerHTML = 'On';
      this.publisher.publishVideo(true);
    }
  }

  // Get the modal
  modal: any;

  // Get the button that opens the modal
  btn: any;

  // Get the <span> element that closes the modal
  span: any;

  settingsClick() {

    this.modal = document.getElementById("myModal");

    this.modal.style.display = "block";

    this.btn = document.getElementById("settings");

    this.span = document.getElementsByClassName("close")[0];

    this.testAudio();

    // When the user clicks on <span> (x), close the modal
    // this.span.onclick = function () {
    //   this.modal.style.display = "none";
    //   this.stopCamera();
    // }

    let self = this;

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == self.modal) {
        self.modal.style.display = "none";
      }
    }
  }

  showPlayOpt: any = true;

  playAudio() {
    var x;
    x = document.getElementById("myAudio");
    this.showPlayOpt = false;
    x.play();
    // var butnPlay = document.getElementById("playIcon")
    // var butnPause = document.getElementById("pauseIcon")
    // butnPlay.style.display = 'none';
    // butnPause.style.display = 'block';
  }

  pauseAudio() {
    var x;
    x = document.getElementById("myAudio");
    this.showPlayOpt = true;
    x.pause();
    // var butnPlay = document.getElementById("playIcon")
    // var butnPause = document.getElementById("pauseIcon")
    // butnPlay.style.display = 'none';
    // butnPause.style.display = 'block';
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

  testAudio(fromSave?) {
    // var testScreen = document.getElementById("video-test")

    console.log("selected video/audio options in settings page, selectedCamera: ", this.selectedCamera, "selectedAudioInput: ", this.selectedAudioInput, "selectedAudioOutput", this.selectedAudioOutput);

    if (fromSave) {
      if (this.modal.style.display == 'block') {
        this.stopCamera();
      }
    }else{
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
      // this.camerasListChange();
      // this.startCamera();
      DetectRTC.audioInputDevices.forEach(element => {
        this.audioInputList.push({ "value": element.id, "label": element.label })
      });
      this.selectedAudioInput = this.audioInputList[0];
      this.selectedAudioInput = this.selectedAudioInput.value
      console.log(this.selectedAudioInput);
      this.camerasListChange();
    });
    micTesting();
    this.MeasureConnectionSpeed();
    startInternetSpeed();
  }
    // this.selectedCamera = this.camerasList[0];

    // ;
    // }
  }

  // startCamera() {
  //   this.testVideo = document.getElementById('videoElement');
  //   console.log(navigator.mediaDevices.getUserMedia);
  //   if (navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then(stream => {
  //         this.video.srcObject = stream;
  //       })
  //       .catch((err0r) => {
  //         console.log(err0r)
  //         console.log("Something went wrong!");
  //       });
  //   }
  // }

  downloadSpeed: any;

  MeasureConnectionSpeed() {
    var imageAddr = '/assets/images/people-woman-coffee-meeting.jpg'
    var downloadSize = 4995374;
    var startTime, endTime;
    var download = new Image();

    let self = this;

    download.onload = function () {
      endTime = (new Date()).getTime();
      showResults();
    }

    download.onerror = ((err, msg) => {
      alert("Invalid");
    })

    startTime = (new Date()).getTime();
    // var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr;
    //  + cacheBuster;

    function showResults() {
      var duration = (endTime - startTime) / 1000;
      var bitsLoaded = downloadSize * 8;
      var speedBps;
      speedBps = (bitsLoaded / duration).toFixed(2);
      var speedKbps;
      speedKbps = (speedBps / 1024).toFixed(2);
      var speedMbps = (speedKbps / 1024).toFixed(2);

      self.downloadSpeed = speedMbps;

      alert("Your connection speed is:"
        + speedBps + " bps"
        + speedKbps + " kbps"
        + speedMbps + " Mbps");


    }
  }

  async stopCamera() {
    this.testVideo = document.getElementById("videoElement")
    let stream = this.testVideo.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.testVideo.srcObject = null;
    this.modal.style.display = 'none';
  }

  toggle: any = false;

  toggleChat() {

    this.toggle = !this.toggle;
    if($("#centerDiv").hasClass('col-lg-9')){
      $("#centerDiv").removeClass('col-lg-9')
      $("#centerDiv").addClass('col-lg-12')
    }else{
      $("#centerDiv").removeClass('col-lg-12')
      $("#centerDiv").addClass('col-lg-9')
    }
    if (this.toggle) {
      document.getElementById("tabs").style.display = "none";
      document.getElementById("side-togglers").style.left = "90%";
      //document.getElementById("cf-arrow").style.transform = "none";
    } else {
      document.getElementById("tabs").style.display = "block";
      document.getElementById("side-togglers").style.left = "-30px";
     // document.getElementById("cf-arrow").style.transform = "rotateZ(180deg)";
    }
  }

  // Starting Timmer For the video
  // clsStopwatch() {
  // Private vars
  startAt = 0;	// Time of last start / resume. (0 if not running)
  lapTime = 0;	// Time on the clock when last stopped in milliseconds

  now() {
    return (new Date()).getTime();
  };

  // Public methods
  // Start or resume
  start() {
    this.startAt = this.startAt ? this.startAt : this.now();
  };

  // Stop or pause
  stop() {
    // If running, update elapsed time otherwise keep it
    if (this.webinarInfo.webinarStartTime == null)
      this.lapTime = this.startAt ? this.lapTime + this.now() - this.startAt : this.lapTime;
    else
      this.lapTime = this.startAt ? this.lapTime + this.now() - this.webinarInfo.webinarStartTime : this.lapTime;
    this.startAt = 0; // Paused
  };

  // Reset
  reset() {
    this.lapTime = this.startAt = 0;
  };

  // Duration
  time() {
    return this.lapTime + (this.startAt ? this.now() - this.startAt : 0);
  };

  webinarStartTime() {
    return this.lapTime + (this.startAt ? this.now() - this.webinarInfo.webinarStartTime : 0);
  };
  // };
  clocktimer: any;
  offerTime = document.getElementById("");
  messageDisplayed = [];
  watched = [];
  watchedUser = 0;
  $time: any;

  update(thisRef) {
    let self = thisRef;
    //if(this.user.uRole.role == "MAIN_USER"){
    if (!this.webinarInfo.webinarStartTime || this.webinarInfo.webinarStartTime == null || this.webinarInfo.webinarStartTime == undefined) {
      this.$time.innerHTML = self.formatTime(this.time());
    } else {
      this.$time.innerHTML = self.formatTime(this.webinarStartTime());
    }
    // }
    // else if(this.user.uRole.role == "CLIENT")
    // {
    //   this.$time.innerHTML = self.formatTime(self.webinarStartTime());
    // }
  }

  pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
  }

  formatTime(time) {
    var h = 0;
    var m = 0;
    var s = 0;
    var ms = 0;
    var newTime = '';

    h = Math.floor(time / (60 * 60 * 1000));
    time = time % (60 * 60 * 1000);
    m = Math.floor(time / (60 * 1000));
    time = time % (60 * 1000);
    s = Math.floor(time / 1000);
    ms = time % 1000;

    newTime = this.pad(h, 2) + ':' + this.pad(m, 2) + ':' + this.pad(s, 2);
    return newTime;
  }

  startStopWatch() {
    // alert("Start timer")
  //  alert("Webinar time:" + this.webinarInfo.webinarStartTime)
    let self = this;
    this.clocktimer = setInterval(function () {
      self.update(self)
    }, 1);
    this.start();
  }
  updateCoahMessages() {

    var timer = setInterval(() => {
      if (this.chatlength > 0) {
        this.showCoachMessages();
      } else {
        clearInterval(timer);
      }

    }, 1000);
  }
  stopStopWatch() {
    this.stop();
  }
  showCoachMessages() {
    var webinarTime = $('#time').html();
    if(webinarTime) {
    webinarTime = webinarTime.split(":");
    var wt = parseInt(webinarTime[0]) * 120 + parseInt(webinarTime[1]) * 60 + parseInt(webinarTime[2]);
    //var messageDisplayed=[];

    if (this.chatlength > 0) {
      this.webinarInfo.webinarChatDetails.forEach(chat => {
        if (!this.messageDisplayed.includes(chat.id)) {
          var chatTime = chat.chatTimeInHour * 120 + chat.chatTimeInMinute * 60 + chat.chatTimeInSecond;

          if (chatTime <= wt) {
            console.log(chatTime + ":" + wt);
            console.log("Sending message");
            this.messageDisplayed.push(chat.id);
            this.messageHistory.push({
              "message": chat.chatDesc,
              "user": this.webinarInfo.mainUser.firstName + " " + this.webinarInfo.mainUser.lastName,
              "userId": this.webinarInfo.mainUser.id,
              "picture": this.webinarInfo.mainUser.profilePicture,
              "initials": this.webinarInfo.mainUser.firstName.charAt(0) + this.webinarInfo.mainUser.lastName.charAt(0),
              "messageId": chat.id,
              "likeCount": chat.webinarMessageLikes.length
            })
            this.ref.detectChanges();
            // this.data.type = "message";
            // this.data.message = chat.chatDesc;
            // this.data.userName = this.webinarInfo.mainUser.firstName + " " + this.webinarInfo.mainUser.lastName
            // this.data.userId = this.webinarInfo.mainUser.id;
            // if (this.webinarInfo.mainUser.profilePicture) this.data.profilePicture = this.webinarInfo.mainUser.profilePicture
            // this.data.messageId = chat.id;
            // this.session.signal({
            //   type: 'msg',
            //   data: JSON.stringify(this.data)
            // }, (error) => {
            //   if (error) {
            //     console.error('Error sending signal:', error.name, error.message);
            //   } else {
            //     this.message = '';
            //     this.messageData = {};
            //     this.messageBy = {};
            //     this.messageTo = {};
            //     this.data = {};
            //   }
            // });
            this.chatlength--;
          }
        }
      })
    }
  }
  }

  showOffer() {

    var timer = setInterval(() => {
      var webinarTime = $('#time').html();
      webinarTime = webinarTime.split(":");
      var wt = parseInt(webinarTime[0]) * 120 + parseInt(webinarTime[1]) * 60 + parseInt(webinarTime[2]);
      var offerTime = this.webinarInfo.webinarOffer.videoHour * 120 + this.webinarInfo.webinarOffer.videoMins * 60 + this.webinarInfo.webinarOffer.videoSecs;
      // console.log(offerTime+":"+wt);
      if (offerTime <= wt) {
        console.log(offerTime + ":" + wt);
        console.log(this.webinarInfo.webinarOffer)
        $('#offerDive').show();
        $('#offerButton').css("background-color", this.webinarInfo.webinarOffer.offerBtnColor);
        clearInterval(timer);
      }
    })

  }
  closeWebinar() {
    this.webinarHasStarted = false;
    $("#stop-webinar").hide();
    this.endWebinar();
  }
  continueWebinar() {
    $("#stop-webinar").hide();
    this.videoShared = false;
    this.screenShared = false;
    this.pdfShared = false;
    this.initOpenTok();
  }

  async endWebinar() {

    if (this.webinarHasStarted == true) {
      console.log( document.querySelector(".OT_widget-container video"));
      this.testVideo = document.querySelector(".OT_widget-container video")
      let stream = this.testVideo.srcObject;
        console.log(stream);
         let tracks = stream.getTracks();
          console.log(tracks);
          stream.getTracks().forEach(track => track.stop())
      if (this.publisher){
        this.publisher.destroy();
      } 
      if (this.pdfSharingPublisher){  this.pdfShared = false; this.pdfSharingPublisher.destroy(); }
      if (this.shareVideoPublisher) this.shareVideoPublisher.destroy();
      if (this.screenSharingPublisher) this.screenSharingPublisher.destroy();
      $('#publisher-screen').html('');
      $("#start-count-down").hide();
      $("#stop-webinar").show();

    } else {
      // no.ofJoinee, attendees logic
      this.stopStopWatch();
      // @if(LoginController.isLoggedIn() && LoginController.getLoggedInUser.equals(appUser)){
      console.log(">>>>leave button clicked >>>>>");
      //watched= [{131,'00:01:30'},{150,'00:00:10'}];
      var i = 0;

      var webinarTime = $('#time').html();
      for (var i = 0; i < this.watched.length; i++) {
        if (this.watched[i].present == true) {
          this.watched[i].time = webinarTime;
        }
      }
      webinarTime = webinarTime.split(":");
      var wt = webinarTime[0] * 120 + webinarTime[1] * 60 + webinarTime[2];
      wt = (wt * 4) / 5;
      console.log("Webinar 80% Time: " + wt);
      console.log(this.watched);
      for (i = 0; i < this.watched.length; i++) {
        var obj = this.watched[i];
        var t = obj.time.split(":");
        var s = t[0] * 120 + t[1] * 60 + t[2];
        console.log("Client Time: " + s);
        if (s >= wt) {
          this.watchedUser++;
        }
      }
      this.data = {};
      this.data.type = "endWebinar";
      this.session.signal({
        type: 'msg',
        data: JSON.stringify(this.data)
      }, (error) => {
        if (error) {
          console.error('Error sending signal:', error.name, error.message);
        } else {
          this.data = {};
        }
      });


      this.session.disconnect();
      await this.webinarAPI.stopArchiveWebinar(this.webinarId, this.noOfJoine, this.watchedUser, null)
      localStorage.removeItem("webinarId");
      localStorage.removeItem("urlAfterLogin");
      localStorage.removeItem("webinarRegistrationTime");

    }

  }

  countActionUser(){

    this.webinar.countUser(this.webinarId,'offerPage',this.registrationTime).subscribe(register=>{
      console.log(register)
    })
  }
  goFullscreen(){
    console.log('inside ful screen');
    this.fullScreen = true;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    this.fullScreen = false;
    console.log('inside close full');
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (this.documentEle.mozCancelFullScreen) {
      /* Firefox */
      this.documentEle.mozCancelFullScreen();
    } else if (this.documentEle.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.documentEle.webkitExitFullscreen();
    } else if (this.documentEle.msExitFullscreen) {
      /* IE/Edge */
      this.documentEle.msExitFullscreen();
    }
  }
  serverError(data){
    Swal.fire({
      text: data.message,
      type: 'warning',
    }).then(result=>{
      if(result){
        this.router.navigate(['/']);
      }
    });
  }
}
