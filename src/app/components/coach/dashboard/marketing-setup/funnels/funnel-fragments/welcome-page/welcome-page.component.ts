import { Component, OnInit, Input,HostListener } from '@angular/core';

import { FragmentComponent }      from 'src/app/services/global/interfaces/fragment-component';
import {FunnelService} from '../../../../../../../services/coach/funnel/funnel.service';
import {CommonService} from '../../../../../../../services/global/common.service';
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit, FragmentComponent {
  @Input() data: any;
  @HostListener('document:click', ['$event'])
  clazz : any;
  onMouseClick(e) {
    var modal = document.getElementById('autoMationRules');
   if(e.target == modal){
    modal.style.display = "none";
   }
   
  }
  constructor(public service:FunnelService,
              public commonService: CommonService) { }

  people$: any = [ {
                      'id': '5a15b13c36e7a7f00cf0d7cb',
                      'index': 2,
                      'isActive': true,
                      'picture': 'http://placehold.it/32x32',
                      'age': 23,
                      'name': 'Karyn Wright',
                      'gender': 'female',
                      'company': 'ZOLAR',
                      'email': 'karynwright@zolar.com',
                      'phone': '+1 (851) 583-2547'
                  },
                  {
                      'id': '5a15b13c2340978ec3d2c0ea',
                      'index': 3,
                      'isActive': false,
                      'picture': 'http://placehold.it/32x32',
                      'age': 35,
                      'name': 'Rochelle Estes',
                      'disabled': true,
                      'gender': 'female',
                      'company': 'EXTRAWEAR',
                      'email': 'rochelleestes@extrawear.com',
                      'phone': '+1 (849) 408-2029'
                  },
                  {
                      'id': '5a15b13c663ea0af9ad0dae8',
                      'index': 4,
                      'isActive': false,
                      'picture': 'http://placehold.it/32x32',
                      'age': 25,
                      'name': 'Mendoza Ruiz',
                      'gender': 'male',
                      'company': 'ZYTRAX',
                      'email': 'mendozaruiz@zytrax.com',
                      'phone': '+1 (904) 536-2020'
                  },
                  {
                      'id': '5a15b13cc9eeb36511d65acf',
                      'index': 5,
                      'isActive': false,
                      'picture': 'http://placehold.it/32x32',
                      'age': 39,
                      'name': 'Rosales Russell',
                      'gender': 'male',
                      'company': 'ELEMANTRA',
                      'email': 'rosalesrussell@elemantra.com',
                      'phone': '+1 (868) 473-3073'
                  }]

  selectedPersonId = '5a15b13c36e7a7f00cf0d7cb'

  showOptions: boolean = false;
  whenRules = [];
  thenRules = [];
  whenRule;
  thenRule;
  whenRuleFor;

  actionIcons: any = [{
    className: "zu-tag-action"
  }, {
    className: "zu-mail-action"
  }, {
    className: "zu-video-page"
  }];

  
  ngOnInit() {
    this.showWhenOptions();
  }

  // used to toggle fragment options
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  savePrivatePublic(){
    
  }
  async showWhenOptions(){
      var response:any = await this.service.getFunnelWhenOptions();
      console.log(response);
      if(response.status == 'SUCCESS'){
       
        this.whenRules = response.data.WHEN;
        this.thenRules = response.data.THEN;
        this.whenRules.forEach(e =>{
          e.autoDtlDesc.forEach(ele =>{
            if(ele.description == 'Form is submitted' && e.whenTitle == 'Webinar'){
                this.whenRule = ele.description;
            }
          })
        })
        console.log(this.whenRule);
      }else{
        this.commonService.serverError(response);
      }
  }
  openModel(){
    var modal = document.getElementById("autoMationRules");
    if(modal.style.display == 'none'){
      modal.style.display = 'block';
    }else{
      modal.style.display = 'none';
    }
  }

  showWhenDropDown(){
    console.log(document.getElementById("whenDropDown1").style.display)
    if(document.getElementById("whenDropDown1").style.display == 'block'){
      document.getElementById("whenDropDown1").style.display = 'none'
    }else{
      document.getElementById("whenDropDown1").style.display = 'block'
    }
    
  }
  showThenDropDown(){
    console.log(document.getElementById("thenDropDown").style.display)
    if(document.getElementById("thenDropDown").style.display == 'block'){
      document.getElementById("thenDropDown").style.display = 'none'
    }else{
      document.getElementById("thenDropDown").style.display = 'block'
    }
    
  }
 
}
