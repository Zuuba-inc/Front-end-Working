import { Injectable } from '@angular/core';
import { EmailCampaignService } from '../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../services/global/common.service';
import { Common } from '../../global/common';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { template } from '@angular/core/src/render3';
// import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class EmailCommonService {
  emailCampaign:any={
    emailCampaignDtl:[],
   
  } ;
  allEmailSequence:any=[];
  allEmailBroadCast:any=[];
  emailTempelate:any={
    emailBodyDtl:[],
    mainBackground:{
      emailBackImage:{}
    },
    innerBackground:{}
  };
  defaultTempelate:any = [];
  allEmailTemplate:any=[];
  constructor(public service:EmailCampaignService,
              private authService: AuthapiserviceService,
              public commonService:CommonService, 
              private http :HttpClient,
              private common: Common,
              private router: Router) { }
  baseURL = this.common.baseurl;
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public options =({ headers: this.headers });
  authToken;
  themes:any =[];
  async getEmailThemes() :Promise<any>{
    if(this.themes.length == 0){
      var data: any = await this.service.getEmailThemes();
      
      if (data.status == 'SUCCESS') {
        this.themes = data.data;
      } else {
        this.commonService.serverError(data);
      }
    }
    return JSON.stringify(this.themes);
  }
  async updateHeader(): Promise<void> {
    if (this.authService.getToken() == '' || this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    } else {
      this.authToken = JSON.parse(this.authService.getToken());
      this.headers = new HttpHeaders()
      .set('Authorization', 'bearer ' + this.authToken.access_token)
      .set('Content-Type', 'application/json'),
      this.options = { headers: this.headers };
    }
  }

  setAllEmails(emails, type){
    if(type == 'Sequence')
      this.allEmailSequence = emails;
    else
      this.allEmailBroadCast = emails;
  }            
  async getAllEmails(type): Promise<any>{
    if(this.allEmailBroadCast.length == 0 || this.allEmailSequence.length == 0){
      var data: any = await this.service.getEmailCampaignList(type,0);
      if (data.status == 'SUCCESS') {
        data.data.content.forEach(element => {
          if(element.emailCampaignType != null){ 
            if (element.emailCampaignType.id == 1) {
              this.allEmailSequence.push(element)
            } else {
              this.allEmailBroadCast.push(element)
            }
         }
        });
      } else {
        this.commonService.serverError(data);
      }
    }
    if(type == 'Sequence'){ 
      return this.allEmailSequence;
    }
    else{
      return this.allEmailBroadCast;
    }
      
  }

  async calculatePages(data): Promise<any> {
    var pagesObj :any={};
    var totalSubscriberPages :any = [];
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
        totalSubscriberPages.push(i);
      }
     
    }
    pagesObj.currentPage = data.number;
    pagesObj.isFirstPage = data.first;
    pagesObj.isLastPage = data.last;
    pagesObj.totalPages = totalSubscriberPages;
    window.scrollTo(0, 0);
    return pagesObj;
  }
  updateAllEmails(email,type){
    if(type == 'Sequence')
      this.allEmailSequence.push(email);
    else
      this.allEmailBroadCast.push(email);
  } 

  updateAllEmailsOrder(email,type){
    if(type == 'Sequence')
    this.allEmailSequence = email;
  else
    this.allEmailBroadCast = email;
  }
  updateEmailTempelateData(tempelate,action){
   
        if(action == 'Backgrounds'){
          this.emailTempelate.innerBackground = tempelate.innerBackground;
          this.emailTempelate.mainBackground = tempelate.mainBackground;
        }else if(action == 'Theme'){
          this.emailTempelate.emailTheme = tempelate.emailTheme
        }
  }         
  async setEmailTempelateBodyDtl(body){
      this.emailTempelate.emailBodyDtl = body;
  }   
  async setEmailTempelate(template): Promise<void>{
    this.emailTempelate = template;
    if(this.emailTempelate.mainBackground == null) { this.emailTempelate.mainBackground={ emailBackImage:{}} }
    if(this.emailTempelate.innerBackground == null) { this.emailTempelate.innerBackground={} }
    var index = -1;
    if(this.emailTempelate.id){
      if(this.emailCampaign.emailCampaign){
        index = this.emailCampaign.emailCampaign.emailCampaignDtl.findIndex(e=> e.id == this.emailTempelate.id);
       if(index < 0){
         this.emailCampaign.emailCampaign.emailCampaignDtl.push(this.emailTempelate);
       }
       
     }else{
        index = this.emailCampaign.emailCampaignDtl.findIndex(e=> e.id == this.emailTempelate.id);
       if(index < 0){
         this.emailCampaign.emailCampaignDtl.push(this.emailTempelate);
       }
       
     }
    }
  }
  setEmailCampaign(campaign){
    this.emailCampaign = campaign;
  }
  async getEmailCampaign(): Promise<any>{
    var  emailCampaigId = null;
   if(this.emailCampaign.emailCampaign){
    emailCampaigId = this.emailCampaign.emailCampaign.id;
   }else if(this.emailCampaign.id){
    emailCampaigId = this.emailCampaign.id;
   }
    if(emailCampaigId == null || emailCampaigId == undefined){
      if(localStorage.getItem("emailCampaignId")){
        var data:any = await this.service.getEmailCampaign(localStorage.getItem("emailCampaignId"));
        if(data.status == 'SUCCESS'){
          this.emailCampaign = data.data;
          var count = 1;
          this.emailCampaign.emailCampaign.emailCampaignDtl.forEach(element =>{
              if(element.emailTitle == null || element.emailTitle == " "){
                element.emailTitle = "Email Name "+count;
                count++;
              }
          })
        }else{
            this.commonService.serverError(data);
        }
      } 
    }
    return this.emailCampaign;
  }
  async getEmailCampaignTriggers(): Promise<any>{
    if(!this.emailCampaign.id){
        if(localStorage.getItem("emailCampaignId")){
          var data:any = await this.service.getEmailCampaignTriggers(localStorage.getItem("emailCampaignId"));
          if(data.status == 'SUCCESS'){
            this.emailCampaign = data.data;
          }else{
              this.commonService.serverError(data);
          }
        }
        
    }
    return this.emailCampaign;
  }
   async getEmailTemplate() : Promise<any>{
     //if(this.emailTempelate)
     if(!this.emailTempelate.id){
      if(localStorage.getItem("emailTemplateId")){
        var data:any = await this.service.getEmailTemplate(localStorage.getItem("emailTemplateId"));
        if(data.status == 'SUCCESS'){
          this.emailTempelate = data.data;
          if(this.emailTempelate.mainBackground == null) { this.emailTempelate.mainBackground={ emailBackImage:{}} }
          if(this.emailTempelate.innerBackground == null) { this.emailTempelate.innerBackground={} }
        }else{
          this.commonService.serverError(data);
        }
      }
    }
    return this.emailTempelate;
  }
  async setEmailTempelateTitle(email){
    console.log(this.emailCampaign);
    var index = -1;
    if(this.emailCampaign.emailCampaign){
      index = this.emailCampaign.emailCampaign.emailCampaignDtl.findIndex(e=> e.id == email.id);
      if(index > -1){
        this.emailCampaign.emailCampaign.emailCampaignDtl[index] = email;
      }
    }else{
      index = this.emailCampaign.emailCampaignDtl.findIndex(e=> e.id == email.id);
      if(index > -1){
        this.emailCampaign.emailCampaignDtl[index] = email;
      }
    }
   
    
  }
  updateEmailBody: boolean = false;
  async startFromScratchBCTemplate() {
    this.emailTempelate.emailBodyDtl = [];
    this.emailTempelate.emailTemplate = null;
    this.updateEmailBody = true;
  }

  async changeEmailBody(emailCampaignDtl) {
    await this.updateHeader();
    let campDtlId = parseInt(localStorage.getItem("emailCampaignId"));
    // let templateId = parseInt(localStorage.getItem("emailTemplateId"));
    let body = emailCampaignDtl;
    try {
      return this.http.post(this.baseURL+'/emailCampaign/changeEmailTemplate', body, this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  setDefaultTempelate(template){
    this.defaultTempelate = template;
  }
  
  async getDefaultTemplate(templateName):Promise <any>{
    if(this.defaultTempelate.length == 0){
      var data: any = await this.service.getDefaultTempelate(templateName);
      if (data.status == 'SUCCESS') {
        this.defaultTempelate = data.data;
      }else{
        this.commonService.serverError(data);
      }
    }
    return this.defaultTempelate;
  }
  async updateEmailCampaignSetting(tempelate,action ?: string){
    if(!action){  
      this.emailCampaign.bcc = tempelate.bcc;
      this.emailCampaign.daysOfWeek = tempelate.daysOfWeek;
      this.emailCampaign.delayBtwnEmails = tempelate.delayBtwnEmails;
      this.emailCampaign.emailCapaignTitle = tempelate.emailCapaignTitle;
      this.emailCampaign.footerText = tempelate.footerText;
      this.emailCampaign.fromEmail = tempelate.fromEmail;
      this.emailCampaign.postalAddress = tempelate.postalAddress;
      this.emailCampaign.timeToSendEmail = tempelate.timeToSendEmail;
      this.emailCampaign.timezone = tempelate.timezone;
    }else{
        this.emailCampaign.emailCampaignDtl.push(tempelate);
    }
  }
  async updateEmailTempelate(tag, action?: String): Promise<void>{
    console.log(tag);
    if(!action){
      var count = 0;
      var order = 0;
      var newTagObj = tag[0];
      this.emailTempelate.emailBodyDtl.forEach( element=>{
        element.compOrder = order;
        order ++;
        if(element.tagId == newTagObj.tagId){
          count ++;
        }
      })
      var index = this.emailTempelate.emailBodyDtl.findIndex( e => e.tagId == newTagObj.tagId);
      if(index > -1){
        this.emailTempelate.emailBodyDtl[index] = newTagObj;
      }
      if(count == 0){
        this.emailTempelate.emailBodyDtl.splice(newTagObj.compOrder, 0, newTagObj)
      }
    }else{
      this.emailTempelate.emailBodyDtl.splice(tag.index, 1);
        for (let i = 0; i < this.emailTempelate.emailBodyDtl.length; i++) {
          this.emailTempelate.emailBodyDtl[i].index = i;
      }
    } 
    console.log(this.emailTempelate);
  }
  async updateEmailTempelateDynamicVale(tag, action?: any) : Promise<void> {
    if(!action){
      this.emailTempelate.emailBodyDtl.forEach( element =>{
        if(element.id == tag[0].id){
          if(!element.dynamicValues || element.dynamicValues == null){
            element.dynamicValues = [];
          }
          element.dynamicValues.push(tag[0].dynamicValues[0]);
        }
      })
    }else{
      this.emailTempelate.emailBodyDtl.forEach( element =>{
        if(element.id == tag.id){
          action.forEach( a=>{
            var index = element.dynamicValues.findIndex( d => d.id == a);
            if(index > -1){
              element.dynamicValues.splice(index,1);
            }
          })
          
        }
      })
    }
    
  }
  clearList(){
    this.emailCampaign={
      emailCampaignDtl:[]
    } ;
    this.emailTempelate={
      emailBodyDtl:[]
    };
  }

  updateSubtagIds(emailCampaignDtl) {
    let emailElements: any = emailCampaignDtl.emailBodyDtl;

    emailElements.forEach(item => {
        if(item.subTags && item.subTags.length !== -1) {
          item.subTags.forEach(st => {
              st.tagId = st.tagId + st.id;
          });
        }
    });    

    return emailElements;
  } 

  getQueryString(body) {
    return Object.keys(body).map((key) => {
     // if (key != 'sendTo') {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);

    }).join('&');
  }

  async sendTestEmail(sendTo, subject, fromName, replyToEmail) {

    await this.updateHeader();

    let campDtlId = parseInt(localStorage.getItem("emailTemplateId"));

    let body = {
      campDtlId,
      fromName,
      replyToEmail,
      sendTo,
      subject
    };

    let queryString = this.getQueryString(body);


    try {
      return this.http.post(this.baseURL+'/emailCampaign/sendTestEmail?'+queryString, {}, this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  async sendBroadcastEmail(sendTo) {
    await this.updateHeader();
    let campDtlId = parseInt(localStorage.getItem("emailTemplateId"));
    let body = {
      campDtlId,
      // sendTo
    };
    let queryString = this.getQueryString(body);
    try {
      return this.http.post(this.baseURL+'/emailCampaign/sendBroadcastEmail?'+queryString, {}, this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  async saveBroadCastEmailDetails(body:any) {
    await this.updateHeader();
    let campDtlId = parseInt(localStorage.getItem("emailCampaignId"));
    body.id = campDtlId;
    try {
      return this.http.post(this.baseURL+'/emailCampaign/saveEmailCampaign', body, this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  errorHandler(error) {
    if (error['_body']) {

      let e = JSON.parse(error['_body']);

      if(e.error == 'invalid_token'){
        //localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
        this.router.navigate(['/login']);
      }else{
        Swal.fire({
          text: e.error ,
          type: 'warning',
  
        })
      }
    }
  }

  // Theme templates
  columnTags = [
    {
      'tag': 'column',
      'tagType': 1,
      //  id: 'st1',
      tagId: 'st1',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c1img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st1c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c1txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st1c2',
        // tagType: 'text'
      }, {
        compOrder: 2,
        style: null,
        tag: 'button',
        tagId: 'c1btn1',
        templateName: 'Default1',
        text: 'JOIN NOW',
        subTag: true,
        // id: 'st1c3',
        // tagType: 'button'
      }],
    },
    {
      'tag': 'column',
      'tagType': 2,
      //  'text':'text 2',
      //  'btnText':'button2',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st2',
      tagId: 'st2',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c2txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st2c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c2img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st2c3',
        // tagType: 'image'
      }, {
        compOrder: 2,
        style: null,
        tag: 'button',
        tagId: 'c2btn1',
        templateName: 'Default1',
        text: 'Button 2',
        subTag: true,
        // id: 'st2c2',
        // tagType: 'button'
      }],
    },
    {
      'tag': 'column',
      'tagType': 3,
      //  'text1':'text 3-1',
      //  'text2':'text 3-2',
      // id: 'st3',
      tagId: 'st3',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c3txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st3c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c3txt2',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st3c2',
        // tagType: 'text'
      }]
    },
    {
      'tag': 'column',
      'tagType': 4,
      //  'text':'text 4',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st4',
      tagId: 'st4',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c4txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st4c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c4img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st4c2',
        // tagType: 'image'
      }]
    },
    {
      'tag': 'column',
      'tagType': 5,
      //  'text':'text 5',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st5',
      tagId: 'st5',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c5img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st5c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c5txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st5c2',
        // tagType: 'text'
      }]
    },
    {
      'tag': 'column',
      'tagType': 6,
      // id: 'st6',
      tagId: 'st6',
      multiImage: true,
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c6img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st6c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c6img2',
        templateName: 'Default1',
        subTag: true,
        // id: 'st6c4',
        // tagType: 'image'
      }, {
        compOrder: 2,
        style: null,
        tag: 'text',
        tagId: 'c6txt2',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st6c5',
        // tagType: 'text'
      }, {
        compOrder: 3,
        style: null,
        tag: 'text',
        tagId: 'c6txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st6c2',
        // tagType: 'text'
      }, {
        compOrder: 4,
        style: null,
        tag: 'button',
        tagId: 'c6btn1',
        templateName: 'Default1',
        text: 'Button 7',
        subTag: true,
        // id: 'st6c3',
        // tagType: 'button'
      }, {
        compOrder: 5,
        style: null,
        tag: 'button',
        tagId: 'c6btn2',
        templateName: 'Default1',
        text: 'Button 6',
        subTag: true,
        // id: 'st6c6',
        // tagType: 'button'
      }]
    },
    {
      'tag': 'column',
      'tagType': 7,
      //  id: 'st7',
      tagId: 'st7',
      multiImage: true,
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c7img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st7c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c7img2',
        templateName: 'Default1',
        subTag: true,
        // id: 'st7c3',
        // tagType: 'image'
      }, {
        compOrder: 2,
        style: null,
        tag: 'button',
        tagId: 'c7btn1',
        templateName: 'Default1',
        text: 'Button 7-1',
        subTag: true,
        // id: 'st7c2',
        // tagType: 'button'
      }, {
        compOrder: 3,
        style: null,
        tag: 'button',
        tagId: 'c7btn2',
        templateName: 'Default1',
        text: 'Button 7-2',
        subTag: true,
        // id: 'st7c4',
        // tagType: 'button'
      }]
    },
    {
      'tag': 'column',
      'tagType': 8,
      tagId: 'st8',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c8img1',
        templateName: 'Default1',
        subTag: true,
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c8img2',
        templateName: 'Default1',
        subTag: true,
      }]
    },
  ]
  duplicatedColumnData: any = [
    {
      'tag': 'column',
      'tagType': 1,
      //  id: 'st1',
      tagId: 'st1',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c1img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st1c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c1txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st1c2',
        // tagType: 'text'
      }, {
        compOrder: 2,
        style: null,
        tag: 'button',
        tagId: 'c1btn1',
        templateName: 'Default1',
        text: 'JOIN NOW',
        subTag: true,
        // id: 'st1c3',
        // tagType: 'button'
      }],
    },
    {
      'tag': 'column',
      'tagType': 2,
      //  'text':'text 2',
      //  'btnText':'button2',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st2',
      tagId: 'st2',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c2txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st2c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c2img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st2c3',
        // tagType: 'image'
      }, {
        compOrder: 2,
        style: null,
        tag: 'button',
        tagId: 'c2btn1',
        templateName: 'Default1',
        text: 'Button 2',
        subTag: true,
        // id: 'st2c2',
        // tagType: 'button'
      }],
    },
    {
      'tag': 'column',
      'tagType': 3,
      //  'text1':'text 3-1',
      //  'text2':'text 3-2',
      // id: 'st3',
      tagId: 'st3',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c3txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st3c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c3txt2',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st3c2',
        // tagType: 'text'
      }]
    },
    {
      'tag': 'column',
      'tagType': 4,
      //  'text':'text 4',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st4',
      tagId: 'st4',
      subTags: [{
        compOrder: 0,
        style: null,
        tag: 'text',
        tagId: 'c4txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st4c1',
        // tagType: 'text'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c4img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st4c2',
        // tagType: 'image'
      }]
    },
    {
      'tag': 'column',
      'tagType': 5,
      //  'text':'text 5',
      //  'src':'assets/images/dummy_logo.png',
      // id: 'st5',
      tagId: 'st5',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c5img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st5c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        style: null,
        tag: 'text',
        tagId: 'c5txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st5c2',
        // tagType: 'text'
      }]
    },
    {
      'tag': 'column',
      'tagType': 6,
      // id: 'st6',
      tagId: 'st6',
      multiImage: true,
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c6img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st6c1',
        // tagType: 'image'
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c6img2',
        templateName: 'Default1',
        subTag: true,
        // id: 'st6c4',
        // tagType: 'image'
      }, {
        compOrder: 2,
        style: null,
        tag: 'text',
        tagId: 'c6txt2',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st6c5',
        // tagType: 'text'
      }, {
        compOrder: 3,
        style: null,
        tag: 'text',
        tagId: 'c6txt1',
        templateName: 'Default1',
        text: 'Choose the layout you love, then add beautiful images, lively text and a catchy button to make it your own. Mix it up and get people clicking! Bring the best you have to offer together in one place.',
        subTag: true,
        // id: 'st6c2',
        // tagType: 'text'
      }, {
        compOrder: 4,
        style: null,
        tag: 'button',
        tagId: 'c6btn1',
        templateName: 'Default1',
        text: 'Button 7',
        subTag: true,
        // id: 'st6c3',
        // tagType: 'button'
      }, {
        compOrder: 5,
        style: null,
        tag: 'button',
        tagId: 'c6btn2',
        templateName: 'Default1',
        text: 'Button 6',
        subTag: true,
        // id: 'st6c6',
        // tagType: 'button'
      }]
    },
    {
      'tag': 'column',
      'tagType': 7,
      //  id: 'st7',
      tagId: 'st7',
      multiImage: true,
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c7img1',
        templateName: 'Default1',
        subTag: true,
        // id: 'st7c1',
        // tagType: 'image'
      }, {
        compOrder: 2,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c7img2',
        templateName: 'Default1',
        subTag: true,
        // id: 'st7c3',
        // tagType: 'image'
      }, {
        compOrder: 1,
        style: null,
        tag: 'button',
        tagId: 'c7btn1',
        templateName: 'Default1',
        text: 'Button 7-1',
        subTag: true,
        // id: 'st7c2',
        // tagType: 'button'
      }, {
        compOrder: 3,
        style: null,
        tag: 'button',
        tagId: 'c7btn2',
        templateName: 'Default1',
        text: 'Button 7-2',
        subTag: true,
        // id: 'st7c4',
        // tagType: 'button'
      }]
    },
    {
      'tag': 'column',
      'tagType': 8,
      tagId: 'st8',
      subTags: [{
        compOrder: 0,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c8img1',
        templateName: 'Default1',
        subTag: true,
      }, {
        compOrder: 1,
        altText: 'sample image',
        src: 'https://coachforceprod.s3.amazonaws.com/Default_Images/holger-link-d2drtHafQWM-unsplash.jpg',
        style: null,
        tag: 'image',
        tagId: 'c8img2',
        templateName: 'Default1',
        subTag: true,
      }]
    },
  ]

  async getColumnData (): Promise<any>{
    const columnData = Object.assign([],this.columnTags);
    return columnData;
  }
  async  replsceColumNData():Promise<string>{
     return JSON.stringify(this.duplicatedColumnData);
  }
  async getDefaultThemeTempelate(templateName):Promise <any>{
    if(this.defaultTempelate.length == 0 ){
      var data:any;
      if(templateName == undefined)
      data = await this.service.getDefaultTempelate(templateName)
      else 
      data = await this.service.getDefaultTempelate(templateName.id)
      if (data.status == 'SUCCESS') {
        this.defaultTempelate = data.data;
          return this.defaultTempelate;
      }else{
        this.commonService.serverError(data);
      }
    }else if(this.defaultTempelate.length > 0 && templateName.templateName == this.defaultTempelate[0].templateName){
      return this.defaultTempelate
    }else{
      data= await this.service.getDefaultTempelate(templateName.id)
        if (data.status == 'SUCCESS') {
          this.defaultTempelate = data.data;
            return this.defaultTempelate;
        }else{
          this.commonService.serverError(data);
        }
    }
  }

  async getAllEmailTemplates():Promise <any> {
    if(this.allEmailTemplate.length == 0){
      var data:any = await this.service.getAllEmailTempelate();
      if (data.status == 'SUCCESS') {
        this.allEmailTemplate = data.data;
          return this.allEmailTemplate;
      }else{
        this.commonService.serverError(data);
      }
    }else{
      return this.allEmailTemplate;
    }
  }


  dividerLines :any =[]
  async getDividerLines():Promise<any>{
    if(this.dividerLines.length == 0){
        var data :any = await this.service.getSpacerData();
        if(data.status == 'SUCCESS'){
          this.dividerLines = data.data;
          return this.dividerLines;
        }else{
          this.commonService.serverError(data);
        }
    }else{
      return this.dividerLines;
    }
    
  }

  unsubscribeUserData:any={};
  setUnsubscribeUserData(data){
    this.unsubscribeUserData = data;
  }
  async getUnsubscribeUserData() : Promise<any>{
    return this.unsubscribeUserData;
  }
  unsubscribeEmailData:any = {};
  setUnsubscribedEmailData(data){
      this.unsubscribeEmailData = data;
  }
  async getUnsubscribedEmailData():Promise<any>{
    return this.unsubscribeEmailData;
  }
  resetUnsubscribeUserData(){
      this.unsubscribeUserData = {};
  }

  recentlyEditedSequence:any=[];
  recentlyEditedBroadCast:any=[];
  async getRecentlyEditedBroadCast(campaignType): Promise<any>{
    if(this.recentlyEditedBroadCast.length == 0){
      var data :any = await this.service.getRecentlyEditedEmail(campaignType);
      if(data.status == 'SUCCESS'){
            this.recentlyEditedBroadCast = data.data;
      }else{
        this.commonService.serverError(data);
      }
    }
      return this.recentlyEditedBroadCast;
  }
  async getRecentlyEditedSequence(campaignType): Promise<any>{
    if(this.recentlyEditedSequence.length == 0){
      var data :any = await this.service.getRecentlyEditedEmail(campaignType);
      if(data.status == 'SUCCESS'){
            this.recentlyEditedBroadCast = data.data;
      }else{
        this.commonService.serverError(data);
      }
    }
     return this.recentlyEditedSequence;
  }

  sequenceEmail:any =[];
  broadCastEmail:any =[];
  async getSegmentationCampaignNames(campaignType) : Promise<any>{
      if(campaignType == 'campaign_emails'){
        if(this.sequenceEmail.length == 0){
          var data :any = await this.service.getSequenceEmails();
          if(data.status == 'SUCCESS'){
            this.sequenceEmail = data.data;
            return this.sequenceEmail;
          }else{
            this.commonService.serverError(data);
            return null;
          }
        }else{
          return this.sequenceEmail;
        }  
      }else{
        if(this.broadCastEmail.length == 0){
          var data :any = await this.service.getBroadcastEmails();
          if(data.status == 'SUCCESS'){
            this.broadCastEmail = data.data;
            return this.broadCastEmail;
          }else{
            this.commonService.serverError(data);
            return null;
          }
        }else{
          return this.broadCastEmail;
        }
      }
  }
}
