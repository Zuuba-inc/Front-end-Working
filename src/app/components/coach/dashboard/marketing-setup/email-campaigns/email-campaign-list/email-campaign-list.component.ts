import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email-campaign-list',
  templateUrl: './email-campaign-list.component.html',
  styleUrls: ['./email-campaign-list.component.css']
})
export class EmailCampaignListComponent implements OnInit {
  activeTab = '1a';
  newEmailCampaign: any = {
    emailCampaignType: {}
  };
  emailCampaign: any = {};
  emailCampaignSequence: any = [];
  emailCampaignBroadcast: any = [];
  constructor(public service: EmailCampaignService,
    public commonService: CommonService,
    public router: Router,
    private ngxService: NgxUiLoaderService,
    public emailCommonService: EmailCommonService) { }

  ngOnInit() {
    // this.emailCommonService.updateEmailBody = false;
    localStorage.removeItem("emailCampaignId");
    localStorage.removeItem("emailTemplateId");
    localStorage.getItem("emailListTab");
    if(localStorage.getItem("emailListTab") == '2a'){
      $("#broadcastTab").click();
      this.broadcasts(localStorage.getItem("emailListTab"));
    }
    this.emailCommonService.clearList();
    this.getEmailBroadCast();
    this.getEmailSequence();
  }

  bcMterics: any = [];
  esMetrics: any = [];

  // async getEmailCampaignList() {
  //     await this.getEmailSequence();
  //     await this.getEmailBroadCast();
  //     console.log(this.emailCampaignBroadcast);
  //     console.log(this.emailCampaignSequence);
      
      
     
      
  // }
  emailSequencePageNumber = [];
  sequencePageObject:any ={
    currentPage : 0
  };
  async getEmailSequence(pageNumber?: number){
    if(pageNumber >= 0){
      this.sequencePageObject.currentPage = pageNumber
    }
    var data: any = await this.service.getEmailCampaignList("Sequence",this.sequencePageObject.currentPage);
    console.log(data);
    if (data.status == 'SUCCESS') {
      this.calculatePages(data.data,'Sequence',this.sequencePageObject);
      console.log(this.emailSequencePageNumber)
      console.log(this.sequencePageObject);
      this.emailCampaignSequence = data.data.content;
      this.setMetrics([...this.emailCampaignSequence], 'es');
      this.emailCommonService.setAllEmails(this.emailCampaignSequence, 'Sequence');
    } else {
      this.commonService.serverError(data);
      return null;
    }
  }
  emailBroadPageNumber = [];
  broadcastPageObject:any ={
    currentPage : 0
  };
  async getEmailBroadCast(pageNumber?: number){
    if(pageNumber >= 0){
      this.broadcastPageObject.currentPage = pageNumber;
    }
    var data: any = await this.service.getEmailCampaignList("BroadCast",this.broadcastPageObject.currentPage);
    console.log(data);
    if (data.status == 'SUCCESS') {
      this.calculatePages(data.data,'Broadcast',this.broadcastPageObject);
      console.log(this.emailBroadPageNumber)
      console.log(this.broadcastPageObject);
      this.emailCampaignBroadcast = data.data.content;
      this.setMetrics([...this.emailCampaignBroadcast], 'bc');
      this.emailCommonService.setAllEmails(this.emailCampaignBroadcast, 'BroadCast');
    } else {
      this.commonService.serverError(data);
    }
  }
  calculatePages(data, totalPagesOf,pageObject) {
    if(totalPagesOf == 'Broadcast'){
        this.emailBroadPageNumber = [];
    }else{
      this.emailSequencePageNumber = [];
    }
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
          if(totalPagesOf == 'Broadcast'){
            this.emailBroadPageNumber.push(i);
        }else{
          this.emailSequencePageNumber.push(i);
        }
      }
    }
    pageObject.currentPage = data.number;
    pageObject.isFirstPage = data.first;
    pageObject.isLastPage = data.last;
    window.scrollTo(0, 0);
  }
  activeECtype: any;

  setMetrics(ebc: any, type: any) {
    ebc.forEach(item => {
      // debugger;
      let totalOpenCount = 0, totalClickedCount = 0, totalUnsubscribedCount = 0, totalEmailSent = 0;
      totalOpenCount = item.emailCampaignDtl.reduce((acc, {emailOpenedCount}) => {
        return acc+emailOpenedCount;
      }, 0);
      totalClickedCount = item.emailCampaignDtl.reduce((acc, {emailClickedCount}) => {
        return acc+emailClickedCount;
      }, 0);
      totalUnsubscribedCount = item.emailCampaignDtl.reduce((acc, {emailUnsubCount}) => {
        return acc+emailUnsubCount;
      }, 0);
      totalEmailSent = item.emailCampaignDtl.reduce((acc, {totalEmailSent}) => {
        return acc+totalEmailSent;
      }, 0);
      totalOpenCount = isNaN(totalOpenCount) ? 0 : totalOpenCount;
      totalClickedCount = isNaN(totalClickedCount) ? 0 : totalClickedCount;
      totalUnsubscribedCount = isNaN(totalUnsubscribedCount) ? 0 : totalUnsubscribedCount;
      totalEmailSent = isNaN(totalEmailSent) ? 0 : totalEmailSent;
      if (type == 'bc')
        this.bcMterics.push({totalOpenCount, totalClickedCount, totalUnsubscribedCount, totalEmailSent, id: item.id});
      else
        this.esMetrics.push({totalOpenCount, totalClickedCount, totalUnsubscribedCount, totalEmailSent, id: item.id});
    });
  }

  sequences(activeTab) {
    this.activeTab = activeTab;
    $('#swapp li.active').removeClass('active');
    $('#sequences').addClass('active');
    localStorage.setItem("emailListTab", this.activeTab)
    this.hideActionDropdown(this.emailCampaignSequence, -1, 'sqdpdwn');
    this.hideActionDropdown(this.emailCampaignBroadcast, -1, 'dpdwn');
    this.activeECtype = 'sequence';
  }

  broadcasts(activeTab) {
    this.activeTab = activeTab;
    localStorage.setItem("emailListTab", this.activeTab)
    $('#swapp li.active').removeClass('active');
    $('#broadcasts').addClass('active');
    this.hideActionDropdown(this.emailCampaignSequence, -1, 'sqdpdwn');
    this.hideActionDropdown(this.emailCampaignBroadcast, -1, 'dpdwn');
    this.activeECtype = 'broadcast';
  }

  selectEmailCampaignType(emailCampaignType, id) {
    var sequnceType: any = []
    if (id == 'emailSequence') {
      $("#emailBroadcast").css('border', '');
    } else {
      $("#emailSequence").css('border', '');
    }
    var activeType = document.getElementById(id);
    activeType.style.border = "2px solid #000000";
    this.newEmailCampaign.emailCampaignType.id = emailCampaignType;
  }

  approvedName = true;
  emailTypeSelected = true;
  async createCampaign() {
    var index: number = -1;
    if (!this.newEmailCampaign.emailCampaignType.id) {
      this.emailTypeSelected = false;
    } else {
      // debugger;
      this.emailTypeSelected = true;
      if (this.newEmailCampaign.emailCampaignType.id == 1) {
        index = this.emailCampaignSequence.findIndex(e => e.emailCapaignTitle == this.newEmailCampaign.emailCapaignTitle)
      } else {
        index = this.emailCampaignBroadcast.findIndex(e => e.emailCapaignTitle == this.newEmailCampaign.emailCapaignTitle)
      }
      if (index == -1) {
        this.approvedName = true;
        this.ngxService.start()
        var data: any = await this.service.createEmailCampaign(this.newEmailCampaign);
        console.log(data);
        if (data.status == 'SUCCESS') {
          if (data.data.emailCampaignType != null) {
            if (data.data.emailCampaignType.id == 1) {
              this.emailCampaignSequence.push(data.data)
              this.emailCommonService.updateAllEmails(data.data, 'Sequence');
            }
            else {
              this.emailCommonService.setAllEmails(data.data, 'BroadCast');
              this.emailCampaignBroadcast.push(data.data)
            }
            this.emailCommonService.setEmailCampaign(data.data);
            localStorage.setItem("emailCampaignId", data.data.id);
          }

          $('.cancel').click();
          this.ngxService.stop();
          if (this.newEmailCampaign.emailCampaignType.id == 1) {
            this.router.navigate(['/emailList']);
          } else {
            this.router.navigate(['/EmailBroadcastOne']);
          }
        } else {
          this.commonService.serverError(data);
        }

      } else {
        this.approvedName = false;
      }
    }
  }
  openEmails(emailCampaign, emailType?: any, tab?: any, event?: any) {
    if (event) {
      event.preventDefault();
    }
    localStorage.setItem("emailCampaignId", emailCampaign.id);
    if (emailCampaign.emailCampaignType && emailCampaign.emailCampaignType.id == 2) {
      // This code will get the selected campaign on the top of the list
      var selctedElement = this.emailCampaignBroadcast.findIndex(e=> e.id == emailCampaign.id)
      if(selctedElement > 0){
        var newlySelectedElement = this.emailCampaignBroadcast.splice(selctedElement,1);
        this.emailCampaignBroadcast.unshift(newlySelectedElement[0]);
        this.emailCommonService.updateAllEmailsOrder(this.emailCampaignBroadcast,'Broadcast');
      }
      //
      //this.emailCommonService.setEmailCampaign(emailCampaign);
      if( emailCampaign.emailCampaignDtl.length > 0){
        localStorage.setItem("emailTemplateId", emailCampaign.emailCampaignDtl[0].id);
      }
      this.router.navigate(['/EmailBroadcastOne'], { queryParams: { tab: tab } });
    } else {
      this.router.navigate(['/emailList'], { queryParams: { tab: tab } });
    }
  }

  dupcounter: any = 0;

  duplicateEmail(email, event) {
    if(event) {
      event.preventDefault();
    }
    if (this.activeECtype = 'sequence') {
     // this.emailCampaignSequence.splice(2, 0, "Lemon", "Kiwi");
      // this.emailCampaignSequence
      this.newEmailCampaign = {...email};
      delete this.newEmailCampaign.id;
      this.newEmailCampaign.emailCampaignType.id = 1;
      this.newEmailCampaign.emailCapaignTitle = email+email.emailCapaignTitle+this.dupcounter
      this.dupcounter++;
    } else {
      this.newEmailCampaign = {...email};
      this.newEmailCampaign.emailCampaignType.id = 2;
      this.newEmailCampaign.emailCapaignTitle = email+email.emailCapaignTitle+this.dupcounter
      this.dupcounter++;
    }

    // this.createCampaign();
  }

  hovered: any = {};
  math = Math;
  ecOnHover(email) {
    this.hovered.id = email.id;
  }

  ecOnMOut() {
    this.hovered = {};
  }

  emailSeqEdit(emailCampaign) {
    // This code will get the selected campaign on the top of the list
    var selctedElement = this.emailCampaignSequence.findIndex(e=> e.id == emailCampaign.id)
   
    if(selctedElement > 0){
      var newlySelectedElement = this.emailCampaignSequence.splice(selctedElement,1);
      this.emailCampaignSequence.unshift(newlySelectedElement[0]);
      this.emailCommonService.updateAllEmailsOrder(this.emailCampaignSequence,'Sequence');
    }
    //
    localStorage.setItem("emailCampaignId", emailCampaign.id);
    this.router.navigate(['/emailList']);
  }
  closeEditEmailDropDown(email){
    console.log("Close Drop Down:"+email)
    let state = $('#' + email).css("display");
    if (state == 'block') {
      $('#' + email).hide();
    }
  }

  async deleteCampaign() {
    // if (event) {
    //   event.preventDefault();
    // }

    // Swal.fire({
    //   text: 'Are You Sure You Want To Delete?',
    //   type: 'warning',
    // }).then(async (result) => {
    //   console.log("swal on delete value::", result);
    //   if (result.value) {
        var data: any = await this.service.deleteEmailCampaign(this.emailCampaign.id);
        console.log(data);
        $('.cancel').click();
        if (data.status == "SUCCESS") {
          if (this.emailCampaign.emailCampaignType == null) {
            var obj = this.emailCampaignSequence.find(e => e.id == this.emailCampaign.id);
            let index = this.emailCampaignSequence.indexOf(obj);
            if (index > -1) {
              this.emailCampaignSequence.splice(index, 1);
            }
          } else if (this.emailCampaign.emailCampaignType.id == 1) {
            var obj = this.emailCampaignSequence.find(e => e.id == this.emailCampaign.id);
            let index = this.emailCampaignSequence.indexOf(obj);
            if (index > -1) {
              this.emailCampaignSequence.splice(index, 1);
            }
          } else if (this.emailCampaign.emailCampaignType.id == 2) {
            // debugger;
            var obj = this.emailCampaignBroadcast.find(e => e.id == this.emailCampaign.id);
            let index = this.emailCampaignBroadcast.indexOf(obj);
            if (index > -1) {
              this.emailCampaignBroadcast.splice(index, 1);
            }
          }
          this.emailCommonService.setAllEmails(this.emailCampaignSequence, 'Sequence');
          this.emailCommonService.setAllEmails(this.emailCampaignBroadcast, 'BroadCast');
        } else {
          this.commonService.serverError(data);
        }
    //   }
    // })

  }
  selectCampaignForDeleting(email){
    this.emailCampaign = email;
  }
  async duplicateCampaign(email?: any){
    if(email){
      this.newEmailCampaign.emailCapaignTitle = email.emailCapaignTitle+' (copy)';
      this.newEmailCampaign.id = email.id;
      this.newEmailCampaign.emailCampaignType = email.emailCampaignType;
    }else{
        var data:any =await this.service.duplicateEmail(this.newEmailCampaign.id, this.newEmailCampaign.emailCapaignTitle);
        console.log(data);
        $('.cancel').click();
        if(data.status == 'SUCCESS'){
          //this.emailCampaign.unshift(data.data.emailCampaign);
          if (data.data.emailCampaignType != null) {
            if (data.data.emailCampaignType.id == 1) {
              this.emailCampaignSequence.push(data.data)
              this.emailCommonService.updateAllEmails(data.data, 'Sequence');
            }
            else {
              this.emailCommonService.setAllEmails(data.data, 'BroadCast');
              this.emailCampaignBroadcast.push(data.data)
            }
            this.emailCommonService.setEmailCampaign(data.data);
            localStorage.setItem("emailCampaignId", data.data.id);
          }
          if (this.newEmailCampaign.emailCampaignType.id == 1) {
            this.router.navigate(['/emailList']);
          } else {
            this.router.navigate(['/EmailBroadcastOne']);
          }
        }else{
          this.commonService.serverError(data);
        }
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

    let emailData: any;

    if (this.activeECtype = 'sequence') {
      emailData = this.emailCampaignSequence;
    } else {
      emailData = this.emailCampaignBroadcast;
    }
    this.hideActionDropdown(emailData, index, type);
  }

  async changeEmSeq(event: any, email: any) {
    let body = {
      id: email.id,
      status: event.target.value
    };
    var data: any = await this.service.createEmailCampaign(body);
    console.log("successfully updated emSeq status", data);
    if(data.status == 'SUCCESS'){
      email.status = event.target.value;
    }else{
      this.commonService.serverError(data);
    }
  }

  months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  getModifiedDate(email) {

    if(email.emailBroadcastDate != null && email.emailBroadcastTime != null){
      var date = email.emailBroadcastDate+"T"+email.emailBroadcastTime;

      let d = new Date(date);
  
      let hours: any = d.getHours();
      let minutes: any = d.getMinutes();
      let ampm: any = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;
  
      return this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " " + strTime;
    }else{
      return "-";
    }
    
  }
}
