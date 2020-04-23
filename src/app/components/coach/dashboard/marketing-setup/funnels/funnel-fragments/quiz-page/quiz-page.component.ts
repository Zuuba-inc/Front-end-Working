import { Component, OnInit, Input,HostListener} from '@angular/core';

import { FragmentComponent }      from 'src/app/services/global/interfaces/fragment-component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {FunnelService} from '../../../../../../../services/coach/funnel/funnel.service';
import {CommonService} from '../../../../../../../services/global/common.service';
import {QuizapiserviceService} from '../../../../../../../services/coach/quiz/quizapiservice.service';
import { FunnelConfigService } from 'src/app/services/coach/funnel/funnel-config.service';
@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit,FragmentComponent {

  @Input() data: any;
  @HostListener('document:click', ['$event'])
  clazz: any;
  // onMouseClick(e) {
  //   var modal = document.getElementById('autoMationRulesQuiz');
  //  if(e.target == modal){
  //   modal.style.display = "none";
  //   this.automationRule.automationThenDtl = {};
  //   this.automationRule.automationWhenDtl = {};
  //    document.getElementById("thenRuleForDiv").style.display = 'none'
  //  }
   
  // }

  onMouseClick(e) {
    //  console.log(e.target)
    var modal = document.getElementById('autoMationRulesWebinar');
    if(e.target == modal){
    this.showAutomationRulesModal = false;
      document.getElementById("thenRuleForDiv").style.display = 'none'
    }
  }

  constructor(
    private router: Router,
    public service:FunnelService,
    public commonService: CommonService,
    public quizService : QuizapiserviceService,
    public funnelConfigService : FunnelConfigService
  ) { }

  showOptions: boolean = false;
  editFunnel = false;
  quiz:any={}
  whenRules = [];
  thenRules = [];
  thenRuleFor;
  automationRule:any={
    automationThenDtl:{},
    automationWhenDtl:{}
   };
   quizListForThenRule = [];
  // actionIcons: any = [{
  //   className: "zu-tag-action"
  // }, {
  //   className: "zu-mail-action"
  // }, {
  //   className: "zu-video-page"
  // }];

  actionIcons: any = [{
    "id": 839,
    "automationDtl": {
      "id": 1,
      "description": "Started",
      "className": "zu-tag-action"
    }
  },
  {
    "id": 840,
    "automationDtl": {
      "id": 7,
      "description": "Register to a Webinar",
      "className": "zu-mail-action"
    }
  },
  {
    "id": 841,
    "automationDtl": {
      "id": 8,
      "description": "Register to a Webinar",
      "className": "zu-video-page"
    }
  }];

  showAutomationRulesModal: boolean = false;

  automationRuleData: any;

  fileType: any;

  ngOnInit() {
    console.log(this.data)
    var data : any = this.data.quizData;
    this.automationRuleData = this.data;
    this.quiz = data.quiz;
    this.automationRule.quizId = this.quiz.id;
    this.funnelConfigService.updateQuizList(this.quiz);
    this.actionIcons = this.quiz.quizAutomationRules;
   
    localStorage.setItem("quizId", this.quiz.id);
    console.log("================quiz++"+localStorage.getItem("editFunnel"))
    if(localStorage.getItem("editFunnel") || localStorage.getItem("editQuiz")){
      this.editFunnel = true;
    }

    // check the quizMediaAttached if it is an image or video and show video/img tag accordingly
    let vidFormats = ['.webm', '.mkv', '.flv', '.vob', '.ogg', '.ogv', '.drc', '.gif', '.gifv', '.mng',
                              '	.avi', '.MTS', '.M2TS', '.TS', '.mov', '.qt', '.wmv', '.mp4', '.amv', 'm4p', 
                              '.mpg', '.mpeg', '.m4v', '.3gp', '.flv'];

    for (let i=0; i<vidFormats.length; i++) {

      let item = vidFormats[i];

      // console.log("this.quizConfiguration.quizMediaAttached", this.quizConfiguration.quizMediaAttached,
      //             "this.quizConfiguration.quizMediaAttached.includes(item)", 
      //             this.quizConfiguration.quizMediaAttached.includes(item),
      //             "item", item);

      if (this.quiz.quizMediaAttached.includes(item)) {

        this.fileType = "video";

        break;

      }
    };

    if (this.fileType != "video") {
      
      this.fileType = "image";
    }

  }

  // used to toggle fragment options
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  // handles navigation for creating from scratch
  navigateToQuizSetup() {
   
    
    localStorage.setItem("edit", "true");
    this.router.navigate(["/quizSetup/WelcomePage"]);
  }

  async showWhenOptions(){
    // var response:any = await this.service.getFunnelWhenOptions();
    // console.log(response);
    // if(response.status == 'SUCCESS'){
     
      this.whenRules = this.data.automationRule.WHEN;
      this.thenRules = this.data.automationRule.THEN;
        console.log(this.thenRules);
      this.whenRules.forEach(e =>{
        e.autoDtlDesc.forEach(ele =>{
          if(ele.description == 'Form is submitted' && e.whenTitle == 'Quiz'){
            //  this.whenRule = ele;
              this.automationRule.automationWhenDtl = ele;
          }
        })
      })
     // console.log(this.whenRule);
    // }else{
    //   this.commonService.serverError(response);
    // }
}
openModel(){
  // var modal = document.getElementById("autoMationRulesQuiz");
  // if(modal.style.display == 'none' || modal.style.display == ''){
  //   this.showWhenOptions();
  //   modal.style.display = 'block';
  // }else{
  //   modal.style.display = 'none';
  // }

  this.showAutomationRulesModal = true;

  this.automationRuleData = this.data;

  delete this.automationRuleData.rule;
  delete this.automationRuleData.edit;
}

showWhenDropDown(){
  console.log(document.getElementById("whenDropDownQuiz").style.display)
  if(document.getElementById("whenDropDownQuiz").style.display == 'block'){
    document.getElementById("whenDropDownQuiz").style.display = 'none'
  }else{
    document.getElementById("whenDropDownQuiz").style.display = 'block'
  }
  
}
showThenDropDown(){
  console.log(document.getElementById("thenDropDownQuiz").style.display)
  if(document.getElementById("thenDropDownQuiz").style.display == 'block'){
    document.getElementById("thenDropDownQuiz").style.display = 'none'
  }else{
    document.getElementById("thenDropDownQuiz").style.display = 'block'
  }
  
}
// selectThenRun(thenRule){
//   alert(thenRule.description)
//   this.thenRule = thenRule.description;
//   document.getElementById("thenDropDownQuiz").style.display = 'none'
// }

async selectThenRun(thenRule){
  
  //this.thenRule = thenRule;
  this.automationRule.automationThenDtl = thenRule;
  if(thenRule.description == "Register to a Quiz"){
    console.log(thenRule)
    this.quizListForThenRule = await this.funnelConfigService.getQuizList();
    document.getElementById("thenRuleForDivQuiz").style.display = 'block'
  //  var response:any = await this.quizService.getPublishedQuiz();
  //  if(response.status == 'SUCCESS'){
  //    console.log(response)
  //    this.quizListForThenRule = response.data;
  //    document.getElementById("thenRuleForDivQuiz").style.display = 'block'
  //  }else{
  //    this.commonService.serverError(response);
  //  }
  }
  document.getElementById("thenDropDownQuiz").style.display = 'none'
}
async saveAutoMationRule(){
  // this.automationRule.webinarId = this.automationRule.webinar.id;
  // delete this.automationRule['webinar']; 

   console.log(this.automationRule);
   this.openModel();
   var response:any = await this.service.saveAutomationRules(this.automationRule,'quiz');
   console.log(response);
   if(response.status == 'SUCCESS'){
     Swal.fire({
       text: response.message,
       type: 'success',  
     })
     this.automationRule.automationThenDtl = {};
     this.automationRule.automationWhenDtl = {};
     this.quiz.quizAutomationRules = response.data.quizAutomationRules;
     this.actionIcons = this.quiz.quizAutomationRules;
     console.log(this.quiz)
     document.getElementById("thenRuleForDiv").style.display = 'none'
   }else{
    this.actionIcons = this.quiz.quizAutomationRules;
    this.automationRule.automationThenDtl = {};
    this.automationRule.automationWhenDtl = {};
     this.commonService.serverError(response);
   }
 }

//  editAutomationRule(aIcon){
//   console.log(aIcon);
//   this.openModel();
//   this.automationRule = aIcon;
//   this.automationRule.quizId = this.quiz.id;
//   this.selectThenRun(this.automationRule.automationThenDtl);
// }

// editAutomationRule(aIcon){
//   // console.log(aIcon);
//   // this.openModel();
//   // this.automationRule = aIcon;
//   // this.automationRule.webinarId = this.webinar.id;
//   // this.selectThenRun(this.automationRule.automationThenDtl);
//   this.automationRuleData = this.data;
//   this.automationRuleData.rule = aIcon;
//   this.automationRuleData.edit = true;
//   console.log(this.automationRuleData);
//   this.showAutomationRulesModal = true;
// }

 // TODO: USE THIS RULE IN SAVE API
  onSelectedRule(rule: any) {
    console.log("output event intercepted in parent component in webinar page. select rule is::", rule);
  }


  message:any={}
  showPopUpMessage: boolean= false;
  onSavedRules(rule: any){
      console.log("INSIDE QUIZ EVENT EMITTED", rule);
      this.showAutomationRulesModal = false;
      this.showPopUpMessage = false;
      if(rule.isDeleted){
        var foundIndex = this.actionIcons.findIndex(x => x.id == rule.id);
        console.log(foundIndex);
        if(foundIndex > 0){
          this.actionIcons.splice(foundIndex,1);
          this.quiz.quizAutomationRules = this.actionIcons;
          this.message = { 'type': 'SUCCESS', 'message': 'Automation rule deleted successfully'  };
          this.showPopUpMessage = true;
          //this.actionIcons = this.webinar.webinarAutomationRules
        }
      }else{
        this.quiz.quizAutomationRules = rule.data.quizAutomationRules;
        this.actionIcons = this.quiz.quizAutomationRules;
        this.message = { 'type': 'SUCCESS', 'message': 'Automation rule created successfully'  };
        this.showPopUpMessage = true;
      }
  }
  editAutomationRule(aIcon){
    // console.log(aIcon);
    // this.openModel();
    // this.automationRule = aIcon;
    // this.automationRule.webinarId = this.webinar.id;
    // this.selectThenRun(this.automationRule.automationThenDtl);
    this.automationRuleData = this.data;
    this.automationRuleData.rule = aIcon;
    this.automationRuleData.edit = true;
    console.log(this.automationRuleData);
    this.showAutomationRulesModal = true;
  }

}
