import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import * as $ from 'jquery';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';

@Component({
  selector: 'app-unsubscribe-to-email',
  templateUrl: './unsubscribe-to-email.component.html',
  styleUrls: ['./unsubscribe-to-email.component.css']
})
export class UnsubscribeToEmailComponent implements OnInit {
  trackToken;
  emailCampaigns = [];
  selectedCampaigns:any = [];
  userData:any={};
  constructor(private service :EmailCampaignService,
              private commonService : CommonService,
              private emailCommmonService :EmailCommonService,
              private router: Router,
              private route: ActivatedRoute,) { }
  ngOnInit() {
    $( "#unsubscribeFromCurrent").prop('checked', true);
    document.getElementById("unsubscribeOptions").style.display = 'block';
    this.route.queryParams.subscribe(params => {
      console.log(params["trackToken"]);
      if(params["trackToken"] ){
        this.trackToken = params["trackToken"];
        this.getEmailCampaigns();
      }
    });
  }
  async getEmailCampaigns(){
      var data: any =await this.service.getEmailCampaignForSubscribers(this.trackToken);
      console.log(data);
      if(data.status == 'SUCCESS'){
          this.emailCampaigns = data.data.EmailCampaign;
         // this.emailCampaigns = data.data.UserEmailCampaignSubscription;
          this.userData = data.data.user;
         //this.userData = data.data.user;
          this.emailCommmonService.setUnsubscribeUserData(this.userData);
          if(this.emailCampaigns.length == 1){
            this.router.navigate(['sucessfullyUnsubscribed'])
          }else{
          $( "#unsubscribeFromCurrent").prop('checked', true);
          document.getElementById("unsubscribeOptions").style.display = 'block';
          setTimeout(()=>{
            this.emailCampaigns.forEach(email =>{
              if(email.selected == true){
                $( "#email"+email.emailCampaign.id).prop('checked', true);
                this.selectedCampaigns.push(email.emailCampaign.id);
              }
            })
          },200); 
          }
          
      }else{
        this.commonService.serverError(data);
      }
  }
  unsubscribefrom(from){
    if(from == 'Current'){
      document.getElementById("unsubscribeOptions").style.display = 'block';
      this.selectedCampaigns = [];
      setTimeout(()=>{
        this.emailCampaigns.forEach(email =>{
          if(email.selected == true){
            $( "#email"+email.emailCampaign.id).prop('checked', true);
            this.selectedCampaigns.push(email.emailCampaign.id);
          }
        })
      },200);
    }else{
      document.getElementById("unsubscribeOptions").style.display = 'none';
      this.selectedCampaigns = [];
      this.selectedCampaigns.push(0);
    }
  }
  async confirmUnsubscribe(){
    //this.router.navigate(['/sucessfullyUnsubscribed']);
    if(this.selectedCampaigns.length == 0 ){ this.selectedCampaigns.push(0);  }
      var data :any = await this.service.unSubscribersFromEmailCampaign(this.trackToken,this.selectedCampaigns,'trackToken',false);
      if(data.status == 'SUCCESS'){
        this.router.navigate(['/sucessfullyUnsubscribed']);
      }else{
        this.commonService.serverError(data);
      }
  }
  selectEmail(event,emailId){
    console.log(event);
    if(event.srcElement.checked == true){
      this.selectedCampaigns.push(emailId)
    }else{
      var index = this.selectedCampaigns.findIndex(e => e == emailId);
      if(index > -1){
        this.selectedCampaigns.splice(index,1);
      }
    }
    console.log(this.selectedCampaigns);
  }
}
