import { Component, OnInit ,ChangeDetectorRef, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import { Common } from '../../../../../../services/global/common';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { Router, ActivatedRoute } from '@angular/router';
import {NgForm} from '@angular/forms';
import { FunnelService } from '../../../../../../services/coach/funnel/funnel.service';
import {FunnelAutomationRulesService} from '../../../../../../services/coach/funnel/funnel-automation-rules.service';
import{WebinarAPIService} from '../../../../../../services/coach/webinar/webinar-api.service';
import{QuizapiserviceService} from '../../../../../../services/coach/quiz/quizapiservice.service';
import { element } from '@angular/core/src/render3';
import{FunnelFragmentsService} from '../../../../../../services/coach/funnel/funnel-fragments.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {Chart} from 'chart.js';
@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent implements OnInit,AfterViewInit {

  activeTab = '1a';
  constructor(public service: EmailCampaignService,
    public funnelFragmentService : FunnelFragmentsService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public emailCommonService: EmailCommonService,
    public funnelService : FunnelService,
    private funnelAutomationRulesService: FunnelAutomationRulesService,
    private webinarAPIService: WebinarAPIService,
    private quizService:QuizapiserviceService,
    private ngxService: NgxUiLoaderService,
    private common : Common) { }
 
    emailCampaign:any={
      subscribers:[]
    };
    updatedEmailCampaign:any={};
    hours:number=1;
    minutes:any=[];
    selectedMint ="00";
    am_pm="AM";
    rules:any={};
    whenRules=[];
    thenRules=[];
    quizList=[];
    webinarList=[];
    tagList=[];
    totalSubscriberPages: any = [];
  defaultThenRule;
  selectedWhenRule;
  thenRuleData: any =[];
  allAutomationRules:any = [];
  automationRule: any = {
    automationThenDtl: {},
    automationWhenDtl: {},
    tag:{}
  };
  listStyle: any = {
    width: 'inherit', //width of the list defaults to 300
    height: 'inherit', //height of the list defaults to 250
  }
  barchart = [];
  //Email Then and When rule variables
  emailWhenRules=[];
  emailThenRules=[];
  editingEmailAutomationRule = false;
  automationRuleEmail:any;
  ngOnInit() {
    let i;
    localStorage.removeItem("emailTemplateId");
    localStorage.removeItem("templateData");
    //this.emailCommonService.updateEmailBody = false;
    this.getEmailCampaign();
    this.getWhenAndThenRules();
    this.getEmailWhenAndThenRules();
    this.checkIfFunnelIsEdited();
    let dropdown = document.getElementsByClassName('dropdown-btn');
    
    for(i=0; i < 6; i++){
        for(var j=0; j< 10 ; j++){
          this.minutes.push(i+""+j);
        }
    }
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener('click', function() {
      this.classList.toggle('active');
      let dropdownContent :any = this.nextElementSibling;
      if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
      } else {
      dropdownContent.style.display = 'block';
      }
      });
    }
   
    this.route.queryParams
      .subscribe(params => {
        console.log("query params in email broad cast one page", params);
        this.emailTab(params.tab);
      });
      
  }
  async getBarchart() : Promise<void>{
    var canvas = <HTMLCanvasElement> document.getElementById("barChart");
    var ctx = canvas.getContext("2d");
    var label =[];
    var barData = [];
    this.barchart = new Chart(ctx, {  
      type: 'bar',  
      data: {  
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [  
          {  
            barThickness: 20,
            data: [12, 19, 3, 5, 2, 3],  
            borderColor: '#3cba9f',  
            backgroundColor: "#0B8B8C",  
            fill: true  
          }  
        ]  
      },  
      options: {
        legend: {  
          display: true,
          align: 'end',
          legendText : "Total People" ,
          labels: {
            fontColor: '#00000'
          }
        },  
        scales: {  
          xAxes: [{  
            gridLines: {
              display:false
            },
            display: true  ,
          }],  
          yAxes: [{
            gridLines: {
              drawBorder: false,
            },  
            display: true , 
          }],  
        },
      }  
    });  
    // var ctxh = document.getElementById("barChart");
    $("#barChart").css({'height':'341px', 'width':'878px;'}); 
  }
  funnelFragments:any=[];
 async checkIfFunnelIsEdited(){
    if(localStorage.getItem("funnel")){
        console.log("Funnel is being edited");
        this.funnelFragments = await this.funnelFragmentService.getFunneFragmentData();
        console.log(this.funnelFragments);
    }
  }
  goBack(){
    if(localStorage.getItem("funnel")){
      var funnelUrl = localStorage.getItem("funnelUrl");
      this.router.navigate(['/funnelCreate/'+funnelUrl], { queryParams: { edit: true } })
    }else{
      this.router.navigate(['/marketingSetup/emailCampaigns/list'])
    }
  }
  // handles navigation for creating from scratch
  navigateToFunnelComponent(action) {
    console.log(action)
    if(action == 'Quiz'){
      localStorage.setItem("edit", "true");
      this.router.navigate(["/quizSetup/WelcomePage"]);
    }else if(action == 'Webinar'){
      localStorage.setItem("edit", "true");
      this.router.navigate(["/webinarSetup/WebinarInfo"]);
    }
  
  }
  ngAfterViewInit() {
    setTimeout(() => {
      // remove sortable button provided with library ngx sortable
      if (document.getElementsByClassName('sortable-header') && document.getElementsByClassName('sortable-header')[0]) {
        document.getElementsByClassName('sortable-header')[0].remove();
      }
      $(".sortable-container").css('border', 'none');
      $(".sortable-container .sortable-list").css('overflow','hidden');
      this.cdr.detectChanges();
    }, 200);
  }
  async getWhenAndThenRules(){
    var data:any = await this.funnelService.getFunnelWhenOptions();
    if(data.status == "SUCCESS"){
        this.rules = data.data;
        this.whenRules = this.rules.WHEN;
        this.thenRules = this.rules.THEN;
    }else{
      this.commonService.serverError(data);
    }
  }
  async getEmailWhenAndThenRules(){
    var data:any = await this.service.getEmailWhenAndThenRules();
    console.log("Email when and then rules: ",data);
    if(data.status == "SUCCESS"){
        this.emailWhenRules = data.data.WHEN;
        this.emailThenRules = data.data.THEN;
    }else{
      this.commonService.serverError(data);
    }
  }
  toggle = false;
  toggleDivs(element){
    $("#"+element).toggle(1000);
    var imgName = $("#image"+element).attr("src")
    if(imgName.includes("ic_back.svg")){
      $("#image"+element).attr("src","./assets/icons/arrow-right.svg")
    }else{
      $("#image"+element).attr("src","./assets/icons/ic_back.svg")
    }
    //if($("#"+element))
  }
  selectDefaultThenRule(action){
    this.editingEmailAutomationRule = false;
    if(this.editingAutomationRule == false){
      this.selectedWhenRule = "";
      this.automationRule= {
        automationThenDtl: {},
        automationWhenDtl: {},
        tag:{}
      }
      document.getElementById("WhenRuleOtherDropDown").style.display = 'none'
      document.getElementById("whenRuleDropDown").style.display = 'none'
      this.editingAutomationRule = false;
      this.showPopUpMessage = false;
    } 
    this.thenRules.forEach(rule=>{
      if(rule.whenTitle == "Email Sequence"){
        rule.autoDtlDesc.forEach(autoRule=>{
          if(autoRule.description == "Subscriobe to an email sequence" && action == 'Subscribe'){
            this.defaultThenRule = autoRule.description;
            this.automationRule.automationThenDtl = autoRule;
            this.automationRule.thenEmailCampId = localStorage.getItem("emailCampaignId");
          }else if(autoRule.description == "Unsubscriobe to an email sequence" && action == 'Unsubscribe'){
            this.defaultThenRule = autoRule.description;
            this.automationRule.automationThenDtl = autoRule;
            this.automationRule.thenEmailCampId = localStorage.getItem("emailCampaignId");
          }
        })
      }
    })
  }
  dropdownData=[];
  bindLabel;
  selectedWhenSubRule;
  async selectWhenRule(event){
    this.resetAutoMationRule();
    if(this.editingEmailAutomationRule == false){
      var selectedRule;
      var selectedSubRule:any;
      this.whenRules.forEach(rule=>{
       rule.autoDtlDesc.forEach(ruleDes=>{
         if(ruleDes.id == this.selectedWhenRule){
           selectedRule = rule;
           this.automationRule.automationWhenDtl = ruleDes;
           selectedSubRule = ruleDes
         }
       })
      })
      this.selecteWhenSubRule(selectedSubRule,selectedRule);
    }else{
      this.automationRule.automationWhenDtl.id = this.selectedWhenRule;
    }
   

  }
  onWhenDataChange(event){
    if(event.webinarTitle){
      this.automationRule.webinarId = event.id;
    }else if(event.quizTitle){
      this.automationRule.quizId = event.id;
    }else{
      this.automationRule.whenEmailCampId = event.id;
    }
  }

  resetAutoMationRule(){
    delete this.automationRule.webinarId;
    delete this.automationRule.quizId;
    delete this.automationRule.whenEmailCampId;
    delete this.automationRule.whenTag;
    this.automationRule.tag = {};
    this.automationRule.automationWhenDtl = {}
    if(this.editingEmailAutomationRule == true){
      this.automationRule.automationThenDtl = {};
      delete this.automationRule.thenEmailCampId;
    }
    this.selectedWhenOption = "";
    this.thenRuleData = [];
    this.emailThenRule = "";
  }

  message:any={};
  showPopUpMessage=false;
  async saveAutomationRule(){
      this.editingAutomationRule = false;
      // this.editingEmailAutomationRule = false;
      var moduleName;
      // alert("editingEmailAutomationRule: "+this.editingEmailAutomationRule)
      if(this.editingEmailAutomationRule == false){
        moduleName = 'EmailCampaign';
      }else{
        moduleName = 'EmailCampaignDtl';
      }
      var response:any = await this.funnelService.saveAutomationRules(this.automationRule,moduleName);
      console.log(response);
      $('.cancel').click();
      if(response.status == 'SUCCESS'){
        this.showPopUpMessage = true;
        if(this.editingEmailAutomationRule == false){
          this.allAutomationRules = response.data;
          this.showAutomationRule();
          document.getElementById("WhenRuleOtherDropDown").style.display = 'none'
          document.getElementById("whenRuleDropDown").style.display = 'none'
        }else{
          this.automationRuleEmail.emailAutomationRules = response.data;
          document.getElementById("thenRuleDropDown").style.display = 'none'
        }
        this.resetAutoMationRule();
      this.message = { 'type': 'SUCCESS', 'message': response.message  };
      }else{
        this.message = { 'type': 'ERROR', 'message': response.message  };
        this.showPopUpMessage = true;
      }
  }

  quillData;
  onSelectionChanged(event){
      if(event.oldRange != null){
        this.saveSettings();
      }
  }
  onContentChanged(event){
    this.updatedEmailCampaign.footerText = this.quillData;
}

unsubscribedCount: any = 0;

  async getEmailCampaign(){
    // debugger;
      var data: any = await this.emailCommonService.getEmailCampaign();
      console.log("data in email list component", data);
     setTimeout(()=>{
      this.getBarchart();
     },200)
      
      this.unsubscribedCount = data.emailUnsubscribedCount;
      if(data.emailCampaign) {
        this.allAutomationRules = data.automationRules;
        this.emailCampaign = data.emailCampaign;
      }else{
        this.emailCampaign = data;
      }
      this.showAutomationRule();
      if(this.emailCampaign.timeToSendEmail != null){
        this.fillTimeToSendEmail();
      }
      this.emailCampaign.emailCampaignDtl.forEach(element =>{
        element.shortName = element.emailTitle.substring(0,20)+"..";
      })
      this.updatedEmailCampaign = Object.assign({},this.emailCampaign);
      delete this.updatedEmailCampaign.emailCampaignDtl;
      delete this.updatedEmailCampaign.emailCampaignType;
      delete this.updatedEmailCampaign.mainUser;
      // remove email broadCast related key/value pair
      delete this.updatedEmailCampaign.emailBroadcastDate;
      delete this.updatedEmailCampaign.emailBroadcastTime;
      delete this.updatedEmailCampaign.emailBroadcastTimeZone;
      if(this.updatedEmailCampaign.timezone == null){
        this.updatedEmailCampaign.timezone = "recipient's timezone";
      }
      if(this.updatedEmailCampaign.delayBtwnEmails == null){
        this.updatedEmailCampaign.delayBtwnEmails = 1;
      }
      if(!this.updatedEmailCampaign.delayType){
        this.updatedEmailCampaign.delayType = "Days";
      }
      this.quillData =this.updatedEmailCampaign.footerText; 
      if(this.updatedEmailCampaign.daysOfWeek != null){
        this.checkAlreadySelectedWeekDays();
      }
  }
  subscriberArray:any=[];
  unsubscriberArray:any=[];
  showAutomationRule(){
    this.subscriberArray=[];
    this.unsubscriberArray=[];
      this.allAutomationRules.forEach(e =>{
        if(e.automationThenDtl.id == 5){
          if(e.automationWhenDtl.id == 9){
              var obj :any ={};
              obj = e;
              obj.text = "<b>IF</b> "+e.webinarTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Subscribe to email sequence "+e.thenEmailCampTitle;
              this.subscriberArray.push(obj);
            }else if(e.automationWhenDtl.id == 10){
              var obj :any ={};
              obj = e;
              obj.text = "<b>IF</b> "+e.quizTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Subscribe to email sequence "+e.thenEmailCampTitle;
              this.subscriberArray.push(obj);
            }else if(e.automationWhenDtl.id == 1 || e.automationWhenDtl.id == 2){
              var obj :any ={};
              obj = e;
              obj.text = "<b>IF</b> "+e.whenEmailCampTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Subscribe to email sequence "+e.thenEmailCampTitle;
              this.subscriberArray.push(obj);
            }else if(e.automationWhenDtl.id == 3 || e.automationWhenDtl.id == 4){
                var obj :any ={};
                obj = e;
                obj.text = "<b>IF</b> tag "+e.whenTag.tagName+" is added <b>THEN</b> Subscribe to email sequence "+e.thenEmailCampTitle;
                this.subscriberArray.push(obj);
            }
        }else{
          if(e.automationWhenDtl.id == 9){
            var obj :any={};
            obj = e;
            obj.text = "<b>IF</b> "+e.webinarTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Unsubscribe to email sequence "+e.thenEmailCampTitle;
            this.unsubscriberArray.push(obj);
          }else if(e.automationWhenDtl.id == 10){
            var obj :any ={};
            obj = e;
            obj.text = "<b>IF</b> "+e.quizTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Unsubscribe to email sequence "+e.thenEmailCampTitle;
            this.unsubscriberArray.push(obj);
          }else if(e.automationWhenDtl.id == 1 || e.automationWhenDtl.id == 2){
            var obj :any={};
            obj = e;
            obj.text = "<b>IF</b> "+e.whenEmailCampTitle+" "+e.automationWhenDtl.description +" <b>THEN</b> Unsubscribe to email sequence "+e.thenEmailCampTitle;
            this.unsubscriberArray.push(obj);
          }else if(e.automationWhenDtl.id == 3 || e.automationWhenDtl.id == 4){
            var obj :any ={};
            obj = e;
            obj.text = "<b>IF</b> tag "+e.whenTag.tagName+" is added <b>THEN</b> Unsubscribe to email sequence "+e.thenEmailCampTitle;
            this.unsubscriberArray.push(obj);
          }
        }
        
      })
  }
  updateAutomationRuleArray(){
    var count = 1;
    this.allAutomationRules.forEach(e =>{
      if(e.automationWhenDtl.id == 9){
        e.webinarId = count;
        e.webinarTitle = "WebinarTitle"+count
        count++;
      }else if(e.automationWhenDtl.id == 1){
        e.whenEmailCampId = count;
        e.whenEmailCampMst = "EmailSequence"+count
        count++;
      }
    })
  }
  fillTimeToSendEmail(){
    var time = this.emailCampaign.timeToSendEmail.split(":");
    if(time[0] > 12){
      this.hours = this.hours - 12;
      this.am_pm = 'PM';
    }else{
      this.hours = time[0];
      this.am_pm = 'AM';
    }
    this.selectedMint = time[1];
  }
  checkAlreadySelectedWeekDays(){
    var selectedays  = this.updatedEmailCampaign.daysOfWeek.split(",");
    selectedays.forEach(e =>{
      $( "#dayCheckBox"+e ).attr( 'checked', 'checked' );
    })
    if(this.updatedEmailCampaign.doubleOptInConfirmation == true){
      $( "#myonoffswitch").prop('checked', true);
    }
  }
  async editEmail(email) {
    if (email != null) {
      await this.emailCommonService.setEmailTempelate(email);
      localStorage.setItem("emailTemplateId", email.id);
       this.router.navigate(['/editEmail'])
    }else{
     var  emailTempelate:any={
        emailBodyDtl:[]
      };
      await this.emailCommonService.setEmailTempelate(emailTempelate);
      this.router.navigate(['/emailTemplateSequance'])
    }
   
   
    
  }
  
  async deleteEmail(email) {
    var data: any = await this.service.deleteEmailTemplate(email.id);
    if (data.status == 'SUCCESS') {
      var obj = this.emailCampaign.emailCampaignDtl.find(e => e.id == email.id);
      var index = this.emailCampaign.emailCampaignDtl.indexOf(obj);
      if (index > -1) {
        this.emailCampaign.emailCampaignDtl.splice(index, 1);
      }
      this.emailCommonService.setEmailCampaign(this.emailCampaign);
    } else {
      this.commonService.serverError(data);
    }
  }
  isFirstPage;
  isLastPage;
  currentPage=0;
  lastTab;
  async emailTab(activeTab = '1a',pageNumber?: number) {
    if(this.lastTab == '3a'){
      this.saveSettings();
    }
    this.lastTab = activeTab;
    if (activeTab === '1a') {
      this.activeTab = activeTab;
      $('.sequence li.active').removeClass('active');
      $('#email').addClass('active');
    }
    if (activeTab === '2a') {
      this.activeTab = activeTab;
      $('.sequence li.active').removeClass('active');
      $('#subscriper').addClass('active');
      console.log(pageNumber)
      if(this.emailCampaign.subscribers.length == 0 || pageNumber){
        if(pageNumber){
          this.currentPage = pageNumber;
        }
        var data :any = await this.service.getEmailCampRecepients(this.emailCampaign.id, this.emailCampaign.emailCampaignType.id,this.currentPage);
        console.log(data);
        if(data.status == "SUCCESS"){
          this.emailCampaign.subscribers = data.data.content;
          //remove this line after adding view button
          // this.emailCampaign.subscribers =[
          //   {
          //     user:{ name : 'Anthony Wade', email: 'andreea.carpenter@mail.com'  },
          //     addedOn: '10/04/2013'
          //   },
          //   {
          //     user:{ name : 'Ryan Gordon', email: 'carmen.adams@mail.com'  },
          //     addedOn: '10/04/2013'
          //   }
          // ]
          this.calculatePages(data.data);
          this.emailCommonService.setEmailCampaign(this.emailCampaign);
        }else{
          this.commonService.serverError(data);
        }
      }
      
    }
    if (activeTab === '3a') {
      this.activeTab = activeTab;
      $('.sequence li.active').removeClass('active');
      $('#settingTab').addClass('active');
    }
    if(activeTab === 'dashboard'){
      this.activeTab = activeTab;
      $('.sequence li.active').removeClass('active');
      $('#dashboardTab').addClass('active');
    }
    if(activeTab === 'optInForm'){
      this.activeTab = activeTab;
      $('.sequence li.active').removeClass('active');
      $('#optInFormTab').addClass('active');
    }
  }
  calculatePages(data) {
    this.totalSubscriberPages = [];
    var startFrom;
    var goTill;
    if(data.totalPages <= 5){
      startFrom = 0
      goTill = data.totalPages;
    }else{
      if(parseInt(data.number) < 3 ){
        startFrom = 0;
        goTill = 5;
      }else if(parseInt(data.number) >= 3){
        startFrom = Math.abs(parseInt(data.number) - 2)
        goTill = parseInt(data.number) + 3
      }
      
    }
    for (var i = startFrom; i < goTill; i++) {
      if(i < data.totalPages){
        this.totalSubscriberPages.push(i);
      }
     
    }
    this.currentPage = data.number;
    this.isFirstPage = data.first;
    this.isLastPage = data.last;
    window.scrollTo(0, 0);
  }

  async saveEmail(email){
    var emailDtl:any = [{
      id: email.id,
      delayBtnEmails: email.delayBtnEmails,
      delayType: email.delayType,
      status : email.status
    }]
    var emailCampaign :any ={
      id:this.emailCampaign.id,
      emailCampaignDtl: emailDtl,
    }
      this.callingSaveTemplateFuntion(emailCampaign);
  }

  errorMessage;

  async saveSettings(){
      var emptyFeilds = await this.checkIfSettingsDataIsEmpty();
      console.log(emptyFeilds);
      if(emptyFeilds.length == 0){   
        console.log("Saving Settings")
        console.log(this.updatedEmailCampaign);
        let doubleOptInConfirmation: any = document.getElementById("myonoffswitch");
        if (doubleOptInConfirmation.checked == true) {
          this.updatedEmailCampaign.doubleOptInConfirmation = true;
        } else {
          this.updatedEmailCampaign.doubleOptInConfirmation = false;
        }

        var data : any =await this.service.saveTemplate(this.updatedEmailCampaign);
        console.log(data);
        if(data.status == 'SUCCESS'){
          console.log("Successfully saved settings", data.data)
          // this.updatedEmailCampaign = data.data;
          this.emailCommonService.updateEmailCampaignSetting(this.updatedEmailCampaign);
        }else{
          this.commonService.serverError(data);
        }
      }else{
        var values = emptyFeilds.join(",");
        this.errorMessage = "Please enter proper values for "+values;
        this.toggleErrorMessage();
      }
  }
  dmarkRule: boolean = true;
  fromEmailErrorMesage;
  checkEmailAddressDMARC(){
    var dmarkRule = this.common.newEmailPattern.test(this.updatedEmailCampaign.fromEmail);
    if(dmarkRule == false){
      this.fromEmailErrorMesage = "This addresses are not allowed due to DMARC rules."
      this.dmarkRule = false;
    }
    var emailValidation = this.common.emailPattern.test(this.updatedEmailCampaign.fromEmail);
    if(emailValidation == false){
      this.fromEmailErrorMesage = "From address should be a valid email address"
      this.dmarkRule = false;
    }
    if(dmarkRule == true && emailValidation == true){
      this.dmarkRule = true;
    }
  }

  async checkIfSettingsDataIsEmpty(): Promise<any>{
    var emptyVales=[];
    if(this.updatedEmailCampaign.fromName === null || this.updatedEmailCampaign.fromName === ""){
        emptyVales.push("From Name")
    }
    if(this.updatedEmailCampaign.fromEmail === null || this.updatedEmailCampaign.fromEmail === ""){
      emptyVales.push("From Email")
    }else{
      var testedEmailPattern = this.common.emailPattern.test(this.updatedEmailCampaign.fromEmail);
      var dmarckRule = this.common.newEmailPattern.test(this.updatedEmailCampaign.fromEmail);
      if(testedEmailPattern == false || dmarckRule == false){
        emptyVales.push("From Email");
      }
    }
    if(this.updatedEmailCampaign.bcc != null || this.updatedEmailCampaign.bcc != ""){
      var testedEmailPattern = this.common.emailPattern.test(this.updatedEmailCampaign.bcc);
      if(testedEmailPattern == false){
        emptyVales.push("bcc");
      }
    }
    if(this.updatedEmailCampaign.daysOfWeek === null || this.updatedEmailCampaign.daysOfWeek === ""){
      emptyVales.push("Days of Week")
    }
    if(this.updatedEmailCampaign.timeToSendEmail === null || this.updatedEmailCampaign.timeToSendEmail === ""){
      emptyVales.push("Time to send email")
    }
    if(this.updatedEmailCampaign.timezone === null || this.updatedEmailCampaign.timezone === ""){
      emptyVales.push("timezone")
    }
    // if(this.updatedEmailCampaign.bcc === null || this.updatedEmailCampaign.bcc === ""){
    //   emptyVales.push("bcc")
    // }else{
    //   var testedEmailPattern = this.common.emailPattern.test(this.updatedEmailCampaign.bcc);
    //   if(testedEmailPattern == false){
    //     emptyVales.push("bcc");
    //   }
    // }
    if(this.updatedEmailCampaign.postalAddress === null || this.updatedEmailCampaign.postalAddress === ""){
      emptyVales.push("Postal address")
    }
    if(this.updatedEmailCampaign.campaignPrimaryPurpose === null || this.updatedEmailCampaign.campaignPrimaryPurpose === ""){
      emptyVales.push("Campaign Primary Purpose");
    }

    return emptyVales;
  }
  toggleErrorMessage(close?: string){
    $("#errorMessage").toggle(500);
    if(!close){
      setTimeout(function() {
        $('#errorMessage').fadeOut('fast');
      }, 3000);
    }
    
  }
  changeTime(event){
    // let d = new Date();
    var hours = this.hours;
    if(this.am_pm == "PM"){
      hours = 12 + this.hours;
    }
    var time = hours+":"+this.selectedMint+":00";
    console.log(time);
    this.updatedEmailCampaign.timeToSendEmail = time;
    this.saveSettings();
  }

  selectedDays=[];
  selectWeekDay(event,day){
      console.log(event);
      if(event.target.checked == true){
          this.selectedDays.push(day);
      }else{
        var index = this.selectedDays.findIndex(e => e == day);
        this.selectedDays.splice(index,1);
      }
      this.selectedDays.sort();
      this.updatedEmailCampaign.daysOfWeek = this.selectedDays.join();
      console.log(this.selectedDays);
      this.saveSettings();
  }

  showModal(){
    document.getElementById("myModal").style.display = 'block';
  }
  onSelectedRule(event){
    console.log(event);
    if(this.editingEmailAutomationRule == false){
      this.automationRule.whenTag = {
        id: event
      }
    }else{
      if(this.emailThenRule.toLowerCase().includes("register") || this.emailThenRule.toLowerCase().includes("redirect")){
        this.automationRule.webinarId = event;
      }else if(this.emailThenRule.toLowerCase() == "add a tag" || this.emailThenRule.toLowerCase() == "remove a tag"){
        this.automationRule.tag.id = event;
      }else{
        this.automationRule.thenEmailCampId  = event;
      }
    } 
  }

  editingAutomationRule = false;
  ruleBeingEdited:any={};
  selectedWhenOption:any;
  editAutomationRule(ruleToBeEdited){
    console.log(ruleToBeEdited);
    this.editingEmailAutomationRule = false;
    this.automationRule= {
      automationThenDtl: {},
      automationWhenDtl: {},
      tag:{}
    }
    this.editingAutomationRule = true;
    this.automationRule.id = ruleToBeEdited.id;
    this.automationRule.automationThenDtl = ruleToBeEdited.automationThenDtl;
    this.ruleBeingEdited = ruleToBeEdited;
    console.log(this.automationRule);
    $('.subsribe').click();
    var selectedSubRule:any ={};
    var selectedRule;
    this.whenRules.forEach(rule=>{
     rule.autoDtlDesc.forEach(ruleDes=>{
       if(ruleDes.id == ruleToBeEdited.automationWhenDtl.id){
         this.selectedWhenRule = ruleToBeEdited.automationWhenDtl.id
         selectedRule = rule;
         this.automationRule.automationWhenDtl = ruleDes;
         selectedSubRule = ruleDes
       }
     })
    })
   
    this.selecteWhenSubRule(selectedSubRule,selectedRule);
    
  }

  async selecteWhenSubRule(selectedSubRule,selectedRule){
    document.getElementById("WhenRuleOtherDropDown").style.display = 'none'
    document.getElementById("whenRuleDropDown").style.display = 'none'
    if(selectedSubRule.description == 'Started' || selectedSubRule.description == 'Finished'){
      var data: any = await this.emailCommonService.getAllEmails("Sequence");
      console.log(data);
      // this.thenRuleData  = data;
      var index = data.findIndex(e => e.id == this.emailCampaign.id);
      console.log("Current email campaign id: "+index);
      if(index >= 0){
        data.splice(index,1);
      }
      this.dropdownData = data;
      this.bindLabel = "emailCapaignTitle";
      if(this.editingAutomationRule == true){
        this.selectedWhenOption = this.ruleBeingEdited.whenEmailCampId;
      }
      document.getElementById("WhenRuleOtherDropDown").style.display = 'block'
    }else if(selectedSubRule.description == 'Form is submitted'){
        if(selectedRule.whenTitle == "Webinar"){
          if(this.webinarList.length == 0){
            var data: any = await this.webinarAPIService.getWebinarList();
            console.log(data);
            this.webinarList = data.data;
          }
          this.dropdownData = this.webinarList ;
          this.bindLabel = "webinarTitle";
          if(this.editingAutomationRule == true){
            this.selectedWhenOption = this.ruleBeingEdited.webinarId;
          }
          document.getElementById("WhenRuleOtherDropDown").style.display = 'block'
        }else{
          if( this.quizList.length == 0){ 
            var data: any = await this.quizService.getPublishedQuiz();
            console.log(data);
            this.quizList = data.data;
          }
          this.dropdownData =  this.quizList 
          this.bindLabel = "quizTitle";
          if(this.editingAutomationRule == true){
            this.selectedWhenOption = this.ruleBeingEdited.quizId;
          }
          document.getElementById("WhenRuleOtherDropDown").style.display = 'block'
        }
    
    }else{
      if(this.tagList.length == 0){
        let tagsRes: any = await this.funnelAutomationRulesService.getTags();
        console.log("response after succesffulyy adding tag into automation rules", tagsRes);
        this.tagList = tagsRes.data
      }
      this.thenRuleData = this.tagList;
      if(this.editingAutomationRule == true){
        this.ruleBeingEdited.tag = this.ruleBeingEdited.whenTag;
        this.automationRule = this.ruleBeingEdited;
      }
      document.getElementById("whenRuleDropDown").style.display = 'block'
    }
    setTimeout(()=>{
      $(".ng-select .ng-select-container .ng-value-container .ng-placeholder").css({"color": "#495057", "font-weight":"100"});
      $(".ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input input").css({"border": "none","margin-top":"0"});
      $(".ng-select .ng-arrow-wrapper").css("width", "13px");
      $(".ng-select .ng-arrow-wrapper .ng-arrow").css({"border-color":"#707070 transparent transparent","border-width":"6px 3px 2.5px"});

    },100) 
  }
  async deleteAutomationRule(){
    var response:any = await this.funnelService.deleteAutomationRules(this.ruleBeingEdited.id);
    console.log(response);
    if(response.status == 'SUCCESS'){
        this.message = { 'type': 'SUCCESS', 'message': response.message  };
        this.showPopUpMessage = true;
        $('.cancel').click();
        this.resetAutoMationRule();
        if(this.editingEmailAutomationRule == false){
          document.getElementById("WhenRuleOtherDropDown").style.display = 'none'
          document.getElementById("whenRuleDropDown").style.display = 'none'
          var index =  this.allAutomationRules.findIndex( e=> e.id == this.ruleBeingEdited.id);
          this.allAutomationRules.splice(index,1)
          this.showAutomationRule();
          console.log("Item deleted at index: "+index);
        }else{
            var index =  this.automationRuleEmail.emailAutomationRules.findIndex( e=> e.id == this.ruleBeingEdited.id);
            this.automationRuleEmail.emailAutomationRules.splice(index,1);
        }
       
    }else{
      this.message = { 'type': 'ERROR', 'message': response.message  };
      document.getElementById("header").style.height = '117px';
      this.showPopUpMessage = true;
    }
  }

  openfunnelNavigationList(){
    var block = document.getElementById("funnelNavigationList");
    if(!block.style.display || block.style.display == 'none'){
      block.style.display = 'block'
    }else{
      block.style.display = 'none'
    }
  }
  listSorted(list: any) {
    console.log(list);
    var count = 0;
    var emails=[];
    list.forEach(element=>{
        element.emailOrder = count;
        count++;
        emails.push({'emailOrder':element.emailOrder, 'id':element.id});
    })
    this.emailCampaign.emailCampaignDtl = list;
    var emailCampaign ={
      id: localStorage.getItem("emailCampaignId"),
      emailCampaignDtl: emails
    }
    this.callingSaveTemplateFuntion(emailCampaign);

  }

  async callingSaveTemplateFuntion(emailCampaign){
    console.log(emailCampaign);
      var data : any =await this.service.saveTemplate(emailCampaign);
      console.log(data);
      if(data.status == 'SUCCESS'){
        console.log(data.data)
        console.log(this.emailCampaign);
        this.emailCampaign.emailCampaignDtl.forEach(email =>{
          if(email.id == data.data.emailCampaignDtl.id){
            //email = data.data.emailCampaignDtl;
          }
        })
        this.emailCommonService.setEmailCampaign(this.emailCampaign);
        }else{
        this.commonService.serverError(data);
      }
  }

  hideActionDropdown(emailData: any, index: any, type: any) {
    emailData.forEach((item, i) => {
      if (i != index) {
        // console.log("index:", index, "type:", type);
        $('#' + i + type).hide();
      }
    });
  }

  showActions(id: any, index: any, type: any, email: any, event?: any) {

    if (event) {
      event.stopPropagation();
    }

    let state = $('#' + id).css("display");
    if (state != 'block') {
      $('#' + id).show();
    } else {
      $('#' + id).hide();
    }

    let emailData: any = this.emailCampaign.emailCampaignDtl;
    this.hideActionDropdown(emailData, index, type);
  }
  
  emailThenRule;
  async selectThenRule(thenRule, rule?: any) {
    console.log(thenRule);
    if(document.getElementById("thenRuleDropDown")){
      document.getElementById("thenRuleDropDown").style.display = 'none';
    }
    this.emailThenRules.forEach(rule =>{
      rule.autoDtlDesc.forEach(r =>{
        if(r.description == thenRule){
          this.automationRule.automationThenDtl.id = r.id;
        }
      })
    })
    if(thenRule.toLowerCase().includes("register") || thenRule.toLowerCase().includes("redirect")) {
      if(this.webinarList.length == 0){
        var data: any = await this.webinarAPIService.getWebinarList();
        console.log(data);
        this.webinarList = data.data;
      }
      this.thenRuleData = this.webinarList;
      this.bindLabel = "webinarTitle";// if (this.data.webinarData) {
        document.getElementById("thenRuleDropDown").style.display = 'block'
    } else if (thenRule.toLowerCase() == "add a tag" || thenRule.toLowerCase() == "remove a tag") {
      if(this.tagList.length == 0){
        let tagsRes: any = await this.funnelAutomationRulesService.getTags();
        console.log("response after succesffulyy adding tag into automation rules", tagsRes);
        this.tagList = tagsRes.data
      }
      if(rule){
        var autoRule :any = this.automationRule;
        autoRule.tag.id = rule.tag.id;
        this.automationRule = autoRule;
        console.log("Editing Email Automation rule", this.automationRule)
      }else if(this.editingEmailAutomationRule == true && this.editingAutomationRule == true){
        var autoRule :any = this.automationRule;
        delete autoRule.thenEmailCampId;
        autoRule.tag = {};
        this.automationRule = autoRule;
        console.log("Editing Email Automation rule", this.automationRule)
      }
      this.thenRuleData = this.tagList;
      document.getElementById("thenRuleDropDown").style.display = 'block'
  }else if(thenRule.toLowerCase() == "subscriobe to an email sequence" || thenRule.toLowerCase() == "unsubscriobe to an email sequence"){
    var data: any = await this.emailCommonService.getAllEmails("Sequence");
    console.log(data);
    // this.thenRuleData  = data;
    var index = data.findIndex(e => e.id == this.emailCampaign.id);
    console.log("Current email campaign id: "+index);
    if(index >= 0){
      data.splice(index,1);
    }
    if(rule){
      var autoRule :any = this.automationRule;
      autoRule.thenEmailCampId = rule.thenEmailCampId;
      this.automationRule = autoRule;
      console.log("Editing Email Automation rule", this.automationRule)
    }else if(this.editingEmailAutomationRule == true && this.editingAutomationRule == true){
      var autoRule :any = this.automationRule;
      delete autoRule.thenEmailCampId;
      autoRule.tag = {};
      this.automationRule = autoRule;
      console.log("Editing Email Automation rule", this.automationRule)
    }
    this.thenRuleData = data;
    this.bindLabel = "emailCapaignTitle";
    document.getElementById("thenRuleDropDown").style.display = 'block'
  }
  setTimeout(()=>{
    $(".ng-select .ng-select-container .ng-value-container .ng-placeholder").css({"color": "#495057", "font-weight":"100"});
    $(".ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input input").css({"border": "none","margin-top":"0"});
    $(".ng-select .ng-arrow-wrapper").css("width", "13px");
    $(".ng-select .ng-arrow-wrapper .ng-arrow").css({"border-color":"#707070 transparent transparent","border-width":"6px 3px 2.5px"});
  },100) 
  }
  emailListSortable :any=[];
  addAutomationRuleForEmail(email){
    console.log("AddAutomationRuleFor Email")
    this.resetAutoMationRule();
    if(this.automationRule.id){
      delete this.automationRule.id;
    }
    this.editingAutomationRule = false;
    this.editingEmailAutomationRule = true;
    this.automationRuleEmail = email;
    this.automationRule.whenEmailCampaignDtlId = email.id;
    this.selectedWhenRule = this.emailWhenRules[0].autoDtlDesc[0].id
    this.automationRule.automationWhenDtl.id = this.selectedWhenRule;
    console.log(this.automationRuleEmail);
    if(document.getElementById("thenRuleDropDown")){
      document.getElementById("thenRuleDropDown").style.display = 'none';
    }
    setTimeout(()=>{
       this.emailListSortable = $(".sortable-container .sortable-list li");
       console.log(this.emailListSortable);
       for (const element of this.emailListSortable) {
        console.log(element.classList.contains('active'));
        if(element.classList.contains('active')){
          element.classList.remove("active");
        }
        }      
    },200);
    
  }
  
  editAutomationRuleForEmail(rule,email){
    console.log(rule);
    this.resetAutoMationRule();
    this.editingAutomationRule = true;
    this.editingEmailAutomationRule = true;
    this.automationRuleEmail = email;
    this.automationRule.id = rule.id;
    this.ruleBeingEdited = rule;
    this.automationRule.whenEmailCampaignDtlId = email.id;
    this.selectedWhenRule = rule.automationWhenDtl.id;
    this.automationRule.automationWhenDtl.id = this.selectedWhenRule;
    this.automationRule.automationThenDtl.id = rule.automationThenDtl.id;
    this.emailThenRule = rule.automationThenDtl.description;
    this.selectThenRule(this.emailThenRule,rule);
    setTimeout(()=>{
      $(".sortable-container .sortable-list .active").css("background", "#f7f7f7 !important");
    },200);
  }

  selectPrimaryPurpose(purpose){
    this.updatedEmailCampaign.campaignPrimaryPurpose = purpose;
    document.getElementById("settingsDropDownMenu").style.display = 'none';
  }
  openSettingsDropDownMenu(){
    var menu = document.getElementById("settingsDropDownMenu");
    console.log(menu.style.display)
    if(menu.style.display == 'none' || menu.style.display == undefined){
      menu.style.display = 'block'
    }else{
      menu.style.display = 'none'
    }
  }
  closeEditEmailDropDown(id){
    var drpDow =  document.getElementById(id);
    if (drpDow.style.display == 'block') {
      drpDow.style.display = 'none'
    }
  }
  showSubscriberActions(id){
      var drpDow =  document.getElementById(id);
      if(drpDow.style.display == 'none'){
        drpDow.style.display = 'block'
      }else{
        drpDow.style.display = 'none'
      }
  }
}

