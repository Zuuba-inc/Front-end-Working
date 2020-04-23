import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Inject } from '@angular/core';
import { EmbedVideoService } from 'ngx-embed-video';
import { Router, ActivatedRoute } from "@angular/router";
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import { OpentokService } from 'src/app/components/client/webinar/opentok-demo/opentok.service';
import { Common } from 'src/app/services/global/common';
import * as $ from 'jquery';
import { AuthapiserviceService } from "src/app/services/coach/global/authapiservice.service";
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment'; // add this 1 of 4
import { DomSanitizer } from '@angular/platform-browser';
import Vimeo from '@vimeo/player';
import Swal from "sweetalert2";
@Component({
  selector: 'app-auto-webinar-strem-page',
  templateUrl: './auto-webinar-strem-page.component.html',
  styleUrls: ['./auto-webinar-strem-page.component.css']
})
export class AutoWebinarStremPageComponent implements OnInit {
  changeDetectorRef: ChangeDetectorRef;

  vimeoUrl = 'https://vimeo.com/197933516'; fullScreen: boolean = false;
  youtubeUrl = 'https://www.youtube.com/watch?v=iHhcHTlGtRs';
  elem; webinarTime: any; webinarRegistrationTime: any;
  vimeoId = '197933516';
  youtubeId = 'iHhcHTlGtRs'; videoDuration: any;
  webinarHasStarted = false;
  webinarId;
  userId;
  registrationTime;
  webinarInfo: any = {
    mainUser: {}
  };
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;
  public iframe: any;
  user: any = {
    uRole: {}
  };
  token;
  sessionId;
  session;
  joiniArray = [];
  noOfJoine = 0;
  data: any;
  messageHistory = [];
  messageData: any = {};
  message;
  messageTo: any = {}
  messageBy: any = {}
  disableMessageSendButton = true;
  distance;
  day;
  min;
  hrs;
  sec;
  replay = false;
  replayTimeSlot;
  sidePanelOpened = true;
  chatlength = 0;
  timeSlot;current_url : any ;
  constructor(
    private opentokService: OpentokService,
    private route: ActivatedRoute,
    private router: Router,
    private webinar: WebinarAPIService,
    private common: Common,
    private ref: ChangeDetectorRef, @Inject(DOCUMENT) private documentEle: any, private sanitizer: DomSanitizer) {
    this.changeDetectorRef = ref;
  }

  ngOnInit() {

    this.$time = document.getElementById('time');

    console.log('inside init');
    this.elem = document.documentElement;

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.webinarId = params['id'];
        localStorage.setItem("webinarId", this.webinarId);
      } else {
        this.webinarId = localStorage.getItem("webinarId");
      }
      console.log(params['replay']);
      if (params['replay']) {
        this.replay = params['replay']
        localStorage.setItem("replay", "true");
      }else if(localStorage.getItem("replay")){
        this.replay = true;
      }
      if(params['replayTimeSlot']){
        this.replayTimeSlot = params['replayTimeSlot']
        localStorage.setItem("replayTimeSlot", this.replayTimeSlot);
      }else if(localStorage.getItem("replayTimeSlot")){
        this.replayTimeSlot  = localStorage.getItem("replayTimeSlot");
      }
      if(params['timeSlot']){
        this.timeSlot = params['timeSlot']
        localStorage.setItem("timeSlot", this.timeSlot);
      }else if(localStorage.getItem("timeSlot")){
        this.timeSlot  = localStorage.getItem("timeSlot");
      }
      this.checkToken();
    });

  }

  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  getVideoId(videoUrl){
    var url = new URL(videoUrl);
    var searchParams3 = new URLSearchParams(url.search);
    let pathandQuery = url.pathname;
     console.log(pathandQuery);
    this.video = searchParams3.get("v")
  }

  getVimeoId(vimeoUrl){
    var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
        
    var match = vimeoUrl.match(regExp);

    if (match){
        this.video = match[5];
    }else{
        alert("not a vimeo url");
    }
  }

  checkToken() {

    var token = localStorage.getItem("token");
     console.log(token)
    
    if (!token || token == null || token == undefined) {
      localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
      this.router.navigate(['/login']);
    } else {
      this.checkWebinarStatus();
    }
  }

  async checkWebinarStatus() {
    this.init();
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if (this.replay == false) {
      let webinar:any = await this.webinar.getWebinar(this.webinarId, 'all')

        if (webinar) {
        
        if (webinar.status == "SUCCESS") {
          this.webinarInfo = webinar;
          this.user = localStorage.getItem("currentUser");
          this.user = JSON.parse(this.user);
          this.timeSlot = new Date(this.timeSlot);
          this.timeSlot = this.timeSlot.getFullYear() + "-" + (this.timeSlot.getMonth() + 1) + "-" + this.timeSlot.getDate() + " " + this.timeSlot.getHours() + ":" + this.timeSlot.getMinutes();
          var user;
          //  console.log(this.user)
          this.webinarInfo = this.webinarInfo.data.webinar;
          this.youtubeUrl = this.webinarInfo.webinarUrl;
          if (this.youtubeUrl.indexOf('youtube') > 0)
          {
            this.getVideoId(this.youtubeUrl);
           // this.video = this.youtubeUrl.split('v=')[1];
          }
          else if(this.youtubeUrl.indexOf('vimeo') > 0){
            this.getVimeoId(this.youtubeUrl);
          }
          var totalSecs = (this.webinarInfo.webinarDurationHrs * 60 * 60) + (this.webinarInfo.webinarDurationMins * 60) + (this.webinarInfo.webinarDurationSecs);
          console.log('total sec : ' + totalSecs);
          this.videoDuration = totalSecs;
          this.chatlength = this.webinarInfo.webinarChatDetails.length;
          this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.forEach(timeSlot =>{
            console.log(timeSlot.eventTime)
           var webTimeSlot = timeSlot.eventTime.split('T');
          timeSlot.eventTime = new Date(webTimeSlot[0] + ' '+webTimeSlot[1].split('.')[0 ]);
          })
         
          this.webinarInfo.webinarRegisteredUsers.forEach(element => {
              var userRegTime = element.registrationTime.split('T');
              element.registrationTime = new Date(userRegTime[0] + ' '+userRegTime[1].split('.')[0 ]);
              if(element.appUserId == this.user.id ){
                console.log("========= Time Slot ===============")
                console.log(new Date(this.timeSlot).getTime() === new Date(element.registrationTime).getTime())
                console.log(new Date(this.timeSlot).getTime()+" : "+ new Date(element.registrationTime).getTime())
            
                var newRegistrtionTime = new Date(element.registrationTime)
                newRegistrtionTime.setHours(newRegistrtionTime.getHours() + this.webinarInfo.webinarDurationHrs )
                newRegistrtionTime.setMinutes(newRegistrtionTime.getMinutes() + this.webinarInfo.webinarDurationMins )
                newRegistrtionTime.setSeconds(newRegistrtionTime.getSeconds() + this.webinarInfo.webinarDurationSecs )
                if(newRegistrtionTime.getTime() > new Date().getTime() && new Date(this.timeSlot).getTime() === new Date(element.registrationTime).getTime()){
                  if(user == null || user == undefined){
                    user = element;
                    user.registrationTime = element.registrationTime;
                    var time = element.registrationTime;
                    this.registrationTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
                    this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
                  }
               }
          }
          });
          if (user != undefined || user != null) {
            this.selectTime(user.registrationTime);
          } else {
            if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
              this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'true'} });
             }else{
              this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'false'} });
             }
          }


        } else {
          this.serverError(webinar);
        }
      }
      // })
    } else {
      this.replayWebinar()
    }

  }

  
  async replayWebinar() {

    $('#count-down').hide();
    var webinar:any = await this.webinar.getWebinarReplay(this.webinarId,this.replayTimeSlot);
    console.log(webinar);
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.webinarInfo = webinar;
    console.log(this.webinarInfo)
    if (this.webinarInfo.status == "SUCCESS") {
      this.user = JSON.parse(localStorage.getItem("currentUser"));
      console.log(this.user);
      this.webinarInfo = this.webinarInfo.data.webinar;
      
        this.webinarInfo.webinarChatDetails.forEach(chat=>{
          this.messageHistory.push({
            "message": chat.chatDesc,
            "user": this.webinarInfo.mainUser.firstName + " " + this.webinarInfo.mainUser.lastName,
            "userId": this.webinarInfo.mainUser.id,
            "picture": this.webinarInfo.mainUser.profilePicture,
            "initials": this.webinarInfo.mainUser.firstName.charAt(0) + this.webinarInfo.mainUser.lastName.charAt(0),
            "messageId": chat.id,
            "likeCount": chat.webinarMessageLikes.length
          })
        })

      localStorage.removeItem("replay");
     
      if(this.webinarInfo.webinarOffer)
    { 
      if(this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
        $("#offerDive").show();
        $('#offerButton').css("background-color", this.webinarInfo.webinarOffer.offerBtnColor);
      }
     
    }
      console.log(this.webinarInfo)
      if (this.webinarInfo.webinarType == 'live') {
        if (this.webinarInfo.webinarLiveDtl.enableReplay == true) {
          if(!localStorage.getItem("funnelReplay")){
          this.webinarInfo.webinarRegisteredUsers.forEach(element => {
            if(element.appUserId == this.user.id ){
                  var time = element.registrationTime;
                  this.registrationTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
                  this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
            }
        });
      }else{
        localStorage.removeItem("funnelReplay");
               var time = new Date(this.replayTimeSlot);
               this.registrationTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
               this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
      }
          this.getWebinarMessages();
          var videoDiv = '<video id="video" width="100%" height="450px" controls autoplay><source  type="video/mp4" ></video>';
          $('#player').html('');
          $('#player').append(videoDiv);
          $('#video source').attr('src', this.webinarInfo.webinarUrl);
          $("#video")[0].load();
          var videoEle = document.getElementById('video');
          console.log(videoEle)
        } else {
          this.router.navigate(['/endWebinar'], { queryParams: { type: 'LinkExpired'} });

        }

      } else {
        var user;    
        if (this.webinarInfo.webinarUrl.indexOf('youtube') > 0)
        {
          this.getVideoId(this.webinarInfo.webinarUrl);
        }
        else if(this.webinarInfo.webinarUrl.indexOf('vimeo') > 0)
        {
          this.getVimeoId(this.webinarInfo.webinarUrl);
        }

        if(!localStorage.getItem("funnelReplay")){
          this.webinarInfo.webinarRegisteredUsers.forEach(element => {
            var userRegTime = element.registrationTime.split('T');
            console.log(element.registrationTime)
            element.registrationTime = new Date(userRegTime[0] + ' '+userRegTime[1].split('.')[0 ]);
            console.log(element.appUserId+":"+this.user.id )
            if(element.appUserId == this.user.id ){
              var replayTime = new Date(this.replayTimeSlot);
              console.log(replayTime+":"+element.registrationTime)
              console.log(replayTime.getTime() === element.registrationTime.getTime())
            
              if(replayTime.getTime() === element.registrationTime.getTime()){
              //  if(this.replay){
                if(user == null || user == undefined){
                  user = element;
                  user.registrationTime = element.registrationTime;
                  var time = element.registrationTime;
                  this.registrationTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
                  this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();

                }
             }
          
        }
        });
        }else{
            user = this.user;
            var time = new Date(this.replayTimeSlot);
            this.registrationTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
            this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
      
        }
        if (user != undefined || user != null) {
          if (user.enableReplaySlot == true || localStorage.getItem("funnelReplay")) {
            this.getWebinarMessages();
            this.YT = window['YT'];
            this.reframed = false;
            if(this.webinarInfo.webinarUrl.indexOf('youtube') > 0){
              var timerwind = setInterval(() => {
                this.player = new window['YT'].Player('player', {
                videoId: this.video,
                width: '100%', height: '100%',
                playerVars: {
                  autoplay: 1,            // Auto-play the video on load
                  controls: 1,            // Show pause/play buttons in player
                  modestbranding: 1,      // Hide the Youtube Logo
                  fs: 1,                  // Hide the full screen button
                  cc_load_policy: 0,      // Hide closed captions
                  iv_load_policy: 3,      // Hide the Video Annotations
                  autohide: 0, // Hide video controls when playing
                  },
                events: {
                  'onReady': (e) => {
                    console.log('ready');
                    this.iframe = $('#player');
                    e.target.mute();
                    e.target.playVideo();
                    if (!this.reframed) {
                      this.reframed = true;
                      //    reframe(e.target.a);
                      clearInterval(timerwind);
                    }
                  },
                  'onStateChange':(e)=>{
                    console.log(e);
                    localStorage.removeItem("funnelReplay");
                    if(e.data === 0) {          
                      if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
                        this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'true'} });
                      }else{
                        this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'false'} });
                      }
                    }
                  } 
                }
                });
              });
            }
            else if(this.webinarInfo.webinarUrl.indexOf('vimeo') > 0){
              var options = {
                id: this.video,
                autoplay: 1,
                responsive: true
                
                } ;
               this.player = new Vimeo('player', options);
               //this.player.setVolume(0);
               this.player.on('play', () => {
                   console.log('played the video!');
               });

               this.player.on('ended', () => {
                console.log('ended the video!');
                localStorage.removeItem("funnelReplay");
                    this.redirectPage();
               });
           
            }
          } else {
            this.router.navigate(['/endWebinar'], { queryParams: { type: 'LinkExpired'} });
          }
        } else {
          console.log("Link expired")
          this.router.navigate(['/registerForWebinar'], { queryParams: { id: this.webinarInfo.id} });
        }

      }
      localStorage.setItem("webinarRegistrationTime", this.registrationTime);
    } else{
      localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
      this.router.navigate(['/login']);
    }
  }

  async getWebinarMessages(){
    this.data = await this.webinar.getWebinarMessages(this.webinarId,this.registrationTime);    
            console.log("Messages")
            console.log(this.data);
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
            this.data={};
  }
  async selectTime(event) {
    var date = new Date(event)
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.registrationTime = months[date.getMonth()] + " " + date.getDate() + "," + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    localStorage.setItem("webinarRegistrationTime", this.registrationTime);
    this.coutdown();
  }
  coutdown() {

    var countDownTime = new Date(this.registrationTime).getTime();
    //  alert('countDownTime : '+countDownTime);
    var timer = setInterval(() => {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down 
      this.distance = countDownTime - now;
      //alert(this.distance)
      // Time calculations for days, hours, minutes and seconds
      var days, hours, minutes, seconds;

      if (this.distance) {
        days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
        hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        this.day = days;
        this.hrs = hours;
        this.min = minutes;
        this.sec = seconds
        this.ref.detectChanges();
      }
      if (this.distance < 0) {
        console.log("Webinar is going to start");
        this.createSessionId();
        $("#count-down").hide();
        clearInterval(timer);
        console.log(this.registrationTime);
        var startTime = new Date(this.registrationTime).getTime();
        var currentTime = new Date().getTime();
        var diff = currentTime - startTime;

        var endTime = startTime + this.videoDuration;
        var duration = currentTime - endTime;
        console.log('is ended : ' + Math.round(diff / 1000) + ' : ' + this.videoDuration);
        console.log(this.videoDuration + ' : ' + Math.round(diff / 1000));
        console.log(Math.round(diff / 1000));
        if (Math.round(diff / 1000) < this.videoDuration) {
          console.log(this.video);
          //window['onYouTubeIframeAPIReady'] = (e) => {
          this.YT = window['YT'];
          this.startStopWatch();
          if(this.webinarInfo.webinarChatDetails && this.webinarInfo.webinarChatDetails.length > 0)
            this.updateCoahMessages();
          if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null)
            this.showOffer();
          this.reframed = false;
          var timerwind = setInterval(() => {
            console.log('hello');
            //window['onYouTubeIframeAPIReady'] = (e) => {

            let self = this;
            if(this.webinarInfo.webinarUrl.indexOf('youtube') > 0){
            this.player = new window['YT'].Player('player', {
              videoId: this.video,
              width: '100%', height: '100%',
              playerVars: { 'autoplay': 1, 'controls': 0, mute: 1, start: Math.round(diff / 1000) },
              //playerVars: { 'autoplay': 1, 'controls': 0 , mute:1 , playsinline:1},
              events: {
                'onReady': (e) => {
                  console.log('ready');

                  // this is to prevent pause actions on coach/client side
                  // if(self.user.uRole.role == "CLIENT") {
                    // set pointer events to none for client to prevent from pausing YT video
                    let vidContainer: any = document.getElementsByTagName("iframe");
                    vidContainer[0].style.pointerEvents = 'none';
                  // }
                  this.iframe = $('#player');
                  e.target.playVideo();
                  if (!this.reframed) {
                    this.reframed = true;
                    //    reframe(e.target.a);
                  }
                }
              }
            });
          }
          else if(this.webinarInfo.webinarUrl.indexOf('vimeo') > 0){
           var options = {
            id: this.video,
            autoplay: 1,
            controls: 0,
            responsive: true
            } ;
           this.player = new Vimeo('player', options);
           this.player.setVolume(0);
           this.player.setCurrentTime(Math.round(diff / 1000)).then(function(seconds) {
            // seconds = the actual time that the player seeked to
        }).catch(function(error) {
            switch (error.name) {
                case 'RangeError':
                    // the time was less than 0 or greater than the video’s duration
                    break;
         
                default:
                    // some other error occurred
                    break;
            }
        });
 
           this.player.on('play', function() {
               console.log('played the video!');
              
           });
       
            //this.current_url=this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/"+this.video+"?#t=1m&autoplay=1&muted=1");
          }
            clearInterval(timerwind);
            //}
          });
        
          //};
          var timera = setInterval(() => {
            var startTime = new Date(this.registrationTime).getTime();
            var currentTime = new Date().getTime();
            var diff = currentTime - startTime;
            // console.log(Math.round(diff / 1000) + ' : ' + this.videoDuration)  ;
            if (Math.round(diff / 1000) > this.videoDuration) {
              clearInterval(timera);
             
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
              this.webinar.stopArchiveWebinar(this.webinarId, this.noOfJoine, this.watchedUser, this.webinarRegistrationTime)
              this.stopStopWatch();
              if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
                this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'true'} });
               }else{
                this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'false'} });
               }
            }
          });

        }

        else {
          
          if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
            this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'true'} });
           }else{
            this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'false'} });
           }
          this.stopStopWatch();
        }
      }
    }, 1000);


  }
  async createSessionId() {
    let dataWebinar:any;
   this.getWebinarMessages();
    dataWebinar = await this.webinar.generateToken(this.webinarId, this.user.id,this.registrationTime);
    var token = dataWebinar;
    console.log(token.data);
    if (token.statusCode == 200) {
      this.token = token.data.tokenId;
      this.sessionId = token.data.sessionId;
    }
    if (this.token && this.sessionId) {
      this.opentokService.initSession({ API_KEY: this.common.API_KEY, TOKEN: this.token, SESSION_ID: this.sessionId }).then((session: OT.Session) => {
        this.session = session;
        this.opentokService.connect().then(x => {
          console.log("Session Connected: ")
          console.log(x);
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
            this.messageHistory.push({
              "message": this.data.message,
              "user": this.data.userName,
              "userId": this.data.userId,
              "picture": this.data.profilePicture,
              "initials": userInitial,
              "messageId": this.data.messageId,
              "likeCount": 0
            })
            console.log(this.messageHistory);
            this.ref.detectChanges();
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
            this.noOfJoine++;
            this.joiniArray.push({ "userName": eventData.username, "initial": userInitial, "id": eventData.userid, "photo": eventData.profilepicture })
            this.ref.detectChanges();

          console.log(this.joiniArray)

        })
        this.session.on('connectionDestroyed', (event) => {
          console.log(event.connection.connectionId + ":" + this.session.connection.connectionId)
          console.log(event.connection.data)
          var eventData = event.connection.data;
          eventData = JSON.parse(eventData);

          console.log(eventData)
          var index = 0;
          for (var i = 0; i < this.joiniArray.length; i++) {
            console.log(this.joiniArray[i].id + ":" + eventData.userid)
            if (this.joiniArray[i].id == eventData.userid) {
              index = i;
            }
          }
          console.log(index);
          this.joiniArray.splice(index, 1);
          //this.joiniArray.push({ "userName": eventData.username, "initial": userInitial, "id": eventData.userid, "photo": eventData.profilepicture })
          this.ref.detectChanges();
          // logic for setting present to false
          for (var i = 0; i < this.watched.length; i++) {
            if (this.watched[i].user == eventData.userid) {
              this.watched[i].time = $('#time').html();
              this.watched[i].present = false;
            }
          }
          // console.log(this.joiniArray)

        })
      })
        .catch((err) => {
          console.error(err);
          console.log('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
        });
    }
  }
  async sendMessage() {
    console.log(this.message);
    //  this.message= this.message+"#"+this.user.firstName+"#"+this.user.id+"#"+this.user.profilePicture
    console.log("Message:" + this.message);
    this.disableMessageSendButton = false;
    this.messageData = {};
    this.messageData.description = this.message;
    this.messageBy.id = this.user.id;
    this.messageData.messageBy = this.messageBy;
    if (this.messageTo.id) {
      this.messageData.messageTo = this.messageTo;
    }
    if (this.session != null || this.session != undefined) {
      this.messageData = await this.webinar.saveMessages(this.webinarId, this.messageData,this.webinarRegistrationTime);
      console.log(this.messageData)
      // this.messageData = JSON.parse(this.messageData["_body"])
      if (this.messageData.status == "SUCCESS") {
        this.data={};
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
            this.disableMessageSendButton = true;
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
      }
    } else {
      console.log("You cannot send a message untill webinar starts")
    }


  }

  receiveMessage() {

  }
  async likeMessage(messageId) {
    if(this.session){
    this.messageData = await this.webinar.saveLikes(this.webinarId, messageId, this.user.id);
    // this.messageData = JSON.parse(this.messageData["_body"]);
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
  }

  reply(msg) {
    this.messageTo.id = msg.userId;
    var firstName = msg.user.split(" ");
    this.message = "@" + firstName[0];
    console.log(this.message)
  }
  showChatBox() {
    if ($(".tabs__tab--attds").hasClass("active")) {
      $(".tabs__tab--attds").removeClass("active")
      $(".tabs__tab--chat").addClass("active")
      $("#webinarJoineList").hide();
      $("#webinarChatBox").show();
    }
  }

  showJoineList() {
    if ($(".tabs__tab--chat").hasClass("active")) {
      $(".tabs__tab--chat").removeClass("active")
      $(".tabs__tab--attds").addClass("active")
      $("#webinarJoineList").show();
      $("#webinarChatBox").hide();
    }
  }
  mueUnMuteVideo() {
    if (this.webinarInfo.webinarUrl.indexOf('youtube') > 0){
        if (!this.player.isMuted()){
          this.player.mute();
          document.getElementById("muteUnmute").innerHTML = 'UnMute';
        }
        else{
          this.player.unMute();
          document.getElementById("muteUnmute").innerHTML = 'Mute';
        }
    }
    else if(this.webinarInfo.webinarUrl.indexOf('vimeo') > 0){

      this.player.getMuted().then((muted) => {
        // muted = whether muted is turned on or not
        if(!muted)
        {
          
          this.player.setMuted(true).then(muted => {
            // muted was turned on
            document.getElementById("muteUnmute").innerHTML = 'UnMute';
        }).catch(function(error) {
            // an error occurred
        });
          
        }
        else{
          this.player.setMuted(false).then(muted => {
            // muted was turned on
            document.getElementById("muteUnmute").innerHTML = 'Mute';
        }).catch(function(error) {
            // an error occurred
        });
        }
    }).catch(function(error) {
        // an error occurred
    });
  
  }
      
     
  }

  playFullscreen() {
    console.log('inside');
    this.player.playVideo();//won't work on mobile

    var requestFullScreen = this.iframe.requestFullScreen || this.iframe.mozRequestFullScreen || this.iframe.webkitRequestFullScreen;
    console.log(this.player.requestFullScreen);

    /*if (requestFullScreen) {
      requestFullScreen.bind(this.iframe)();
    }*/
  }

  goFullscreen() {
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

  toggle: any = false;

  

  toggleChat() {

    this.toggle = !this.toggle;

    if (this.toggle) {
      document.getElementById("tabs").style.display = "none";
      document.getElementById("side-togglers").style.left = "98%";
      document.getElementById("cf-arrow").style.transform = "none";
      document.getElementById("player").style.width = "100vw";
      document.getElementById("player").style.height = "92vh";
    } else {
      document.getElementById("tabs").style.display = "block";
      document.getElementById("side-togglers").style.left = "73%";
      document.getElementById("cf-arrow").style.transform = "rotateZ(180deg)";
      document.getElementById("player").style.width = "inherit";
      document.getElementById("player").style.height = "92vh";
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
    // return this.lapTime + (this.startAt ? this.now() - this.webinarInfo.webinarStartTime : 0);
    return this.lapTime + (this.startAt ? this.now() - new Date(this.registrationTime).getTime() : 0);
  };
  // };

  // x: any = this.clsStopwatch();
  clocktimer: any;
  offerTime = document.getElementById("");
  // length = @chat.size();
  messageDisplayed = [];
  watched = [];
  watchedUser = 0;
  $time: any;

  update(thisRef) {

    let self = thisRef;

    this.user = localStorage.getItem("currentUser");
    this.user = JSON.parse(this.user);

    this.$time.innerHTML = self.formatTime(self.webinarStartTime());
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
    // console.log("Start timer")
    let self = this;
    this.clocktimer = setInterval(function () {
      self.update(self)
    }, 1);
    this.start();
  }
  stopStopWatch() {
    this.stop();
  }
  showCoachMessages() {
    var webinarTime = $('#time').html();
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
            var userInitial = this.webinarInfo.mainUser.firstName.charAt(0) + this.webinarInfo.mainUser.lastName.charAt(0);
            this.messageHistory.push({
              "message": chat.chatDesc,
              "user": this.webinarInfo.mainUser.firstName + " " + this.webinarInfo.mainUser.lastName,
              "userId": this.webinarInfo.mainUser.id,
              "picture": this.webinarInfo.mainUser.profilePicture,
              "initials": userInitial,
              "messageId": chat.id,
              "likeCount": chat.webinarMessageLikes.length
            })
            this.chatlength--;
          }

        }
      })
    }
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

  showOffer() {

    var timer = setInterval(() => {
      var webinarTime = $('#time').html();
      webinarTime = webinarTime.split(":");
      var wt = parseInt(webinarTime[0]) * 120 + parseInt(webinarTime[1]) * 60 + parseInt(webinarTime[2]);
      var offerTime = this.webinarInfo.webinarOffer.videoHour * 120 + this.webinarInfo.webinarOffer.videoMins * 60 + this.webinarInfo.webinarOffer.videoSecs;
      console.log(offerTime + ":" + wt);
      if (offerTime <= wt) {
        console.log(offerTime + ":" + wt);
        console.log(this.webinarInfo.webinarOffer)
        $('#offerDive').show();
        $('#offerButton').css("background-color", this.webinarInfo.webinarOffer.offerBtnColor);
        clearInterval(timer);
      }
    })

  }
  countActionUser() {
    this.webinar.countUser(this.webinarInfo.id, 'offerPage',this.registrationTime).subscribe(register => {
      console.log(register)
    })
  }

  async redirectPage()
  {
    if(this.webinarInfo.webinarOffer && this.webinarInfo.webinarOffer.videoHour != null || this.webinarInfo.webinarOffer.videoMins != null || this.webinarInfo.webinarOffer.videoSecs != null){
      this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'true'} });
    }else{
      this.router.navigate(['/endWebinar'], { queryParams: { type: 'EndWebinar', offer:'false'} });
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
