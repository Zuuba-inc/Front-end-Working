import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import * as $ from 'jquery';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';

@Component({
  selector: 'app-subscribe-to-email',
  templateUrl: './subscribe-to-email.component.html',
  styleUrls: ['./subscribe-to-email.component.css']
})
export class SubscribeToEmailComponent implements OnInit {

  constructor(private service :EmailCampaignService,
              private commonService : CommonService,
              private emailCommmonService :EmailCommonService,
              private router: Router,
              private route: ActivatedRoute,) { }
  changeDetails = false;
  subscribeToken;
  emailCampaign:any={};
  unsubscribedEmailCampaigns : any =[];
  reactivateCampaign = false;
  userData:any={};
  manageSubscription:boolean;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params["subscribeToken"]);
      if(params["subscribeToken"] ){
        this.subscribeToken = params["subscribeToken"];
          this.manageSubscription = false;
        this.getEmailCampaigns();
      }else{
        this.manageSubscription = true;
        this.getUnsubscribedEmailData();
      }
    });
  }

  async getUnsubscribedEmailData(){
    //var data:any = await this.emailCommmonService.getUnsubscribedEmailData();
    var data:any = JSON.parse(localStorage.getItem("unsubscribedData"));
    console.log("Get Unsubscribed Email Data ",data);
    this.unsubscribedEmailCampaigns = data;
    document.getElementById("subscribedSuccessfully").style.display = 'none';
    document.getElementById("unSubscribedSuccessfully").style.display = 'block';
  }
  async getEmailCampaigns(){
    var data: any = await this.service.subscribersToEmailCampaign(this.subscribeToken);
    console.log(data);
    if(data.status == 'SUCCESS'){
      var allCampaigns = data.data;
      if (data.data.length == 1){
        this.emailCampaign = data.data[0].UserEmailCampaignSubscription.emailCampaignMst;
        this.userData = data.data[0].user;
        this.userData.subscribeToken = this.subscribeToken;
        this.emailCommmonService.setUnsubscribeUserData(this.userData);
        if(data.data[0].UserEmailCampaignSubscription.subscribed == true)
        this.reactivateCampaign = false;
        else
        this.reactivateCampaign = true;
      }
      // allCampaigns.forEach(element => {
      //   if(Object.keys(element).length > 0 ){
      //     this.emailCampaign = element.emailCampaign;
      //   }
      // });
      console.log(this.emailCampaign)
    }else{
      this.commonService.serverError(data);
    }
}
  async unsubscribeFromEmail(email, reactivate?: string){
    var selectedEmail = [];
    if(email == null)
    selectedEmail.push(0);
    console.log(email);
    var data: any;
    if(this.manageSubscription == false)
     data =await this.service.unSubscribersFromEmailCampaign(this.subscribeToken,selectedEmail,'SubscriberToken',this.reactivateCampaign);
    
    else{
      selectedEmail.push(email.emailCampaignMst.id);
      var subscribeFlag;
      if(email.subscribed == false){   subscribeFlag = true;  }
      else { subscribeFlag = false;  }
      data = await this.service.unSubscribersFromEmailCampaign(email.subscribeToken,selectedEmail,'SubscriberToken',subscribeFlag);
    }
      console.log(data);
    if(data.status == 'SUCCESS'){
      if(this.manageSubscription == false){
        if(data.data.UserEmailCampaignSubscription.subscribed == false){
          this.reactivateCampaign = true;
        }else{
          this.reactivateCampaign = false;
        }
      }else{
          var updatedData = data.data.UserEmailCampaignSubscription[0];
          this.unsubscribedEmailCampaigns.forEach(element => {
               if(element.id == updatedData.id){
                 element.subscribed = updatedData.subscribed;
               }
          });
          console.log(this.unsubscribedEmailCampaigns);
          localStorage.setItem("unsubscribedData", JSON.stringify(this.unsubscribedEmailCampaigns));
      }
      
      if(reactivate == 'UnsubscribeFromALl'){
        this.router.navigate(['sucessfullyUnsubscribed']);
      }
    }else{
      this.commonService.serverError(data);
    }
  }
}
