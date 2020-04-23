import { Component, OnInit,ViewChild  } from '@angular/core';
// import * as $ from 'jquery';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { CommonService } from '../../../../../../services/global/common.service';
import { Common } from '../../../../../../services/global/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {EditEmailComponent} from '../edit-email/edit-email.component';
import { async } from '@angular/core/testing';
import {Chart} from 'chart.js';

declare var $: any;

@Component({
  selector: 'app-email-broadcast-one',
  templateUrl: './email-broadcast-one.component.html',
  styleUrls: ['./email-broadcast-one.component.css']
})
export class EmailBroadcastOneComponent implements OnInit {
  @ViewChild('child') editEmailChild:EditEmailComponent;

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months    = ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
  barchart = []; 
  //dataSource: any = {};
  title: string;
  constructor(
    public service: EmailCampaignService,
    private route: ActivatedRoute,
    public router: Router,
    public emailCommonService: EmailCommonService,
    public commonService: CommonService,
    private common : Common,
    private ngxService: NgxUiLoaderService
  ) {
   }
  dashboardCount : any ={};
  emailBroadCast: any;

  emailBroadcastDate: any;

  emailCampaign: any={};
  errorMessage;
  criteriaList: any = [];
  emailCampaignSent = false;
  async ngOnInit() {
    
    this.ngxService.startLoader('loader-01');
    this.emailBroadCast = await this.emailCommonService.getEmailCampaign();
    console.log("this.emailBroadCast in broad cast one component", this.emailBroadCast);
      if(this.emailBroadCast.emailCampaign) {
        // this.allAutomationRules = this.emailBroadCast.automationRules;
        this.emailCampaign = this.emailBroadCast.emailCampaign;
      }else {
        this.emailCampaign = this.emailBroadCast;
      }
      if(this.emailCampaign.criteriaList != null){
          this.criteriaList = this.emailCampaign.criteriaList;
      }
      if(this.emailCampaign.status == 'SENT'){
        if(this.emailCampaign.criteriaList.length == 0){
          this.filters = []
        } 
          this.emailCampaignSent = true;
         
      }
      // this.dashboardCounts("opened_count");
      this.subscribers = this.emailCampaign.emailCampaignReceipients;
     this.emailTitle = this.emailCampaign.emailCapaignTitle;
     this.ngxService.stopLoader('loader-01'); 
    this.updatedEmailCampaign = Object.assign({},this.emailCampaign);
    delete this.updatedEmailCampaign.emailCampaignDtl;
    delete this.updatedEmailCampaign.emailCampaignType;
    delete this.updatedEmailCampaign.emailCampaignReceipients;
    delete this.updatedEmailCampaign.mainUser;
    for(let i=0; i < 6; i++){
      for(var j=0; j< 10 ; j++){
        this.minutes.push(i+""+j);
      }
    }

    this.route.queryParams
      .subscribe(params => {
        this.setActiveTab(params.tab);
      });
    
    let self = this;

    $("#datepicker").datepicker({
      dateFormat: 'MM d, yy',
      minDate: 0,
      onSelect: function (date) {
        self.emailBroadcastDate = date;
      }
    });

    //this.setEmailEditorView();
  }
  async getBarchart(tab,graphData) : Promise<void>{
    var canvas = <HTMLCanvasElement> document.getElementById("barChart");
    var ctx = canvas.getContext("2d");
    var label =[];
    var barData = [];
    graphData.forEach(e=>{
          label.push(e.label);
          barData.push(e.value);
    })
    console.log("Creating Graph")
    console.log(graphData)
    this.barchart = new Chart(ctx, {  
      type: 'bar',  
      data: {  
        labels: label,  
        datasets: [  
          {  
            barThickness: 20,
            data: barData,  
            borderColor: '#3cba9f',  
            backgroundColor: "#0B8B8C",  
            fill: true  
          }  
        ]  
      },  
      options: {  
        legend: {  
          display: false  
        },  
        scales: {  
          xAxes: [{  
            gridLines: {
              display:false
            },
            display: true  ,
            ticks: {
              // Show all labels
              autoSkip: false,
              callback: function(tick) {
                  var date = new Date(tick);
                  var shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format;
                  var shortName = shortMonthName(date);
                  // var characterLimit = 20;
                  // if (tick.length >= characterLimit) {
                  //     return tick.slice(0, tick.length).substring(0, characterLimit - 1).trim() + '...';;
                  // }
                   return date.getDate()+" "+shortName;
              }
            }
          }],  
          yAxes: [{
            gridLines: {
              drawBorder: false,
            },  
            display: true ,
            ticks: {
              beginAtZero: true,
              userCallback: (label, index, labels) => {
                  // when the floored value is the same as the value we have a whole number
                  if (Math.floor(label) === label) {
                      return label;
                  }

              },
            } 
          }],  
        },  
        tooltips: {
          custom: function(tooltip) {
           // var tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;
            //tooltipEl.style.position = 'absolute';
          },
          callbacks: {
            title: function(tooltipItem){
            
              var date = new Date(this._data.labels[tooltipItem[0].index]);
              var dayName = this.days[date.getDay()];
              
              return this.days[date.getDay()]+","+this.months[date.getMonth()]+" "+date.getDate()+","+date.getFullYear();
            },
            label: function(tooltipItem) {
              
                return tab+" : " + Number(tooltipItem.yLabel);
            }
         }
		    },
      }  
    });  
  }
  async dashboardCounts(countType){
    //this.dataSource.data = [];
    var graphData = [];
     var data :any = await this.service.getDashboardCount(this.emailCampaign.id,countType);
     console.log(data);
     if(data.status == 'SUCCESS'){
       console.log(data.data);
     
     
      //  $("#dashboardClickedTab .fusioncharts-container").css("padding-left","15%");
      //  $("#dashboardUnsubscribeTab .fusioncharts-container").css("padding-left","15%");
       this.dashboardCount =  data.data;
       this.dashboardCount.openRate = Math.round(this.dashboardCount.openCount/this.dashboardCount.subscriberCount * 100)
       this.dashboardCount.clickRate = Math.round(this.dashboardCount.clickCount/this.dashboardCount.subscriberCount * 100)
       this.dashboardCount.unsubscribeRate = Math.round(this.dashboardCount.unsubscribekCount/this.dashboardCount.subscriberCount * 100)
       var datetime = new Date('1970-01-01T' + this.dashboardCount.emailBroadcastTime + 'Z');
       this.dashboardCount.time = datetime;
       data.data.timeLineList.forEach(e=>{
        graphData.push({label:e.timestamp, value: e.value});
       })
       console.log(graphData);
        await this.getBarchart(this.dashboardActiveTab, graphData);
        $("#barChart").css({"width":"80%"});
     }else{
       this.commonService.serverError(data);
     }
  }

  async changeCriteriaListToFilterList(){
    this.criteriaList.forEach(criteria =>{
          var obj:any = {};
          obj.selectedSegment = criteria.type;
          obj.id = criteria.id;
          obj.propertiesObj = criteria.propertiesObj.id;
          this.segmentationData.forEach(element =>{
            element.segmentationEvent.forEach(async e=> {
                    if(e.value == criteria.type){
                        if(e.value == 'broadcast_emails' || e.value == 'campaign_emails'){
                             obj.broadcastOrEmailId = criteria.propertiesObj.broadcastOrEmailId;
                            var data:any = {};
                             if(e.value == 'campaign_emails' || e.value == 'campaigns'){
                              data = await this.emailCommonService.getSegmentationCampaignNames('campaign_emails');
                              }else if(e.value == "broadcast_emails"){
                                data = await this.emailCommonService.getSegmentationCampaignNames('broadcast_emails');
                              }
                              if(data != null){
                                obj.campaign = data;
                              }
                        }
                           e.segmentationMatch.forEach(match =>{
                                if(criteria.propertiesObj.match.id == match.id){
                                  obj.segmentationMatch = e;
                                  obj.parentSegmentation = element;
                                  obj.matchTag = match.id;
                                  if( obj.segmentationMatch.value == 'email_address'){
                                    console.log(obj.segmentationMatch.value +"++ email_address");
                                    obj.email = criteria.propertiesObj.email;
                                  }else if(obj.segmentationMatch.value == 'person_timezone'){
                                    console.log(obj.segmentationMatch.value +"++ person_timezone");
                                    obj.timezone = criteria.propertiesObj.timeZone;
                                  }  
                                }
                           })
                           e.segmentationMatchExtension.forEach(matchEx =>{
                            if(criteria.propertiesObj.matchExtentions.id == matchEx.id){
                                  obj.segmentationMatch = e;
                                  obj.parentSegmentation = element;
                                  obj.matchExtension = matchEx.id;
                                  obj.matchExtensionValue = matchEx.value
                                  obj.extensionValueType = matchEx.text;
                                  console.log(obj.segmentationMatch.value +"++ email_address");
                                  if(obj.parentSegmentation.id == 2){
                                    if(matchEx.text.includes('at least')){  obj.timesCount =  criteria.propertiesObj.minCount}
                                    if(matchEx.text.includes('at most')){ obj.timesCount = criteria.propertiesObj.maxCount}
                                    if(matchEx.text.includes('exactly')){ obj.timesCount = criteria.propertiesObj.exactCount} 
                                    if(matchEx.text.includes('before')){ obj.date  = criteria.propertiesObj.beforeDate} 
                                    if(matchEx.text.includes('after')){ obj.date  = criteria.propertiesObj.afterDate}
                                    if(matchEx.text.includes('on')){ obj.date  = criteria.propertiesObj.onDate}
                                    if(matchEx.text.includes('in the last')){ obj.days = criteria.propertiesObj.timeSince  } 
                                  }else if(obj.parentSegmentation.id == 3){
                                    if(obj.segmentationMatch.value == 'date_added'){
                                      if(matchEx.text.includes('on or after') || matchEx.text.includes('before')){
                                        obj.date = criteria.propertiesObj.date; 
                                        obj.timezone  = criteria.propertiesObj.timeZone 
                                      }else{
                                        obj.units = criteria.propertiesObj.units; 
                                        obj.days = criteria.propertiesObj.interval 
                                      }
                                    }
                                  }
                                  }
                          })
                           if(!this.filters[0].id){
                             this.filters = [];
                            this.filters.push(obj);
                           }else{
                            this.filters.push(obj);
                           }
                           
                    }
            })
       })

    })
    for(var i=0 ; i< this.criteriaList.length; i++){
      this.criteriaList[i].index = i;
    }
    console.log("Criteria List ",this.filters);
    if(this.emailCampaign.status == 'SENT'){
      setTimeout(()=>{
        $("#segmentationList *").attr("disabled", "disabled")
      },200);
    }
  }
  preview(){
    this.asSubmodule = 'Preview';
  }
  
  setEmailEditorView() {
    if (this.emailCampaign.emailCampaignDtl.length !== 0) {
      this.editEmailView = true;
      $("#main .broadcast .clearfix").css({'overflow' : 'hidden'})
    } else {
      this.editEmailView = false;
      $("#main .broadcast .clearfix").css({'overflow' : 'scroll'})
    }
  }

    activeTab: any = "recipients";
    totalPagesForSubscriber = [];
    pageObjectForSubscriber:any ={
      currentPage : 0
    };
    lastTab: any;
    async setActiveTab(tab: any = 'recipients', pageNumber?: number) {
      $("#main .broadcast .clearfix").css({'overflow' : 'scroll'})
      if (this.lastTab == 'recipients') {
        let newUsers : any = [];
        this.subscribers.forEach(element => {
            if(element.id == null){
              var user:any = { id: element.user.id }
              newUsers.push({ emailCampaignMstId: localStorage.getItem("emailCampaignId"), user: user});
            }
        });
        var data :any = await this.service.saveEmailBroadcastReceipients(newUsers);
      }else if(this.lastTab == 'settings'){
        this.saveSettings();
      }
      this.lastTab = tab;
      this.activeTab = tab;
      if (tab == 'sendemail') {
        this.activeTab = 'sendemail';
        // if(this.subscribers.length == 0){
        //   this.getEmailSubscribers();
        // }
        if(this.emailCampaign.status == "SCHEDULED" || this.emailCampaign.status == "DRAFT"){
         setTimeout(()=>{
          this.setSendEmailData();
         },200); 
        }else{
          $("#1r").prop('checked', true);
          $("#2r").prop('checked', false);
          this.mailOpt = 1;
        }
      }else if(tab == 'recipients'){
        // if(this.subscribers.length != 0 && this.pageObjectForSubscriber.currentPage != pageNumber){
        //   if(pageNumber >= 0){
        //     this.pageObjectForSubscriber.currentPage = pageNumber;
        //   }
        //     this.getEmailSubscribers();
        //   }else if(this.subscribers.length == 0){
        //     this.getEmailSubscribers();
        //   }
          
          this.getSegmentationData();
      }else if(tab == 'email'){
        this.setEmailEditorView();
      }else if(tab == 'dashboard'){
        this.setDashboardActiveTab('Opened');
      }
    }
    dashboardActiveTab;
    setDashboardActiveTab(tab){
      this.dashboardActiveTab = tab;
      if(tab == 'Opened'){
        this.dashboardCounts("opened_count");
      }else if(tab == 'Clicked'){
        this.dashboardCounts("clicked_count");
      }else{
        this.dashboardCounts("unsubscribe_count");
      }
    }
    filters:any =[
      {
        segmentationMatch:{},
        parentSegmentation:{},
        matchExtension : {}
      }
    ];
    segmentationData:any = [];
    selectedSegment;
    async getSegmentationData(){
      var data :any = await this.service.getSegmentationData();
      if(data.status == 'SUCCESS'){
        this.segmentationData = data.data;
        this.changeCriteriaListToFilterList();
      }else{
        this.commonService.serverError(data);
      }
    }
    // segmentationMatch : any={
    //   segmentationMatchExtension:[]
    // };
    // campaign:any = [];
    // async selectSegmentEvent(segmentation){
    //   console.log(this.segmentationData);  
    //   console.log(segmentation);
    //   this.segmentationData.forEach(element =>{
    //        element.segmentationEvent.forEach(e=>{
    //           console.log(segmentation.target.value+" : " +e.value)
    //             if(segmentation.target.value == e.value){
    //                 this.segmentationMatch = e;
    //             }
    //        })
    //   })
    //   console.log(this.segmentationMatch);
    //   var data:any;
    //   if(this.segmentationMatch.value == "campaign_emails"){
    //       data = await this.emailCommonService.getSegmentationCampaignNames('campaign_emails');
    //   }else{
    //     data = await this.emailCommonService.getSegmentationCampaignNames('broadcast_emails');
    //   }
    //   if(data != null){
    //     this.campaign = data;
    //   }
    //   console.log(this.campaign)
    // }
    matchExtensionCount = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    // matchExtensionValue:any={};
    selectedUnsubscribeFromAllMailings(filter,matchExtension){
      // console.log(filter);
      // console.log(event);
      delete filter.date;
      delete filter.days;
      delete filter.timesCount;
      delete filter.units
      delete filter.timezone
      delete filter.email
      matchExtension.forEach(e =>{
          if(e.id == filter.matchExtension){
            console.log(e);
              filter.matchExtensionValue = e.value;
              filter.extensionValueType = e.text;
              if(e.value == 'count'){ filter.timesCount = 1  }
              if(e.value == 'days') {  filter.days = 30  }
              if(e.value == 'in_the_last') {  filter.days = 5 ; filter.units = 'minutes' }
          }
        })
    }
    parentSeletedSegment:any={};
    async selectSegmentEvent2(segmentation,filter){
        this.resetFilterObject(filter);
      // this.matchExtensionValue = {};
      this.segmentationData.forEach(element =>{
           element.segmentationEvent.forEach(e=>{
                if(segmentation.target.value == e.value){
                  filter.parentSegmentation = element;
                  filter.segmentationMatch = e;
                  if(e.segmentationMatch.length > 0){
                    filter.matchTag = e.segmentationMatch[0].id;
                    if(element.id == 3){
                      filter.timezone = 'client';
                    }
                  }
                  if(e.segmentationMatchExtension.length > 0){
                    if(element.id == 3){
                      console.log(element);
                      filter.matchExtensionValue = e.segmentationMatchExtension[0].value;
                      filter.extensionValueType = e.segmentationMatchExtension[0].text
                      filter.timezone = 'client';
                    }
                    filter.matchExtension = e.segmentationMatchExtension[0].id
                  }
                }
           })
      })
      var data:any;
      if(filter.segmentationMatch.value == "campaign_emails" || filter.segmentationMatch.value == 'campaigns'){
          data = await this.emailCommonService.getSegmentationCampaignNames('campaign_emails');
          console.log("Campaigns",data);
      }else if(filter.segmentationMatch.value == "broadcast_emails"){
        data = await this.emailCommonService.getSegmentationCampaignNames('broadcast_emails');
        console.log("Broadcast",data);
      }
      if(data != null){
        filter.campaign = data;
      }
      console.log(filter);
    }

    resetFilterObject(filter){
      delete filter.matchTag;
      delete filter.matchExtension;
      delete filter.matchExtensionValue;
      delete filter.extensionValueType;
      delete filter.campaign;
      delete filter.date;
      delete filter.days;
      delete filter.timesCount;
      delete filter.units
      delete filter.timezone
      delete filter.email
    }
    async saveFilters(){
      console.log(this.filters);
      var receiptFilter = [];
      this.ngxService.startLoader('loader-01');
      receiptFilter = await this.createFilterObject();
      console.log(receiptFilter);
      var data :any = await this.service.saveBroadCastFilters(receiptFilter);
      console.log(data);
      if(data.status == 'SUCCESS'){
        console.log(data.data);
        this.subscribers = data.data.emailCampaignReceipients;
        this.ngxService.stopLoader('loader-01');
      }else{
        this.commonService.serverError(data);
      }
    }
    async deleteBroadCastFilter(filter){
      this.filters.splice(filter.index,1);
      for(var i=0; i< this.filters.length; i++){
        this.filters[i].index = i;
      }  
    }
    async deleteAllFilters(){
      this.ngxService.startLoader('loader-01');
        var data :any= await this.service.deleteAllBroadCastFilters(localStorage.getItem("emailCampaignId"));
        console.log(data);
        if(data.status == 'SUCCESS'){
          console.log(data.data);
          this.filters = [];
         this.filters.push({segmentationMatch:{},parentSegmentation:{}, matchExtension:{}})
          this.ngxService.stopLoader('loader-01');
        }else{
          this.ngxService.stopLoader('loader-01');
          this.commonService.serverError(data);
        }
    }
    async createFilterObject(): Promise <any>{
      var receiptFilter = [];
      this.filters.forEach(e =>{
        var obj :any= {};
        obj = {
          "propertiesObj": {
            "match": {
              "id": e.matchTag
            },
          },
          "type": e.selectedSegment,
          "emailCampMstId":  localStorage.getItem("emailCampaignId")
        }
        if(e.id){  obj.id = e.id;
                   obj.propertiesObj.id = e.propertiesObj   }

        if(e.selectedSegment == "campaigns"){
          obj.propertiesObj.campaignId= e.campaignId
        }else if(e.selectedSegment == "campaign_emails" || e.selectedSegment == "broadcast_emails"){
          obj.propertiesObj.broadcastOrEmailId =  e.broadcastOrEmailId
        }else if(e.parentSegmentation.id == 2){
          obj.propertiesObj.matchExtentions = { "id" :e.matchExtension  } ;
          if(e.extensionValueType){
            if(e.extensionValueType.includes('at least')){ obj.propertiesObj.minCount = e.timesCount }
            if(e.extensionValueType.includes('at most')){ obj.propertiesObj.maxCount = e.timesCount }
            if(e.extensionValueType.includes('exactly')){ obj.propertiesObj.exactCount = e.timesCount } 
            if(e.extensionValueType.includes('before')){ obj.propertiesObj.beforeDate = e.date } 
            if(e.extensionValueType.includes('after')){ obj.propertiesObj.afterDate = e.date }
            if(e.extensionValueType.includes('on')){ obj.propertiesObj.onDate = e.date }
            if(e.extensionValueType.includes('in the last')){ obj.propertiesObj.timeSince = e.days }
          } 
        }else if(e.parentSegmentation.id == 3){
          if(e.selectedSegment == 'date_added'){
            obj.propertiesObj = {
              "matchExtentions":{ "id" :e.matchExtension  }   
             } ;
             if(e.id){   obj.propertiesObj.id = e.propertiesObj }
             if(e.extensionValueType.includes('on or after') || e.extensionValueType.includes('before')){
              obj.propertiesObj.date = e.date; 
              obj.propertiesObj.timeZone = e.timezone 
             }else{
               obj.propertiesObj.units = e.units; 
               obj.propertiesObj.interval = e.days 
             }
            }else if(e.selectedSegment == 'signup_source'){
              obj.propertiesObj.matchExtentions = { "id" :e.matchExtension } ;
              if(e.id){   obj.propertiesObj.id = e.propertiesObj }
            }else if( e.selectedSegment == 'email_address'){
              obj.propertiesObj.email = e.email;
            }else if(e.selectedSegment == 'person_timezone'){
              obj.propertiesObj.timeZone = e.timezone;
            }
            
        }
        receiptFilter.push(obj)
      })
      return receiptFilter;
    }

    addMoreFilters(){
      var obj = {segmentationMatch:{},parentSegmentation:{}, matchExtension:{}, index : this.filters.length}
      this.filters.push(obj);
      console.log(this.filters);
      console.log(this.criteriaList);
      console.log(this.segmentationData);
    }
    // async getEmailSubscribers(){
    //   var data:any = await this.service.getEmailCampRecepients(this.emailCampaign.id,this.emailCampaign.emailCampaignType.id,this.pageObjectForSubscriber.currentPage)
    //   if(data.status == 'SUCCESS'){
    //     this.subscribers = data.data.content;
    //     this.calculatePages(data.data, this.pageObjectForSubscriber);
    //   }else{
    //     this.commonService.serverError(data);
    //   }
    // }
    // calculatePages(data, pageObject) {
    //   this.totalPagesForSubscriber=[];
    //   var startFrom;
    //   var goTill;
    //   if(data.totalPages <= 5){
    //     startFrom = 0
    //     goTill = data.totalPages;
    //   }else{
    //     if(parseInt(data.number) < 3 ){
    //       startFrom = 0;
    //       goTill = 5;
    //     }else if(parseInt(data.number) >= 3){
    //       startFrom = Math.abs(parseInt(data.number) - 2)
    //       goTill = parseInt(data.number) + 3
    //     }
    //   }
    //   for (var i = startFrom; i < goTill; i++) {
    //       if(i < data.totalPages){
    //         this.totalPagesForSubscriber.push(i);
    //     }
    //   }
    //   pageObject.currentPage = data.number;
    //   pageObject.isFirstPage = data.first;
    //   pageObject.isLastPage = data.last;
    //   pageObject.totalElements = data.totalElements;
    //   pageObject.numberOfElements = data.numberOfElements;
    //   window.scrollTo(0, 0);
    // }
    mailOpt: any;
    minutes:any=[];

    selectOption(e: any, val: any) {
      if (!e.srcElement.innerText) {
        e.stopPropagation();
      }

      if (val == 1) {
        $("#1r").prop('checked', true);
        $("#2r").prop('checked', false);
      } else {
        $("#1r").prop('checked', false);
        $("#2r").prop('checked', true);
      }

      this.mailOpt = val;

      if (val == 2) {
        let self = this;

        $("#datepicker").datepicker({
          dateFormat: 'MM d, yy',
          minDate: 0,
          onSelect: function (date) {
            self.emailBroadcastDate = date;
          }
        });
      }
    }

    hours: any; am_pm: any; selectedMint: any;
    emailBroadcastTime: any;
    setSendEmailData(){
      $("#1r").prop('checked', false);
      $("#2r").prop('checked', true);
      this.mailOpt = 2;
      if(this.emailCampaign.emailBroadcastDate != null){
        var month = ['January', 'Feburary','March','April','May','June','July','August','September','October','November','December']
        var date = new Date(this.emailCampaign.emailBroadcastDate);
        this.emailBroadcastDate =  month[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
      }
      if(this.emailCampaign.emailBroadcastTimeZone != null){this.emailBroadcastTimeZone =  this.emailCampaign.emailBroadcastTimeZone}
      if(this.emailCampaign.emailBroadcastTime != null){
        this.emailBroadcastTime = this.emailCampaign.emailBroadcastTime;
        var time = this.emailCampaign.emailBroadcastTime.split(":");
        if(time[0] > 12){
          this.hours = '0'+ (parseInt(time[0]) - 12);
          this.am_pm = 'PM';
        }else{
          this.hours = time[0];
          this.am_pm = 'AM';
        }
        this.selectedMint = time[1];
      }
    
    }
    changeTime(event){
      // let d = new Date();
      let hours = parseInt(this.hours);
      if(this.am_pm == "PM" && hours != 12){
        hours = 12 + hours;
      }
      var time = hours+":"+this.selectedMint+":00";
      this.emailBroadcastTime = time;
    }

    editEmailView: boolean = false;
    asSubmodule: any = true;
    editEmail() {
      // this.activeTab = "";
      //this.emailCommonService.startFromScratchBCTemplate();
      this.editEmailView = true;
      $("#main .broadcast .clearfix").css({'overflow' : 'hidden'})
     
    }

    // async navToEmailEditor(email) {
    //   if (email != null) {
    //     await this.emailCommonService.setEmailTempelate(email);
    //     localStorage.setItem("emailTemplateId", email.id);
    //   }else{
    //    var  emailTempelate:any={
    //       emailBodyDtl:[]
    //     };
    //     await this.emailCommonService.setEmailTempelate(emailTempelate);
    //   }
    //   this.router.navigate(['/editEmail'])
    // }

    async onNavigation(path: any) {
      if (path == 'emailBack') {
        this.activeTab = "recipients";
      } else if (path == 'emailNext') {
        this.activeTab = "settings";
      } else if (path == 'recipientsNext') {
        this.activeTab = 'email';
        var newUsers : any = [];
        this.subscribers.forEach(element => {
            if(element.id == null){
              var user:any = { id: element.user.id }
              newUsers.push({ emailCampaignMstId: localStorage.getItem("emailCampaignId"), user: user});
            }
        });
        var data :any = await this.service.saveEmailBroadcastReceipients(newUsers);
       
      } else if (path == 'settingsBack') {
        this.activeTab = 'email';
        this.saveSettings();
      } else if (path == 'settingsNext') {
        var emptyFeilds = await this.checkIfSettingsDataIsEmpty();
        if(emptyFeilds.length == 0){
          this.saveSettings();
          this.activeTab = 'sendemail';
          $("#1r").prop('checked', true);
          $("#2r").prop('checked', false);
         
          if (!this.mailOpt) {
            this.mailOpt = 1;
          }
        }else{
          var values = emptyFeilds.join(",");
          this.errorMessage = "Please enter the values for "+values;
          this.toggleErrorMessage();
         
        }
       
      } else if (path == 'sendemailBack') {
        this.activeTab = "settings";
      }

      // this.setEmailEditorView();
      this.setActiveTab(this.activeTab)
      if (path == 'changeEmailTemplate') {
        this.editEmailView = false;
        $("#main .broadcast .clearfix").css({'overflow' : 'scroll'})
        this.activeTab = "email";
      }
    }

    editorOptions= {
      toolbar: [
        ['bold', 'italic', 'underline'],        // toggled buttons
        [{ 'color': [] }],          // dropdown with defaults from theme
        ['blockquote'],            // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
       
        [{ 'align': [] }],

        ['clean']                                    // remove formatting button

      ]
  };
  quillData;

  changeEditorCss(){
    $(".ql-toolbar.ql-snow").css("background-color","white");
    $(".ql-container").css({"height":"25vh","background":"white"});
    $(".ql-toolbar.ql-snow .ql-formats").css("margin-right",0);
    $(".ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button").css({"height":"19px", "width":"25px", "background":"none", "border":"none"});
    $(".ql-snow .ql-color-picker .ql-picker-label, .ql-snow .ql-icon-picker .ql-picker-label").css({"padding": "0px 4px", "background":"none"});
  }

  updatedEmailCampaign: any = {};
  emailBroadcastTimeZone: any;
  async saveSettings(){
    this.emailBroadcastTimeZone = this.updatedEmailCampaign.timezone;
    //var testedEmailPattern = this.common.emailPattern.test(this.updatedEmailCampaign.fromEmail);
    var emptyFeilds = await this.checkIfSettingsDataIsEmpty();
    if(emptyFeilds.length == 0){   
      this.ngxService.startLoader('loader-01');
      var data : any =await this.service.saveTemplate(this.updatedEmailCampaign);
      if(data.status == 'SUCCESS'){
        // this.updatedEmailCampaign = data.data;
        this.ngxService.stopLoader('loader-01');
        this.emailCommonService.updateEmailCampaignSetting(this.updatedEmailCampaign);
      }else{
        this.ngxService.stopLoader('loader-01');
        this.commonService.serverError(data);
      }
    }else{
      var values = emptyFeilds.join(",");
      this.errorMessage = "Please enter proper values for "+values;
      this.toggleErrorMessage();
    }
  }

  onSelectionChanged(event){
      if(event.oldRange != null){
        this.saveSettings();
      }
  }
  onContentChanged(event){
    this.updatedEmailCampaign.footerText = this.quillData;
  }
  getEditorInstance(event){
    this.changeEditorCss();
  }

  sendTo: any;
  emailSentRes: any;
  sendingEmail = false;
  async sendBcEmail(type: any) {
    var emptyVales:any =[];
    emptyVales = await this.checkIfSettingsDataIsEmpty();
    //document.getElementById("sendBroadcastEmailModal").style.display = 'block';
    if(emptyVales.length == 0){
        this.sendTo = this.subscribers.map(item => item.userEmail);
        if (type == 'immediate') {
          if(localStorage.getItem("emailTemplateId")){
            document.getElementById("sendBroadcastEmailModal").style.display = 'block';
            this.sendingEmail = true;
            this.emailSentRes = await this.emailCommonService.sendBroadcastEmail(this.sendTo);
            document.getElementById("successfullySentBroadcastEmail").style.display = 'block';
            document.getElementById("sendingBroadcastEmail").style.display = 'none';
            this.sendingEmail = false;
          }else{
            this.errorMessage = "You have not yet created a email, Please create a email first"
            this.toggleErrorMessage();
          }
          
        } else {
          var checkEmpty = await this.checkIfSendBroadcastDataIsEmpty();
          if(checkEmpty.length == 0){
            var d = new Date(this.emailBroadcastDate);
            var date = d.getFullYear()+"-"+ (d.getMonth() + 1 ) + "-"+d.getDate();
            var originalDate  = new Date(date);
            let body = {
                "emailBroadcastDate": originalDate,
                "emailBroadcastTime": this.emailBroadcastTime,
                "emailBroadcastTimeZone": this.emailBroadcastTimeZone,
                "status" : type
            }
            if(type == 'SCHEDULED'){
              document.getElementById("sendBroadcastEmailModal").style.display = 'block';
            }else{
              this.ngxService.startLoader('loader-01');
            }
            
            this.sendingEmail = true;
            this.emailSentRes = await this.emailCommonService.saveBroadCastEmailDetails(body);
            if(type == 'SCHEDULED'){
            document.getElementById("successfullySentBroadcastEmail").style.display = 'block';
            document.getElementById("sendingBroadcastEmail").style.display = 'none';
            }else{
                this.ngxService.startLoader('loader-01');
            }
            this.sendingEmail = false;
          }else{
            var values = checkEmpty.join(",");
            this.errorMessage = "Please enter the values for "+values;
            this.toggleErrorMessage();
          }
         
        }
    }else{
        var values = emptyVales.join(",");
        this.errorMessage = "Please enter the values for "+values;
        this.toggleErrorMessage();
    }
  
  }
  closeSendEmailBox(){
    document.getElementById("successfullySentBroadcastEmail").style.display = 'none';
    document.getElementById("sendingBroadcastEmail").style.display = 'block';
    document.getElementById("sendBroadcastEmailModal").style.display = 'none';
    this.sendingEmail = false;
    this.router.navigate(['/EmailBroadcastOne'], { queryParams: { tab: 'dashboard' } });
    location.reload()
  }
  toggleErrorMessage(close?: string){
    $("#errorMessage").toggle(500);
    if(!close){
      setTimeout(function() {
        $('#errorMessage').fadeOut('fast');
      }, 3000);
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
      var dmarkRule = this.common.newEmailPattern.test(this.updatedEmailCampaign.fromEmail);
      if(testedEmailPattern == false || dmarkRule == false){
        emptyVales.push("From Email");
      }
    }
    if(this.updatedEmailCampaign.bcc != null && this.updatedEmailCampaign.bcc != ""){
      var testedEmailPattern = this.common.emailPattern.test(this.updatedEmailCampaign.bcc);
      if(testedEmailPattern == false){
        emptyVales.push("bcc");
      }
    }
    if(this.updatedEmailCampaign.postalAddress === null || this.updatedEmailCampaign.postalAddress === ""){
      emptyVales.push("Postal address")
    }
    if(this.updatedEmailCampaign.campaignPrimaryPurpose === null || this.updatedEmailCampaign.campaignPrimaryPurpose === ""){
      emptyVales.push("Campaign Primary Purpose");
    }

    return emptyVales;
  }
  async checkIfSendBroadcastDataIsEmpty():Promise<any>{
    var checkEmpty=[];
    if(this.emailBroadcastDate == null || this.emailBroadcastDate == undefined){
        checkEmpty.push("Broadcast Date");
    } 
    if(this.emailBroadcastTime == null || this.emailBroadcastTime == undefined){
      checkEmpty.push("Broadcast Time");
    }
    if(this.emailBroadcastTimeZone == null || this.emailBroadcastTimeZone == undefined){
      checkEmpty.push("Broadcast Timezone");
    }
    return checkEmpty;
  }
  // [];
  subscribers:any = [
  ];
 

  onDPIconClick() {
    $("#datepicker").focus();
  }

  onEditEmail(event) {
      this.editEmail();
  }

  openSettingsDropDownMenu(){
    var menu = document.getElementById("settingsDropDownMenu");
    if(menu.style.display == 'none' || menu.style.display == undefined){
      menu.style.display = 'block'
    }else{
      menu.style.display = 'none'
    }
  }
 
  selectPrimaryPurpose(purpose){
    this.updatedEmailCampaign.campaignPrimaryPurpose = purpose;
    document.getElementById("settingsDropDownMenu").style.display = 'none';
  }
  editingEmailTitleBorder(action){
    var elem = document.getElementById("emailTitle");

    if(!elem.style.borderBottom.includes('1px solid')){
      if(action == "Show"){
        elem.style.borderBottom = '2px dashed #0B8B8C'
        $("#emailTitleEditButton").show();
      }else{
        elem.style.borderBottom = 'none'
        $("#emailTitleEditButton").hide();
      }  
    }
  }

  editingEmailTitle(){
    var elem = document.getElementById("emailTitle");

    elem.style.borderBottom = '1px solid #0B8B8C'
    $("#editTitleImage").attr('src', 'assets/icons/ic_editgreen.svg');
    $("#editTitleImage").attr('width', '15px');
  }
  emailTitle="";
  countEmailTitleCharacters(event){
    var length = event.target.innerText.length;
    if(event.key != 'Enter'){
      if(length >= 31){
        document.getElementById("templateTitleText").innerText = this.emailTitle;
      }else{
        this.emailTitle = event.target.innerText
      }
    }
  }
  onEnter($event) {
    //$event.preventDefault();
    var length = $event.target.innerText.length;
    if($event.key != 'Enter'){
      if(length >= 80 && $event.keyCode != 8){
        $event.preventDefault();
      }else{
        this.emailTitle = $event.target.innerText
      }
  }else{ 
     $event.preventDefault();
  }
  }
  async saveEmailTempelateTitle(){
    
      var text = document.getElementById("templateTitleText").innerText;
      $("#editTitleImage").attr('src','assets/icons/pencil-edit-button (1).svg')
      $("#editTitleImage").attr('width','');
      $("#emailTitleEditButton").hide();
      var elem = document.getElementById("emailTitle");
      elem.style.borderBottom = 'none'

    var emailCampaign: any = {
      id: localStorage.getItem("emailCampaignId"),
      emailCapaignTitle: text
    }
    var data: any = await this.service.createEmailCampaign(emailCampaign);
    if (data.status == 'SUCCESS') {
    } else {
      this.commonService.serverError(data);
    }
  }

  showFilterList(){
    var icon = document.getElementById("toggelDownIcon");
        if($("#toggelDownIcon").hasClass("down")){
          $("#toggelDownIcon").removeClass("down");
          $("#toggelDownIcon").addClass("up");
          this.emailCampaignSent = false;
        }else{
          $("#toggelDownIcon").removeClass("up");
          $("#toggelDownIcon").addClass("down");
          this.emailCampaignSent = true;
        }
  }
}
