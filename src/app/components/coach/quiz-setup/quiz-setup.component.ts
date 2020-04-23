import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';
import { QuizConfigureserviceService } from "../../../services/coach/quiz/quiz-configureservice.service"
// import jquery
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';

import { FormValidationService } from '../../../services/global/form-validation.service';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';

import { Location } from '@angular/common';
import Swal from 'sweetalert2';
// import { element } from '@angular/core/src/render3';
// import { stat } from 'fs';
@Component({
  selector: 'app-quiz-setup',
  templateUrl: './quiz-setup.component.html',
  styleUrls: ['./quiz-setup.component.css']
})
export class QuizSetupComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private quizConfigureserviceService: QuizConfigureserviceService,
    private formValidationService: FormValidationService,
    private quizAPI: QuizapiserviceService,
    private quizConfigureservice: QuizConfigureserviceService,
    private authService: AuthapiserviceService,
    private location: Location
  ) {
    // set lastActiveModule for funnel validations
    localStorage.setItem("lastActiveModule", "quiz");
  }

  allowedKeys: any = ["outcomeTitle", "outcomeDesc", "offerHeadling", "offerDescription", "actionLabel", "headline", "headlineDesc", "callActionLabel",
    "quizTitle", "quizDescription", "quizCallActionLabel",
    "questionDescription", "answerDescription"];

  formData: any;

  formStatus: any;

  module: any;

  quizId: any;

  currentUser: any;

  quizConfiguration: any;

  message: any;

  quizOutcome: any;

  quizQuestion: any;

  counter: any = 0;

  loaded: boolean = true;

  selectedNavLink: any = {};

  previouslySelectedLink: any ={};

  moduleStatus: any = [];

  editQuiz: any;

  highestVisitedModule: any = -1;

  // this function gets called when a clicked module is active
  async onSelect(navLink?) {
    this.previouslySelectedLink = this.selectedNavLink;
    console.log("selected navlink", navLink);
    this.selectedNavLink = navLink;

    localStorage.setItem("lastVisitedSubModule", navLink.name);

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;


    console.log("this.quizConfiguration in onSelect activator func", this.quizConfiguration);

    // make an API call if quizConfiguration obj is empty
    if (localStorage.getItem("edit") == "false") {
      if(this.quizConfiguration != null){
      this.quizConfiguration.moduleName = navLink.name;
      delete this.quizConfiguration.moduleStatus;
      }
    }
    // this.quizConfiguration.moduleName = navLink.name;

    // hit save API 
    var data:any={};
    if(this.previouslySelectedLink.name == 'Welcome Page'){
      data.allowSocialSharing = this.quizConfiguration.allowSocialSharing;
      data.quizDescription = this.quizConfiguration.quizDescription;
      data.quizMediaAttached = this.quizConfiguration.quizMediaAttached;
      data.quizTitle = this.quizConfiguration.quizTitle;
      if(this.quizConfiguration.id)
      data.id = this.quizConfiguration.id;
    }else if(this.previouslySelectedLink.name == 'outcomes'){
      data = { "id": this.quizId, "quizOutcomes":this.quizConfiguration.quizOutcomes  };
    }else if(this.previouslySelectedLink.name == 'Questions'){
      data={ "id": this.quizId, "multiVariationNo": this.quizConfiguration.multiVariationNo, "quizQuestions":  this.quizConfiguration.quizQuestions};
    }else if(this.previouslySelectedLink.name == 'LeadCapture'){
      data = { "id": this.quizId, "quizLeadCaptureInfo": this.quizConfiguration.quizLeadCaptureInfo }
    }else if(this.previouslySelectedLink.name == 'Quiz Design'){
      data = {"id": this.quizId,"fontLightDark":this.quizConfiguration.fontLightDark, "fontColor": this.quizConfiguration.fontColor,"fontName":this.quizConfiguration.fontName,"quizColorScheme" : this.quizConfiguration.quizColorScheme}
    }if (this.previouslySelectedLink.name == 'Settings'){
      data ={ "id": this.quizId, "quizSEOMetadata": this.quizConfiguration.quizSEOMetadata}
    }
    let quiz :any = await this.quizAPI.saveQuiz(data);
    
    //var quiz = JSON.parse(dataQuiz['_body']);
    this.quizConfiguration = quiz.data;
    console.log(this.quizConfiguration);
    // store data in service 
    if(this.previouslySelectedLink.name == 'Welcome Page'){
      this.quizConfigureservice.change(this.quizConfiguration,'WelcomePage');
    }else if(this.previouslySelectedLink.name == 'outcomes'){
      this.quizConfigureservice.change(this.quizConfiguration,'Outcome');
    }else if(this.previouslySelectedLink.name == 'Questions'){
      this.quizConfigureservice.change(this.quizConfiguration,'Question');
    }else if(this.previouslySelectedLink.name == 'LeadCapture'){
      this.quizConfigureservice.change(this.quizConfiguration,'Lead Capture');
    }else if(this.previouslySelectedLink.name == 'Quiz Design'){
      this.quizConfigureservice.change(this.quizConfiguration,'Quiz Design');
    }else if(this.previouslySelectedLink.name == 'Settings'){
      this.quizConfigureservice.change(this.quizConfiguration,'Settings');
    }
    //this.quizConfigureservice.change(this.quizConfiguration);
    console.log('quiz object from Activator call');
    console.log(quiz.data);

    // if quizId doesn't exist in session storage, only then set it 
    // (to save data against the same id even after page reload)
    if (!localStorage.getItem("quizId")) {

      console.log("quizId for this SESSION", quiz.data.id);
      localStorage.setItem("quizId", quiz.data.id);
    }

    // get status from local storage and set validation based on status
    this.quizNavLinks.forEach(element => {

      // console.log("status of module ", element.name, "and its value", localStorage.getItem(element.name));

      if (quiz && quiz.data && (quiz.data.moduleStatus[element.name] != null ||
        quiz.data.moduleStatus[element.name] != undefined ||
        quiz.data.moduleStatus[element.name] != "")
        || element.name.startsWith("Welcome")) {

        console.log("element.name.startsWith('Welcome')", element.name.startsWith("Welcome"), "quiz.data.moduleStatus.WelcomePage", quiz.data.moduleStatus.WelcomePage);

        element.status = !element.name.startsWith("Welcome") ? quiz.data.moduleStatus[element.name] : quiz.data.moduleStatus.WelcomePage;
      }
    });

    this.moduleStatus = this.quizNavLinks;

    this.updateValdiations();

    this.router.navigate(['/quizSetup/'+navLink.route]);
  }

  // set quizNavLinks 
  quizNavLinks: any = [
    { "index": 1, "name": "Welcome Page", "class": "icon cf-correct", "route": "WelcomePage/", "status": "" },
    { "index": 2, "name": "outcomes", "class": "icon cf-correct", "route": "Outcomes/", "status": "" },
    { "index": 3, "name": "Questions", "class": "icon cf-correct", "route": "Questions/", "status": "" },
    { "index": 4, "name": "LeadCapture", "class": "icon cf-correct", "route": "LeadCapture/", "status": "" },
    { "index": 5, "name": "Quiz Design", "class": "icon cf-test", "route": "QuizDesign/", "status": false },
    { "index": 6, "name": "Settings", "class": "icon cf-setting", "route": "Settings/", "status": false }
  ];

  initModuleStatus: any = [
    { "index": 1, "name": "Welcome Page", "class": "icon cf-correct", "route": "WelcomePage/", "status": "" },
    { "index": 2, "name": "outcomes", "class": "icon cf-correct", "route": "Outcomes/", "status": "" },
    { "index": 3, "name": "Questions", "class": "icon cf-correct", "route": "Questions/", "status": "" },
    { "index": 4, "name": "LeadCapture", "class": "icon cf-correct", "route": "LeadCapture/", "status": "" },
    { "index": 5, "name": "Quiz Design", "class": "icon cf-test", "route": "QuizDesign/", "status": false },
    { "index": 6, "name": "Settings", "class": "icon cf-setting", "route": "Settings/", "status": false }
  ];

  // use this variable to check if there's any editQuizId set at the time of login
  // editQuizId: any;

  statusArray: any = [];

  // this gets called when there a component is activated on router outlet
  // the data paramter of this func has all the fields and its values defined in an activated route at a given moment
  // based on that data just sets status of a module "VALID"/"INVALID"
  onSetNavValidation(data: any) {

    for (let i = 0; i < this.quizNavLinks.length; i++) {
    if (this.quizNavLinks[i].name == data.module) {
      this.selectedNavLink = this.quizNavLinks[i];
    }
  }

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    // get editQuizId from localStorage
    this.quizId = localStorage.getItem("quizId");

    // on page refersh this function gets called 
    // set validations aftr making API call since data from service will be gone on page refresh
    // if id doesn't exist, getQUiz API is used
    if ((this.quizConfiguration && !this.quizConfiguration.id) && this.quizId) {
      this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {

        var quiz :any = dataQuiz;
        if (quiz.status == 'SUCCESS') {
          this.quizConfiguration = quiz.data;

          // get status from local storage and set validation based on status
          this.quizNavLinks.forEach(element => {

            // console.log("status of module ", element.name, "and its value", localStorage.getItem(element.name));

            if (this.quizConfiguration && this.quizConfiguration.moduleStatus && (this.quizConfiguration.moduleStatus[element.name] != null ||
              this.quizConfiguration.moduleStatus[element.name] != undefined ||
              this.quizConfiguration.moduleStatus[element.name] != "")) {

              // element.status = this.quizConfiguration.moduleStatus[element.name];
              element.status = !element.name.startsWith("Welcome") ? this.quizConfiguration.moduleStatus[element.name] : this.quizConfiguration.moduleStatus.WelcomePage;
            }
          });

          this.moduleStatus = [...this.quizNavLinks];

          this.updateValdiations();
        }else{
          this.serverError(quiz);
        }
      });
    } else {
      if(this.quizConfiguration && (this.quizConfiguration.id != null || this.quizConfiguration.id != undefined || this.quizConfiguration.id != "")) {
    // get status from local storage and set validation based on status
    this.quizNavLinks.forEach(element => {

      // console.log("status of module ", element.name, "and its value", localStorage.getItem(element.name));

      if (this.quizConfiguration && this.quizConfiguration.moduleStatus && (this.quizConfiguration.moduleStatus[element.name] != null ||
        this.quizConfiguration.moduleStatus[element.name] != undefined ||
        this.quizConfiguration.moduleStatus[element.name] != "")) {

        // element.status = this.quizConfiguration.moduleStatus[element.name];
        element.status = !element.name.startsWith("Welcome") ? this.quizConfiguration.moduleStatus[element.name] : this.quizConfiguration.moduleStatus.WelcomePage;
      }
    });

    this.moduleStatus = this.quizNavLinks;

    this.updateValdiations();
  }
  }
  }

  returnBoolBasedOnStatus(status) {

    return status == "VALID" ? 1 : 0;
  }

  updateValdiations() {
    // get editQuiz from localStorage
    // if editQuiz is undefined or false => fresh quiz
    // apply highestVisitedModule logic
    this.editQuiz = localStorage.getItem("editFunnel") || localStorage.getItem("editQuiz");
    // this.editQuiz = localStorage.getItem("editQuiz");

    this.highestVisitedModule = this.selectedNavLink.index > 1 ? this.selectedNavLink.index : -1;

    console.log("this.highestVisitedModule", this.highestVisitedModule);

    this.moduleStatus.forEach((element, i) => {
      if ( i < this.highestVisitedModule && !this.editQuiz == true ) {
        element.status = !element.status ? "INVALID" :  element.status
      } else {

        if (!this.editQuiz) {

          // element.status = element.status == "VALID" ? element.status : "";

          element.status = element.status == "VALID" ? element.status : element.status;
        } else {

          element.status = element.status ? element.status : "INVALID";
        }
      }

      // don't show validations for test quiz and settings page
      if (i >= 4) {
        element.status = false;
      }
    });

    // let dStatus: any = this.returnBoolBasedOnStatus(this.moduleStatus[0].status) && this.returnBoolBasedOnStatus(this.moduleStatus[1].status) && this.returnBoolBasedOnStatus(this.moduleStatus[2].status)

    // dStatus = dStatus == 1 ? "VALID" : "INVALID";

    // let TestQuizStatus = {
    //   "index": 5, "name": "Test Quiz", "class": "icon cf-test", "route": "TestQuiz/", "status": dStatus
    // };

    // let settingsStatus = {
    //   "index": 6, "name": "Settings", "class": "icon cf-setting", "route": "Settings/", "status": this.moduleStatus[0].status
    // };

    // // update status of test module
    // this.moduleStatus[4] = TestQuizStatus;

    // // update state of settings module
    // this.moduleStatus[5] = settingsStatus;
  }

  // initialization logic
  ngOnInit() {

    console.log("in the ngOnInit() of quiz-setup, quizNavLinks", this.quizNavLinks, "this.selectedNavLink", this.selectedNavLink);

    // select first navLink
    if( !this.selectedNavLink.index ) {
    this.selectedNavLink = this.quizNavLinks[0];
    }
  }

  ngAfterViewInit() {

    console.log("in ngAfterViewInit()");

    this.editQuiz = localStorage.getItem("editFunnel") || localStorage.getItem("editQuiz");
    // this.editQuiz = localStorage.getItem("editQuiz");

    if (!this.editQuiz) {

      // if (localStorage.getItem("lastVisitedSubModule") != "LeadCapture")
      //   this.moduleStatus = this.initModuleStatus;
      // else {
      //    // show the latest bindings for validations

      //     console.log("inside else from test quiz", this.quizNavLinks);

      this.moduleStatus = [...this.quizNavLinks];
      // }
    }

  }

  logoutUser() {
    // localStorage.removeItem("token");
    // localStorage.removeItem("currentUser");

    // remove everything at the time of log out
    localStorage.clear();

    this.quizConfigureservice.quizConfiguration = {};

    this.router.navigate(['/']);
  }

  async publishQuiz() {
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    this.quizConfiguration.status = 'Published';
    var x = $('.create-quiz__menu li');
    var index = 0;
    for (var i = 0; i < x.length; i++) {
      if ($('.create-quiz__menu li').eq(i).hasClass('not-completed')) {
        index++;
      }
    }
    if (index == 0) {
     // $('#loader').show();
      let quiz:any = await this.quizAPI.saveQuiz(this.quizConfiguration);
      //var quiz = JSON.parse(response['_body']);
      this.quizConfiguration = quiz.data;
      this.message = 'Quiz Published Successfully';
      setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
      $("#messageBox").fadeIn();
      setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
      //        $(".QuizTitleHeadline").text($scope.quizConfiguration.quizTitle)
      //        $scope.quizOutcomeArray = response.data.quizOutcomes;
      //        $scope.questionArray = response.data.quizQuestions;
      //        
    } else {
      alert("You have not completed the quiz, Please complete the quiz before publishing");
    }
  }

  hideMessageBox() {
    $("#messageBox").fadeOut();
  }

  goBackToDashBoard()
  {
    // Object.keys(localStorage)
    //   .forEach(function(k) {
    //     console.log(k);
    //     if(k != 'token' && k != 'currentUser') 
    //       localStorage.removeItem(k);
    // });

    // remove quizId from localStorage at the time of clicking back
    // quizId is set when user navigates from funnel steps page
    localStorage.removeItem("quizId");

    // store empty data in service when clicking back
    //this.quizConfigureservice.change({multiVariationNo:	1});
    Swal.fire({
      text: "Your changes may be lost if you have not saved your data, Please make sure you have saved your data",
      type: 'info',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        this.quizConfigureserviceService.quizConfiguration = { multiVariationNo:	1};
        localStorage.removeItem('quizId')
        var funnelType = localStorage.getItem('funnelUrl')
        this.router.navigate(['/funnelCreate/'+funnelType], { queryParams: {editQuiz: true}});
      }
  });
    
    //this.location.back(); // <-- go back to previous location on back
  }

  onPreview() {

    console.log("this.quizConfiguration.status", this.quizConfiguration.status);

    // get the quiz status
    // if it is active, user can preview testQuiz
    // if(this.quizConfiguration.status.toLowerCase() == 'active') {
      // if (true) {

    // navigate to testQuiz
    this.router.navigate(['/TestQuiz']);
    // } else {

    //   // if quiz is not active, show info popup
    //   Swal.fire({
    //     text: "You can only preview once you completely setup quiz.",
    //     type: 'info',
    //     showCancelButton: true
    //   }).then((result) => {
    //     // do not do anything, just show alert
    //   });
    // }
  }

//Handeler that handels erorr if the status code of the api is not SUCCESS
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
export const quizConfiguration = {
  allowSocialSharing: true,
  isPvtPub: true,
  multiVariationNo: "1",
  quizColorScheme: []
};