import { Component, OnInit ,Input, Output, EventEmitter  } from '@angular/core';
import * as $ from 'jquery';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-email-template-sequance',
  templateUrl: './email-template-sequance.component.html',
  styleUrls: ['./email-template-sequance.component.css']
})
export class EmailTemplateSequanceComponent implements OnInit {
  @Output() templateEv = new EventEmitter<any>();
  allEmailTemplate : any=[];
  emailName;
  constructor(public emailCommonService: EmailCommonService, public commonService :CommonService,
    public router: Router, public service : EmailCampaignService) { }

  ngOnInit() {
        this.getAllEmailTemplates();
  }
  campaignType;
  async getAllEmailTemplates(){
    this.allEmailTemplate = await this.emailCommonService.getAllEmailTemplates();
    console.log(this.allEmailTemplate);
    var emailCampaign:any = await this.emailCommonService.getEmailCampaign();
    console.log(emailCampaign);
    if(emailCampaign.id){
      this.campaignType = emailCampaign.emailCampaignType.id;
    }else if(emailCampaign.emailCampaign){
      this.campaignType = emailCampaign.emailCampaign.emailCampaignType.id;
    }
    if(this.campaignType == 1){
      var email :any = await this.emailCommonService.getEmailTemplate();
      this.emailName = email.emailTitle;
      console.log(email);  
    }
    this.getRecentlyEditedEmails();
  }
  editEmail(template) {
    // debugger
    console.log(template);
    if(this.campaignType == 1){
      if(template){
        localStorage.setItem("templateData",JSON.stringify(template));
        if(localStorage.getItem("emailTemplateId")){
          this.emailCommonService.startFromScratchBCTemplate();
        }
      }else{
        localStorage.removeItem("templateData");
        if(localStorage.getItem("emailTemplateId")){
          this.emailCommonService.startFromScratchBCTemplate();
        }
      }
      this.router.navigate(['/editEmail'])
    }else{
      if(template){
        localStorage.setItem("templateData",JSON.stringify(template));
        if(localStorage.getItem("emailTemplateId")){
          alert("Start from scratch")
          this.emailCommonService.startFromScratchBCTemplate();
        }
        this.templateEv.emit(template);
      }else{
        localStorage.removeItem("templateData");
        if(localStorage.getItem("emailTemplateId")){
          alert("Start from scratch dfd")
          this.emailCommonService.startFromScratchBCTemplate();
        }
        this.templateEv.emit("startFromScratch");
      }
    }
    
  }

  recentlyEditedEmail:any=[];
  async getRecentlyEditedEmails(){
    if(this.campaignType == 1){
        this.recentlyEditedEmail = await this.emailCommonService.getRecentlyEditedSequence(this.campaignType);
    }else{
      this.recentlyEditedEmail = await this.emailCommonService.getRecentlyEditedBroadCast(this.campaignType);
    }
    
    for(var i=0; i< this.recentlyEditedEmail.length ; i++){
      if(i == 0 || i%2 == 0){
          this.recentlyEditedEmail[i].direction = 'Left'
      }else{
        this.recentlyEditedEmail[i].direction = 'Right';
      }
    }
    
    this.recentlyEditedEmail.forEach(element=>{
      var count = 0;
      element.emailBodyDtl.forEach( e=>{
        if(e.tag == "image" && count == 0){
          count ++;
          element.templateImage = e.src;
        }
      })
    })
    console.log(this.recentlyEditedEmail);
  }

  async useEmailTemplate(email){
      console.log(email);
      email.emailBodyDtl.forEach(element => {
        delete element.id;
        if(element.createdon) delete element.createdon;
        if(element.lastUpdate) delete element.lastUpdate;
        if (element.tag == 'column') { 
          if (element.subTags != null) {
            element.subTags.forEach(item => {
              delete item.id;
              if(item.createdon){ delete item.createdon; } 
              if(item.lastUpdate ){ delete item.lastUpdate ; }  
            });
          }
        }
      });
      var emailTemplate : any ={
        emailTitle: email.emailTitle,
        emailBodyDtl: email.emailBodyDtl,
        mainBackground: email.mainBackground,
        innerBackground : email.innerBackground,
        emailTheme : email.emailTheme,
        emailTemplate : email.emailTemplate
      }
    
      var emailCampaign: any = {
        id: localStorage.getItem("emailCampaignId"),
        emailCampaignDtl: [emailTemplate]
      }
      var data:any={};
      if(localStorage.getItem("emailTemplateId")){
        emailTemplate.id = localStorage.getItem("emailTemplateId")
         data = await this.emailCommonService.changeEmailBody(emailCampaign);
      }else{
        data = await this.service.createEmailCampaign(emailCampaign);
      }
      if (data.status == 'SUCCESS') {
        console.log(data.data);
        await this.emailCommonService.setEmailTempelate(data.data.emailCampaignDtl);
        localStorage.setItem("emailTemplateId", data.data.emailCampaignDtl.id);
      } else {
        this.commonService.serverError(data);
      }
      if(this.campaignType == 2){
        this.templateEv.emit("startFromScratch");
      }else{
        this.router.navigate(['/editEmail'])
      }
  }
}
