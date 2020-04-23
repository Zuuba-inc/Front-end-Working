import { Component, OnInit } from '@angular/core';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';
import * as $ from 'jquery';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-change-subscriber-details',
  templateUrl: './change-subscriber-details.component.html',
  styleUrls: ['./change-subscriber-details.component.css']
})
export class ChangeSubscriberDetailsComponent implements OnInit {

  constructor(private service :EmailCampaignService,
              private commonService : CommonService,
              private emailCommmonService :EmailCommonService,
              private router: Router,
              private route: ActivatedRoute,) { }
    userEmail;
    subscribeToken;
  async ngOnInit() {
    var userData:any  = await this.emailCommmonService.getUnsubscribeUserData();
    this.userEmail = userData.email;
    this.subscribeToken = userData.subscribeToken;
  }
  async saveMyDetails(){
    var data:any = await this.service.updateDataForSubscribedUser(this.subscribeToken,this.userEmail);
    console.log(data);
    if(data.status == 'SUCCESS'){
        console.log(data.data);
        this.emailCommmonService.setUnsubscribeUserData(data.data);
    }else{
      this.commonService.serverError(data);
    }
  }
}
