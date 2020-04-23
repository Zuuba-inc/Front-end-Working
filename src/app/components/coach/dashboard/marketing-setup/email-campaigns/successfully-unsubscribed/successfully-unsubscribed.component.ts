import { Component, OnInit } from '@angular/core';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';
import { EmailCampaignService } from '../../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../../services/global/common.service';

@Component({
  selector: 'app-successfully-unsubscribed',
  templateUrl: './successfully-unsubscribed.component.html',
  styleUrls: ['./successfully-unsubscribed.component.css']
})
export class SuccessfullyUnsubscribedComponent implements OnInit {

  constructor( private emailCommmonService :EmailCommonService,
                private service :EmailCampaignService,
                private commonService : CommonService,) { }
  userData:any={};
  async ngOnInit() {
    this.userData = await this.emailCommmonService.getUnsubscribeUserData();
    this.emailCommmonService.resetUnsubscribeUserData();
  }
  async clickToReport(){
    var data : any = await this.service.reportEmailAsSpam(this.userData.id);
    console.log(data);
    if(data.status == 'SUCCESS'){
      document.getElementById("clickToReport").style.display = 'block';
      document.getElementById("sorryToSeeYouGo").style.display = 'none';
      localStorage.setItem("unsubscribedData", JSON.stringify(data.data));
     // this.emailCommmonService.setUnsubscribedEmailData(data.data);
    }else{
      this.commonService.serverError(data);
    }
  }
}
