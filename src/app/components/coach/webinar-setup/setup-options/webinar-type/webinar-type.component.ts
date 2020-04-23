import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';

// import jquery
// import * as $ from 'jquery';
import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';
import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';
import { Router } from '@angular/router';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { Validators, FormControl } from '@angular/forms';
import * as moment from 'moment'; // add this 1 of 4

declare var $: any;

@Component({
  selector: 'app-webinar-type',
  templateUrl: './webinar-type.component.html',
  styleUrls: ['./webinar-type.component.css']
})
export class WebinarTypeComponent implements OnInit {

  // set recently updated property in keyupfunction
  recentlyUpdatedModule: any = "webinarMstType";

  // use this for setting post url 
  moduleUrl: any = "/webinarType";

  // getParam
  getParam: any = "WebinarType";

  webinarObj: any = {};

  webinarId: any;

  minDate = new Date();
  webinarTypeObj; autoEventTimeLength;
  webinarReplayMode;
  hoursV; minutesV; secondsV;
  autoEventTimeList = [{ text: 1, value: 1 }];
  intervalList = [];

  // use this to set route active when there is a page reload in websetup file
  module: any = "WebinarType";

  webinarMst: any = {};
  timeZoneList: Map<String, String> = new Map<String, String>();
  enableReplay: Boolean;

  webinarResObj: any;

  webinarMstTypeKeys: any = [];

  constructor(private webinarConf: WebinarConfigureService,
    private webinarAPI: WebinarAPIService, private authService: AuthapiserviceService,
    private router: Router) { }

  async ngOnInit() {
    // console.log('inside ng init ***************');
  
    let self = this;

    $("#datepicker").datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: 0,
      onSelect: function (date) {
        // console.log("onDateChange autoDtl", date);
        self.webinarMst.webinarAutoDtl.eventStartDate = date;
      }
    });

    $("#datepicker2").datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: 0,
      onSelect: function (date) {
        // console.log("onDateChange liveDtl", date);
        self.webinarMst.webinarLiveDtl.webinarLiveDate = date;
        //   event.preventDefault();
        //   var option = this.id == "from" ? "minDate" : "maxDate",
        //       instance = $(this).data("datepicker"),
        //       date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
        //   dates.not(this).datepicker("option", option, date);
      }
    });

    $("#replayExpDate").datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: 0,
      onSelect: function (date) {
        // console.log("onDateChange liveDtl", date);
        self.webinarMst.webinarLiveDtl.replayExpDate = date;
      }
    });

    // get webinarMstType data from service
    this.webinarMst = this.webinarConf.webinarMstType;
    
    //this.webinarMst.webinarAutoDtl.numberOfSchedulesToDisplay = 'Select';
    // get data from API
    // get webinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");
    //this.webinarId = 305;

    // set webinar id if it exists
    if (this.webinarId) {

      this.webinarMst.id = this.webinarId;
    }

    // console.log("in ngOnInit of offer, found webinarId", this.webinarId, "and this.webinarMst", this.webinarMst);

    //this.cookie.delete('access_token','/');
    //localStorage.removeItem("token");
    // console.log(JSON.parse(this.authService.getToken()));
    // console.log(JSON.parse(localStorage.getItem('currentUser')));

    // fromService is true => get data based on webinarId and store in webinarservice
    // and on page refresh make an api if this.webinarMst.fromService exists and is true in webinarservice
    // this is used for page refresh handling data binding
    if (this.webinarMst && (this.webinarMst.fromService == true) && this.webinarId) {

      // if webinarMst is empty on service like in  case of page refresh
      // and webinarId exists make an API call
      // get data from webinar service
      let dataQuiz: any = await this.webinarAPI.getWebinar(this.webinarId, "WebinarType")
      // .subscribe(dataQuiz => {
      // console.log(dataQuiz);
      if (dataQuiz) {
        var webinar = dataQuiz;
        if (webinar.status == 'SUCCESS') {

          this.webinarResObj = webinar.data;

          // console.log('this // console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          // console.log(this.webinarObj);

          // this.webinarConf.changeWebinarConfigure(this.webinarResObj);

          // set only webinarMstType data, coming from response, into service
          if (this.webinarResObj.webinarType != null) {
            this.webinarConf.webinarMstType = this.webinarResObj;

            // set only webinarOffer module data from service 
            // if this.webinarMst.webinarOffer is undefined initialize it to empty obj
            // if (Object.keys(this.webinarConf.webinarMst).length == 0)
            //   this.webinarMst = {
            // webinarType: 'live',
            // webinarUrl:null,
            // webinarLiveDtl:{enableReplay:false,webinarLiveTime:'',replayExpDays:'',replayExpDate:'',webinarLiveDate:''},
            // webinarAutoDtl:{eventFrequency:null,webinarAutoDtlTimeList:[{}],eventStartDate:null,enableIntimeReg:false, enableReplay:false},
            // id:null,
            // webinarDurationHrs:null,
            // webinarDurationMins:null,
            // webinarDurationSecs:null
            //   };
            // else {
            //   this.webinarObj = {};
            //   this.webinarObj =  this.setWebinarTypeDataBindings(this.webinarConf.webinarMst);

            //   // null checks to initialize when the following is empty
            //   if (this.webinarObj.webinarLiveDtl == null) {
            //     this.webinarObj.webinarLiveDtl = {enableReplay:false,webinarLiveTime:'',replayExpDays:'',replayExpDate:'',webinarLiveDate:'', liveTimezone: ''};
            //   }

            //   if (this.webinarObj.webinarAutoDtl == null) {
            //     this.webinarObj.webinarAutoDtl = {eventFrequency:null,webinarAutoDtlTimeList:[{}],eventStartDate:null,enableIntimeReg:false, enableReplay:false};
            //   }

            //   if (this.webinarObj.webinarType == null) {
            //     this.webinarObj.webinarType = 'live';
            //   }

            //   this.webinarMst = this.webinarObj;

            //   this.webinarMst.id = this.webinarId;
            // }

            // console.log("this.webinarMst initialized in webinarType, from GET-API, should only contain this module relevant data", this.webinarMst);

            this.webinarTypeObj = webinar.data;
            this.updateRecord();

            // set data bindings
            this.setWebinarTypeBindings();
          } else {

            this.webinarTypeObj = this.webinarMst;
            this.updateRecord();
            this.setWebinarTypeBindings();
          }
        } else {
          this.setWebinarTypeBindings();
        }
      }
      // })
    } else {
      // data exists in service, then don't make API call.
      if (this.webinarMst && this.webinarMst.id) {

        if (this.webinarConf.webinarMstType) {
          // set only webinarOffer module data from service 
          this.webinarObj = {};
          this.webinarObj = this.webinarConf.webinarMstType;

          delete this.webinarObj.fromService;

          this.webinarMst = this.webinarObj;

          if (!this.webinarMst.webinarAutoDtl) {
            this.webinarMst.webinarAutoDtl = { eventFrequency: null, webinarAutoDtlTimeList: [{}], eventStartDate: null, enableIntimeReg: false, enableReplay: false };
          }

          if (!this.webinarMst.webinarLiveDtl) {
            // this.webinarMst.webinarLiveDtl = { enableReplay: false, webinarLiveTime: '', replayExpDays: '', replayExpDate: '', webinarLiveDate: '' };
            this.webinarMst.webinarLiveDtl = { enableReplay: false, webinarLiveTime: '', replayExpDays: '', replayExpDate: '', webinarLiveDate: '' };
          }

          // console.log("this.webinarMst initialized in webinar type, from SERVICE,should only contain this module relevant data", this.webinarMst);

          this.webinarTypeObj = this.webinarMst;

          this.updateRecord();

          // set data bindings
          this.setWebinarTypeBindings();
        }
      }
    }


    /*if(this.webinarMst.webinarType != null && (this.webinarMst.webinarType == 'Auto' || this.webinarMst.webinarType == 'auto'))
      this.webinarMst.webinarAutoDtl.eventStartDate = new FormControl('', [Validators.required, Validators.min((new Date()).getTime())])*/
  }

  async ngAfterViewInit() {

    this.setWebinarTypeBindings();
    this.webinarTypeObj = this.webinarConf.getWebinarConfigure();
    // console.log(this.webinarTypeObj.id != undefined);
    if (this.webinarTypeObj.id != null && this.webinarTypeObj.id != undefined) {
      this.webinarMst.id = this.webinarTypeObj.id;
      // var res = this.webinarAPI.getWebinar(this.webinarTypeObj.id).subscribe(data=>{
      let data :any = await this.webinarAPI.getWebinar(this.webinarTypeObj.id);
      if (data) {
        // // console.log('Inside get webinar ' , res);
        var webinarObj = data;
        this.webinarTypeObj = webinarObj.data;

        this.updateRecord();
      }
      // });
    }

    // this.listIntervals();
  }

  // use this to select timezone by default
  userTimeZone: any;

  setWebinarTypeBindings() {
    this.getTimeZoneList().then(data => {
      this.timeZoneList = data;
      // console.log(this.timeZoneList);

      // has timeZones defined
      let timeString: any = new Date().toTimeString();

      // split by space and get time zone
      timeString = timeString.split(' ');

      // get time zone
      timeString = timeString[1];

      // returned time zone is of GMT+0530,
      // from db we have of format GMT+05:30
      // convert time zone to that of db format
      let timeZoneFound = timeString.slice(0, 6) + ':' + timeString.slice(6);

      // this.userTimeZone = this.timeZoneList[timeZoneFound];

      this.userTimeZone = timeZoneFound;

      // // console.log("found user time zone", this.userTimeZone, "this.timeZoneList[timeZoneFound]", this.timeZoneList[timeZoneFound]);

      // update ngModel for timezone dropdown
      this.webinarMst.webinarLiveDtl.liveTimezone = this.userTimeZone;

      // to set disable for live webinar live replay radio options
      this.showHideReplayDiv(this.webinarMst.webinarLiveDtl.replayExpirationType, true);

    });
    // this.webinarTypeObj = this.webinarConf.getWebinarConfigure();
    // if(this.webinarTypeObj.id != null)
    //   this.webinarMst.id = this.webinarTypeObj.id;
    //   var res = this.webinarAPI.getWebinar(this.webinarTypeObj.id).subscribe(data=>{
    //     // console.log('Inside get webinar ' , res);
    //     var webinarObj = JSON.parse(data['_body']);
    //         this.webinarTypeObj = webinarObj.data;
    //     this.updateRecord();
    //   });
    this.listIntervals();
  }

  setWebinarType(type1, type2) {
    // console.log('webinarType  ************************************: ' + $("#" + type1));
    this.webinarMst.webinarType = type1;
    $("#" + type1).addClass("active");
    $("#" + type2).removeClass("active");
    $('#' + type1 + 'Webinar').show();
    $('#' + type2 + 'Webinar').hide();
    //alert(type1);
    if (type1 == 'live') {
      $('#presentationLink').show();
    }
    else if (type1 == 'auto') {
      $('#presentationLink').hide();
    }
    // console.log('$scope.webinarMst.webinarType : ' + this.webinarMst.webinarType);

    // emit event to parent to hide presentation nav bar when it is automated type
    if (type1 == "auto") {
      this.router.navigate(['/webinarSetup/WebinarType/auto']);
    } else {
      this.router.navigate(['/webinarSetup/WebinarType/live']);
    }
  }

  async getTimeZoneList() {
    var tz:any = await this.webinarAPI.getTimeZoneList();
    // console.log(this.timeZoneList);
    // var tz = JSON.parse(timeZoneList['_body']);
    // // console.log(tz);
    //this.timeZoneList = tz.data;
    return tz.data;

  }

  showHideReplayExpiration() {
    var webinar = this.webinarMst;
    // console.log(this.webinarMst.webinarLiveDtl, webinar);
    if (!this.webinarMst.webinarLiveDtl.enableReplay) {
      $('#replay_expiration').show();
      $("#replayExpDay").focus();
      // use this to autobind checkbox on page refresh
      let ro1: any = document.getElementById("radoiOPt1");
      let ro2: any = document.getElementById("radoiOPt2");
      ro1.checked = false;
      ro2.checked = true;
    }
    else {
      $('#replay_expiration').hide();
    }
  }

  showHideReplayDiv(value, fromPageAction?) {

    // use this to autobind checkbox on page refresh
    let ro1: any = document.getElementById("radoiOPt1");
    let ro2: any = document.getElementById("radoiOPt2");

    // used for binding at the time of back and forth switching b/w modules;
    let replayExpDay: any = document.getElementById("replayExpDay");

    let replayExpDate: any = document.getElementById("replayExpDate");

    if (this.webinarMst.webinarLiveDtl.replayExpDays != '')
      replayExpDay.value = this.webinarMst.webinarLiveDtl.replayExpDays;

    if (this.webinarMst.webinarLiveDtl.replayExpDate != '') {
      // replayExpDate.value = this.webinarMst.webinarLiveDtl.replayExpDate;
      replayExpDate.value = this.handleISOFormat(this.webinarMst.webinarLiveDtl.replayExpDate, 'yyyy-MM-dd');
    }

    this.webinarMst.webinarLiveDtl.replayExpirationType = value;

    // set bindings
    // used for binding at the time of back and forth switching b/w modules;
    // let replayExpDayAuto: any = document.getElementById("replayExpDayAuto");

    // if (this.webinarTypeObj.webinarAutoDtl && this.webinarTypeObj.webinarAutoDtl.replayExpDays ) {
    // replayExpDay.value = this.webinarTypeObj.webinarAutoDtl.replayExpDays;

    // if (this.webinarTypeObj.webinarAutoDtl && this.webinarTypeObj.webinarAutoDtl.replayExpDate != '') {

    //   replayExpDate = this.webinarTypeObj.webinarAutoDtl.replayExpDate;
    // } else {

    //   replayExpDate = this.webinarTypeObj.webinarLiveDtl.replayExpDate;
    // }

    // replayExpDate.value = this.handleISOFormat(replayExpDate, 'yyyy-MM-dd');
    // }

    let self = this;

    // console.log("value::::::::::", value);

    if (value == 'days') {

      $("#replayExpDate").val("");
      // this.webinarMst.webinarLiveDtl.replayExpDate = null;
      $("#replayExpDate").attr('disabled', 'disabled');
      $("#replayExpDay").removeAttr('disabled');
      $("#replayExpDate").css('color', '#6c757d');
      $("#radoiOPt2-lbl").css('color', '#6c757d');
      $("#radoiOPt1-lbl").css('color', 'inherit');
      $("#radoiOPt1-lbl-2").css('color', 'inherit');
      if (ro1 && ro2) {

        // console.log("days value::::::::::", value);

        $("#replayExpDay").focus();
        ro1.checked = true;
        ro2.checked = false;
      }
    }
    else {



      $("#replayExpDay").val("");
      // this.webinarMst.webinarLiveDtl.replayExpDays = null;
      $("#replayExpDay").attr('disabled', 'disabled');
      $("#replayExpDate").removeAttr('disabled');
      $("#radoiOPt1-lbl").css('color', '#6c757d');
      $("#radoiOPt1-lbl-2").css('color', '#6c757d');
      $("#replayExpDate").css('color', 'inherit');
      $("#radoiOPt2-lbl").css('color', 'inherit');

      if (ro1 && ro2) {

        // console.log("date value::::::::::", value);

        // $("#replayExpDate").focus();
        ro1.checked = false;
        ro2.checked = true;
      }
    }
    // console.log(this.webinarMst);
  }

  async saveWebinarType() {
    // console.log('inside save webinar');

    if (this.authService.getToken() == '') {

      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {

          // console.log("result.value", result.value);

          this.router.navigate(['/'])
        }
      })
    };

    /*if(this.webinarMst.webinarType == 'live' || this.webinarMst.webinarType == 'Live')
    {
      this.webinarMst.webinarAutoDtl = null;
    }
    else if(this.webinarMst.webinarType == 'auto' || this.webinarMst.webinarType == 'Auto')
    {
      this.webinarMst.webinarLiveDtl = null;
    }*/
    if (this.webinarMst.webinarType == 'Auto' || this.webinarMst.webinarType == 'auto') {

      // clear off bindings of live webinar when user selects
      // this.webinarMst.webinarLiveDtl = {enableReplay:false,webinarLiveTime:'',replayExpDays:'',replayExpDate:'',webinarLiveDate:''};
      this.webinarMst.webinarLiveDtl = { enableReplay: false, webinarLiveTime: '', replayExpDays: '', replayExpDate: '', webinarLiveDate: '' };

      if (this.webinarMst.webinarAutoDtl != null && this.webinarMst.webinarAutoDtl.eventStartDate != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length > 0) {
        this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.forEach(element => {
          // alert(moment(this.webinarMst.webinarAutoDtl.eventStartDate + ' ' + element.eventTime).format('YYYY-MM-DD[T]hh:mm:ss') );
          // alert(this.webinarMst.webinarAutoDtl.eventStartDate + ' : '+element.eventTime);
          element.eventTime = moment(this.webinarMst.webinarAutoDtl.eventStartDate + ' ' + element.eventTime).format('YYYY-MM-DD[T]HH:mm:ss');
          element.webinarTimeSlotEnded = false;
          // alert(element.eventTime);
        });
      }
    }
    if (this.webinarMst.webinarType == 'Live' || this.webinarMst.webinarType == 'live') {

      // clear off bindings of live webinar when user selects
      this.webinarMst.webinarAutoDtl = { eventFrequency: null, webinarAutoDtlTimeList: [{}], eventStartDate: null, enableIntimeReg: false, enableReplay: false };

      if (this.webinarMst.webinarLiveDtl != undefined && this.webinarMst.webinarLiveDtl.webinarLiveTime != null) {
        //this.webinarMst.webinarLiveDtl.webinarLiveTime = new Date(Date.parse(this.webinarMst.webinarLiveDtl.webinarLiveDate + ' ' + this.webinarMst.webinarLiveDtl.webinarLiveTime));
        alert('this.webinarMst.webinarLiveDtl.webinarLiveTime : ' + this.webinarMst.webinarLiveDtl.webinarLiveTime);
        this.webinarMst.webinarLiveDtl.webinarLiveTime = moment(this.webinarMst.webinarLiveDtl.webinarLiveDate + ' ' + this.webinarMst.webinarLiveDtl.webinarLiveTime).format('YYYY-MM-DD[T]HH:mm:ss');
      }

    }

    if (this.webinarMst.webinarType == 'live' || this.webinarMst.webinarType == 'Live') {
      // console.log(this.webinarReplayMode);
      if (this.webinarReplayMode == false) {
        this.webinarMst.webinarLiveDtl.replayExpirationType = 'date';
      }
      else {
        this.webinarMst.webinarLiveDtl.replayExpirationType = 'days';
      }
    }
    let res:any = await this.webinarAPI.saveWebinarType(this.webinarMst);

    localStorage.setItem("webinarTypeChosen", this.webinarMst.webinarType);

   // var res = JSON.parse(data['_body']);
    // console.log(res);
    if (res.data != null) {
      // this.webinarMst.id = res.data.id;
      // set only webinarMstType data, coming from response res.data(this should contain only webinar type response), into service
      this.webinarConf.webinarMstType = res.data;

      // common module across all modules, to be updated on each save in each of the modules
      this.webinarConf.moduleStatus = res.data.moduleStatus;

      this.webinarConf.webinarMstType.moduleUrl = this.moduleUrl;
      this.webinarMst = this.webinarConf.webinarMstType;


      // if webinarId doesn't exist in session storage, only then set it 
      // (to save data against the same id even after page reload)
      if (!localStorage.getItem("webinarId")) {

        // console.log("webinarId for this SESSION", res.data.id);
        localStorage.setItem("webinarId", res.data.id);
      }
      this.router.navigate(['/webinarSetup/Offer/']);
     
    }
    // } catch (error) {

    //   // stop loader
    //   this.loadingScreenService.stopLoading();

    //   // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
    //   // console.log("error in saving post", error);

    //   //if the error is of invalid token type return to login page
    //   error = JSON.parse(error['_body']);

    //   // console.log("error after parsing", error);

    //   if (error.error == "invalid_token") {

    //     // redirect to login page iof token is inavlid
    //     Swal.fire({
    //       text: error.error + ", Please login",
    //       type: 'warning',

    //     }).then((result) => {
    //       if (result.value) {

    //         // clear everything from locastorage

    //         this.router.navigate(['/'])
    //       }
    //     })

    //   }
    // }
  }

  // returns time format and date format
  handleISOFormat(ISOTime, format) {

    try {
      let ISOFormattedBase = ISOTime.split("T");
      // (2) ["2019-08-16", "05:34:36.405+0000"]

      if (format == 'yyyy-MM-dd') {
        return ISOFormattedBase[0];
      } else {
        // returns time format
        let t = ISOFormattedBase[1].split(":");
        // (3) ["05", "34", "36.405+0000"]

        let tm = t[0] + ":" + t[1]
        // "05:34"

        return tm
      }
    } catch (error) {
      // console.log("error in handleISOFormat func");
    }
  }

  // webinarLiveTime is stored in ISO standard format that has time zone appened to it.
  // formatDate converts webinarLiveTime based on client time zone and we don't want that at coach side
  updateRecord() {

    if (this.webinarTypeObj.webinarType != null && (this.webinarTypeObj.webinarType == 'live' || this.webinarTypeObj.webinarType == 'Live')) {
      this.setWebinarType('live', 'auto');
      this.webinarMst.webinarType = this.webinarTypeObj.webinarType;
      if (this.webinarTypeObj.webinarLiveDtl != null && this.webinarTypeObj.webinarLiveDtl != undefined) {
        this.webinarMst.webinarLiveDtl = this.webinarTypeObj.webinarLiveDtl;
        if (this.webinarMst.webinarLiveDtl.webinarLiveTime.length != 5)
          // this.webinarMst.webinarLiveDtl.webinarLiveTime = formatDate(this.webinarMst.webinarLiveDtl.webinarLiveTime, 'HH:mm','en-US');
          this.webinarMst.webinarLiveDtl.webinarLiveTime = this.handleISOFormat(this.webinarMst.webinarLiveDtl.webinarLiveTime, 'HH:mm');

        if (this.webinarMst.webinarLiveDtl.webinarLiveDate != undefined)
          // this.webinarMst.webinarLiveDtl.webinarLiveDate = formatDate(this.webinarMst.webinarLiveDtl.webinarLiveDate, 'yyyy-MM-dd', 'en-US');
          this.webinarMst.webinarLiveDtl.webinarLiveDate = this.handleISOFormat(this.webinarMst.webinarLiveDtl.webinarLiveDate, 'yyyy-MM-dd');

        // added length check, since formatted '13:45' shows err in // console
        if (this.webinarMst.webinarLiveDtl.webinarLiveTime != undefined && this.webinarMst.webinarLiveDtl.webinarLiveTime.length != 5)
          // this.webinarMst.webinarLiveDtl.webinarLiveTime = formatDate(this.webinarMst.webinarLiveDtl.webinarLiveTime, 'HH:mm', 'en-US');
          this.webinarMst.webinarLiveDtl.webinarLiveTime = this.handleISOFormat(this.webinarMst.webinarLiveDtl.webinarLiveTime, 'HH:mm');

        if (this.webinarMst.webinarLiveDtl.enableReplay) {
          // console.log(this.webinarMst.webinarLiveDtl.replayExpDays, " ; ", this.webinarMst.webinarLiveDtl.replayExpDate);
          if (this.webinarMst.webinarLiveDtl.replayExpDays != null) {
            $("#replayExpDay").removeAttr('disabled');
            $("#replayExpDay").focus();
            this.webinarReplayMode = true;
          }
          else if (this.webinarMst.webinarLiveDtl.replayExpDate != null) {
            $("#replayExpDate").removeAttr('disabled');
            // $("#replayExpDate").focus();
            this.webinarReplayMode = false;
            if (this.webinarMst.webinarLiveDtl.replayExpDate != undefined)
              // this.webinarMst.webinarLiveDtl.replayExpDate = formatDate(this.webinarMst.webinarLiveDtl.replayExpDate, 'yyyy-MM-dd', 'en-US');
              this.webinarMst.webinarLiveDtl.replayExpDate = this.handleISOFormat(this.webinarMst.webinarLiveDtl.replayExpDate, 'yyyy-MM-dd');
          }

        }
      }
      // console.log(this.webinarMst.webinarLiveDtl, " : ", this.webinarTypeObj.webinarLiveDtl);
    }
    else if (this.webinarTypeObj.webinarType != null && (this.webinarTypeObj.webinarType == 'Auto' || this.webinarTypeObj.webinarType == 'auto')) {

      this.webinarMst.webinarType = this.webinarTypeObj.webinarType;
      this.setWebinarType('auto', 'live');
      if (this.webinarTypeObj.webinarAutoDtl != null && this.webinarTypeObj.webinarAutoDtl != undefined) {
        this.webinarMst.webinarAutoDtl = this.webinarTypeObj.webinarAutoDtl;
        if (this.webinarMst.webinarAutoDtl.eventStartDate != undefined)
          // this.webinarMst.webinarAutoDtl.eventStartDate = formatDate(this.webinarMst.webinarAutoDtl.eventStartDate, 'yyyy-MM-dd', 'en-US');
          this.webinarMst.webinarAutoDtl.eventStartDate = this.handleISOFormat(this.webinarMst.webinarAutoDtl.eventStartDate, 'yyyy-MM-dd');
        this.webinarMst.webinarUrl = this.webinarTypeObj.webinarUrl;
        if (this.webinarMst.webinarAutoDtl != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length > 0) {
          let i = 1;
          this.autoEventTimeList = [];

          while (i <= this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length) {
            this.autoEventTimeList.push({ text: i, value: i });
            i++;
          }
         // this.webinarMst.webinarAutoDtl.numberOfSchedulesToDisplay = 'Select'
          // do this for null check, since empty object throws err in // console
          let keysLen = Object.keys(this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList[0]).length;

          if (this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length >= 1 && keysLen > 0) {

            this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.forEach(element => {
              //element.eventTime /= formatDate(element.eventTime, 'HH:mm', 'en-US');
              // alert('inside');

              if (element.eventTime.includes("T")) {

                element.eventTime = element.eventTime.split('T')[1].split('+')[0];
              }
            });
          }
        }
        // console.log(this.webinarMst.webinarUrl);
        this.webinarMst.webinarDurationHrs = this.webinarTypeObj.webinarDurationHrs;
        this.webinarMst.webinarDurationMins = this.webinarTypeObj.webinarDurationMins;
        this.webinarMst.webinarDurationSecs = this.webinarTypeObj.webinarDurationSecs;
      }
    }

    // console.log("this.webinarMst.webinarLiveDtl.webinarLiveTime", this.webinarMst.webinarLiveDtl.webinarLiveTime);

  }

  async createVideo() {

    var url = this.webinarMst.webinarUrl;
    // console.log(url);
    var videoObj = this.parseVideo(url);
    var $iframe = document.getElementById('webinarVideoIframe');

    // console.log(videoObj.id);
    if (videoObj.type == 'youtube') {
      var formattedTime = await this.getYoutubeDuration(videoObj.id);
      // console.log('formatted time : ' + formattedTime);
      //formattedTime = angular.element('#mainController').scope().totalSecs
      /*if(flag) 
        fancyTimeFormat(formattedTime);*/
    }
    else if (videoObj.type == 'vimeo') {
      // console.log('inside  else');
      var iframe = document.querySelector('iframe');
      await this.getVimeoDuration(videoObj.id);
      /*var player = new Vimeo.Player($iframe);
      var x = setInterval(function() {
      player.getDuration().then(function(duration) {
        if(flag)
        {
          this.fancyTimeFormat(duration);
          clearInterval(x);
        }
    }).catch(function(error) {
        // an error occurred
        // console.log('inside error ');
    });
    }, 1000);*/
    }
    return $iframe;
  }


  parseVideo(url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551
    // - Also supports relative URLs:
    //   - //player.vimeo.com/video/25451551

    if (url !== undefined && url !== null)
      url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
      var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
      var type = 'vimeo';
    }

    return {
      type: type,
      id: RegExp.$6
    };
  }


  async getVimeoDuration(yt_video_id) {

    var vimeoObj:any  = await this.webinarAPI.getVimeoData(yt_video_id);
    //var vimeoObj = JSON.parse(vimeoData['_body']);
    // console.log(vimeoObj);
    var totalSecs = vimeoObj.duration;
    // console.log('totalSecs : ' + totalSecs);
    //this.totalSecs = totalSecs;
    this.fancyTimeFormat(totalSecs);

  }


  async getYoutubeDuration(yt_video_id) {

    var youtubeObj:any = await this.webinarAPI.getYoutubeData(yt_video_id);
   // var youtubeObj = JSON.parse(youtubeData['_body']);
    // console.log(youtubeObj);
    // console.log(Object.keys(youtubeObj.items[0].contentDetails));
    var yt_duration = youtubeObj.items[0].contentDetails.duration;
    var duration = yt_duration.split("PT");

    if (duration[1].indexOf("H") >= 0)
      var hoursRef = duration[1].split("H");
    else
      hoursRef = duration;

    if (hoursRef[1].indexOf("M") >= 0)
      var minutesRef = hoursRef[1].split("M");
    else
      minutesRef = hoursRef;

    if (minutesRef[1].indexOf("S") >= 0)
      var secondsRef = minutesRef[1].split("S");
    else
      secondsRef = 0;

    duration[1].indexOf("H") >= 0 ? hoursRef = hoursRef[0] : hoursRef = 0;

    duration[1].indexOf("M") >= 0 ? minutesRef = minutesRef[0] : minutesRef = 0;

    duration[1].indexOf("S") >= 0 ? secondsRef = secondsRef[0] : secondsRef = 0;

    // console.log("hoursRef:", hoursRef, "minutesRef", minutesRef, "secondsRef", secondsRef);

    this.webinarMst.webinarDurationHrs = hoursRef;
    this.webinarMst.webinarDurationMins = minutesRef;
    this.webinarMst.webinarDurationSecs = secondsRef;

    // var hours = duration[1].split("H");

    // // console.log(hours[0]);
    // var minutes = 0;
    // var duration1 = duration[1];
    // // console.log('hours[1]) : ' + (duration1.indexOf('M') !== -1) + ' : ' + hours[0]);
    // var secs = 0;
    // if (hours[1] !== undefined) {
    //   minutes = hours[1].split("M");
    // }
    // else if (duration1.indexOf('M') !== -1) {
    //   minutes = duration[1].split("M");
    // }
    // else {
    //   secs = duration[1].split("S");
    // }
    // // console.log('isNaN : ' + minutes[0]);


    // var totalSecs = 0;
    // if (isNaN(minutes[1]) && minutes[1] !== undefined && yt_duration.indexOf('H') !== -1) {
    //   secs = minutes[1].split("S");
    //   // console.log(secs[0] + ' : ' + minutes[0]);
    //   totalSecs = (hours[0] * 60 * 60) + (minutes[0] * 60) + (secs[0]);
    //   // console.log('totalSecs : ' + totalSecs);
    // }
    // else if (isNaN(minutes[1]) && minutes[1] !== undefined && hours[0].indexOf('H') == -1) {
    //   secs = minutes[1].split("S");
    //   // console.log(secs[0] + ' : ' + minutes[0]);
    //   totalSecs = (minutes[0] * 60 - 0) + (secs[0] - 0);
    //   // console.log('totalSecs : 2 ', totalSecs);
    // }
    // else if (duration1.indexOf('M') !== -1)
    //   totalSecs = (hours[0] * 60 * 60) + (minutes[0] * 60);
    // else
    //   totalSecs = secs[0];
    // // console.log('totalSecs : ' + totalSecs);
    // //this.totalSecs = totalSecs;
    // this.fancyTimeFormat(totalSecs);

  }


  fancyTimeFormat(time) {
    // Hours, minutes and seconds
    time = Math.ceil(time);
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    $('#webinarHour').val = hrs;
    $('#webinarMin').value = mins;
    $('#webinarSecs').value = secs;
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    // console.log('return format : ' + ret);
    this.webinarMst.webinarDurationHrs = hrs;
    this.webinarMst.webinarDurationMins = mins;
    this.webinarMst.webinarDurationSecs = secs;

    return ret;
  }

  showhideDaysDiv() {
    if (this.webinarMst.webinarAutoDtl.eventFrequency == 'Week')
      $('#showWeekDays').show();
    else
      $('#showWeekDays').hide();

  }

  addNewEventTime() {

    this.showStartTimesErr = false;
    this.startTimesErrMsg = "";

    if (this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length < 10) {

      this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.push({ "eventTime": "" });

      this.autoEventTimeLength = this.autoEventTimeLength + 1;
      this.autoEventTimeList.push({ text: (this.autoEventTimeList.length + 1), value: (this.autoEventTimeList.length + 1) });
    }

    // console.log('inside function' + this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length);

    if (this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length >= 10) {
      alert('Event Timings can not be more than 10');
      return false;
    }
  }

  deleteWebinarEventTime(webinarEvent, index) {

    this.showStartTimesErr = false;
    this.startTimesErrMsg = "";

    this.autoEventTimeList.splice(this.autoEventTimeList.length - 1, 1);
    this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.splice(this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.indexOf(webinarEvent), 1);
    //angular.element($('#webinarEvent'+index)).remove();

  }

  // shows intervals like 15m, 30m, 1h, 2h, 3h
  listIntervals() {

    let num = 15;

    for (var i = 1; i <= 3; i++) {

      if (i > 1) {

        if (num / 60 <= 1) {

          let prev = num;

          num = num + prev;
        } else {

          num = num + 60;
        }
      }

      if (num < 60) {
        this.intervalList.push({ text: (num) + ' Minutes', value: (num) });
      } else {
        if (num / 60 == 1)
          this.intervalList.push({ text: (num / 60) + ' Hour', value: (num) });
        else
          this.intervalList.push({ text: (num / 60) + ' Hours', value: (num) });
      }
    }
   
  }

  showStartTimesErr = false;

  startTimesErrMsg = "";

  checkInterval() {

    let self = this;

    // sort eventTime
    this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.sort(function (a, b) { return self.getMilliSeconds(a.eventTime) - self.getMilliSeconds(b.eventTime) });

    // console.log("this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList", this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList);

    // let startTimesLength = this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length;

    //   for(let k=0; k<startTimesLength; k++) {
    //   // let addedEventTime = this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList[startTimesLength - 1].eventTime;

    //   let addedEventTime = this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList[k].eventTime;

    //   let addedEvtTimeInMs = this.getMilliSeconds(addedEventTime);

    //   if (startTimesLength > 1) {
    //     // console.log(this.webinarMst.webinarDurationHrs, this.webinarMst.webinarDurationMins, this.webinarMst.webinarDurationSecs, this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList[startTimesLength - 1].eventTime);

    //     // console.log(this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList, "indexOf eventTime", this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.indexOf(addedEventTime));

    //     // show alert when the added time already exists
    //     for (let i = 0; i < startTimesLength-1; i++) {

    //       let eventTime = this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList[i].eventTime;

    //       // check added event time right from second insert and show error, if the eventTimes match
    //       if (eventTime == addedEventTime) {
    //         this.showStartTimesErr = true;
    //         this.startTimesErrMsg = "*Event time has already been added";
    //         break;
    //       } else {
    //         this.showStartTimesErr = false;
    //         this.startTimesErrMsg = "";
    //       }

    //       // show alert and disable add more button if added time results in interval less than uploaded vid duration
    //       // get the existing event time in milliseconds
    //       let evtTimeInMs = this.getMilliSeconds(eventTime);

    //       // get the video length in milliseconds
    //       let vidEvtTimeInMs = (+this.webinarMst.webinarDurationHrs * (60000 * 60)) + (+this.webinarMst.webinarDurationMins * 60000);

    //       // add evtTimeInMs, vidEvtTimeInMs
    //       let updatedMs = evtTimeInMs + vidEvtTimeInMs;

    //       let intervalDiff = updatedMs - addedEvtTimeInMs;

    //       // console.log("intervalDiff", intervalDiff);

    //       // show alert to pick a different interval
    //       if (intervalDiff >= 0) {
    //         this.showStartTimesErr = true;
    //         this.startTimesErrMsg = "*Start time interval must be more than uploaded video duration";
    //         break;
    //       } else {
    //         this.showStartTimesErr = false;
    //         this.startTimesErrMsg = "";
    //       }
    //     }
    //   }

    //   let addBtnEle = document.getElementById("add-more-icon");

    //   if(this.showStartTimesErr) {
    //     // if err exists disable add more icon
    //     addBtnEle.setAttribute("disabled","disabled");

    //     addBtnEle.style.cssText = "color:#959595 !important; border: none; background: inherit";

    //   } else {
    //     // no err, enable btn
    //     addBtnEle.removeAttribute("disabled");

    //     addBtnEle.style.cssText = "color:#28a745 !important; border: none; background: inherit";
    //   }
    // }
  }

  getMilliSeconds(time) {
    let timeParts = time.split(":");
    // get the existing event time in milliseconds
    let evtTimeInMs = (+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000);

    return evtTimeInMs;
  }
  openCalendar(){}

  goBack()
  {
    this.router.navigate(['/webinarSetup/WebinarInfo']);    
  }
}
