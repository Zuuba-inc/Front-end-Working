import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'coachforce';

  constructor(public router: Router)
  {

  }

  ngOnInit(){
    // alert("Hello : "+  window.location.host);
    var userNameLists = ['vaishali','tarek' , 'akhil'] ;
    var url = window.location.host;
    //var url = 'vaishali.zuuba.com';
    // alert(url.split('.').length + ' : ' + (userNameLists.indexOf('localhost') < 0));
    
    if(url.split('.').length == 3 &&  url.split('.')[0] != 'www' && userNameLists.indexOf(url.split('.')[0]) < 0)
    {
      // alert('inside');
      this.router.navigate(['/errorPage']); 
    }
  }

}
