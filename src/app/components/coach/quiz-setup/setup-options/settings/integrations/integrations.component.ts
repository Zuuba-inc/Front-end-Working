import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';

import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';

import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';

import { GoogleSheetsService } from 'src/app/services/global/integration/google-sheets.service';

import * as $ from 'jquery';

declare var gapi: any;

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent implements OnInit, AfterViewInit {

  fbPxId: any = null;

  gaId: any = null;

  gsId: any = null;

  gtmId: any = null;

  showGSModal: boolean = false;

  googleSheetUrl: any = "";

  sheetIntegrated: any = "";

  constructor(
    public quizAPI: QuizapiserviceService,
    public quizConfigureservice: QuizConfigureserviceService,
    private ref: ChangeDetectorRef,
    public googleSheetsService: GoogleSheetsService
  ) {

    this.quizConfigureservice.quizConfObstream$.subscribe(
      (item: any) => {
        console.log("item in subscribing", item);

        this.fbPxId = item.facebookPixelId;

        this.gaId = item.googleTrackingId;

        this.gsId = item.googleSheetUrl;

        this.gtmId = item.googleTagMngrId;
        this.googleSheetUrl = item.googleSheetUrl;

        this.sheetIntegrated = item.sheetIntegrated;

        // to make on/off in sync with that of response
        this.toggleGSConnection(null, true);
      });

    console.log("checking for ids inside integration component", this.quizConfigureservice.quizConfiguration);

    // on firther visits by swithcing modules, bindings need to be updated
    this.fbPxId = this.quizConfigureservice.quizConfiguration.facebookPixelId;

    this.gaId = this.quizConfigureservice.quizConfiguration.googleTrackingId;

    this.gsId = this.quizConfigureservice.quizConfiguration.googleSheetUrl;

    this.gtmId = this.quizConfigureservice.quizConfiguration.googleTagMngrId;
    this.googleSheetUrl = this.quizConfigureservice.quizConfiguration.googleSheetUrl;

    if (gapi) {
      gapi.load('auth2', () => {

        console.log("gapi loaded from script", gapi);

        this.auth2 = gapi.auth2.init({
          client_id: '647129437466-0rp2359nmcpikfkls8oqsm2uj0teh6tg.apps.googleusercontent.com',
          // discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
          scope: [
            "https://www.googleapis.com/auth/spreadsheets"
          ].join(" ")
          // Scopes to request in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
      });
    }
  }

  showModal: boolean = false;

  sideBarEle: any = document.getElementById("quizSideBar");

  previewEle: any = document.getElementsByClassName("btn-pre")[0];

  integrationId: any;

  showPopUpMessage: boolean = false;

  message: any = {};

  integrationText: any = "";

  integrationDesc: any = "";

  integrationHelpLink: any = "";

  integrationPlaceholder: any = "";

  integrationType: any = "";

  subscription: any;

  ngOnInit() {
    //   this.gapiGoogleService.loadClient().then(
    //     result => {
    //       console.log("rsult from gapi", result);
    //       return this.gapiGoogleService.initClient();
    //     }
    //     ,
    //     err => {
    //       console.log("err from gapi", err);
    //     }
    // ).then(result => {
    //       console.log('GAPI API READY, gapi global variable', gapi, gapi.auth2.getAuthInstance());

    //       this.GoogleAuth = gapi.auth2.getAuthInstance();

    //       console.log("this after clicking", this);

    //       // Listen for sign-in state changes.
    //       this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus());

    //       // Handle initial sign-in state. (Determine if user is already signed in.)
    //       var user = this.GoogleAuth.currentUser.get();

    //       this.setSigninStatus();

    //       document.getElementById('gs-c-btn').addEventListener('click', this.handleAuthClick.bind(this));
    //   }, err => {
    //       console.log('err in GAPI ready', err);
    //   });
  }

  auth2: any;

  ngAfterViewInit() {
    
    this.sheetIntegrated = this.quizConfigureservice.quizConfiguration.sheetIntegrated;

    // to make on/off in sync with that of response
    this.toggleGSConnection(null, true);

    // detect changes, added this bc since there was an error on console related binding changes detection
    this.ref.detectChanges();
  }

  code: any;

  connectedGAccounts: any = [];

  async onGoogleSheetsConnect() {


    // get list of connected users for this logged in user
    this.connectedGAccounts = await this.googleSheetsService.getConnectedGAccountsList();

    console.log("connectedGAccounts", this.connectedGAccounts);

    this.connectedGAccounts = this.connectedGAccounts.data;

    // show the modal on clicking coonnect and let user select email and provide sheets data
    this.showGSModal = true;

    // adjust zindex of quiz side bar menu
    this.sideBarEle.style.zIndex = 0;

    // adjust the preview btn z index
    this.previewEle.style.zIndex = 0;
  }

  onGSAddAccount() {

    if (!this.GSEmail) {

      gapi.auth2.getAuthInstance().grantOfflineAccess().then(res => {

        console.log("resCode", res);

        // assign code
        this.code = res.code;

        // make an api call to save code

      });
    }
  }

  refreshToken() {

  }
  onGTMConnet() {
    // adjust zindex of quiz side bar menu
    this.sideBarEle.style.zIndex = 0;

    // adjust the preview btn z index
    this.previewEle.style.zIndex = 0;

    this.showModal = true;

    this.integrationText = "Google Tag Manager Integration";

    this.integrationDesc = "Copy and paste your GTM id below";

    this.integrationHelpLink = "How to find my GTM ID?";

    this.integrationPlaceholder = "e.g GTM-XXXXXX"

    this.integrationType = "GoogleTagManager";
  }
  onFBPixelConnet() {

    // adjust zindex of quiz side bar menu
    this.sideBarEle.style.zIndex = 0;

    // adjust the preview btn z index
    this.previewEle.style.zIndex = 0;

    this.showModal = true;

    this.integrationText = "Facebook Pixel Integration";

    this.integrationDesc = "Copy and paste your pixel ID below";

    this.integrationHelpLink = "How to find my pixel ID?";

    this.integrationPlaceholder = "e.g 6254628662618"

    this.integrationType = "Facebook";
  }

  onGAConnet() {

    // adjust zindex of quiz side bar menu
    this.sideBarEle.style.zIndex = 0;

    // adjust the preview btn z index
    this.previewEle.style.zIndex = 0;

    this.showModal = true;

    this.integrationText = "Add Your Google Analytics Tracking Code";

    this.integrationDesc = "Copy and paste your Google Analytics Tracking Code below";

    this.integrationHelpLink = "How do I find my tracking code?";

    this.integrationPlaceholder = "e.g. UA-XXXX-Y";

    this.integrationType = "GoogleAnalytics";
  }

  closeModal() {

    this.showModal = false;

    this.showGSModal = false;

    this.sideBarEle.style.zIndex = 9999;

    // adjust the preview btn z index
    this.previewEle.style.zIndex = 100;
  }

  quizId = localStorage.getItem("quizId");

  async OnSaveID(integrationType) {

    console.log("integrationType", integrationType);

    let savedRes: any;

    if (integrationType == "Facebook") {

      let saveData = {
        "facebookPixelId": this.integrationId,
        "id": parseInt(this.quizId)
      }

      savedRes = await this.quizAPI.saveQuiz(saveData);

      console.log("savedFbPixelRes", savedRes);

      this.showPopUpMessage = true;

      if (savedRes.status == "SUCCESS") {

        this.message = { 'type': 'SUCCESS', 'message': 'Facebook Pixel Id is saved successfully' };

        this.showModal = false;

        this.integrationId = "";

      } else {

        this.message = { 'type': 'ERROR', 'message': 'Error in saving Facebook Pixel Id, please try again!' };

        this.showModal = false;

        this.integrationId = "";
      }
    } else if (integrationType == "GoogleAnalytics") {

      let saveData = {
        "googleTrackingId": this.integrationId,
        "id": parseInt(this.quizId)
      }

      savedRes = await this.quizAPI.saveQuiz(saveData);

      console.log("savedFbPixelRes", savedRes);

      this.showPopUpMessage = true;

      if (savedRes.status == "SUCCESS") {

        this.message = { 'type': 'SUCCESS', 'message': 'Google Analytics Id is saved successfully' };

        this.showModal = false;

        this.integrationId = "";

      } else {

        this.message = { 'type': 'ERROR', 'message': 'Error in saving Facebook Pixel Id, please try again!' };

        this.showModal = false;

        this.integrationId = "";
      }
    } else if (integrationType == 'GoogleTagManager') {

      let saveData = {
        "googleTagMngrId": this.integrationId,
        "id": parseInt(this.quizId)
      }

      savedRes = await this.quizAPI.saveQuiz(saveData);

      console.log("savedFbPixelRes", savedRes);

      this.showPopUpMessage = true;

      if (savedRes.status == "SUCCESS") {

        this.message = { 'type': 'SUCCESS', 'message': 'Google Tag Manager Id is saved successfully' };

        this.showModal = false;

        this.integrationId = "";

      } else {

        this.message = { 'type': 'ERROR', 'message': 'Error in saving Google Tag Manager Id, please try again!' };

        this.showModal = false;

        this.integrationId = "";
      }
    }

    this.fbPxId = savedRes.data.facebookPixelId;

    this.gaId = savedRes.data.googleTrackingId;

    this.gsId = savedRes.data.googleSheetUrl;

    this.gtmId = savedRes.data.googleTagMngrId;

    this.googleSheetUrl = savedRes.data.googleSheetUrl;
  }

  async onRemoveIntegration(integrationType) {

    let saveData = {
      "moduleName": integrationType,
      "quizId": parseInt(this.quizId)
    }

    if (integrationType == 'googleSheetUrl') {
      // clear google sheet url
      this.googleSheetUrl = ""
    }

    let rSavedRes: any = await this.quizAPI.removeIntegration(saveData);

    if (rSavedRes.status = "SUCCESS") {

      this.showPopUpMessage = true;

      this.message = { 'type': 'SUCCESS', 'message': `${integrationType} Integration Is Removed` };

      this.fbPxId = rSavedRes.data.facebookPixelId;

      this.gaId = rSavedRes.data.googleTrackingId;

      this.gsId = rSavedRes.data.googleSheetUrl;

      this.gtmId = rSavedRes.data.googleTagMngrId;
    } else {

      this.showPopUpMessage = true;

      this.message = { 'type': 'ERROR', 'message': `Error In Removing ${integrationType} Integration, Please Try Again!` };
    }
  }

  // use this vairable to show or hide input elements
  showNSInp: boolean = false;

  showESInp: boolean = false;

  type: any; // new or existing

  createNewSheet() {

    this.showNSInp = true;
    this.showESInp = false;
    this.type = "new";
  }

  useExistingSheet() {

    this.showNSInp = false;
    this.showESInp = true;
    this.type = "existing";
  }

  sheetName: any;
  sheetUrl: any;
  GSEmail: any;

  GSPostData: any;

  async OnSaveGSData() {

    console.log("inside OnSaveGSData");

    if (this.type == "new") {

      if (!this.GSEmail) {

        this.GSPostData = {
          "googleSheetName": this.sheetName,
          "googleAuthorizationCode": this.code
        }
      } else {

        this.GSPostData = {
          "googleSheetName": this.sheetName,
          "userEmail": this.GSEmail
        }
      }
    } else {

      if (!this.GSEmail) {

        this.GSPostData = {
          "googleSheetUrl": this.sheetUrl,
          "googleAuthorizationCode": this.code
        }
      } else {

        this.GSPostData = {
          "googleSheetUrl": this.sheetUrl,
          "userEmail": this.GSEmail
        }

      }
    }

    let id = localStorage.getItem("quizId");

    // quiz id
    this.GSPostData.id = parseInt(id);

    //  send this data in post request to create new sheet by name
    let res: any = await this.googleSheetsService.CreateEditSheets(this.GSPostData);


    if (res.status = "SUCCESS") {

      // show the modal on clicking coonnect and let user select email and provide sheets data
      this.showGSModal = false;

      this.sideBarEle.style.zIndex = 9999;

      // adjust the preview btn z index
      this.previewEle.style.zIndex = 100;

      // show remove button
      this.gsId = this.GSPostData;

      this.showPopUpMessage = true;

      this.message = { 'type': 'SUCCESS', 'message': 'Google Sheets Integration is successful' };

      this.showModal = false;

      this.integrationId = "";

      this.googleSheetUrl = res.data.googleSheetUrl;

      this.sheetIntegrated = res.data.sheetIntegrated;

      // to make on/off in sync with that of response
      this.toggleGSConnection(null, true);
    } else {

      this.showPopUpMessage = true;

      this.message = { 'type': 'ERROR', 'message': 'Error in Google Sheets Integration, please try again!' };

      this.showModal = false;

      this.integrationId = "";
    }
  }

  async toggleGSConnection(event, noEvent ?: boolean) {

    let allow = "";

    if (noEvent) {

      allow = this.sheetIntegrated ? 'on' : 'off';

      if (allow == 'off') {

          $('#socialSharingBtn').removeClass('on');
          $('#socialSharingBtn').addClass('off');
      }  else {
          // for 'off'
          $('#socialSharingBtn').removeClass('off')
          $('#socialSharingBtn').addClass('on')
      }
    } else {

      allow = event.currentTarget.classList[1];

      console.log("event", event);

      if (allow == 'on') {
        if ($('#socialSharingBtn').hasClass('on')) {
          $('#socialSharingBtn').removeClass('on')
          $('#socialSharingBtn').addClass('off')

          let body: any = {
            "id": parseInt(this.quizId),
            "sheetIntegrated": false,
            "sheetIntegration": "toggle"
          }

          let savedRes: any = await this.quizAPI.saveQuiz(body);

          console.log("succesfully turned on integration", savedRes);

          this.sheetIntegrated = savedRes.data.sheetIntegrated;

          this.quizConfigureservice.quizConfiguration.sheetIntegrated = this.sheetIntegrated;

        }

        this.showPopUpMessage = true;

        this.message = { 'type': 'SUCCESS', 'message': 'Google Sheets Integration Turned Off' };

      } else {
        // for 'off'
        if ($('#socialSharingBtn').hasClass('off')) {
          $('#socialSharingBtn').removeClass('off')
          $('#socialSharingBtn').addClass('on')

          let body: any = {
            "id": parseInt(this.quizId),
            "sheetIntegrated": true,
            "sheetIntegration": "toggle"
          }

          let savedRes: any = await this.quizAPI.saveQuiz(body);

          console.log("succesfully turned off integration", savedRes);

          this.sheetIntegrated = savedRes.data.sheetIntegrated;

          this.quizConfigureservice.quizConfiguration.sheetIntegrated = this.sheetIntegrated;

          this.showPopUpMessage = true;

          this.message = { 'type': 'SUCCESS', 'message': 'Google Sheets Integration Turned On' };

        }
      }
    }
  }

}