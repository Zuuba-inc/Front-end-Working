import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { CommonService } from '../../../../services/global/common.service';
@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class CrmComponent implements OnInit {

  constructor( private router: Router,
    private commonService: CommonService) { }
    showSideBar = true;
  ngOnInit() {
    this.activateCurrentRoute();
  }

activateCurrentRoute(){
    var currentUrl = this.router.url;
    console.log(currentUrl);
    if($(".submenu__item").hasClass("active")){
      $(".submenu__item").removeClass("active");
    }
    if(currentUrl == '/crm/contacts'){
      $("#active").addClass("active");
      this.router.navigate(['/crm/contacts']);
    }else if(currentUrl == "/crm/segments"){
      $("#segments").addClass("active");
    }else if(currentUrl == "/crm/tags"){
      $("#tags").addClass("active");
    }else if(currentUrl == "/crm/fields"){
      $("#fields").addClass("active");
    }else if(currentUrl == "/crm/bulkOperations"){
      $("#bulkOperations").addClass("active");
    }else if(currentUrl == "/crm/pruningOperation"){
      $("#pruningOperations").addClass("active");
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
      if(event.target.innerText == 'Active'){
        this.router.navigate(['/crm/contacts']);
      }else if(event.target.innerText == 'Segments'){
        this.router.navigate(['/crm/segments']);
      }else if(event.target.innerText == 'Tags'){
        this.router.navigate(['/crm/tags']);
      }else if(event.target.innerText == 'Fields'){
        this.router.navigate(['/crm/fields']);
      }else if(event.target.innerText == 'Bulk Operations'){
        this.router.navigate(['/crm/bulkOperations']);
      }else if(event.target.innerText == 'Pruning Operations'){
        this.router.navigate(['/crm/pruningOperation']);
      }
  }
}
