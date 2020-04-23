import { Component, OnInit } from "@angular/core";
import { AuthapiserviceService } from "src/app/services/coach/global/authapiservice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";
import * as $ from 'jquery';
import { UserserviceService } from "../../../../services/global/user/userservice.service";
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import { AuthService, SocialUser } from "angularx-social-login";
import * as moment from 'moment'; // add this 1 of 4

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider
} from "angularx-social-login";
import { JSDocCommentStmt } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';
import { isUndefined } from 'util';
// import { LoadingScreenService } from 'src/app/services/global/loading-screen.service';

@Component({
  selector: "app-webinar-registration-page",
  templateUrl: "./webinar-registration-page.component.html",
  styleUrls: ["./webinar-registration-page.component.css"]
})
export class WebinarRegistrationPageComponent implements OnInit {
  socialUser: SocialUser;
  distance;
  message: any;
  webinarId;
  countDon;
  email;
  webinarTime;
  webinarRegistrationTime;
  disableRegistration = true;
  inTimeRegistration = false;
  webinarSelectedTime;
  webinarInfo: any = {
    webinarType: 'live',
    webinarLiveDtl: {},
    webinarAutoDtl:{}
  };
  user: any = {};
  constructor(
    private authService: AuthapiserviceService,
    private router: Router,
    private loginService: UserserviceService,
    private socialAuthService: AuthService,
    private route: ActivatedRoute,
    private webinar: WebinarAPIService
  ) { }

  ngOnInit() {
    $.each(localStorage, function (key, value) {

      // key magic
      // value magic
      if (key != 'token' && key != 'currentUser')
        localStorage.removeItem(key);

    });

    // this.webinarInfo.webinarType = 'live'
    this.route.queryParams.subscribe(params => {
      this.webinarId = params['id'];
      localStorage.setItem("webinarId", this.webinarId);
      console.log(this.webinarId)
      this.getWebinarInfo();
    });
    //this.webinarCountDown();

  }

  async getWebinarInfo() {

    var response:any;
    response = await this.webinar.getWebinar(this.webinarId, 'all') 
    
    if (response) {
    // .subscribe(async webinar => {
      
      console.log(this.webinarInfo)
      if (response.status == "SUCCESS") {

        var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        this.webinarInfo = response.data.webinar;

        let date;
        if (this.webinarInfo.webinarType == 'live') {
          date = new Date(this.webinarInfo.webinarLiveDtl.webinarLiveDate)
          //alert(date.getDate()+":"+date.getFullYear()+":"+months[date.getMonth()]);
          //var webinarTime = new Date(this.webinarInfo.webinarLiveDtl.webinarLiveTime)
          console.log(this.webinarInfo.webinarLiveDtl.webinarLiveTime);
          var userEventTime = this.webinarInfo.webinarLiveDtl.webinarLiveTime.split('T');
          var webinarTime = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
          console.log(webinarTime);

          this.webinarRegistrationTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + webinarTime.getHours() + ":" + webinarTime.getMinutes();
          console.log(this.webinarTime)
          this.webinar.countUser(this.webinarInfo.id, 'RegisterationPage', this.webinarRegistrationTime).subscribe(registr => {
            console.log(registr);
          })

          var countDownDate = new Date(this.webinarTime).getTime()
          console.log(new Date().getTimezoneOffset());
          console.log(this.webinarInfo.webinarLiveDtl.liveTimezone);
          var test = Date.parse(webinarTime + ' ' + this.webinarInfo.webinarLiveDtl.liveTimezone);
          var test1 = moment(test).utcOffset(this.webinarInfo.webinarLiveDtl.liveTimezone).format("YYYY-MM-DDTHH:mmZ");
          console.log(test1, ' : ', Date.parse(test1));
          console.log(moment(test.valueOf()).zone('GMT+02:00').format("YYYY-MM-DD'T'HH:mm'z'"));
          var countDownDate1 = moment(test1).utcOffset(new Date().getTimezoneOffset()).valueOf();
          console.log(moment(test1).utcOffset('GMT+0530').format('YYYY-MM-DD HH:mm'));
          console.log(moment(test).utcOffset(this.webinarInfo.webinarLiveDtl.liveTimezone).toDate());
          var webinarTime = moment(test).utcOffset(this.webinarInfo.webinarLiveDtl.liveTimezone).toDate();
          console.log(webinarTime.getDate());
          this.webinarTime = months[webinarTime.getMonth()] + " " + webinarTime.getDate() + "," + webinarTime.getFullYear() + " " + webinarTime.getHours() + ":" + webinarTime.getMinutes()
          console.log(this.webinarTime);
          var th;
          var time;
          if (webinarTime.getHours() >= 12) {
            if (webinarTime.getHours() > 12) th = webinarTime.getHours() - 12;
            else th = webinarTime.getHours();
            if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() < 10)
              time = th + ":" + "0" + webinarTime.getMinutes() + " PM"
            else if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() >= 10)
              time = th + ":" + webinarTime.getMinutes() + " PM"
            else time = th + " PM"
          } else if (webinarTime.getHours() < 12) {
            th = webinarTime.getHours();
            if (webinarTime.getMinutes() > 0)
              time = th + ":" + webinarTime.getMinutes() + " AM"
            else time = th + " AM"
          } else {
            if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() < 10)
              time = webinarTime.getHours() + ":" + "0" + webinarTime.getMinutes() + " PM"
            else if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() >= 10)
              time = webinarTime.getHours() + ":" + webinarTime.getMinutes() + " PM"
            else time = webinarTime.getHours() + " PM"
          }

          document.getElementById("month").innerHTML = months[webinarTime.getMonth()];
          document.getElementById("date").innerHTML = webinarTime.getDate() + '';
          this.webinarInfo.webinarLiveDtl.webinarLiveDate = webinarTime;
          this.webinarInfo.webinarLiveDtl.webinarLiveTime = time;
          //this.webinarTime = months[date.getMonth()] + " " + date.getDate() + "," + date.getFullYear() + " " + webinarTime.getHours() + ":" + webinarTime.getMinutes()

          this.webinarCountDown(countDownDate1);
        } else {
          this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.forEach(element => {
            var userEventTime = element.eventTime.split('T');
            var webinarTime = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
            var time;
            if (webinarTime.getHours() >= 12) {
              if (webinarTime.getHours() > 12) th = webinarTime.getHours() - 12;
              else th = webinarTime.getHours();
              if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() < 10)
                time = th + ":" + "0" + webinarTime.getMinutes() + " PM"
              else if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() >= 10)
                time = th + ":" + webinarTime.getMinutes() + " PM"
              else time = th + " PM"
            } else if (webinarTime.getHours() < 12) {
              th = webinarTime.getHours();
              if (webinarTime.getMinutes() > 0)
                time = th + ":" + webinarTime.getMinutes() + " AM"
              else time = th + " AM"
            } else {
              if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() < 10)
                time = webinarTime.getHours() + ":" + "0" + webinarTime.getMinutes() + " PM"
              else if (webinarTime.getMinutes() > 0 && webinarTime.getMinutes() >= 10)
                time = webinarTime.getHours() + ":" + webinarTime.getMinutes() + " PM"
              else time = webinarTime.getHours() + " PM"
            }
            console.log(time);
            element.time = time;
            time = null;
          });
          await this.updateWebinarTimeSlots(this.webinarInfo.webinarAutoDtl);
          if (this.webinarInfo.webinarAutoDtl.enableIntimeReg == true)
            await this.calculateIntimeRegistration(this.webinarInfo.webinarAutoDtl);
          this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.sort((b, a) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
          console.log("Sorted list")

          var numberOdSchedule = parseInt(this.webinarInfo.webinarAutoDtl.numberOfSchedulesToDisplay);
          this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList = this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.slice(0, numberOdSchedule)

          this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.forEach(timeSlot => {
            var dt = new Date(timeSlot.eventTime)

            var cd = new Date();

            if (dt > new Date()) {
              if (time == null) {

                this.webinarSelectedTime = timeSlot.eventTime;
                console.log(this.webinarSelectedTime)
                time = dt
                if (timeSlot.InTimeRegistration && timeSlot.InTimeRegistration == true)
                  this.inTimeRegistration = true;
              }
            }
          })
          //this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.sort((b, a) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
          console.log(this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList)
          this.webinarTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
          this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
          var countDownDate = new Date(this.webinarTime).getTime()
          //console.log(countDownDate)
          this.webinar.countUser(this.webinarInfo.id, 'RegisterationPage', this.webinarSelectedTime).subscribe(registr => {
            console.log(registr);
          })
          this.webinarCountDown(countDownDate);
        }

      } else {
        this.serverError(response);
      }
    // })
    }
  }

  async updateWebinarTimeSlots(webinarAutoDtl): Promise<void> {
    webinarAutoDtl.webinarAutoDtlTimeList.forEach(webinarDtl => {
      console.log(new Date(webinarDtl.eventTime))
      var userEventTime = webinarDtl.eventTime.split('T');
      var dt = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
      var currentdate = new Date();
      console.log(dt)
      if (currentdate > dt) {
        if (webinarAutoDtl.eventFrequency == 'Day') {
          while (dt < currentdate) {
            dt.setDate(dt.getDate() + 1);
            webinarDtl.eventTime = dt;
          }
        } else if (webinarAutoDtl.eventFrequency == 'Month') {
          while (dt < currentdate) {
            dt.setMonth(dt.getMonth() + 1);
            webinarDtl.eventTime = dt;
          }
        } else {
          if (webinarAutoDtl.sunEve == true && dt.getDay() != 7) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 6 - d.getDay()) % 7);
            //  console.log("Sunday:"+d);
            webinarDtl.eventTime = d;
          } else if (webinarAutoDtl.monEve == true && dt.getDay() != 1) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
            // console.log("Monday:"+d);
            webinarDtl.eventTime = d;

          } else if (webinarAutoDtl.tueEve == true && dt.getDay() != 2) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 8 - d.getDay()) % 7);
            //   console.log("TUesday:"+d);
            webinarDtl.eventTime = d;
          } else if (webinarAutoDtl.wedEve == true && dt.getDay() != 3) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 9 - d.getDay()) % 7);
            //   console.log("Wednesday:"+d);
            webinarDtl.eventTime = d;
          } else if (webinarAutoDtl.thurEve == true && dt.getDay() != 4) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 10 - d.getDay()) % 7);
            //     console.log("Thrusday:"+d);
            webinarDtl.eventTime = d;
          } else if (webinarAutoDtl.friEve == true && dt.getDay() != 5) {
            var d = new Date();
            d.setDate(d.getDate() + (1 + 11 - d.getDay()) % 7);
            //    console.log("Friday:"+d);
            webinarDtl.eventTime = d;
          } else if (webinarAutoDtl.satEve == true && dt.getDay() != 6) {

            var d = new Date();
            d.setDate(d.getDate() + (1 + 12 - d.getDay()) % 7);
            //     console.log("Saturday:"+d);
            webinarDtl.eventTime = d;
          }

        }
      } else {
        webinarDtl.eventTime = dt;
      }

    })
  }

  async calculateIntimeRegistration(webinarAutoDtl): Promise<void> {
    console.log("Calculate Intime Registration")
    console.log(webinarAutoDtl);
    var currentTime = new Date();
    var usertime = new Date();

    usertime.setMinutes(usertime.getMinutes() - usertime.getMinutes());
    usertime.setMinutes(usertime.getMinutes() + webinarAutoDtl.intimeRegInterval);
    usertime.setSeconds(usertime.getSeconds() - usertime.getSeconds());

    var i = 0;
    while (currentTime.getTime() >= usertime.getTime()) {
      usertime.setMinutes(usertime.getMinutes() + webinarAutoDtl.intimeRegInterval);
      // inTimeRegistrationdate = usertime.getDate() + "/" + (usertime.getMonth() + 1) + "/" + usertime.getFullYear() + " " + usertime.getHours() + ":" + usertime.getMinutes() + ":" + usertime.getSeconds();
      i++;
    }
    var th, time;
    if (usertime.getHours() >= 12) {
      if (usertime.getHours() > 12)
        th = usertime.getHours() - 12;
      else
        th = usertime.getHours()
      if (usertime.getMinutes() > 0 && usertime.getMinutes() < 10)
        time = th + ":" + "0" + usertime.getMinutes() + " PM"
      else if (usertime.getMinutes() > 0 && usertime.getMinutes() >= 10)
        time = th + ":" + usertime.getMinutes() + " PM"
      else time = th + " PM"
    } else if (usertime.getHours() < 12) {
      th = usertime.getHours();
      if (usertime.getMinutes() > 0)
        time = th + ":" + usertime.getMinutes() + " AM"
      else time = th + " AM"
    } else {
      if (usertime.getMinutes() > 0 && usertime.getMinutes() < 10)
        time = usertime.getHours() + ":" + "0" + usertime.getMinutes() + " PM"
      else if (usertime.getMinutes() > 0 && usertime.getMinutes() >= 10)
        time = usertime.getHours() + ":" + usertime.getMinutes() + " PM"
      else time = usertime.getHours() + " PM"
    }
    var repeatedTime = false;
    this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.forEach(e => {
      console.log(e.eventTime + " : " + usertime)
      console.log(e.eventTime.getTime() + " : " + usertime.getTime())
      console.log(e.eventTime.getTime() === usertime.getTime())
      if (usertime.getFullYear() === e.eventTime.getFullYear() &&
        usertime.getDate() === e.eventTime.getDate() &&
        usertime.getMonth() === e.eventTime.getMonth() &&
        usertime.getHours() === e.eventTime.getHours() &&
        usertime.getMinutes() === e.eventTime.getMinutes()) {
        repeatedTime = true;
      }

      // if (new Date(e.eventTime).getTime() === new Date(usertime).getTime()) {
      //   repeatedTime = true;
      // }
    })
    if (repeatedTime == false)
      this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.push({ "eventTime": usertime, "time": time, "InTimeRegistration": true })



  }
  webinarCountDown(countDownDate) {
    // Set the date we're counting down to
    // var countDownDate = new Date("July 4, 2019 03:24:00");
    // console.log(countDownDate);
    // Update the count down every 1 second
    this.countDon = setInterval(() => {
      // Get todays date and time
      var now = new Date().getTime();
      //      var to = new DatePipe('en-Us').transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'", 'GMT+2:00');
      //var moment = moment();
      //    var now = moment(new Date()).zone('+0200').valueOf();
      // Find the distance between now an the count down date

      this.distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      var days, hours, minutes, seconds;
      days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
      hours = Math.floor(
        (this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

      // Output the result in an element with id="demo"
      // var html =  "<div class='timerBox'>" + days +  "<span>DAYS</span>" + "</div>"   + "<div class='timerBox'>" + hours +  "<span>HOURS</span>" + "</div>"
      // + "<div class='timerBox'>" + minutes +  "<span>MINUTES</span>" + "</div>" + "<div class='timerBox'>" + seconds +  "<span>SECONDS</span>" + "</div>";
      document.getElementById("daysLeft").innerHTML = days;
      document.getElementById("hoursLeft").innerHTML = hours;
      document.getElementById("minLeft").innerHTML = minutes;
      document.getElementById("secLeft").innerHTML = seconds;
      //console.log(html);

      // If the count down is over, write some text
      if (this.distance < 0) {
        clearInterval(this.countDon);
        this.disableRegistration = false;
        document.getElementById("timer").style.display = 'none'
        document.getElementById("webinarEnded").style.display = 'block'
      }
    }, 1000);
  }

  async socialLogin(socialLogin) {
    console.log("about to sign with "+socialLogin);
    if(socialLogin == 'Google')
    this.socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    else if(socialLogin == 'Facebook')
    this.socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(user => {
      this.socialUser = user;
      this.user.email = this.socialUser.email;
      this.user.firstName = this.socialUser.firstName;
      this.user.lastName = this.socialUser.lastName;
      this.user.profilePicture = this.socialUser.photoUrl;
      this.user.provider = this.socialUser.provider;
      this.user.providerId = this.socialUser.id;
      this.user.userRole = "CLIENT";
      console.log("socialUser value in ngOnit", this.socialUser);

      // redirect to home page after getting successful response
      if (this.socialUser) {

        this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id,true)
          .then(authToken => {
            clearInterval(this.countDon);
            var token :any = authToken;
            if (token.status == "SUCCESS") {
              this.authService.saveToken(token.data);
              this.checkUser();
            } else if (token.status == "ERROR") {
              console.log("Inside Singup")
              console.log(this.user);
              this.loginService.registerUser(this.user).subscribe(data => {
                var userObj:any = data;
                console.log(userObj);
                if (userObj.status == "SUCCESS") {
                  let user = userObj.data;
                  this.authService.getAuthenticationToken(this.socialUser.email,this.socialUser.id,true)
                    .then(data => {
                      console.log(data);
                      var token :any = data;
                      if (token.status == "SUCCESS") {
                        this.authService.saveToken(token.data);
                        this.checkUser();
                      }
                    });
                } else if (userObj.status == "ERROR") {
                  this.authService.getAuthenticationToken(this.socialUser.email,this.socialUser.id,true)
                    .then(data => {
                      this.message = userObj.message;
                      this.checkWebinarStatus();
                    });
                }
              });
            }
          });
      }
    });
  }

  selectTime(event) {
    console.log(event.target.value, ' : ', event.target.value.indexOf('T'));
    var time;
    // if (event.target.value.indexOf('T') > 0) {
    //   var userEventTime = event.target.value.split('T');
    //   time = new Date(userEventTime[0] + ' ' + userEventTime[1].split('.')[0])
    // }
    // else
    time = new Date(event.target.value)
    // var date = new Date(this.webinarInfo.webinarAutoDtl.eventStartDate)
    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    this.webinarTime = months[time.getMonth()] + " " + time.getDate() + "," + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes();
    this.webinarRegistrationTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
    console.log(this.webinarTime)
    var countDownDate = new Date(this.webinarTime).getTime()
    this.webinarInfo.webinarAutoDtl.webinarAutoDtlTimeList.forEach(e => {
      if (new Date(e.eventTime) == new Date(event.target.value) && e.InTimeRegistration == true) {
        this.inTimeRegistration = true
      }
    })
    clearInterval(this.countDon);
    this.disableRegistration = true;
    document.getElementById("timer").style.display = 'block'
    document.getElementById("webinarEnded").style.display = 'none'
    this.webinarCountDown(countDownDate);
  }

  async singupForWebinar() {
    console.log(this.email)
    this.email = this.email.toLowerCase();
    // start the loader
    // this.loadingScreenService.startLoading();
    clearInterval(this.countDon);
    // if(this.authService.getToken != null){
    //    this.router.navigate(['/thankyou']);
    // }else{
    var res:any;
    res = await this.loginService.checkUser(this.email)
    
    if (res.status == 'SUCCESS') {
      console.log(this.webinarInfo);
      // alert("Hi")

      localStorage.setItem("urlAfterLogin", "/thankyou");
      localStorage.setItem("webinarRegistrationTime", this.webinarTime);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("firstName", this.webinarInfo.mainUser.firstName);
      localStorage.setItem("lastName", this.webinarInfo.mainUser.lastName);
      console.log('url after login : ', localStorage.getItem("urlAfterLogin"));
      this.user.id = res.data.id;

      //alert('gmt value : ' + Intl.DateTimeFormat().resolvedOptions().timeZone);
      var currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(currentTimezone);

      if (this.webinarInfo.webinarType == 'auto')
        res = await this.webinar.recordWebinarUser(this.webinarId, res.data.id, this.webinarRegistrationTime, this.inTimeRegistration, currentTimezone)
      else if (this.webinarInfo.webinarType == 'live')
        res = await this.webinar.recordWebinarUser(this.webinarId, res.data.id, this.webinarInfo.webinarLiveDtl.webinarLiveDate, this.inTimeRegistration)
     
      // start the loader
      // this.loadingScreenService.stopLoading();
      console.log(res)
      if (res.status == "ERROR") {
        this.checkWebinarStatus();
      } else {
        localStorage.setItem("userRegisteredForWebinar", this.email);
        this.router.navigate(['/login']);
      }


    } else {
      localStorage.setItem("loggedIn", this.email)
      localStorage.setItem("urlAfterLogin", "/thankyou");
      localStorage.setItem("webinarRegistrationTime", this.webinarTime);
      if (this.webinarInfo.webinarType == 'auto')
        localStorage.setItem("userRegistrationTime", this.webinarTime);
      else
        localStorage.setItem("userRegistrationTime", this.webinarTime);
      localStorage.setItem("inrimeRegInterval", this.inTimeRegistration + '');
      this.router.navigate(['/Registration']);
    }
    // }
  }

  async checkUser() {
    var res:any;
    res = await this.loginService.checkUser(this.user.email)
  
    if (res.status == 'SUCCESS') {
      localStorage.setItem("webinarRegistrationTime", this.webinarTime);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      this.user.id = res.data.id;
      //alert('gmt value : ' + Intl.DateTimeFormat().resolvedOptions().timeZone);
      var currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(currentTimezone);
      if (this.webinarInfo.webinarType == 'auto')
        res = await this.webinar.recordWebinarUser(this.webinarId, res.data.id, this.webinarRegistrationTime, this.inTimeRegistration, currentTimezone)
      else if (this.webinarInfo.webinarType == 'live')
        res = await this.webinar.recordWebinarUser(this.webinarId, res.data.id, this.webinarInfo.webinarLiveDtl.webinarLiveDate, this.inTimeRegistration)
     
      console.log(res)
      if (res.status == 'ERROR') {
        this.checkWebinarStatus();
      } else {
        this.router.navigate(['/thankyou']);
      }
    }
  }

  async checkWebinarStatus() {
    var res
    // start the loader
    // this.loadingScreenService.startLoading();
    if (this.webinarInfo.webinarType == 'live') {
      localStorage.setItem("urlAfterLogin", "/liveWebinarPage");
    } else {
      localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
    }
    res = await this.webinar.checkWebinarStatus(this.webinarId, this.user.id)
    // start the loader
    // this.loadingScreenService.stopLoading();
   
    console.log(res)
    if (res.status == 'SUCCESS') {
      if (localStorage.getItem("token")) {
        if (this.webinarInfo.webinarType == 'live') {
          this.router.navigate(['/liveWebinarPage'], { queryParams: { id: this.webinarId } });
        } else {
          var timeS = new Date(localStorage.getItem('webinarRegistrationTime'));
          var timeSlot = timeS.getFullYear() + "-" + (timeS.getMonth() + 1) + "-" + timeS.getDate() + " " + timeS.getHours() + ":" + timeS.getMinutes();
          //alert("Time Slot:" + timeSlot);
          this.router.navigate(['/webinarAutoStreamPage'], { queryParams: { id: this.webinarId, timeSlot: timeSlot } });
        }
      } else {
        localStorage.setItem("userRegisteredForWebinar", this.email);
        this.router.navigate(['/login']);
      }

    } else {
      this.router.navigate(['/thankyou']);
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
