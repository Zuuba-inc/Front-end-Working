import { Injectable } from '@angular/core';
import { FunnelService } from '../../../services/coach/funnel/funnel.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import components to be rendered dynamically
import { RegistrationPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/registration-page/registration-page.component'
import { EmailsComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/emails/emails.component';
import { WelcomePageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/welcome-page/welcome-page.component';
import { WebinarPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/webinar-page/webinar-page.component';
import { QuizPageComponent } from 'src/app/components/coach/dashboard/marketing-setup/funnels/funnel-fragments/quiz-page/quiz-page.component';

// import class for initializing component
import { Fragment } from 'src/app/services/global/classes/fragment';

@Injectable({
  providedIn: 'root'
})
export class FunnelFragmentsService {
  funnelId;
  data: any = {};
  funnelSteps = [];
  funnel: any;
  funnelFragment: any = [];
  constructor(public funnelService: FunnelService,
    public router: Router) { }

  // TODO: REMOVE THIS FUNCTION SINCE IT IS NOT USED ANYWHERE
  // returns list of components to be rendered as fragments for a given funnel
  async getFragments(funnelId) {

    console.log("inside getFragments", funnelId);

    // TODO: ADD FRAGMENTS GET API THAT FETCHES STEPS RELATED DATa
    let funnelSteps = [
      {
        "id": 1,
        "stepName": "Registration Page",
        "className": "zu-webpage",
        "stepDetailTitle": "WEBINAR REGISTRATION PAGE",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 1"
      },
      {
        "id": 2,
        "stepName": "8 Emails",
        "className": "zu-mail",
        "stepDetailTitle": "EMAILS",
        "stepDetailDescription": "Welcome Email<br/>4 emails before webinar<br/>4 emails after webinar",
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 2"
      },
      {
        "id": 3,
        "stepName": "Thank You Page",
        "className": "zu-webpage",
        "stepDetailTitle": "THANK YOU",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 3"
      },
      {
        "id": 4,
        "stepName": "Webinar",
        "className": "zu-video-page",
        "stepDetailTitle": "WEBINAR",
        "stepDetailDescription": null,
        "stepDetailImage": "joel-filipe-196000-unsplash.jpg",
        "stepNo": "Funnel Step 4"
      }
    ]

    // get components based on funnelType
    // based on funnelType. get requiredComponents for that type
    let response = await this.funnelService.getFunnelSteps(funnelId);

    this.data = JSON.parse(response['_body']);

    // console.log(this.data)
    if (this.data.status == 'SUCCESS') {
      this.funnelSteps = this.data.data;
      console.log("found funnelSteps", this.funnelSteps, "with funnelId", funnelId);

      if (funnelId == 1) {
        return [
          new Fragment(RegistrationPageComponent, funnelSteps[0]),
          // new Fragment(EmailsComponent),
          // new Fragment(WelcomePageComponent),
          // new Fragment(WebinarPageComponent)
        ];
      } else if (funnelId == 2) {
        return [
          // new Fragment(WelcomePageComponent),
          // new Fragment(QuizPageComponent),
          // new Fragment(EmailsComponent),
          new Fragment(RegistrationPageComponent, funnelSteps[0]),
          // new Fragment(EmailsComponent),
          // new Fragment(WebinarPageComponent),
        ];
      }
    }
  }

  // this returns funnelSteps based on funnelType id
  // for webinar, id is 1
  // for quiz+webinar, id is 2, etc.,
  // getFragmentSteps() {
  //   this.funnelService.getFunnelSteps(this.funnelId).subscribe(response =>{
  //     this.data = JSON.parse(response['_body']);
  //     // console.log(this.data)
  //      if(this.data.status == 'SUCCESS'){
  //       this.funnelSteps = this.data.data;
  //       console.log(this.funnelSteps)
  //      }else{
  //        this.serverError(this.data);
  //      }
  //   })
  // }
  saveFunnelFragmentData(funnelFragment) {
    this.funnelFragment = funnelFragment;
    console.log(this.funnelFragment);
  }
  async getFunneFragmentData(): Promise<any> {
    if (this.funnelFragment.length == 0) {
      let response: any = await this.funnelService.getFunnelSteps("2");
      if (response.status == 'SUCCESS') {
        this.funnelFragment = response.data.funnelSteps;
        var funnelComponentDetails = [];
        this.funnelFragment.forEach(data => {
          if (data.data.steps) {
            if (data.data.steps.stepName == "Webinar") {
              var obj: any = {
                id: data.data.webinarData.webinar.id,
                name: data.data.webinarData.webinar.webinarTitle,
              }
              if (data.data.webinarData.webinar.webinarCardImgUploadPath != null) {
                obj.image = data.data.webinarData.webinar.webinarCardImgUploadPath
              } else {
                obj.image = data.data.steps.stepDetailImage;
              }
              funnelComponentDetails.push(obj)
            } else if (data.data.steps.stepName == "Quiz") {
              var obj: any = {
                id: data.data.quizData.quiz.id,
                name: data.data.quizData.quiz.quizTitle,
              }
              if (data.data.quizData.quiz.quizMediaAttached != null) {
                obj.image = data.data.quizData.quiz.quizMediaAttached
              } else {
                obj.image = data.data.steps.stepDetailImage;
              }
              funnelComponentDetails.push(obj)
            }
          } else {
            var obj: any = {
              id: data.data.id,
              name: data.data.stepDetailTitle,
              image: data.data.stepDetailImage
            }
            funnelComponentDetails.push(obj)
          }
        })

        this.funnelFragment = funnelComponentDetails;
      }
    }
    return this.funnelFragment;
  }
  saveFunnelData(funnel) {
    this.funnel = funnel;
  }
  async getFunnelData(): Promise<any> {
    console.log(this.funnel);
    if (this.funnel == undefined) {
      var id = localStorage.getItem("funnel");
      console.log(id);
      var data: any = await this.funnelService.getFunnelById(id, 'all');
      console.log(data)
      if (data.status == 'SUCCESS') {
        this.funnel = data.data.funnel;
        this.saveFunnelData(this.funnel);
      } else {
        this.serverError(data);
      }
    }
    return this.funnel;
  }

  async getFunnelDataFromAPI(): Promise<any> {
    var id = localStorage.getItem("funnel");
    console.log(id);
    var data: any = await this.funnelService.getFunnelById(id, 'all');
    console.log(data)
    if (data.status == 'SUCCESS') {
      this.funnel = data.data.funnel;
      this.saveFunnelData(this.funnel);
    } else {
      this.serverError(data);
    }
    return this.funnel;
  }
  //Handeler that handels erorr if the status code of the api is not SUCCESS
  serverError(data) {
    Swal.fire({
      text: data.message,
      type: 'warning',

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/'])
      }
    })
  }
}
