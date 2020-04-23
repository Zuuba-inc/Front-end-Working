import { Component, OnInit } from '@angular/core';

// import jquery
import * as $ from 'jquery';

import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';

import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  webinarMst: any = {};

  checked: boolean = true;

  callActionList = [{
    "id": 1,
    "label": "Signup" 
  }, {
    "id": 2,
    "label": "Quiz" 
  }]

  webinarObj: any;

  webinarId: any;

  webinarResObj: any;

  // set recently updated property in keyupfunction
  recentlyUpdatedModule: any = "webinarMstOffer";

  // use this for setting post url 
  moduleUrl: any = "/webinarOffer";

  // use this as getParam for webinar
  getParam: any = "Offer";

  constructor(
    private webinarAPI: WebinarAPIService,
    private webinarConfigureService: WebinarConfigureService,
    private authService: AuthapiserviceService,
    private router: Router
  ) { }

  async ngOnInit() {

    // initialization logic

    // get webinarMstType data from service
    this.webinarMst = this.webinarConfigureService.webinarMstOffer;

    // this.webinarMst.webinarOffer = {"title":"","description":"", "callToActionLabel": "", "offerBtnColor": ""}
    this.webinarMst.webinarSectionStatus = [{"childTableName":"webinar_registration_host_details","status":"true"},{"childTableName":"webinar_registration_testi_details","status":"true"},{"childTableName":"webinar_call_action","status":"true"},{"childTableName":"webinar_thank_you_file","status":"true"},{"childTableName":"webinar_offer_part","status":"true"}];
  
    // get data from service, else
    // if this.webinarMst.webinarOffer is undefined initialize it to empty oject
    // if (Object.keys(this.webinarConfigureService.webinarMst.webinarOffer).length == 0)
    // if (!this.webinarConfigureService.webinarMst.webinarOffer)
    //   this.webinarMst.webinarOffer = {};
    // else {
    //     this.webinarObj = {};
    //    this.webinarObj =  this.webinarConfigureService.webinarMst.webinarOffer;
    //    this.webinarMst.webinarOffer = this.webinarObj
    // }

    // get data from API
    // get webinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    // console.log("in ngOnInit of offer, found webinarId", this.webinarId, "and this.webinarMst", this.webinarMst);

     // set webinar id if it exists
     if (this.webinarId) {

      this.webinarMst.id = this.webinarId;
    }

    //this.cookie.delete('access_token','/');
    //localStorage.removeItem("token");
    // console.log(JSON.parse(this.authService.getToken()));
    // console.log(JSON.parse(localStorage.getItem('currentUser')));

    if (this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    }

    // webinarId exists, get data based on webinarId and store in webinarservice
    // and on page refresh make an api if data does not exist in webinarservice
    // this is used for page refresh handling data binding
    if (this.webinarMst.webinarOffer && (this.webinarMst.fromService == true)
        && this.webinarId) {

      // if webinarMst is empty on service like in  case of page refresh
      // and webinarId exists make an API call
      // get data from webinar service
      let dataQuiz: any = await this.webinarAPI.getWebinar(this.webinarId, "Offer")
      // .subscribe(dataQuiz => {
        // console.log(dataQuiz);

        if (dataQuiz) {
        var webinar = dataQuiz;
        if (webinar.status == 'SUCCESS') {

          this.webinarResObj = webinar.data;

          // console.log('this // console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          // console.log(this.webinarObj);

          // this.webinarConfigureService.changeWebinarConfigure(this.webinarResObj);

          // set webinar offer module data from GET API response
          if (this.webinarResObj.webinarOffer != null) {
              this.webinarConfigureService.webinarMstOffer = this.webinarResObj;

              // set only webinarOffer module data from service 
              // if this.webinarMst.webinarOffer is undefined initialize it to empty obj
              // if (Object.keys(this.webinarConfigureService.webinarMst.webinarOffer).length == 0)
              //   this.webinarMst.webinarOffer = {};
              // else {
              //   this.webinarObj = {};
              //   this.webinarObj =  this.webinarConfigureService.webinarMst.webinarOffer;

              //   // delete id from chatDetails array, if exists, for save to work
              //   // this.webinarObj = this.delIdFromChatDetails(this.webinarObj);

              //   this.webinarMst.webinarOffer = this.webinarObj;
              // }

              // TODO: ADD OBJECT.ASSIGN TO THE RESPONSE
              // set for binding after get res
              this.webinarMst = this.webinarConfigureService.webinarMstOffer;

              // console.log("this.webinarMst initialized in offer, should only contain this module relevant data", this.webinarMst);
            
              // set data bindings
              this.setOfferBindings();
            }
          }
          }
      // })
    } else {
      // data exists in service, then don't make API call.
      if (this.webinarMst && this.webinarMst.id) {

        if (this.webinarConfigureService.webinarMstOffer) {
          // set only webinarOffer module data from service 
          this.webinarObj = {};
          this.webinarObj =  this.webinarConfigureService.webinarMstOffer;
          this.webinarMst = this.webinarObj;
          // console.log("this.webinarMst initialized in chat-box should only contain this module relevant data", this.webinarMst);
          // set data bindings
          this.setOfferBindings();
        }
      }
    }

  }

  setOfferBindings() {
    // use this for binding
    this.keyupFunction('offerTitleCharCount', this.webinarMst.webinarOffer.title, 'offerTitle');
    this.keyupFunction('offerDescriptionCharCount', this.webinarMst.webinarOffer.description, 'offerDes');
    this.keyupFunction('offerCallToActionCharCount', this.webinarMst.webinarOffer.callToActionLabel, 'offerCallLabel')
  }

  // use this to set route active when there is a page reload in websetup file
  module: any = "Offer";

  showhideWebinarOfferdiv(call) {
	// console.log('call.value : '+call.checked + ' : '+!call.checked);
  
  // // console.log("webinarOfferRadio", document.getElementById("webinarOfferRadio").checked);

  let webinarOfferRadio: any = document.getElementById("webinarOfferRadio")
  let checked = webinarOfferRadio.checked;

	if(checked) {
    let offerMainDiv1: any = document.getElementById('offerMainDiv');
    offerMainDiv1.style = 'display:block';
    let offerContent1: any = document.getElementById('offerContent');
		offerContent1.style = 'display:block';
   
		this.webinarMst.webinarSectionStatus[4].status = checked;
	}
	if(!checked)
	{
    let offerMainDiv: any = document.getElementById('offerMainDiv');
    offerMainDiv.style = 'display:none';

    let offerContent: any = document.getElementById('offerContent');
    offerContent.style = 'display:none';

		this.webinarMst.webinarSectionStatus[4].status = checked;
  }
  
  // console.log("check for webinarSectionStatus[4].status", this.webinarMst.webinarSectionStatus[4].status);
}

keyupFunction = function (charCount, from, to, validation?) {

  // console.log("in keyupFunction,", charCount, from, to, "checking for validation", validation);

  $('#' + to).text(from)
  if (charCount != 'null') {
    var count = $('#' + charCount).text()
    count = count.split("/");
    if (from) {
      count[0] = from.length;
    } else {
      count[0] = 0
    }
    count = count[0] + "/" + count[1];
    $('#' + charCount).text(count);
  }
}

setButtonColor = function(color){
    
  $('#offerCallLabel').css("background-color",color);
  this.webinarMst.webinarOffer.offerBtnColor = color;
}

saveOffer = async function() {

  // try {


  // console.log("about to save offer data with webinar object", this.webinarMst);

  // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

  // get editQuizId from localStorage
  this.webinarId = localStorage.getItem("webinarId");

  if (this.webinarId) {
    this.webinarMst.id = this.webinarId;
  }

  // console.log("data being sent to save API in chat box", this.webinarMst);

  // save webinar data
  let moduleUrl = "/webinarOffer";
  let webinar:any = await this.webinarAPI.saveWebinar(this.webinarMst, moduleUrl);

  // console.log("found webinar after save", webinar);

  if (webinar && webinar.statusCode == 200) {

    // console.log('webinar object', webinar.data, "this.webinarConfigureService.webinarMst after save res", this.webinarConfigureService.webinarMst);

    // set local webinarobj 
    this.webinarObj = {};
    this.webinarObj = webinar.data;

    this.webinarConfigureService.webinarMstOffer = this.webinarObj;
    this.webinarConfigureService.webinarMstOffer.moduleUrl = this.moduleUrl;
    // common module across all modules, to be updated on each save in each of the modules
    this.webinarConfigureService.moduleStatus = this.webinarObj.moduleStatus;
    this.webinarMst = this.webinarConfigureService.webinarMstOffer;

    // if webinarId doesn't exist in session storage, only then set it 
    // (to save data against the same id even after page reload)
    if (!localStorage.getItem("webinarId")) {

      // console.log("webinarId for this SESSION", webinar.data.id);
      localStorage.setItem("webinarId", webinar.data.id);
    }

    this.router.navigate(['/webinarSetup/ChatBox/']);
  
  }
// } catch(error) {

//   // stop loader
//   this.loadingScreenService.stopLoading();

//   // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
//   // console.log("error in saving post", error);

//   //if the error is of invalid token type return to login page
//   error = JSON.parse(error['_body']);

//   // console.log("error after parsing", error);

//   if (error.error == "invalid_token") {

//     // redirect to login page iof token is inavlid
//     Swal.fire({
//       text: error.error+", Please login",
//       type: 'warning',

//     }).then((result) => {
//       if (result.value) {

//         // clear everything from locastorage

//         this.router.navigate(['/'])
//       }
//     })

//   }
// }
}

goBack()
  {
    this.router.navigate(['/webinarSetup/WebinarType/']);
  }

}
