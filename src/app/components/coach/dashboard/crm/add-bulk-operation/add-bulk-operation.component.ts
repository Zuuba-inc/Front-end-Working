import { Component, OnInit } from '@angular/core';
import { EmailCampaignService } from '../../../../../services/coach/emailCampaign/email-campaign.service';
import { CommonService } from '../../../../../services/global/common.service';
import { EmailCommonService } from '../../../../../services/coach/emailCampaign/email-common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-bulk-operation',
  templateUrl: './add-bulk-operation.component.html',
  styleUrls: ['./add-bulk-operation.component.css']
})
export class AddBulkOperationComponent implements OnInit {
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
  addBulkOperationStatus = 'addSegmentationRule';
  
  constructor(public service: EmailCampaignService,
    public commonService: CommonService,
    public router: Router,
    public emailCommonService: EmailCommonService) { }
  showFilter = false;
  ngOnInit() {
   
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
  changeShowFilter(value: boolean){
    this.showFilter = value;
  }
  next(section){
    this.addBulkOperationStatus = section;
  }
}
