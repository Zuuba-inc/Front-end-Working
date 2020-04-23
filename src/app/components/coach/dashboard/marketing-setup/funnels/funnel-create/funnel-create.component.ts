import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import {Router} from '@angular/router';

import Swal from 'sweetalert2';
// import service that returns components array
import { FunnelFragmentsService } from 'src/app/services/coach/funnel/funnel-fragments.service';

import { FunnelService } from 'src/app/services/coach/funnel/funnel.service';

// import funnels-fragment component 
import { FunnelFragmentsComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/funnel-fragments.component';

// import class
import { Fragment } from 'src/app/services/global/classes/fragment'; 

// import components to be rendered dynamically
import { RegistrationPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/registration-page/registration-page.component'
import { EmailsComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/emails/emails.component';
import { WelcomePageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/welcome-page/welcome-page.component';
import { WebinarPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/webinar-page/webinar-page.component';
import { QuizPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/quiz-page/quiz-page.component';
import * as $ from 'jquery';
import {Common} from '../../../../../../services/global/common';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-funnel-create',
  templateUrl: './funnel-create.component.html',
  styleUrls: ['./funnel-create.component.css']
})
export class FunnelCreateComponent implements OnInit {

  fragments: Fragment[];

  lastSeperatorLine :any ={};
  lastFunnelAdded:any={};

  showEditIcon: any = false;
  
  showEditFunnelTitleModal: any = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private funnelFragmentsService: FunnelFragmentsService,
    public funnelService: FunnelService,
    private router: Router,
    public common: Common
    ) { }

  funnelId: any;

  funnelData: any;

  funnelSteps: any;

  data: any;
  editFunnel = false;
  editQuiz = false;
  editWebinar = false;
  funnel:any={};

  moduleStatus: any = {};

  // use this to get stepDetailTitle array from funnelSteps
  moduleStatusNames: any = [];

  highestVistedStep: any = -1;

  lastActiveModule: any = "";

  statusKeys: any = [];

  validSteps: any = 0;

  completionWidth: any = {};
  
  automationRules:any={};
  async ngOnInit() {

    // use this to set funnelTypeId based on index
    let funnelTypes = ["Webinar", "QuizandWebinar"];

    // get funnelType from route
    const funnelType = this.route.snapshot.paramMap.get('funnelType');

    console.log("funnelType found from route params", funnelType, funnelTypes.indexOf(funnelType));

    // for funnelId 1 =>  Webinar, 2 =>  Quiz+Webinar 
    this.funnelId = funnelTypes.indexOf(funnelType) + 1;

    console.log("inside getFragments", this.funnelId);

    // TODO: ADD FRAGMENTS GET API THAT FETCHES STEPS RELATED DATa
    let funnelSteps = [
      {
        "id": 1,
        "stepName": "Registration Page",
        "className": "zu-webpage",
        "stepDetailTitle": "WEBINAR REGISTRATION PAGE",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 1"
      },
      {
        "id": 2,
        "stepName": "8 Emails",
        "className": "zu-mail",
        "stepDetailTitle": "EMAILS",
        "stepDetailDescription": "Welcome Email<br/>4 emails before webinar<br/>4 emails after webinar",
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 2"
      },
      {
        "id": 3,
        "stepName": "Thank You Page",
        "className": "zu-webpage",
        "stepDetailTitle": "THANK YOU",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 3"
      },
      {
        "id": 4,
        "stepName": "Webinar",
        "className": "zu-video-page",
        "stepDetailTitle": "WEBINAR",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 4"
      }
    ]

    // get components based on funnelType
    // based on funnelType. get requiredComponents for that type
    let response = await this.funnelService.getFunnelSteps(this.funnelId);

    this.data = response;

    // TODO: UPDATE MODULE STATUS FROM API RESPONSE
    // this.moduleStatus = {
    //   "Thank You Page": "VALID",
    //   "Webinar": "INVALID",
    //   "8 Emails": "",
    //   "Registration Page": ""
    // }

    // console.log(this.data)
    if (this.data.status == 'SUCCESS') {
      this.funnelData = this.data.data;
      console.log("found funnelSteps", this.funnelData.funnelSteps, "with funnelId", this.funnelId);
      var automationRuleResponse:any = await this.funnelService.getFunnelWhenOptions();
      if(automationRuleResponse.status == 'SUCCESS'){
        this.automationRules =  automationRuleResponse.data;
      }
      this.funnel = await this.funnelFragmentsService.getFunnelDataFromAPI();

      this.funnelSteps = this.funnelData.funnelSteps;
      this.funnelService.setEmailCampaignIdForWQ(this.funnel);
      // get module status
      this.moduleStatus = this.funnel.moduleStatus;

      // TODO: REMOVE THIS AFTER TESTING VALIDATIONS
      // this works on funneltype being only for webianr
      // this.moduleStatus = {
      //   "WEBINAR REGISTRATION PAGE": "",
      //   "EMAILS": "",
      //   "THANK YOU": "VALID",
      //   "WEBINAR": "",
      //   // "QUIZ":"VALID"
      // }

      // [start of moduleStatus update code]
      // get stepDetailTitle for each into moduleStatusNames
      // COMMENTED FOR UPDATING MODULESTATUS
      this.moduleStatusNames = this.funnelSteps.map(item => item.stepDetailTitle.toUpperCase());

      // let self = this;

      // COMMENTED FOR TESTING MODULESTATUS VALIDATIONS
      // this.moduleStatusNames.forEach((item) =>{

        // get status of self.funnel[item]
        // based on modules/steps present in this.funnel
        // check for a module/step and its status
        // if status is 
        // DRAFT => ""(IN this.moduleStatus FOR THAT MODULE/STEP)
        // CREATED => "INVALID"(IN this.moduleStatus FOR THAT MODULE/STEP)
        // ACTIVE => "VALID"(IN this.moduleStatus FOR THAT MODULE/STEP)
        // console.log("statusNames", self.funnel[item], "self.funnelSteps", self.funnel, "item", item);

      //   let status = "";

      //   if (self.funnel[item])
      //   status = self.funnel[item].status == "CREATED" ? "INVALID" : (self.funnel[item].status == "ACTIVE" ? "VALID" : "");

      //   self.moduleStatus[item] = status;
      // });
      // END

      console.log("this.moduleStatus", this.moduleStatus);
      // [end of moduleStatus update code]
      // get the lastActiveModule name and update all the steps above to it invalid if it is "" eles retain its
      // value
      // COMMENTED FOR TESTING
      this.lastActiveModule = localStorage.getItem("lastActiveModule") ? localStorage.getItem("lastActiveModule").toUpperCase() : "";

      // TODO: REMOVE THIS AFTER TESTING VALIDATIONS
      // let lastActiveModule = "emails";

      // get keys of moduleStatus
      this.statusKeys = Object.keys(this.moduleStatus);

      // used at the navigation b/w steps and funnelCreate page
      // if (lastActiveModule) {

      // updates highestVisitedStep based on which validations are shown
      this.statusKeys.map((item, i) => {

        this.highestVistedStep = this.moduleStatusNames.indexOf(this.lastActiveModule) > this.highestVistedStep ? this.moduleStatusNames.indexOf(this.lastActiveModule) : this.highestVistedStep;

        if (this.moduleStatus[item] && this.statusKeys.indexOf(item) > this.highestVistedStep) {
          this.highestVistedStep = this.statusKeys.indexOf(item);
        }

        if (localStorage.getItem("editFunnel"))
        this.highestVistedStep = this.statusKeys.length-1;
      });
      // }

      // for editFunnel being true in localStorage, set this.highestVistedStep to max length
      this.highestVistedStep = localStorage.getItem("editFunnel") ? this.statusKeys.length : this.highestVistedStep;

      console.log("highest visited step", this.highestVistedStep);

      // updates valid/invalid for a step
      this.statusKeys.map((item, i) => {

        if (i <= this.highestVistedStep) {
          this.moduleStatus[item] = this.moduleStatus[item] == "" ? "INVALID" : this.moduleStatus[item];

          if (this.moduleStatus[item] == "VALID") {
            this.validSteps++;
          }
        }
      });

      console.log("lastActiveModule", this.lastActiveModule, "this.moduleStatusNames.indexOf(lastActiveModule)", this.moduleStatusNames.indexOf(this.lastActiveModule), "this.moduleStatus[lastActiveModule]", this.moduleStatus[this.lastActiveModule], "this.highestVistedStep", this.highestVistedStep);

      if (this.funnelId == 1) {
        this.fragments = [
          new Fragment(RegistrationPageComponent, this.funnelSteps[0]),
          new Fragment(EmailsComponent, this.funnelSteps[1]),
          new Fragment(WelcomePageComponent, this.funnelSteps[2]),
          new Fragment(WebinarPageComponent, {steps: this.funnelSteps[3], webinarData: this.funnel, automationRule : this.automationRules})
        ];
      } else if (this.funnelId == 2) {
        this.fragments = [
          new Fragment(WelcomePageComponent, this.funnelSteps[0]),
          new Fragment(QuizPageComponent, {steps: this.funnelSteps[1], quizData: this.funnel, automationRule : this.automationRules}),
          new Fragment(EmailsComponent, this.funnelSteps[2]),
          new Fragment(RegistrationPageComponent, this.funnelSteps[3]),
          new Fragment(EmailsComponent, this.funnelSteps[4]),
          new Fragment(WebinarPageComponent, {steps: this.funnelSteps[5], webinarData: this.funnel,automationRule : this.automationRules})
        ];
      }
      console.log(this.fragments);
      this.setFunnelFragmentData();
      this.createQuickLink();
      //TO get the funnel data that is being edited or Created
      this.getFunnelData();
      // detect changes, added this bc since there was an error on console related binding changes detection
      this.cdr.detectChanges();
      
     
    }

    // this.fragments = await this.funnelFragmentsService.getFragments(this.funnelId+1);

  }
  setFunnelFragmentData(){
    var funnelComponentDetails=[];
    this.fragments.forEach(data =>{
      if(data.data.steps){
        if(data.data.steps.stepName == "Webinar"){
          var obj :any={
            id:data.data.webinarData.webinar.id,
            name:data.data.webinarData.webinar.webinarTitle,
            stepName: data.data.steps.stepName
          }
          if(data.data.webinarData.webinar.webinarCardImgUploadPath != null){
            obj.image = data.data.webinarData.webinar.webinarCardImgUploadPath
            obj.imageType = 'Image'
          }else{
            obj.image = data.data.steps.stepDetailImage;
            obj.imageType = 'ClassName'
          }
          funnelComponentDetails.push(obj)
        }else if(data.data.steps.stepName == "Quiz"){
            var obj :any={
              id:data.data.quizData.quiz.id,
              name:data.data.quizData.quiz.quizTitle,
              stepName: data.data.steps.stepName
            }
            if(data.data.quizData.quiz.quizMediaAttached != null){
              obj.image = data.data.quizData.quiz.quizMediaAttached
              obj.imageType = 'Image'
            }else{
              obj.image = data.data.steps.stepDetailImage;
              obj.imageType = 'ClassName'
            }
            funnelComponentDetails.push(obj)
        }
      }else{
        var obj :any={
          id:data.data.id,
          name:data.data.stepDetailTitle,
          stepName: data.data.stepName
        }
        if(data.data.stepDetailTitle.includes('EMAILS')){
          obj.image = 'assets/icons/three-envlope.svg'
          obj.imageType = 'ClassName'
        }else{
          obj.image='assets/images/'+data.data.stepDetailImage
          obj.imageType = 'Image'
        }
        funnelComponentDetails.push(obj)
      }
    })
    this.funnelFragmentsService.saveFunnelFragmentData(funnelComponentDetails);
  }
  url;
  createQuickLink(){
    var firstFragment:any;
      for(var i=0; i < this.fragments.length; i++){
          if(this.fragments[i].component.name != 'WelcomePageComponent' && firstFragment == undefined){
                firstFragment = this.fragments[i].component.name;
          }
      }
      console.log(firstFragment);
      if(firstFragment == 'QuizPageComponent')
      this.url = this.common.serverUrl+"/PlayQuiz?id="+this.funnel.quiz.id;
      else if(firstFragment == 'RegistrationPageComponent')
      this.url = this.common.serverUrl+"/registerForWebinar?id="+this.funnel.webinar.id;
  }

  copyUrl(){
    let selBox;
    selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  async getFunnelData(){
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
          this.editFunnel = params['edit'];
          localStorage.setItem("editFunnel", 'true');
         
          this.highestVistedStep = this.statusKeys.length;

          // updates valid/invalid for a step
          this.statusKeys.map((item, i) => {

            if (i <= this.highestVistedStep) {
              this.moduleStatus[item] = this.moduleStatus[item] == "" ? "INVALID" : this.moduleStatus[item];
            }
          });
      }
      if (params['editQuiz']) {
        this.editQuiz = params['editQuiz'];
        localStorage.setItem("editQuiz", 'true');
      }
      if (params['editWebinar']) {
        this.editWebinar = params['editWebinar'];
        localStorage.setItem("editWebinar", 'true');
      }
    })

    let width = this.validSteps/this.statusKeys.length*100;  // 2/7*100

    this.completionWidth = {'width': (width)+'%' };
  }

  //Handeler that handels erorr if the status code of the api is not SUCCESS
  serverError(data){
    Swal.fire({
      text: data.message,
      type: 'warning',

    });
}

onBack() {

  // remove lastActiveModule from localStorage
  $.each(localStorage, function(key, value){

    // key magic
    // value magic
    if(key != 'loggedIn' && key  != 'token' && key  != 'currentUser')
        localStorage.removeItem(key);
  });

  this.router.navigate(['/marketingSetup/funnels/list'])
}

scrollToView(section: any) {

  console.log("document.getElementById('#' + section)", document.getElementById(section), "section", section);

  // scroll to view element on a page from steps
  if (document.getElementById(section))
  document.getElementById(section).scrollIntoView();
}

showUpdateFunnelTitleModal() {

  this.showEditFunnelTitleModal = true;
}

async updateFunnelTitle() {

  let editObj = {
    funnelName: this.funnel.funnelName,
    id: this.funnel.id
  }

  let funnel = await this.funnelService.saveFunnel(editObj);

  console.log("succesfully updated funnetitle", funnel);

  this.showEditFunnelTitleModal = false;

}

closeEditFunnelTitleModal() {

  this.showEditFunnelTitleModal = false;
}
async drop(event: CdkDragDrop<string[]>) {
  console.log(event);
}
}
