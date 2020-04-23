import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

// import jquery
import * as $ from 'jquery';

import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';

import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';

import Swal from 'sweetalert2';

import { Location } from '@angular/common';

@Component({
  selector: 'app-webinar-setup',
  templateUrl: './webinar-setup.component.html',
  styleUrls: ['./webinar-setup.component.css']
})
export class WebinarSetupComponent implements OnInit, AfterViewInit {

  moduleStatus: any = [];

  constructor(
    private router: Router,
    private webinarConfigureService: WebinarConfigureService,
    private webinarAPI: WebinarAPIService,
    private location: Location
  ) {
    // set lastActiveModule for funnel validations
    localStorage.setItem("lastActiveModule", "webinar");

    // use this to detect change in webinartype and hide presentation tab for auto
    router.events.subscribe((val) => {
      if ((val instanceof NavigationEnd) && val.url.includes("auto")) {
        console.log("route changes detection triggered in webinar setup", (val instanceof NavigationEnd));

        let counter = 0;

        this.webinarNavLinks.forEach((item) => {

          if (item.name == "PresentationVideo") {
            counter++;
          }
        })

        if (counter == 1) {
          // remove presentation for auto webinar type
          this.webinarNavLinks.splice((this.webinarNavLinks.length - 1), 1);
        }

        console.log("webinarNavLinks after hiding presentation", this.webinarNavLinks);
      } else if ((val instanceof NavigationEnd) && val.url.includes("live")) {

        let presentationObj = { "index": 5, "name": "PresentationVideo", "alias": "Presentation Slides & Videos", "class": "icon cf-correct", "route": "PresentationVideo/", "status": "" };

        // add presentation for auto webinar type

        // use this counter to check if navLink has presentation obj 
        let counter = 0;

        this.webinarNavLinks.forEach((item) => {

          if (item.name == "PresentationVideo") {
            counter++;
          }
        })

        if (counter < 1) {
          this.webinarNavLinks.push(presentationObj);
        }
      }
    })
  }

  editWebinar: any;

  ngOnInit() {

    // select first navLink
    if (!this.selectedNavLink.index) {
      this.selectedNavLink = this.webinarNavLinks[0];
    }

    this.editWebinar = localStorage.getItem("editFunnel") || localStorage.getItem("editWebinar");
  }

  ngAfterViewInit() {

    console.log("in ngAfterViewInit()");

    this.editWebinar = localStorage.getItem("editFunnel") || localStorage.getItem("editWebinar");

    if (!this.editWebinar) {

      this.moduleStatus = [...this.webinarNavLinks];
    }

    // this.updateValidations();
  }

  webinarMst: any;

  selectedNavLink: any = [];

  webinarId: any;

  // set quizNavLinks 
  webinarNavLinks: any = [
    { "index": 1, "name": "WebinarInfo", "alias": "Webinar Info", "class": "icon cf-correct", "route": "WebinarInfo/", "status": "" },
    { "index": 2, "name": "WebinarType", "alias": "Webinar Type", "class": "icon cf-correct", "route": "WebinarType/", "status": "" },
    { "index": 3, "name": "Offer", "alias": "Offer", "class": "icon cf-correct", "route": "Offer/", "status": "" },
    { "index": 4, "name": "WebinarChatBox", "alias": "Chat Box", "class": "icon cf-correct", "route": "ChatBox/", "status": "VALID" },
    // { "index": 5, "name": "PresentationVideo", "alias": "Presentation Slides & Videos", "class": "icon cf-correct", "route": "PresentationVideo/", "status": "" },
  ];

  initModuleStatus: any = [
    { "index": 1, "name": "WebinarInfo", "alias": "Webinar Info", "class": "icon cf-correct", "route": "WebinarInfo/", "status": "" },
    { "index": 2, "name": "WebinarType", "alias": "Webinar Type", "class": "icon cf-correct", "route": "WebinarType/", "status": "" },
    { "index": 3, "name": "Offer", "alias": "Offer", "class": "icon cf-correct", "route": "Offer/", "status": "" },
    { "index": 4, "name": "WebinarChatBox", "alias": "Chat Box", "class": "icon cf-correct", "route": "ChatBox/", "status": "VALID" },
    // { "index": 5, "name": "PresentationVideo", "alias": "Presentation Slides & Videos", "class": "icon cf-correct", "route": "PresentationVideo/", "status": "" },
  ];

  // this function gets called when a clicked module is active
  async onSelect(navLink?) {

    console.log("selected navlink", navLink);
    this.selectedNavLink = navLink;

    // this object is taken from webinar service based on what has been recently changes and save it
    let savedModule = this.webinarConfigureService.recentlyUpdatedModule;

    // get data from from webinar service and
    this.webinarMst = this.webinarConfigureService[savedModule];

    // get editWebinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    if (this.webinarId && this.webinarId != "undefined") {
      this.webinarMst.id = this.webinarId;
    }

    console.log("this function gets called when useer clicks on a module, this shows activated module, need to get data from service and hit the save api", this.webinarMst, this.webinarId);

    // // get data from from quizService and
    // this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    // // start loader and save data at the time module switch
    //this.loadingScreenService.startLoading();

    // save webinar data
    let moduleUrl = this.webinarConfigureService.moduleUrl;

    //  remove fromService property, it is only used to hit the get api in modules
    delete this.webinarMst.fromService;

    if (this.webinarMst.webinarCategoryId == "select") {
      delete this.webinarMst.webinarCategoryId;
      delete this.webinarMst.webinarSubCategoryId;
    }

    if (this.webinarMst.webinarAutoDtl != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList != null && this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.length > 0) {
      this.webinarMst.webinarAutoDtl.webinarAutoDtlTimeList.forEach(element => {
        element.eventTime = new Date(Date.parse(this.webinarMst.webinarAutoDtl.eventStartDate + ' ' + element.eventTime));
      });
    }

    if (this.webinarMst.webinarLiveDtl != undefined && this.webinarMst.webinarLiveDtl.webinarLiveTime != null) {
      this.webinarMst.webinarLiveDtl.webinarLiveTime = new Date(Date.parse(this.webinarMst.webinarLiveDtl.webinarLiveDate + ' ' + this.webinarMst.webinarLiveDtl.webinarLiveTime));
    }

    var webinar: any = {};

    // try {
    // const posts = await this._placeholderService.getPosts();
    // this.posts = posts;
    let dataWebinar: any = await this.webinarAPI.saveWebinar(this.webinarMst, moduleUrl);

    console.log("dataWebinar after save response in webinar setup", dataWebinar);

    if (dataWebinar) {
      webinar = dataWebinar;

      // let dataWebinar = await this.webinarAPI.saveWebinar(this.webinarMst, moduleUrl);

      // console.log("dataWebinar after save response in webinar setup", dataWebinar);

      // var webinar = JSON.parse(dataWebinar['_body']);

      console.log("found webinar after save", webinar);

      if (webinar.statusCode == 200) {

        // this.webinarMst = webinar.data;
        // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

        console.log('webinar object', webinar.data);

        // if quizId doesn't exist in session storage, only then set it 
        // (to save data against the same id even after page reload)
        if (!localStorage.getItem("webinarId")) {

          console.log("webinarId for this SESSION", webinar.data.id);
          localStorage.setItem("webinarId", webinar.data.id);
        }

        // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);
        // set webinarinfo related fields into service
        this.webinarConfigureService[savedModule] = webinar.data;

        // get info realted fields
        this.webinarMst = this.webinarConfigureService[savedModule];

        if (this.webinarMst.webinarType)
          localStorage.setItem("webinarTypeChosen", this.webinarMst.webinarType);

        // set this, to be used for validation purpose
        this.webinarConfigureService.savedModule = savedModule

        // this.moduleStatus = [...this.webinarNavLinks];

        // this.updateValidations();

        this.webinarConfigureService.moduleStatus = webinar.data.moduleStatus;

        this.webinarMst.moduleStatus = this.webinarConfigureService.moduleStatus;

        this.updateStatus();

        // this.loadingScreenService.stopLoading();
        this.router.navigate(['/webinarSetup/' + navLink.route]);
        //this.loadingScreenService.stopLoading();
      }
    }
    //   } catch(error) {

    //     // stop loader
    //     this.loadingScreenService.stopLoading();

    //     // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
    //     console.log("error in saving post", error);

    //     //if the error is of invalid token type return to login page
    //     error = JSON.parse(error['_body']);

    //     console.log("error after parsing", error);

    //     if (error.error == "invalid_token") {

    //       // redirect to login page iof token is inavlid
    //       Swal.fire({
    //         text: error.error+", Please login",
    //         type: 'warning',

    //       }).then((result) => {
    //         if (result.value) {

    //           // clear everything from locastorage

    //           this.router.navigate(['/'])
    //         }
    //       })

    //     }
    // }
  }
  // this gets called when there a component is activated on router outlet
  // the data paramter of this func has all the fields and its values defined in an activated route at a given moment
  // based on that data just sets status of a module "VALID"/"INVALID"
  async onSetNavValidation(data: any) {

    for (let i = 0; i < this.webinarNavLinks.length; i++) {
      if (this.webinarNavLinks[i].name == data.module) {
        this.selectedNavLink = this.webinarNavLinks[i];
      }
    }

    this.webinarConfigureService.recentlyUpdatedModule = data.recentlyUpdatedModule

    this.webinarConfigureService.moduleUrl = data.moduleUrl;

    // if (!this.webinarConfigureService.savedModule) {
    //   this.webinarConfigureService.savedModule = this.webinarConfigureService.recentlyUpdatedModule;
    // }

    // get data from from quizService and
    // this.webinarMst = this.webinarConfigureService[this.webinarConfigureService.savedModule];
    this.webinarMst = this.webinarConfigureService[this.webinarConfigureService.recentlyUpdatedModule];

    // get editWebinarId from localStorage
    // this.webinarId = localStorage.getItem("webinarId");

    // NOTE: incase of edit, set webinarId into localStorage on clicking a webinar for edit
    // for testing purpose to check if validations are working, webinarId is set to a random id,
    // remove it when edit screen is developed
    // get editWebinarId from localStorage
    // here 519 is one of the webinar's id
    // this.webinarId = (localStorage.getItem("webinarId") || 519);
    this.webinarId = localStorage.getItem("webinarId");

    // on page refersh this function gets called 
    // set validations aftr making API call since data from service will be gone on page refresh
    // if id doesn't exist, getQUiz API is used
    if (this.webinarMst && (this.webinarMst.fromService == true) && this.webinarId) {
      // TODO: ADD WEBINAR NAME for get api
      let dataWebinar: any = await this.webinarAPI.getWebinar(this.webinarId, data.getParam);
      // .subscribe((dataWebinar: any) => {

      if (dataWebinar) {
        var webinar: any = dataWebinar;
        if (webinar.status == 'SUCCESS') {
          this.webinarMst = webinar.data;

          this.webinarConfigureService.moduleStatus = this.webinarMst.moduleStatus;

          console.log("check for moduleStatus, about to set validations", JSON.stringify(this.webinarMst));

          this.updateStatus();
        }
      }
      // });
    } else {
      if (this.webinarMst && (this.webinarMst.id != null || this.webinarMst.id != undefined || this.webinarMst.id != "")) {

       this.updateStatus();
      }
    }
  }

  updateStatus() {

    // update modules status with that of the common one from webinar service obj
    // this.editWebinar && 
    if (Object.keys(this.webinarConfigureService.moduleStatus).length != 0) {
      this.webinarMst.moduleStatus = this.webinarConfigureService.moduleStatus;
    }
    
     // get status from local storage and set validation based on status
     this.webinarNavLinks.forEach(element => {

      if (this.webinarMst && this.webinarMst.moduleStatus && (this.webinarMst.moduleStatus[element.name] != null ||
        this.webinarMst.moduleStatus[element.name] != undefined ||
        this.webinarMst.moduleStatus[element.name] != "")) {

        element.status = this.webinarMst.moduleStatus[element.name];
      }
    });

    this.moduleStatus = [...this.webinarNavLinks];

    this.updateValidations();
  }

  highestVisitedModule: any = -1;

  updateValidations() {
    // get editQuiz from localStorage
    // if editQuiz is undefined or false => fresh quiz
    // apply highestVisitedModule logic
    this.editWebinar = localStorage.getItem("editFunnel") || localStorage.getItem("editWebinar");

    this.highestVisitedModule = this.selectedNavLink.index > 1 ? this.selectedNavLink.index : -1;

    console.log("this.highestVisitedModule", this.highestVisitedModule);

    this.moduleStatus.forEach((element, i) => {
      if (i < this.highestVisitedModule && !this.editWebinar == true) {
        element.status = !element.status ? "INVALID" : element.status
      } else {
        if (!this.editWebinar) {

          // element.status = element.status == "VALID" ? element.status : "";

          element.status = element.status == "VALID" ? element.status : element.status;
        } else {

          element.status = element.status ? element.status : "INVALID";
        }
      }
    })
  }

  // Dont Know why this function is placed on the back button(Naincy)
  // backPreview = function (setupForm, sectionId, previewBox) {
  //   $("#quizSideBar").show();
  //   $("." + setupForm).show();
  //   $("#" + sectionId).css({ 'margin-left': '225px' });
  //   if (previewBox == 'previewQuestion') {
  //     $("#" + previewBox).addClass('col-lg-7');
  //   }
  //   $("#" + previewBox).removeClass('col-md-12');
  //   $(".backButton").hide();
  // }
  backPreview() {
    // this.router.navigate(["/WebinarList"]);
    Swal.fire({
      text: "Your changes may be lost if you have not saved your data, Please make sure you have saved your data",
      type: 'info',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem("webinarId");
        localStorage.removeItem("webinarTypeChosen");
        this.webinarConfigureService.resetWebinarConfigure();
        var funnelType = localStorage.getItem('funnelUrl')
        this.router.navigate(['/funnelCreate/' + funnelType], { queryParams: { editWebinar: true } });
      }
    });
    //this.location.back(); // <-- go back to previous location on back
  }
  async publishQuiz() {

    // this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    // this.quizConfiguration.status = 'Published';
    // var x = $('.create-quiz__menu li');
    // var index = 0;
    // for (var i = 0; i < x.length; i++) {
    //   if ($('.create-quiz__menu li').eq(i).hasClass('not-completed')) {
    //     index++;
    //   }
    // }
    // if (index == 0) {
    //   $('#loader').show();
    //   let response = await this.quizAPI.saveQuiz(this.quizConfiguration);
    //   var quiz = JSON.parse(response['_body']);
    //   this.quizConfiguration = quiz.data;
    //   this.message = 'Quiz Published Successfully';
    //   setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    //   $("#messageBox").fadeIn();
    //   setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    //   //        $(".QuizTitleHeadline").text($scope.quizConfiguration.quizTitle)
    //   //        $scope.quizOutcomeArray = response.data.quizOutcomes;
    //   //        $scope.questionArray = response.data.quizQuestions;
    //   //        
    // } else {
    //   alert("You have not completed the quiz, Please complete the quiz before publishing");
    // }

    // check status of modules
    // get data from from webinarService 
    this.webinarMst = this.webinarConfigureService[this.webinarConfigureService.savedModule];

    // console.log("in publishQuiz()", this.webinarMst);

    // check module status and alert if any module in complete
    let moduleKeys: any;

    let status: any = true;

    if (this.webinarMst.moduleStatus) {

      moduleKeys = Object.keys(this.webinarMst.moduleStatus);

      for (let i = 0; i < moduleKeys.length; i++) {
        if (this.webinarMst[moduleKeys[i]] == "INVALID") {
          status = false;
        }
      }
    }

    if (status == true) {

      // hit the save API
      // save webinar data
      // let moduleUrl = "/webinarType";
      //this.loadingScreenService.startLoading();

      // this.webinarMst.status = "Published";

      this.webinarId = localStorage.getItem("webinarId");

      if (this.webinarId) {
        // let data = await this.webinarAPI.saveWebinarType(this.webinarMst, moduleUrl);
        let res: any = await this.webinarAPI.getWebinarStatus(this.webinarId);
        // var res = JSON.parse(data['_body']);
        console.log("webinar status found", res);
        if (res.data != null) {

          // set only webinarMstType data, coming from response res.data(this should contain only webinar type response), into service
          // this.webinarConfigureService[this.webinarConfigureService.savedModule] = res.data;
          // this.webinarMst = this.webinarConfigureService[this.webinarConfigureService.savedModule];


          // if webinarId doesn't exist in session storage, only then set it 
          // (to save data against the same id even after page reload)
          // if (!localStorage.getItem("webinarId")) {

          //   console.log("webinarId for this SESSION", res.data.id);
          //   localStorage.setItem("webinarId", res.data.id);
          // }

          this.webinarMst = res.data;

          if (res.message == "Webinar already Published") {
            this.webinarMst.status = "Published";
          }

          // stop the loader
          //this.loadingScreenService.stopLoading();
        }
      }
    }
    else {
      alert("You have not completed the quiz, Please complete the quiz before publishing");
      //this.loadingScreenService.stopLoading();
    }
  }

} 
