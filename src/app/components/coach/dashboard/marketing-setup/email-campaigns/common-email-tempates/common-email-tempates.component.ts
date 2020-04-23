import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmailCommonService } from '../../../../../../services/coach/emailCampaign/email-common.service';

@Component({
  selector: 'app-common-email-tempates',
  templateUrl: './common-email-tempates.component.html',
  styleUrls: ['./common-email-tempates.component.css']
})
export class CommonEmailTempatesComponent implements OnInit {

  @Output() templateEv = new EventEmitter<any>();
  allEmailTemplate : any=[];
  constructor(public emailCommonService: EmailCommonService) { }

  ngOnInit() {
    this.getAllEmailTemplates();
  }
  async getAllEmailTemplates(){
    this.allEmailTemplate = await this.emailCommonService.getAllEmailTemplates();
    console.log(this.allEmailTemplate);
  }
  editEmail(template) {
    // debugger
    console.log(template);
    if(template){
      this.templateEv.emit(template);
    }else{
      this.templateEv.emit("startFromScratch");
    }
    
  }

}
