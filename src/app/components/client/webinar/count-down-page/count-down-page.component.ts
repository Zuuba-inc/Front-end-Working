import { Component, OnInit } from '@angular/core';
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-count-down-page',
  templateUrl: './count-down-page.component.html',
  styleUrls: ['./count-down-page.component.css']
})
export class CountDownPageComponent implements OnInit {
distance:any;
  constructor( private route: ActivatedRoute,
    private router: Router,) { }
  registeredTime;
  firstName;lastName;
  ngOnInit() {
    this.coutdown();
  }

  coutdown(){
    this.registeredTime = localStorage.getItem('webinarRegistrationTime')    
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
   // console.log(this.registeredTime)  
    console.log("Hello")
    console.log(this.registeredTime)  
             var countDownTime = new Date(this.registeredTime).getTime();
             console.log(this.registeredTime)
             setInterval(function() {
                // Get todays date and time
                var now = new Date().getTime();

                // Find the distance between now an the count down 
                  console.log(countDownTime)
                this.distance = countDownTime - now;
                console.log(this.distance)
                // Time calculations for days, hours, minutes and seconds
                var days, hours , minutes, seconds;

                if(this.distance)
                {
                    days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
                    hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
                    seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
                    document.getElementById("daysLeft").innerHTML = days;
                    document.getElementById("hoursLeft").innerHTML = hours;
                    document.getElementById("minLeft").innerHTML = minutes;
                    document.getElementById("secLeft").innerHTML = seconds;
                }
                if (this.distance < 0) {
                    //clearInterval(x);
                   document.getElementById("webinarTimer").innerHTML = "Webinar is going to start";
                   this.router.navigate(['/OpentokDemo']);
                }
            }, 1000);
  }
}
