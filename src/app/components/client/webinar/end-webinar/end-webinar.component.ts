import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { WebinarAPIService } from "../../../../services/coach/webinar/webinar-api.service";
import * as $ from 'jquery';
@Component({
  selector: 'app-end-webinar',
  templateUrl: './end-webinar.component.html',
  styleUrls: ['./end-webinar.component.css']
})
export class EndWebinarComponent implements OnInit {
  type;
  offer;
  webinarId;
  webinarOffer:any={};
  constructor(private route: ActivatedRoute,
              private webinar: WebinarAPIService) {

                console.log("in constructor od end webinar")

                this.route.queryParams.subscribe(params => {
                  if (params['type']) {
                    this.type = params['type'];
                  }
                  if (params['offer']) {
                    this.offer = params['offer'];
                    console.log(this.offer)
                  }
                  this.showMessage();
                });
               }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   if (params['type']) {
    //     this.type = params['type'];
    //   }
    //   if (params['offer']) {
    //     this.offer = params['offer'];
    //     console.log(this.offer)
    //   }
    //   this.showMessage();
    // });

  }

  async showMessage(){
    //alert(this.type)
    if(this.type == 'EndWebinar'){
      console.log(this.offer)
        if(this.offer == 'true'){
          //alert("true")
          this.webinarId = localStorage.getItem("webinarId");
          let dataQuiz: any = await this.webinar.getWebinar(this.webinarId, "Offer");
          // .subscribe(dataQuiz => {
            //console.log(dataQuiz)
          if (dataQuiz) {
            var data = dataQuiz
            if(data.status == 'SUCCESS'){
              this.webinarOffer = data.data.webinarOffer;
              $(".invite__btn").css("background-color", this.webinarOffer.offerBtnColor);
            }
            
               // this.webinarOffer = 
          // })
          }
        }else{
          setTimeout( () => {
             $("#endWebinarOfferDiv").hide();
             $("#endWebinarDiv").show();
            }, 2000 );
           
        }
    }else{
      setTimeout( () => {
        $("#endWebinarOfferDiv").hide();
        $("#endWebinarDiv").show();
        $("#message").text("This webinar has expired");
       }, 2000 );
     
    }
  }

  countActionUser() {
    var time = localStorage.getItem("webinarRegistrationTime");
    this.webinar.countUser(this.webinarId, 'offerPage',time).subscribe(register => {
      console.log(register)
    })
  }
}
