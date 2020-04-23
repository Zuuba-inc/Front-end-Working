import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import * as $ from 'jquery';
import { CommonService } from '../../../../services/global/common.service';
@Component({
  selector: 'app-marketing-setup',
  templateUrl: './marketing-setup.component.html',
  styleUrls: ['./marketing-setup.component.css']
})
export class MarketingSetupComponent implements OnInit {

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    console.log(this.router.url);
    this.activateCurrentRoute();
    // TODO: ADD SIDE BAR CONFIGURABLE FROM JSON OBJ
  }
  activateCurrentRoute(){
    var currentUrl = this.router.url;
    if($(".submenu__item").hasClass("active")){
      $(".submenu__item").removeClass("active");
    }
    if(currentUrl.includes("emailCampaigns")){
      $("#emailCampaign").addClass("active");
    }else if(currentUrl.includes("funnels")){
      $("#funnels").addClass("active");
    }

  }
  navigateTo(event){
    console.log(event);
      if($(".submenu__item").hasClass("active")){
        $(".submenu__item").removeClass("active");
      }
      if(!$(event.target).hasClass("active")){
        $(event.target).addClass("active")
      }
      if(event.target.innerText == 'Funnels'){
        this.router.navigate(['/marketingSetup/funnels']);
      }else if(event.target.innerText == 'Email Campaigns'){
        this.router.navigate(['/marketingSetup/emailCampaigns']);
      }
  }
}
