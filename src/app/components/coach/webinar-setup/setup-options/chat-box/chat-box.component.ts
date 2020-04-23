import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';

import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  // use this to set route active when there is a page reload in websetup file
  module: any = "WebinarChatBox";

  webinarMst: any = {};

  webinarChatTitle: any = "";

  webinarChatDesc: any = "";

  webinarChatHour: any = 0;

  webinarChatMinute: any = 0;

  webinarChatSecond: any = 0;

  firstName: any = "First Name N/A";

  lastName: any = "Last Name N/A";

  currentUser: any;
  
  webinarChatId: any;

  showEdit: any = false;

  showAdd: any = true;

  webinarId: any;

  webinarObj: any;

  webinarResObj: any;

  // set recently updated property in keyupfunction
  recentlyUpdatedModule: any = "webinarMstChatBox";

  // use this for setting post url 
  moduleUrl: any = "/webinarChat";

  // use this for get parama
  getParam: any = "WebinarChat";

  webinarTypeChosen: any;

  @ViewChild('webinarForm') webinarForm: NgForm;

  constructor(
    private webinarAPI: WebinarAPIService,
    private webinarConfigureService: WebinarConfigureService,
    private authService: AuthapiserviceService,
    private router: Router
  ) { }

  // set only webinarChatDetails module data from service or API response for binding and save API wirte efficiency
  async ngOnInit() {

    // get the webinar type and decide whether to do 'save and next'(for live) or 'save and finish'(for auto)
    this.webinarTypeChosen = localStorage.getItem('webinarTypeChosen');

    // initialize webinar chat details obj
    // this.webinarMst = {
    //   "webinarChatDetails": [
        // {
        //   "chatDesc": "string",
        //   "chatTime": {
        //     "date": 0,
        //     "day": 0,
        //     "hours": 0,
        //     "minutes": 0,
        //     "month": 0,
        //     "nanos": 0,
        //     "seconds": 0,
        //     "time": 0,
        //     "timezoneOffset": 0,
        //     "year": 0
        //   },
        //   "chatTimeInHour": 0,
        //   "chatTimeInMinute": 0,
        //   "chatTimeInSecond": 0,
        //   "chatTitle": "string",
        //   "id": 0
        // }
    //   ]
    // }

    // get webinarMstChatBox data from service
    this.webinarMst = this.webinarConfigureService.webinarMstChatBox;

    // get only webinar chat details from service and use it for binding,
    // and in save API request 
    // this.webinarMst = this.webinarConfigureService.webinarMst.webinarChatDetails;

    // if this.webinarMst.webinarChatDetails is undefined initialize it to empty array
    // if (!this.webinarConfigureService.webinarMst.webinarChatDetails)
    //   this.webinarMst.webinarChatDetails = []
    // else {
    //     this.webinarObj = {};
    //    this.webinarObj =  this.webinarConfigureService.webinarMst.webinarChatDetails;
    //    this.webinarMst.webinarChatDetails = this.webinarObj
    // }
    // get webinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    // console.log("in ngOnInit of wbeinar-chatbox, found webinarId", this.webinarId, "and this.webinarMst", this.webinarMst);

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
    // this is used for page refresh handling
    if (this.webinarMst && (this.webinarMst.fromService == true)
        && this.webinarId) {

      // if webinarMst is empty on service like in  case of page refresh
      // and webinarId exists make an API call
      // get data from webinar service
      let dataQuiz: any = await this.webinarAPI.getWebinar(this.webinarId, "WebinarChat"); 
        // this.webinarAPI.getWebinar(this.webinarId, "WebinarChat").subscribe(dataQuiz 
        // => {
        // console.log(dataQuiz);

      if (dataQuiz) {
        
        var webinar =dataQuiz;
        if (webinar.status == 'SUCCESS') {

          this.webinarResObj = webinar.data;

          // console.log('this // console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          // console.log(this.webinarObj);

          // this.webinarConfigureService.changeWebinarConfigure(this.webinarResObj);

          // set webinar chatbox module data from GET API response into service
          this.webinarConfigureService.webinarMstChatBox = this.webinarResObj;

          // set only webinarChatDetails module data from service 
          this.webinarMst = this.webinarConfigureService.webinarMstChatBox;

          // if this.webinarMst.webinarChatDetails is undefined initialize it to empty array
          // if (!this.webinarConfigureService.webinarMst.webinarChatDetails)
          //   this.webinarMst.webinarChatDetails = []
          // else {
          //   this.webinarObj = {};
          //   this.webinarObj =  this.webinarConfigureService.webinarMst.webinarChatDetails;

          //   // delete id from chatDetails array, if exists, for save to work
          //   // this.webinarObj = this.delIdFromChatDetails(this.webinarObj);

          //   this.webinarMst.webinarChatDetails = this.webinarObj;
          // }

          // console.log("this.webinarMst initialized in chat-box should only contain this module relevant data", this.webinarMst);
        }
      }
      // })
    } else {
      // data exists in service, then don't make API call.
      if (this.webinarMst && this.webinarMst.id) {

        if (this.webinarConfigureService.webinarMstChatBox) {
          // set only webinarChatDetails module data from service 
          this.webinarObj = {};
          this.webinarObj =  this.webinarConfigureService.webinarMstChatBox;
          this.webinarMst = this.webinarObj;
          // console.log("this.webinarMst initialized in chat-box should only contain this module relevant data", this.webinarMst);
        }
      }
    }

    // get currentUser from localStorage
    this.currentUser = localStorage.getItem("currentUser");

    // parse
    this.currentUser = JSON.parse(this.currentUser);

    // get the user name from session storage that is set at the time of login
    this.firstName = this.currentUser.firstName;
    this.lastName = this.currentUser.lastName;
  }

  addWebinarChat = function()
	{

		var index;
    
    // console.log("this.webinarMst.webinarChatDetails BEFORE push", this.webinarMst.webinarChatDetails);

		this.webinarMst.webinarChatDetails.push({"chatTitle": this.webinarChatTitle, "chatDesc": this.webinarChatDesc, "chatTimeInHour":this.webinarChatHour, "chatTimeInMinute": this.webinarChatMinute, "chatTimeInSecond": this.webinarChatSecond});
    
    // console.log("this.webinarMst.webinarChatDetails AFTER push", this.webinarMst.webinarChatDetails);
    
    this.webinarChatTitle = "";
		this.webinarChatDesc = "";
		this.webinarChatHour = 0;
		this.webinarChatMinute = 0;
    this.webinarChatSecond = 0;
    
    this.saveChatbox();
  }
  
  deleteWebinarChat = async function(webinarChat)
	{
    // start the screen load
   // this.loadingScreenService.startLoading();
    // this.webinarMst.webinarChatDetails.splice(this.webinarMst.webinarChatDetails.indexOf(webinarChat), 1);
    
    // call delete API service
    let updatedWebinarRes:any = await this.webinarAPI.deleteChatBoxByid(webinarChat);

    // update chatbox list msgs from delete api response
    this.webinarObj = {};
    this.webinarObj = updatedWebinarRes.data;

    this.webinarConfigureService.webinarMstChatBox = this.webinarObj;
    this.webinarMst = this.webinarConfigureService.webinarMstChatBox;

    this.showEdit = false;

    this.showAdd = true;

   // this.loadingScreenService.stopLoading();
	}

  editWebinarChat = function(webinarChat,index) {

    // console.log("selected webinar chat for edit and its index", webinarChat,index);

		this.webinarChatTitle = webinarChat.chatTitle;
		this.webinarChatDesc = webinarChat.chatDesc;
		this.webinarChatHour = webinarChat.chatTimeInHour;
		this.webinarChatMinute = webinarChat.chatTimeInMinute;
		this.webinarChatSecond = webinarChat.chatTimeInSecond;
    this.webinarChatId = index;
    
    this.showEdit = true;

    this.showAdd = false;

		// document.getElementById('chatAdd').style="display:none";
    // document.getElementById('chatEdit').style="display:block;width: 67px;";
  }

  editWebinarChatList = function(webinarChatId)
	{
		this.webinarMst.webinarChatDetails[webinarChatId].chatTitle =this.webinarChatTitle;
		this.webinarMst.webinarChatDetails[webinarChatId].chatDesc =this.webinarChatDesc;
		this.webinarMst.webinarChatDetails[webinarChatId].chatTimeInHour =this.webinarChatHour;
		this.webinarMst.webinarChatDetails[webinarChatId].chatTimeInMinute =this.webinarChatMinute;
		this.webinarMst.webinarChatDetails[webinarChatId].chatTimeInSecond =this.webinarChatSecond;
		this.webinarChatTitle = "";
		this.webinarChatDesc = "";
		this.webinarChatHour = 0;
		this.webinarChatMinute = 0;
    this.webinarChatSecond = 0;
    
    this.showEdit = false;

    this.showAdd = true;

		// document.getElementById('chatAdd').style="display:block;width: 65px;";
		// document.getElementById('chatEdit').style="display:none;width: 67px;"; 
  }
  
  async saveChatbox(fromSave?: boolean) {

    // try {
    // start the screen load
   // this.loadingScreenService.startLoading();

    // set data into webinar service before making save API call
    // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

    // remove id, if exists, from this.webinarMst.webinarChatDetails, since it causes update to fail
    // if (this.webinarMst) {
    //   for (let i = 0; i < this.webinarMst.webinarChatDetails.length; i++) {
    //     if (this.webinarMst.webinarChatDetails[i].id) {
    //       delete this.webinarMst.webinarChatDetails[i].id;
    //     }
    //   };
    // }

    // get editQuizId from localStorage
    this.webinarId = localStorage.getItem("webinarId");

    if (this.webinarId) {
      this.webinarMst.id = this.webinarId;
    }

    // console.log("data being sent to save API in chat box", this.webinarMst);

    // save webinar data
    let moduleUrl = "/webinarChat";

    this.webinarObj = {...this.webinarMst}

    // delete id from chatDetails array, if exists, for save to work
    this.webinarObj = this.delIdFromChatDetails(this.webinarObj);
    let dataWebinar :any = await this.webinarAPI.saveWebinar(this.webinarObj, moduleUrl);
    var webinar = dataWebinar;

    // console.log("found webinar after save", webinar);

    if (webinar.statusCode == 200) {
      
      // this.webinarMst = webinar.data;
      // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

      // console.log('webinar object', webinar.data, "this.webinarConfigureService.webinarMst after save res", this.webinarConfigureService.webinarMst);

      // set local webinarobj 
      // this.webinarObj = {};

      // // for edit only webinarChatDetails array is returned
      // if (!webinar.data.id) {
      //   this.webinarObj = {
      //     id: webinar.data.id,
      //     webinarChatDetails: webinar.data
      //   }
      // } else {
      //     // for first time while webinar obj is returned
      //     this.webinarObj = {
      //       id: webinar.data.id,
      //       webinarChatDetails: webinar.data.webinarChatDetails
      //   }
      // }

      this.webinarObj = {};
      this.webinarObj = webinar.data;

      this.webinarConfigureService.webinarMstChatBox = this.webinarObj;
      this.webinarConfigureService.webinarMstChatBox.moduleUrl = this.moduleUrl;

      // common module across all modules, to be updated on each save in each of the modules
      this.webinarConfigureService.moduleStatus = this.webinarObj.moduleStatus;

      this.webinarMst = this.webinarConfigureService.webinarMstChatBox;

      // console.log("this.webinarObj:", this.webinarObj);

      // delete id from chatDetails array, if exists, for save to work
      // this.webinarObj = this.delIdFromChatDetails(this.webinarObj);
      
      // if webinarId doesn't exist in session storage, only then set it 
      // (to save data against the same id even after page reload)
      if (!localStorage.getItem("webinarId")) {

        // console.log("webinarId for this SESSION", webinar.data.id);
        localStorage.setItem("webinarId", webinar.data.id);
      }
      
      // use fromSave to navigate to next module
      if (fromSave) {
        this.router.navigate(['/webinarSetup/PresentationSlidesAndVideos/']);
        // stop the screen load
     //   this.loadingScreenService.stopLoading();
      } else {
    //    this.loadingScreenService.stopLoading();
      }
      this.webinarForm.form.markAsPristine();
      this.webinarForm.form.markAsUntouched();
    } 
  // } catch(error) {

  //     // stop loader
  //     this.loadingScreenService.stopLoading();
  
  //     // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
  //     // console.log("error in saving post", error);
  
  //     //if the error is of invalid token type return to login page
  //     error = JSON.parse(error['_body']);
  
  //     // console.log("error after parsing", error);
  
  //     if (error.error == "invalid_token") {
  
  //       // redirect to login page iof token is inavlid
  //       Swal.fire({
  //         text: error.error+", Please login",
  //         type: 'warning',
  
  //       }).then((result) => {
  //         if (result.value) {
  
  //           // clear everything from locastorage
  
  //           this.router.navigate(['/'])
  //         }
  //       })
  
  //     }
  // }
}

  delIdFromChatDetails(webinarObj) {

    // iterate over webinar obj and delete to make save API work  because we only need webinar id, not the chatdetails id
    // webinarObj.forEach(element => {
      for (let i = 0; i < webinarObj.length; i++) {

        // console.log("element in webinarObj", webinarObj[i], "about to remove id", webinarObj[i].id);
        if (webinarObj[i].id) {
          delete webinarObj[i].id;
        }
      }

      // console.log("returning webinarObj after remove id", webinarObj);

      return webinarObj;
  }

  goBackToFunnel(){
    var funnelType = localStorage.getItem('funnelUrl')
    this.router.navigate(['/funnelCreate/'+funnelType], { queryParams: {editWebinar: true}});
  }

  goBack()
  {
    this.router.navigate(['/webinarSetup/Offer']);
  }
}
