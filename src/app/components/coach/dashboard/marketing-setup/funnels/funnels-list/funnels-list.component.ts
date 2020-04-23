import { Component, OnInit } from '@angular/core';

import { FunnelService } from 'src/app/services/coach/funnel/funnel.service';
import { FunnelFragmentsService } from 'src/app/services/coach/funnel/funnel-fragments.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Common } from '../../../../../../services/global/common';
import { CommonService } from '../../../../../../services/global/common.service';
import {FunnelConfigService} from '../../../../../../services/coach/funnel/funnel-config.service';
@Component({
  selector: 'app-funnels-list',
  templateUrl: './funnels-list.component.html',
  styleUrls: ['./funnels-list.component.css']
})
export class FunnelsListComponent implements OnInit {

  selectedIndex: any = -1;
  totalPages: any = [];
  currentPage = 0;
  nextPage = 0;
  previousPage = 0;
  isLastPage : boolean;
  isFirstPage : boolean;
  constructor(
    private funnelConfigService:FunnelConfigService,
    private commonService: CommonService,
    public router: Router,
    public funnelService: FunnelService,
    public funnelFragmentsService: FunnelFragmentsService,
    public common : Common
  ) { }

  // [{
  //   "status": "SUCCESS",
  //   "statusCode": 200,
  //   "message": "Generic Success",
  //   "appCode": "SUC_GENERIC",
  //   "data": 

  funnelsList: any = [];

  // get this based on funnel type,
  // for webinar funnel type, based on webinar type, make it to live or automated
  // for quiz + wbeinar, we need quiz tag and based on webinar type, make it to live or automated
  funnelTypeTags: any = [];
  funnelType;
  funnel:any={
    isPvtPub : 'Public'
  };
  categoryList = [];
  mainCategoryList = [];
  itemsList = [];
  selectedCategory = 'select';
  privatePublicFunnel :any = {};
  funnelPage;
  activePage ;
  draftPage;
  archivePage;

  async ngOnInit() {
    localStorage.removeItem("editFunnel");
    localStorage.removeItem("editWebinar");
    localStorage.removeItem("editQuiz");
    localStorage.removeItem("funnelUrl");
    localStorage.removeItem("funnel");
    localStorage.removeItem("webinarRegistrationTime");
    localStorage.removeItem("replayTimeSlot");
    this.funnelPage = this.funnelConfigService.funnelPage;
    this.activePage = this.funnelConfigService.activePage;
    this.draftPage = this.funnelConfigService.draftPage;
    this.archivePage = this.funnelConfigService.archivePage;
    this.getFunnelData(this.funnelPage);
    this.getCtegorySubCategoryList();
  }

  async getFunnelData(page) {
    // get funnelslist
    let funnelsListData: any;
    if(this.funnelType != null || this.funnelType != undefined){
      //funnelsListData = await this.funnelService.getFunnelsList(page,this.funnelType);
     
      if(this.funnelType == 'Active'){
        this.activePage = page;
      }else if(this.funnelType == 'Draft'){
        this.draftPage = page;
      }else if(this.funnelType == 'Archive'){
        this.archivePage = page;
      }
      funnelsListData = await this.funnelConfigService.getFunnel(page,this.funnelType);
    }else{
      //funnelsListData = await this.funnelService.getFunnelsList(page);
      this.funnelPage = page;
      funnelsListData = await this.funnelConfigService.getFunnel(page,null);
    }

    this.funnelsList = funnelsListData.content;
    this.calculatePages(funnelsListData);
    // iterate over funnelsList and set funnelTypeTags
    this.funnelsList.map((item) => {

      // if item has quiz, ADD quiz tag
      if (item.quiz) {
        this.funnelTypeTags.push({
          label: "QUIZ",
          class: "bg-purple"
        });

        item.imageToShow = item.quiz.quizMediaAttached;

      }

      // if item has webinar, get webinarType
      if (item.webinar) {

        // item.webinar.webinarType is null, no webinar type is saved just show 'webinar'
        if (!item.webinar.webinarType) {

          this.funnelTypeTags.push({
            label: "WEBINAR",
            class: "bg-green"
          });
        }
        else {

          // for auto webinar, class is bg-green
          // for live webinar, class is bg-red
          if (item.webinar.webinarType.toLowerCase().includes("auto")) {

            this.funnelTypeTags.push({
              label: item.webinar.webinarType + " WEBINAR",
              class: "bg-green"
            });
          } else {

            this.funnelTypeTags.push({
              label: item.webinar.webinarType + " WEBINAR",
              class: "bg-red"
            });
          }
        }

        item.imageToShow = item.webinar.webinarCardImgUploadPath;
      }

      item.funnelTypeTags = this.funnelTypeTags;

      // clear this.funnelTypeTags
      this.funnelTypeTags = [];

      return item;
    });
  }
  // Show and hide the action button drop down
  showDropDown(event, index) {
    if (event.type == 'mouseover') {
      document.getElementById("actionDropDown" + index).style.display = 'block'
    } else {
      document.getElementById("actionDropDown" + index).style.display = 'none'
    }
  }

  // Changing the active tab(All Funnel, Active, Draft, Archived)
  async changeActiveTab(event) {
    var list = document.getElementsByClassName("nav__item");
    this.funnelType = event.target.innerHTML;
    event.target.classList.add('active');
    for (var i = 0; i < list.length; i++) {
      if (list[i].classList.contains('active') && list[i].innerHTML != event.target.innerHTML) {
        list[i].classList.remove('active')
      }
    }
    this.funnelsList = [];
    if (event.target.innerHTML == 'All Funnels') {
      this.funnelType = null;
      this.getFunnelData(this.funnelPage);
    }else if(this.funnelType == 'Active'){
      this.getFunnelData(this.activePage );
    }else if(this.funnelType == 'Draft'){
      this.getFunnelData(this.draftPage );
    }else if(this.funnelType == 'Archive'){
      this.getFunnelData(this.archivePage );
    }
  }
  // used to show/hide quick links
  toggleQuickLinks(index) {

    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
    }
  }
  getAppendedUrl(splitName, appendText?) {

    let name = "";

    for (let i = 0; i < splitName.length; i++) {
      if (appendText) {
        if (i == 0)
          name = name + splitName[i];
        else
          name = name + appendText + splitName[i];
      }
      else
        name = name + splitName[i];
    }

    return name;

  }
  edit(funnel) {
    let fName = funnel.funnelType.funnelName;

    // if funnelName has space and '+', split based on it and append with 'and'
    if (fName.includes(" + ")) {

      let splitName = fName.split(" + ");
      // update funnelUrl with appended 'and'
      funnel.funnelType.funnelUrl = this.getAppendedUrl(splitName, "and");
    } else if (fName.includes(" ")) {

      let splitName = fName.split(" ");

      // update funnelUrl with appended 'and'
      funnel.funnelType.funnelUrl = this.getAppendedUrl(splitName);
    } else {

      // no spaces and '+', funnelName is the Url
      funnel.funnelType.funnelUrl = funnel.funnelType.funnelName;
    }
    localStorage.setItem("funnel", funnel.id);
    localStorage.setItem("funnelUrl", funnel.funnelType.funnelUrl);
    this.funnelFragmentsService.saveFunnelData(funnel);
    this.router.navigate(['/funnelCreate/' + funnel.funnelType.funnelUrl], { queryParams: { edit: true } });
  }
  async changeStatus(status,id){
    var response: any;
    var message;
    if(status == 'Archive'){
      Swal.fire({
        text: 'If you archive a funnel then you will not be able to Publish it again and you will never be able to edit it again',
        type: 'info',
        showCancelButton: true
      }).then(async (result) => {
        if (result.value) {
          response = await this.funnelService.changeFunnelStatus(status,id);
          if(response.status == 'SUCCESS'){
            Swal.fire({
              text: 'Funnel Archived Successfully',
              type: 'success',
            }).then((result) => {
              if (result.value) {
                var foundIndex = this.funnelsList.findIndex(x => x.id == response.data.id);
                this.funnelsList[foundIndex] = response.data;
                this.funnelConfigService.addItemInList('Archive',this.funnelsList[foundIndex])
                this.funnelConfigService.removeItem('Archive',this.funnelsList[foundIndex]);
                //this.funnelConfigService.archiveFunnel.push(this.funnelsList[foundIndex])
               // console.log(this.funnelsList[foundIndex]);
              }
          });
          }else{
            this.serverError(response);
          }
        }
    });
    }else{
      response = await this.funnelService.changeFunnelStatus(status,id);
      if(response.status == 'SUCCESS'){
        if(status == 'Active')
        message = 'Funnel Published Sucessfully';
        else if(status == 'Draft')
        message = 'Funnel UnPublished Sucessfully';
        Swal.fire({
          text: message,
          type: 'success',
        }).then((result) => {
          if (result.value) {
            var foundIndex = this.funnelsList.findIndex(x => x.id == response.data.id);
            this.funnelsList[foundIndex].status = response.data.status;
            if(status == 'Active'){
              this.funnelConfigService.addItemInList('Active',this.funnelsList[foundIndex])
              this.funnelConfigService.removeItem('Active',this.funnelsList[foundIndex])
             
            }
           
            else if(status == 'Draft'){
              this.funnelConfigService.addItemInList('Draft',this.funnelsList[foundIndex])
              this.funnelConfigService.removeItem('Draft',this.funnelsList[foundIndex])
             
            }
           
          }
      });
      }else{
        this.serverError(response);
      }
    }
    
  }

  copyUrl(url , funnel, forward? : boolean){
    let selBox;
    selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    var dt;
    if(url == 'registerForWebinar'){
      url = this.common.serverUrl+'/registerForWebinar?id='+funnel.id;
    }else if( url == 'thankyou' ){
      var status = false;
       if(funnel.webinarType == 'auto' && funnel.webinarAutoDtl != null){
        var splitDate = funnel.webinarAutoDtl.webinarAutoDtlTimeList[0].eventTime.split('T');
        dt = new Date(splitDate[0]+" "+splitDate[1].split('.')[0])
        replayTimeSlot = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
        localStorage.setItem('webinarRegistrationTime',replayTimeSlot)
        status = true;
        }else if(funnel.webinarType == 'live' && funnel.webinarLiveDtl != null){
          var splitDate = funnel.webinarLiveDtl.webinarLiveTime.split('T')
          dt = new Date(splitDate[0]+" "+splitDate[1].split('.')[0])
          replayTimeSlot = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
         localStorage.setItem('webinarRegistrationTime',replayTimeSlot);
         status = true;
       }else{
        status = false;
         this.serverError({message: 'You have not added Time slot for the webinar, Please add a time slot first'});
       }
       if(forward && status == true){
         url = this.common.serverUrl+'/thankyou';
         localStorage.setItem('webinarId',funnel.id);
        this.router.navigate([]).then(result => {  window.open(url, '_blank'); });
       }else if(!forward && status == true){
        localStorage.setItem('webinarId',funnel.id);
        url = this.common.serverUrl+'/thankyou';
       }
    }else if( url == 'webinarAutoStreamPage' ){
      var replayTimeSlot;
      var status = false;
      if(funnel.webinarType == 'auto' && funnel.webinarAutoDtl != null && funnel.webinarUrl != null){
       var splitDate = funnel.webinarAutoDtl.webinarAutoDtlTimeList[0].eventTime.split('T');
        dt = new Date(splitDate[0]+" "+splitDate[1].split('.')[0])
        replayTimeSlot = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
        localStorage.setItem('webinarRegistrationTime',replayTimeSlot)
          status = true;
      }else if(funnel.webinarType == 'live' && funnel.webinarLiveDtl != null && funnel.webinarUrl != null){
         var splitDate = funnel.webinarLiveDtl.webinarLiveTime.split('T')
         dt = new Date(splitDate[0]+" "+splitDate[1].split('.')[0])
         replayTimeSlot = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes();
        localStorage.setItem('webinarRegistrationTime',replayTimeSlot);
        status = true;
       }else{
        status = false;
         this.serverError({message: 'You dont have a webinar video for replay'});
       }
       if(forward && status == true){
        localStorage.setItem("funnelReplay", 'true');
        localStorage.setItem('webinarId',funnel.id);
        url = this.common.serverUrl+'/webinarAutoStreamPage?id='+funnel.id+"&replay=true&replayTimeSlot="+replayTimeSlot;
       this.router.navigate([]).then(result => {  window.open(url, '_blank'); });
      }else if(!forward && status == true){
        localStorage.setItem("funnelReplay", 'true');
        localStorage.setItem('webinarId',funnel.id);
       url =this.common.serverUrl+'/webinarAutoStreamPage?id='+funnel.id+"&replay=true&replayTimeSlot="+replayTimeSlot;
      }
    }else if( url == 'PlayQuiz'){
      url = this.common.serverUrl+'/PlayQuiz?id='+funnel.id;
    }

    
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  deleteFunnel(id){
    Swal.fire({
      text: 'Are you sure you want to delete this funnel',
      type: 'warning',
      showCancelButton: true
    }).then(async (result)=>{
      if (result.value) {
          var response:any = await this.funnelService.deleteFunnel(id);
          if(response.status == 'SUCCESS'){
            Swal.fire({
              text: 'Funnel Deleted Successfully',
              type: 'success'
            })
            var foundIndex = this.funnelsList.findIndex(x => x.id == id);
            this.funnelsList.splice(foundIndex, 1)
            
          }else{
            this.serverError(response);
          }
      }
    })
  }

  duplicateFunnel(id){
    Swal.fire({
      text: 'Are you sure you want to create a duplicate of this funnel',
      type: 'warning',
      showCancelButton: true
    }).then(async (result)=>{
      if (result.value) {
          var response:any = await this.funnelService.duplicateFunnel(id);
          if(response.status == 'SUCCESS'){
            Swal.fire({
              text: 'Duplicate Funnel created Successfully',
              type: 'success'
            })
           // var foundIndex = this.funnelsList.findIndex(x => x.id == id);
            this.funnelsList.unshift(response.data)
            
          }else{
            this.serverError(response);
          }
      }
    })
  }
  calculatePages(data) {
    this.totalPages = [];
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
        this.totalPages.push(i);
      }
     
    }
    this.currentPage = data.number;
    this.nextPage = data.number + 1;
    this.previousPage = data.number - 1;
    this.isFirstPage = data.first;
    this.isLastPage = data.last;
    window.scrollTo(0, 0);
  }

  openModel(funnel){
    this.itemsList = [];
    this.funnel = funnel;
    if(this.funnel.funnelCategoryId != null){
      this.selectedCategory = this.funnel.funnelCategoryId;
    }
    if(this.funnel.isPvtPub == null){
      this.funnel.isPvtPub = 'Public';
    }

    if(this.funnel.funnelSubCategoryId != null){
      this.getSubCategoryList();
      this.itemsList = this.funnel.funnelSubCategoryId.split(",");
      
    }
    var modal = document.getElementById("myModal");
    if(modal.style.display == 'none'){
      modal.style.display = 'block';
    }else{
      modal.style.display = 'none';
    }
  }

  setWebinarSecurity (securityType, other)
	{

    if(this.funnel.isPvtPub == 'Private' || this.funnel.isPvtPub == null){
      this.selectedCategory = 'select';
      this.itemsList = [];
    }
    this.funnel.isPvtPub = securityType; 
   
    
    
  }
  
  async getCtegorySubCategoryList() {
    var response :any = await this.commonService.getCategory();
    if (response.status == 'SUCCESS') {
      let categoryList = [];
      categoryList =  response.data;
      this.mainCategoryList = response.data;
      categoryList.forEach(element => {
      
        this.categoryList.push({ "id": element.id, "displayName": element.displayName });
      })
    }else{
      this.serverError(response);
    }
  }
  items = [];
  getSubCategoryList() {
   
    if (this.mainCategoryList.length > 0) {
      this.mainCategoryList.forEach(element => {
      
        if (element.id == this.selectedCategory) {
          this.items = [];
          element.subcategoryList.forEach(subCat => {

            // this.items.push({ "value": subCat.id, "display": subCat.displayName });
            this.items.push(subCat.displayName);
          });
        }
      })
    }
  }

  async savePrivatePublic(){
    var funnel :any ={};
    if(this.funnel.isPvtPub == 'Public'){
      funnel.funnelCategoryId = this.selectedCategory;
      this.itemsList.forEach(element=>{
        if(funnel.funnelSubCategoryId == null || funnel.funnelSubCategoryId == undefined)
        funnel.funnelSubCategoryId = element.value;
        else
        funnel.funnelSubCategoryId = funnel.funnelSubCategoryId+","+element.value;
      })
    }
    funnel.funnelName = this.funnel.funnelName;
    funnel.id = this.funnel.id;
    funnel.isPvtPub = this.funnel.isPvtPub;
    var response :any =  await this.funnelService.saveFunnel(funnel)
      funnel.funnelSubCategoryId = null;
       funnel.funnelCategoryId = null;
    if(response.status == 'SUCCESS'){
      Swal.fire({
        text: 'Funnel Successfully changed to '+funnel.isPvtPub,
        type: 'success'
      }).then(result =>{
        if(result){
          var foundIndex = this.funnelsList.findIndex(x => x.id == response.data.id);
          this.funnelsList[foundIndex] = response.data;
          this.selectedCategory = 'select';
          this.itemsList = [];
          this.openModel(funnel);
        }
      })
    }else{
      this.serverError(response);
    }
  }

  startWebinar(webinar){
    Swal.fire({
      text: "Are you sure you want to start this webinar",
      type: "info",
      showCancelButton: true
    }).then(async result=> {
      if (result.value) {
        var url = this.common.serverUrl+"/liveWebinarPage?id="+ webinar.id;
        this.router.navigate([]).then(result => {  window.open(url, '_blank'); });
       }
    })
    
  }
  //Handeler that handels erorr if the status code of the api is not SUCCESS
    serverError(data){
      Swal.fire({
        text: data.message,
        type: 'warning',
  
      });
  }
}
