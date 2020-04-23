import { Component, OnInit } from '@angular/core';
import { EmailCampaignService } from '../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../services/global/common.service';
import { EmailCommonService } from '../../../../../services/coach/emailCampaign/email-common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  segmentContacts: any =[ 
      {
        name: 'Martin Richard',
        email:'martinrichard@gmail.com',
        phnNumber:'+6548638749',
        location: 'Mumbai',
        date: '10/15/1992'
      },
      {
        name: 'Ryan Evans',
        email:'kathy.brewer@mail.com',
        phnNumber:'(254)625-2969',
        location: 'Brussels',
        date: '2/15/1992'
      },
      {
        name: 'Kathy Willis',
        email:'dennis.baker@mail.com',
        phnNumber:'(570)875-9599',
        location: 'Chiang Mai',
        date: '9/15/1992'
      },
      {
        name: 'Louisa Hayes',
        email:'kelly.bradley@mail.com',
        phnNumber:'(567)222-4988',
        location: 'Seattle',
        date: '08/12/1985'
      },
      {
        name: 'Joe Powell',
        email:'beverly.brewer@mail.com',
        phnNumber:'(190)307-8321',
        location: 'Valparaiso',
        date: '10/15/1992'
      },
      {
        name: 'Martin Richard',
        email:'martinrichard@gmail.com',
        phnNumber:'+6548638749',
        location: 'Mumbai',
        date: '10/15/1992'
      }
    ]
  
  filters:any =[
    {
      segmentationMatch:{},
      parentSegmentation:{},
      matchExtension : {}
    }
  ];
  segmentationData:any = [];
  subscribers:any = [];
  matchExtensionCount = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  constructor(public service: EmailCampaignService,
              public commonService: CommonService,
              public router: Router,
              public emailCommonService: EmailCommonService) { }

  ngOnInit() {
    this.getSegmentationData();
  }
  async getSegmentationData(){
    var data :any = await this.service.getSegmentationData();
    if(data.status == 'SUCCESS'){
      this.segmentationData = data.data;
    //  this.changeCriteriaListToFilterList();
    }else{
      this.commonService.serverError(data);
    }
  }
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
     // this.ngxService.startLoader('loader-01');
      receiptFilter = await this.createFilterObject();
      console.log(receiptFilter);
      var data :any = await this.service.saveBroadCastFilters(receiptFilter);
      console.log(data);
      if(data.status == 'SUCCESS'){
        console.log(data.data);
        this.subscribers = data.data.emailCampaignReceipients;
      //  this.ngxService.stopLoader('loader-01');
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
     // this.ngxService.startLoader('loader-01');
        var data :any= await this.service.deleteAllBroadCastFilters(localStorage.getItem("emailCampaignId"));
        console.log(data);
        if(data.status == 'SUCCESS'){
          console.log(data.data);
          this.filters = [];
         this.filters.push({segmentationMatch:{},parentSegmentation:{}, matchExtension:{}})
     //     this.ngxService.stopLoader('loader-01');
        }else{
     //     this.ngxService.stopLoader('loader-01');
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
      // console.log(this.criteriaList);
      console.log(this.segmentationData);
    }
    openViewDropDown(id){
      var dropDown = document.getElementById(id);
      if(dropDown.style.display == 'none'){
        dropDown.style.display = 'block';
      }else{
        dropDown.style.display = 'none';
      }
    }
    closeEditEmailDropDown(id){
      document.getElementById(id).style.display = 'none';
    }
    addMultipleUsers(){
      this.router.navigate(['/uploadlistofUser']);
    }
}
