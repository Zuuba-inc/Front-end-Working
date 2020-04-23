import { Component, OnInit, Input,HostListener } from '@angular/core';

import { FragmentComponent }      from 'src/app/services/global/interfaces/fragment-component';

import { Router } from '@angular/router';
import { FunnelFragmentsService } from 'src/app/services/coach/funnel/funnel-fragments.service';
import {FunnelService} from '../../../../../../../services/coach/funnel/funnel.service';
import { FunnelConfigService } from 'src/app/services/coach/funnel/funnel-config.service';
import {WebinarAPIService} from '../../../../../../../services/coach/webinar/webinar-api.service';
import {CommonService} from '../../../../../../../services/global/common.service';
import Swal from 'sweetalert2';

import {FunnelAutomationRulesService} from 'src/app/services/coach/funnel/funnel-automation-rules.service';

@Component({
  selector: 'app-webinar-page',
  templateUrl: './webinar-page.component.html',
  styleUrls: ['./webinar-page.component.css']
})
export class WebinarPageComponent implements OnInit,FragmentComponent {

  @Input() data: any;
  @HostListener('document:click', ['$event'])
  clazz: any;
  onMouseClick(e) {
  //  console.log(e.target)
    var modal = document.getElementById('autoMationRulesWebinar');
   if(e.target == modal){
    this.showAutomationRulesModal = false;
      document.getElementById("thenRuleForDiv").style.display = 'none'
   }
  }
  actionIcons = [];
  constructor(
    private router: Router,
    public funnelFragmentsService:FunnelFragmentsService,
    public funnelConfigService : FunnelConfigService,
    public service:FunnelService,
    public commonService: CommonService,
    public webinarService : WebinarAPIService,
    private funnelAutomationRulesService: FunnelAutomationRulesService) { 
      // this.onAddThenDataTagRef = this.onAddThenDataTag.bind(this);
    }

    // onAddThenDataTagRef: any;
  showOptions: boolean = false;

  whenRules = [];
  thenRules = [];

  showQuickLinks: boolean = false;
  editFunnel = false;
  webinar:any={}

  automationRuleData;
  async ngOnInit() {
    var data:any = this.data.webinarData;
    this.webinar = data.webinar;
    this.automationRuleData = this.data;
    this.actionIcons = this.webinar.webinarAutomationRules;
    // this.automationRule.webinarId = this.webinar.id;
    this.funnelConfigService.updateWebinarList(this.webinar);
    
    console.log("================Webinar++"+localStorage.getItem("editFunnel"))
    localStorage.setItem("webinarId", this.webinar.id);
    if(localStorage.getItem("editFunnel") || localStorage.getItem("editWebinar")){
      this.editFunnel = true;
    }

    
  }

  // used to toggle fragment options
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  // handles navigation for creating from scratch
  async navigateToWebinarSetup() {

    localStorage.setItem("webinarId", this.webinar.id);
    localStorage.setItem("edit", "true");
    this.router.navigate(["/webinarSetup/WebinarInfo"]);
  }

  //Navigates the user to the webinar pages
  showPage(page){
    if(page == 'Registration'){
      this.router.navigate(['/registerForWebinar'],{ queryParams: { id: this.webinar.id} });
    }else if(page == 'Thankyou'){

    }else{

    }
  }
  // used to toggle quick links
  toggleQuickLinks() {
    this.showQuickLinks = !this.showQuickLinks;
  }
//   async showWhenOptions(){
   
//       this.whenRules = this.data.automationRule.WHEN;
//       this.thenRules = this.data.automationRule.THEN;
//       this.whenRules.forEach(e =>{
//         e.autoDtlDesc.forEach(ele =>{
//           if(ele.description == 'Form is submitted' && e.whenTitle == 'Webinar'){
//               //this.whenRule = ele;
//               this.automationRule.automationWhenDtl = ele;
             
//           }
//         })
//       })
  
// }

showAutomationRulesModal: boolean = false;

openModel(){
  this.showAutomationRulesModal = true;

  this.automationRuleData = this.data;

  delete this.automationRuleData.rule;
  delete this.automationRuleData.edit;
}

  selectedRule: any;

  newTagAdded: any = false;

  // // change event on ng select
  // onThenDataChange() {

  //   console.log("Inside onThenDataChange", this.selectedRule);
  // }

  // // add event on ng select
  // // male a post request with tag name to add it into automation rules tags
  // async onAddThenDataTag(tag) {

  //   console.log("tag inside onAddThenDataTag", tag, this.funnelAutomationRulesService);
    
  //   let data = await this.funnelAutomationRulesService.saveTag(tag);

  //   console.log("response after succesffulyy adding tag into automation rules", data);

  //   return tag;
  // }

  // onSelectedRule(rule: any) {
  //   console.log("output event intercepted in parent component in webinar page. select rule is::", rule);
  // }
  message:any={}
  showPopUpMessage: boolean= false;
  onSavedRules(rule: any){
      console.log(rule);
      this.showAutomationRulesModal = false;
      this.showPopUpMessage = false;
      if(rule.isDeleted){
        var foundIndex = this.actionIcons.findIndex(x => x.id == rule.id);
        console.log(foundIndex);
        if(foundIndex > 0){
          this.actionIcons.splice(foundIndex,1);
          this.webinar.webinarAutomationRules = this.actionIcons;
          this.message = { 'type': 'SUCCESS', 'message': 'Automation rule deleted successfully'  };
          this.showPopUpMessage = true;
          //this.actionIcons = this.webinar.webinarAutomationRules
        }
      }else{
        this.webinar.webinarAutomationRules = rule.data.webinarAutomationRules;
        this.actionIcons = this.webinar.webinarAutomationRules
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
