import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChange } from '@angular/core';

import {FunnelAutomationRulesService} from 'src/app/services/coach/funnel/funnel-automation-rules.service';
import { FunnelConfigService } from 'src/app/services/coach/funnel/funnel-config.service';
import {FunnelService} from '../../../services/coach/funnel/funnel.service';
import {EmailCommonService} from '../../../services/coach/emailCampaign/email-common.service';
@Component({
  selector: 'app-automation-rules',
  templateUrl: './automation-rules.component.html',
  styleUrls: ['./automation-rules.component.css']
})
export class AutomationRulesComponent implements OnInit {

  @Input() data: any;

  @Output() savedRules = new EventEmitter<any>();
  constructor(
    public service:FunnelService,
    public funnelConfigService : FunnelConfigService,
    private funnelAutomationRulesService: FunnelAutomationRulesService,
    private emailSequence : EmailCommonService
  ) { }

  automationRule: any = {
    automationThenDtl: {},
    automationWhenDtl: {},
    tag:{}
  };

  whenRules = [];

  thenRules = [];
  thenRuleDescription: any;
  // [(ngModel)]="result.WaardeStr"

  whenRuleTitle: any;

  whenRuleDescription: any;

  whenInputType: any;

  message:any={};

  thenRuleData: any = [];

  thenRuleTitle: any;
  showPopUpMessage : boolean = false;

  disableThenInputs: any = false;
  deleteAutoRule : boolean = false;
  async ngOnInit() {
      this.showPopUpMessage = false; 
    console.log("automation rules modal is initialized", this.data);
    document.getElementById("thenRuleTextBox").style.display = 'none'
    document.getElementById("thenRuleDropDown").style.display = 'none'

    if(this.data.edit == true){
      this.automationRule = this.data.rule;
        this.thenRuleTitle = this.automationRule.automationThenDtl.description;
        // if thenRuleTitle involves register in it, disable 2 'then rule' input elements
        this.disableThenInputs = this.thenRuleTitle.toLowerCase().includes("register") || this.thenRuleTitle.toLowerCase().includes("redirect") ? true : false;

        console.log(this.automationRule);
        await this.selectThenRun(this.thenRuleTitle);
        this.deleteAutoRule = true;
    } else {
      this.deleteAutoRule = false;
      this.thenRuleTitle = "";
      this.disableThenInputs = false;
    }

    // webinar title binding for quiz and webinar fragments
    if (this.data.webinarData) {
      this.whenRuleDescription = this.data.webinarData.webinar.webinarTitle ? this.data.webinarData.webinar.webinarTitle : "webinar title N/A";
       this.automationRule.webinarId = this.data.webinarData.webinar.id;
       console.log("Webinar: "+this.whenRuleDescription);
     }
 
     if (this.data.quizData) {
      this.whenRuleDescription = this.data.quizData.quiz.quizTitle ? this.data.quizData.quiz.quizTitle : "quiz title N/A";
      this.automationRule.quizId = this.data.quizData.quiz.id;
      console.log("Quiz: "+this.whenRuleDescription);
     }
 
    await this.showWhenOptions();
   
  }

  updatedThenRules: any = [];

  async showWhenOptions() {
    // var response:any = await this.service.getFunnelWhenOptions();
    // console.log(response);
    // if(response.status == 'SUCCESS'){

    this.whenRules = this.data.automationRule.WHEN;
    this.thenRules = this.data.automationRule.THEN;

   
    // update thenRules with out default values
    this.updatedThenRules = this.thenRules.map((then) => {
      if (!then.defaultRule) {
        return then;
      } else {
        return {};
      }
    })

    console.log("this.updatedThenRules", this.updatedThenRules);

    this.whenRules.forEach(e => {
      e.autoDtlDesc.forEach(ele => {
        if (ele.description == 'Form is submitted' && e.whenTitle == 'Webinar') {
          this.automationRule.automationWhenDtl = ele;
        }
      })
    });
  }
  tags:any=[];
  async selectThenRun(thenRule) {

    console.log(thenRule);
    document.getElementById("thenRuleTextBox").style.display = 'none';
    document.getElementById("thenRuleDropDown").style.display = 'none';
    // this.message.msg = "hello";
    // this.showPopUpMessage = true;
  
    //this.thenRule = thenRule;
    this.thenRules.forEach(rule =>{
      rule.autoDtlDesc.forEach(r =>{
        if(r.description == thenRule){
          this.automationRule.automationThenDtl = r;
        }
      })
    })
    //this.automationRule.automationThenDtl = thenRule;

    // if(thenRule == "Register to a Webinar") {
      if(thenRule.toLowerCase().includes("register") || thenRule.toLowerCase().includes("redirect")) {


        if (this.data.webinarData) {
          this.thenRuleDescription =  this.data.webinarData.webinar.webinarTitle ? this.data.webinarData.webinar.webinarTitle : "webinar title N/A";
        } else if (this.data.quizData) {
          this.thenRuleDescription =  this.data.quizData.webinar.webinarTitle ? this.data.quizData.webinar.webinarTitle : "webinar title N/A";
        }
        // webinar title binding for quiz and webinar fragments
        document.getElementById("thenRuleTextBox").style.display = 'block'
      
      } else if (thenRule.toLowerCase() == "add a tag" || thenRule.toLowerCase() == "remove a tag") {
          let tagsRes: any = await this.funnelAutomationRulesService.getTags();
      
          console.log("response after succesffulyy adding tag into automation rules", tagsRes);
          this.thenRuleData = tagsRes.data;
          document.getElementById("thenRuleDropDown").style.display = 'block'
    }else if(thenRule.toLowerCase() == "subscriobe to an email sequence" || thenRule.toLowerCase() == "unsubscriobe to an email sequence"){
        let emailSequence:any = await this.emailSequence.getAllEmails("Sequence");
        console.log("response after succesffulyy adding email sequence into automation rules", emailSequence);
          this.thenRuleData = emailSequence;
          document.getElementById("thenRuleDropDown").style.display = 'block'
    }
  }

  onSelectedRule(rule: any) {
    console.log("output event intercepted in parent component in webinar page. select rule is::", rule);
    console.log(this.automationRule);
    if(this.automationRule.automationThenDtl.description == 'Add a Tag' || this.automationRule.automationThenDtl.description == 'Remove a Tag'){
      this.automationRule.tag = this.automationRule.tag ? this.automationRule.tag : {};

      this.automationRule.tag.id = rule;
    }else if(this.automationRule.automationThenDtl.description == 'Subscriobe to an email sequence' 
    || this.automationRule.automationThenDtl.description == 'Unsubscriobe to an email sequence'){
      this.automationRule.thenEmailCampId = rule;
    }
   
  }

  async saveAutoMationRule(){
     console.log(this.automationRule);
     var response:any = await this.service.saveAutomationRules(this.automationRule,'Funnel');
     console.log(response);
     if(response.status == 'SUCCESS'){
     this.clearAutoMationRule();
        document.getElementById("thenRuleTextBox").style.display = 'none'
        document.getElementById("thenRuleDropDown").style.display = 'none'
        this.savedRules.emit(response);
     }else{
       this.message = { 'type': 'ERROR', 'message': response.message  };
       document.getElementById("header").style.height = '117px';
       this.showPopUpMessage = true;
     }
   }
   async deleteAutomationRule(){
    var response:any = await this.service.deleteAutomationRules(this.automationRule.id);
    console.log(response);
    if(response.status == 'SUCCESS'){
        var data:any = { id:this.automationRule.id, isDeleted: true }
        this.clearAutoMationRule();
        document.getElementById("thenRuleTextBox").style.display = 'none'
        document.getElementById("thenRuleDropDown").style.display = 'none'
        console.log(data);
        this.savedRules.emit(data);
    }else{
      this.message = { 'type': 'ERROR', 'message': response.message  };
      document.getElementById("header").style.height = '117px';
      this.showPopUpMessage = true;
    }
   }
   clearAutoMationRule(){
    this.automationRule.automationThenDtl = {}
    this.automationRule.automationWhenDtl ={}
    this.automationRule.tag = {}
   }
}

