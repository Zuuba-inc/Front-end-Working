import { Component, OnInit } from '@angular/core';
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import { Router } from '@angular/router';
// import jquery
import * as $ from 'jquery';
import { NgAddToCalendarService, ICalendarEvent } from '@trademe/ng-add-to-calendar';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Common } from '../../../../services/global/common';
import Swal from "sweetalert2";
@Component({
  selector: 'app-thankyou-preview',
  templateUrl: './thankyou-preview.component.html',
  styleUrls: ['./thankyou-preview.component.css']
})
export class ThankyouPreviewComponent implements OnInit {
webinarId;
webinarInfo;
firstName; lastName;registrationDate: Date;
public googleCalendarEventUrl: SafeUrl;
public iCalendarEventUrl: SafeUrl;
public newEvent: ICalendarEvent;
registeredTime;
  constructor(private webinar: WebinarAPIService,
    private router: Router,
    private common : Common,
    private _addToCalendarService: NgAddToCalendarService,
    private _sanitizer: DomSanitizer) { }
  webinarLink = this.common.serverUrl;
  userId;
  copiedTextShown = false;
  ngOnInit() {
    this.getWebinarData();
    
  
  }

  async getWebinarData(){
    this.webinarId = localStorage.getItem('webinarId');
    this.registeredTime = localStorage.getItem('webinarRegistrationTime')
    console.log(this.registeredTime);
  
   
    this.userId = localStorage.getItem('userId')
    //alert(this.registeredTime);
    this.registrationDate = new Date(this.registeredTime);
    var timeSlot = this.registrationDate.getFullYear() + "-" + (this.registrationDate.getMonth() + 1) + "-" + this.registrationDate.getDate() + " " + this.registrationDate.getHours() + ":" + this.registrationDate.getMinutes();
    //alert("Time Slot:"+timeSlot);
    var response:any;
    response= await this.webinar.getWebinar(this.webinarId,'all')
    // .subscribe( webinar =>{
      
    if(response.status == 'SUCCESS'){
        this.webinarInfo = this.webinarInfo.data.webinar;
        this.newEvent = {
            // Event title
            title: this.webinarInfo.data.webinar.webinarTitle,
            // Event start date
            start: this.registrationDate,
            // Event duration (IN MINUTES)
            duration: 120,
            // If an end time is set, this will take precedence over duration (optional)
            end: this.registrationDate,
            // Event Address (optional)
            //address: '1 test street, testland',
            // Event Description (optional)
            description: this.webinarInfo.data.webinar.webinarDesc
        };
        this.googleCalendarEventUrl = this._sanitizer.bypassSecurityTrustUrl(
          this._addToCalendarService.getHrefFor(this._addToCalendarService.calendarType.google, this.newEvent)
        );
        this.iCalendarEventUrl = this._sanitizer.bypassSecurityTrustUrl(
          this._addToCalendarService.getHrefFor(this._addToCalendarService.calendarType.iCalendar, this.newEvent)
        );
        console.log(this.webinarInfo.data.webinar);
        this.firstName = this.webinarInfo.data.webinar.mainUser.firstName;
        this.lastName = this.webinarInfo.data.webinar.mainUser.lastName;
        console.log(this.webinarInfo)
        if(this.webinarInfo.status == "SUCCESS"){
          //alert(this.webinarInfo.data.webinar.webinarType)
          if(this.webinarInfo.data.webinar.webinarType == 'live'){
            this.webinarLink = this.webinarLink+"/liveWebinarPage?id="+this.webinarId
          }else{

            this.webinarLink = this.webinarLink+"/webinarAutoStreamPage?id="+this.webinarId+"&timeSlot="+timeSlot;
          }
        }
      // })


    var months=['Jan', 'Feb', 'March', 'April', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var date = new Date(this.registeredTime)
    //alert(date);
              var th;
              var time;
              if(date.getHours() >= 12 ){
                if(date.getHours() > 12) th = date.getHours() - 12;
                else th = date.getHours();
                if(date.getMinutes() > 0)
                  time = th+":"+date.getMinutes()+" PM"
                else time = th+" PM"
              }else{
                th = date.getHours();
                if(date.getMinutes() > 0)
                  time = th+":"+date.getMinutes()+" AM"
                else time = th+" AM"
              }
              this.registeredTime = months[date.getMonth()]+" " + date.getDate()+ "," +date.getFullYear()+" at "+time
                console.log(this.registeredTime);

                $("#month").html(months[date.getMonth()]);
                $("#date").html(date.getDate());
                $("#month2").html(months[date.getMonth()]);
                $("#date2").html(date.getDate());
       
              }else{
                this.serverError(response);
              }
  }
  // webinarDate(date){
  //     var months=['Jan', 'Feb', 'March', 'April', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //         var dt = $("#webDate").html();
  //          var dtArr = dt.split(" ");
  //          var date = dtArr[1]+" "+dtArr[2]+", "+dtArr[3];
  //           $("#webDate").html(date)


  //         console.log(date);

  //         var todayTime = new Date(dt);
  //           $("#month").html(months[todayTime.getMonth()]);
  //           $("#date").html(todayTime.getDate());
  //            $("#month2").html(months[todayTime.getMonth()]);
  //           $("#date2").html(todayTime.getDate());
  //         console.log(todayTime)
  //         console.log(todayTime.getMonth());
    
  // }

  copyWebinarURL(){
    this.copiedTextShown = true;
    let selBox;
    selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.webinarLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    // setTimeout(() => {
    //   this.copiedTextShown = false;
    // }, 3000);
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
