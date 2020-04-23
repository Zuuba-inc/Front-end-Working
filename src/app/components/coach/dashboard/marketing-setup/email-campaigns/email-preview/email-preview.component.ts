import { Component, OnInit, AfterViewInit ,Input } from '@angular/core';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { Router, ActivatedRoute  } from '@angular/router';
// import jquery
import * as $ from 'jquery';
@Component({
  selector: 'app-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.css']
})
export class EmailPreviewComponent implements OnInit  {
  @Input() asSubmodule: any;
  emailTempelate:any=[];
  emailCampaign: any;
  templateData: any;
  emailCampaignData:any ={};
  constructor(public emailCommonService: EmailCommonService,
              public router : Router) {
                console.log(this.asSubmodule)
               }

  async ngOnInit() {
    await this.getEmailTempelate();
    this.getEmailCampaign();
  }

  // ngAfterViewInit() {
  //   this.getEmailCampaign();
  // }

  fromName: any;
  replyToEmail: any;
  sendToTags: any = [];
  sendTo;
  subject: any;
  items: any = [
    {display: 'Pizza', value: 1},
    {display: 'Pasta', value: 2},
    {display: 'Parmesan', value: 3},
  ];
  sendingEmail = false;
  async sendTestEmail() {

    // console.log("this.sendTo", this.sendToTags);

    // this.sendTo = this.sendToTags.map(item => item.value);
      document.getElementById("sendTestEmail").style.display = 'none';
      document.getElementById("sendingTestEmail").style.display = 'block';
      this.sendingEmail = true;
      this.templateData = await this.emailCommonService.sendTestEmail(this.sendTo, this.subject, this.fromName, this.replyToEmail);
      document.getElementById("sendingTestEmail").style.display = 'none';
      document.getElementById("sucessfullySentTestEmail").style.display = 'block';
      this.sendingEmail = false;

  }
  closeSendTestEmailBox(){
    document.getElementById("sendTestEmail").style.display = 'block';
    document.getElementById("sendingTestEmail").style.display = 'none';
    document.getElementById("sucessfullySentTestEmail").style.display = 'none';
    this.sendingEmail = false;
  }
  async getEmailTempelate(): Promise<void>{
      this.templateData = await this.emailCommonService.getEmailTemplate();
      console.log(this.templateData);
      if(this.templateData.emailTheme.Default != 'Default'){
        if(this.templateData.emailTheme.className){ 
          $("#main .main-content").removeClass('classic minimal rose write funny paper purple nature forest classic2');
          $('#main .main-content').addClass(this.templateData.emailTheme.className); 
        }
      }
      if(this.templateData.emailTemplate){
       // this.emailTemplateName = this.emailTemplate.emailTemplate;
       $("#main .main-content").removeClass('template1 template2 template3 template4 template5');
        if(this.templateData.emailTheme.themeName == 'Default'){
          $('#main .main-content').addClass(this.templateData.emailTemplate.templateName);
        }
      }
      this.emailTempelate = this.templateData.emailBodyDtl;
      console.log("this.emailTempelate in email preview component", this.emailTempelate);
      setTimeout(()=>{
        $(".col-lg-6").css("max-width","33%");
      },100)
      // console.log(JSON.stringify(this.emailTempelate));
  }

  updateBgCss(tag) {
    if(tag.innerBackground){
      if(tag.innerBackground.innerBackColor){
          document.getElementById(this.view+"emailTemplateInnerWindow").style.backgroundColor = tag.innerBackground.innerBackColor;
      }
      if(tag.innerBackground.borderColor){
        document.getElementById(this.view+"emailTemplateInnerWindow").style.border = 1+"px"+ " solid " +tag.innerBackground.borderColor; 
      }
      if(tag.innerBackground.borderWidth){
        document.getElementById(this.view+"emailTemplateInnerWindow").style.borderWidth = tag.innerBackground.borderWidth+"px"
      }
      if(tag.innerBackground.showBackgroundColor == false){
        document.getElementById(this.view+"emailTemplateInnerWindow").style.backgroundColor = 'transparent';
      }
    }
    if(tag.mainBackground){
      if(tag.mainBackground.backgroundColor){
          document.getElementById(this.view+"emailTemplateWindow").style.backgroundColor = tag.mainBackground.backgroundColor;
      }
      if(tag.mainBackground.emailBackImage != null){
        if( Object.keys(tag.mainBackground.emailBackImage).length > 0){
          document.getElementById(this.view+"emailTemplateWindow").style.backgroundImage = 'url("' + tag.mainBackground.emailBackImage.imagePath + '")';
        document.getElementById(this.view+"emailTemplateWindow").style.backgroundSize = '50%';
        }
      }
      if(tag.mainBackground.imageBackColor != null){
        document.getElementById(this.view+"emailTemplateWindow").style.backgroundColor = tag.mainBackground.imageBackColor;
      }
    }
  }

  tag: any;

  async getEmailCampaign() {
    // get email campaign data dn check  for background object
    let emailCampaignData: any = await this.emailCommonService.getEmailCampaign();
    if(emailCampaignData.emailCampaign){
      this.emailCampaignData = emailCampaignData.emailCampaign;
    }else{
      this.emailCampaignData = emailCampaignData;
    }
    this.fromName = this.emailCampaignData.fromName;
    this.replyToEmail = this.emailCampaignData.fromEmail;
    this.subject = this.templateData.emailSubject;
     console.log("emailCampaignData", emailCampaignData, "this.templateData", this.templateData);
    if(this.emailCampaignData.id){
      this.emailCampaign = this.emailCampaignData.emailCampaignDtl.filter((item) => {
        return item.id == this.templateData.id;
      });
    }else{
      this.emailCampaign = this.emailCampaignData.emailCampaignDtl.filter((item) => {
        return item.id == this.templateData.id;
      });
    }
    
    

    console.log("found this.emailCampaign", this.emailCampaign);

    this.tag = this.emailCampaign[0];

    this.updateBgCss(this.tag);
  }

  view: any = "Desktop";

  changeView(view,event){
    this.view = view;
    var allViews: any = [];
    var options : any = [];
    options = document.getElementsByClassName("previewType");
    allViews = document.getElementsByClassName("view");
   // console.
   for(let o of options){
      if( $(o) && $(o).hasClass("active")){
        $(o).removeClass("active")
      }
    }
    for(let v of allViews){
         v.style.display= 'none';
    }

    document.getElementById(view).style.display = 'block';
    
    console.log(event)
    $(event.target).addClass("active")
    this.updateBgCss(this.tag); // update background on view change
  }

  goBack(){
    console.log(this.emailCampaignData);
    if(this.emailCampaignData.emailCampaignType.id == 1){
      this.router.navigate(['/editEmail']);
    }else{
      this.router.navigate(['/EmailBroadcastOne'],{ queryParams: { tab: 'email' } })
    }
  }

  public moveBackgroundImageWithScroll(event) {
    if(this.templateData.emailTemplate.templateName == 'template2'){
      var x = event.originalEvent.target.scrollTop;
      var y = -x;
      $('#main .template2').css('background-position','0% '+y+'px');
    }
  }
}
