import { Component, OnInit, AfterViewInit } from '@angular/core';
// import service
import { WebinarAPIService } from "src/app/services/coach/webinar/webinar-api.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-webinar',
  templateUrl: './list-webinar.component.html',
  styleUrls: ['./list-webinar.component.css']
})
export class ListWebinarComponent implements OnInit, AfterViewInit {

  webinarList: any;

  displayedColumns: string[] = ['WebinarTitle', 'Actions'];

  constructor(
    private webinarAPIService: WebinarAPIService,
    private router: Router
  ) { }

  async ngOnInit() {
  }

  async ngAfterViewInit() {

    // get webinar list,
    // passing 'all' as status
    let status = 'all';
    let data: any = await this.webinarAPIService.getWebinarList(status);


    let webinar = data;

    this.webinarList = webinar.data;

    this.webinarList.forEach(element =>{
      console.log(element.id);
  })
  }

  editWebinar(webinarId){
    console.log(webinarId);
    Object.keys(localStorage)
      .forEach(function(k) {
        console.log(k);
        if(k != 'token' && k != 'currentUser') 
        localStorage.removeItem(k);
    });
    localStorage.setItem("webinarId", webinarId);
    localStorage.setItem("edit", "true");
    if (webinarId) {

        this.router.navigate(['/webinarSetup/WebinarInfo']);
    }
  }

  newWebinar()
  {
    localStorage.removeItem("webinarId");
    // localStorage.removeItem("quizConfiguration");
    Object.keys(localStorage)
      .forEach(function(k) {
        console.log(k);
        if(k != 'token' && k != 'currentUser') 
        localStorage.removeItem(k);
    });
    localStorage.setItem("edit", "false");
    this.router.navigate(['/webinarSetup/WebinarInfo']);
  }

}
