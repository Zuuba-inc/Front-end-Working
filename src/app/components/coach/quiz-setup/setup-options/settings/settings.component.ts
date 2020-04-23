import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

// import jquery
import * as $ from 'jquery';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';
import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';
import { quizConfiguration } from '../../quiz-setup.component';

//import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';
import { QuizSetupComponent } from 'src/app/components/coach/quiz-setup/quiz-setup.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormValidationService } from '../../../../../services/global/form-validation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // [[start of variable declarations]]
  /*quizConfiguration: any = {
    allowSocialSharing: true,
    isPvtPub: true,
    multiVariationNo: "1",
    quizColorScheme: [
      {
        backColor: "",
        // quizArea: { id: 1, areaName: "Call to action label", defaultColor: "#1DCB9A" }
      },
      {
        backColor: "",
        // quizArea: { id: 2, areaName: "Offer background", defaultColor: "#00313F" }
      },
      {
        backColor: "",
        // quizArea: { id: 3, areaName: "Outcome background", defaultColor: "#FFFFFF" }
      },
      {
        backColor: "",
        // quizArea: { id: 4, areaName: "Question background", defaultColor: "#FFFFFF" }
      },
      {
        backColor: "",
        // quizArea: { id: 5, areaName: "Answer background", defaultColor: "#F6F6F6" }
      },
      {
        backColor: "",
        // quizArea: { id: 6, areaName: "Quiz title background", defaultColor: "#E1E1E1" }
      }
    ],
    quizSEOMetadata: { seoMetaDesc: "" },
    fontName: "Select" // by default, show 'select' option
  };*/

  cropImage: boolean = false;
  message: any;
  fontList = [
    'Select',
    'Karla',
    'Lora',
    'Frank Ruhl Libre',
    'Playfair Display',
    'Fjalla One',
    'Roboto ',
    'Montserrat',
    'Rubik',
    'Source Sans Pro',
    'Cardo',
    'Cormorant',
    'Work Sans',
    'Rakkas',
    'Concert One',
    'Yatra One',
    'Arvo',
    'Lato',
    'Abril FatFace',
    'Ubuntu',
    'PT Serif',
    'Old Standard TT',
    'Oswald'
  ];

  lightFontColor = "#E1E1E1";

  darkFontColor = "#363636";

  changedImage: any = false;

  colorType: any;

  color: any = {};

  r: any;
  g: any;
  b: any;
  hsp: any;
  // [[end of variable declarations]]

  parsedResData: any;

  quizConfiguration = this.quizConfigureservice.getConfigurationObj();

  // pass this as input to file upload component
  settings: any = 'settings';

 
  constructor(
    public router: Router,
    public quizAPI: QuizapiserviceService,
    public quizConfigureservice: QuizConfigureserviceService,
    public quizSetup: QuizSetupComponent,
    public formValidationService: FormValidationService
  ) {

    if (!this.quizConfiguration.quizSEOMetadata) {
      this.quizConfiguration.quizSEOMetadata = {
        "seoMetaTitle": "",
        "seoMetaDesc": "",
        "seoImage": ""
      }
    }
  }

  // this is used to to set id when user navigates from one module to other and fetches data based on this id
  // does not appear in the url
  quizId: any;

  module: any = "Settings";

  ngOnInit() {

    localStorage.setItem("lastVisitedSubModule", "Settings");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    if (this.quizConfiguration && !this.quizConfiguration.id) {

      this.quizConfiguration = {};
      this.quizConfiguration.quizSEOMetadata = {};
      this.quizConfiguration.quizSEOMetadata.seoMetaTitle = "";
      this.quizConfiguration.quizSEOMetadata.seoMetaDesc = "";
      this.quizConfiguration.quizSEOMetadata.seoImage = "";
    }

    // get editQuizId from localStorage
    this.quizId = localStorage.getItem("quizId");
    // in configure page, based on id we fetch data and store in service
    // on page reload, this.quizConfiguration is empty, fetch data in this case using API

    // this.route.paramMap.subscribe(params => {
    //   console.log(params);
    //   console.log(this.route.snapshot.params.id);

    if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {

        this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {
          console.log(dataQuiz);
          var quiz :any;
          quiz = dataQuiz;
          if (quiz.status == 'SUCCESS') {  
          this.quizConfiguration = quiz.data;

          console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          console.log(this.quizConfiguration);

          this.quizConfigureservice.change(this.quizConfiguration);

          this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

          this.quizConfigureservice.setQuizConfObs(this.quizConfiguration);

          this.setSettingsInitData(this.quizConfiguration);
        }else{
          this.serverError(quiz);
        }
      });
    } else {

      // data exists in service, then don't make API call.
      if (this.quizConfiguration && this.quizConfiguration.id != null || this.quizConfiguration.id != undefined || this.quizConfiguration.id != "") {

        this.quizConfigureservice.setQuizConfObs(this.quizConfiguration);

        this.setSettingsInitData(this.quizConfiguration);
      }
    }
  }

  setSettingsInitData(quiz: any) {

    this.quizConfiguration = quiz;

          console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          console.log(this.quizConfiguration);

          // store data in service call
          this.quizConfigureservice.change(this.quizConfiguration);

        //console.log(this.quizConfiguration.quizColorScheme.length);
        if (this.quizConfiguration.fontName == null) {
          this.quizConfiguration.fontName = 'Select';
        }
        if (this.quizConfiguration.quizColorScheme == undefined || this.quizConfiguration.quizColorScheme == null || this.quizConfiguration.quizColorScheme.length == 0) {
          this.quizConfiguration.quizColorScheme = [
            {
              backColor: "",
              // quizArea: { id: 1, areaName: "Call to action label", defaultColor: "#1DCB9A" }
            },
            {
              backColor: "",
              // quizArea: { id: 2, areaName: "Offer background", defaultColor: "#00313F" }
            },
            {
              backColor: "",
              // quizArea: { id: 3, areaName: "Outcome background", defaultColor: "#FFFFFF" }
            },
            {
              backColor: "",
              // quizArea: { id: 4, areaName: "Question background", defaultColor: "#FFFFFF" }
            },
            {
              backColor: "",
              // quizArea: { id: 5, areaName: "Answer background", defaultColor: "#F6F6F6" }
            },
            {
              backColor: "",
              // quizArea: { id: 6, areaName: "Quiz title background", defaultColor: "#E1E1E1" }
            }
          ];
          this.getQuizColorSchemes();
        }
        // console.log(this.quizConfiguration.quizSEOMetadata.length);
        // console.log(this.quizConfiguration.quizSEOMetadata != null);
        if (this.quizConfiguration.quizSEOMetadata == null || (this.quizConfiguration.quizSEOMetadata.seoMetaTitle == null
          || this.quizConfiguration.quizSEOMetadata.seoMetaDesc == null
          || this.quizConfiguration.quizSEOMetadata.seoImage == null)) {
          this.quizConfiguration.quizSEOMetadata = { seoMetaDesc: "" };
          this.quizConfiguration.quizSEOMetadata.seoMetaTitle = this.quizConfiguration.quizTitle;
          this.quizConfiguration.quizSEOMetadata.seoMetaDesc = this.quizConfiguration.quizDescription;
          this.quizConfiguration.quizSEOMetadata.seoImage = this.quizConfiguration.quizMediaAttached;
          $("#seoImage").attr("src", this.quizConfiguration.quizMediaAttached);
          // this.quizConfiguration.quizSEOMetadata = this.quizSEOMetadata;
        }
        if (this.quizConfiguration.quizSEOMetadata != null && this.quizConfiguration.quizSEOMetadata.seoImage != null) {
          console.log('insdie');
          $("#seoImage").attr("src", this.quizConfiguration.quizSEOMetadata.seoImage);
        }
        // set quizColorScheme array hitting this API
        console.log(this.quizConfiguration.quizColorScheme.length);
        /*if(this.quizConfiguration.quizColorScheme == null || this.quizConfiguration.quizColorScheme.length ==0)
        {
          this.getQuizColorSchemes();
        }*/
        if (this.quizConfiguration.fontName != null) {
          this.updateQuizFont();
        }
        this.setColorAndTheme();
  }

  // write jquery functions for jquery functionality to be working
  ngAfterViewInit() {
    $('.nav').on('click', 'li', function () {
      $('.nav li.active').removeClass('active');
      $(this).addClass('active');
    });
    if (this.quizConfiguration.quizColorScheme == undefined || this.quizConfiguration.quizColorScheme == null || this.quizConfiguration.quizColorScheme.length == 0) {
      this.quizConfiguration.quizColorScheme = [
        {
          backColor: "",
          // quizArea: { id: 1, areaName: "Call to action label", defaultColor: "#1DCB9A" }
        },
        {
          backColor: "",
          // quizArea: { id: 2, areaName: "Offer background", defaultColor: "#00313F" }
        },
        {
          backColor: "",
          // quizArea: { id: 3, areaName: "Outcome background", defaultColor: "#FFFFFF" }
        },
        {
          backColor: "",
          // quizArea: { id: 4, areaName: "Question background", defaultColor: "#FFFFFF" }
        },
        {
          backColor: "",
          // quizArea: { id: 5, areaName: "Answer background", defaultColor: "#F6F6F6" }
        },
        {
          backColor: "",
          // quizArea: { id: 6, areaName: "Quiz title background", defaultColor: "#E1E1E1" }
        }
      ];
      this.getQuizColorSchemes();
    }
  }

  // get quizColorScheme
  async getQuizColorSchemes() {

    // this.quizConfigureservice.getDefaultColor().subscribe((data: any)=> {

    //   this.parsedResData = JSON.parse(data._body).data;
    //   console.log("this.parsedResData", this.parsedResData);

    //   for (let i = 0; i < this.parsedResData.length; i++) {

    //     // set backColor to defaultColor from response
    //     this.quizConfiguration.quizColorScheme[i].backColor =  this.parsedResData[i].defaultColor;

    //     // set quizArea 
    //     this.quizConfiguration.quizColorScheme[i].quizArea = this.parsedResData[i];
    //   }
    //   console.log("quizConfiguration", this.quizConfiguration);
    // });

    let data: any = await this.quizConfigureservice.getDefaultColor();
    this.parsedResData = data;
    console.log("this.parsedResData", this.parsedResData);

    for (let i = 0; i < this.parsedResData.length; i++) {

      // set backColor to defaultColor from response
      this.quizConfiguration.quizColorScheme[i].backColor = this.parsedResData[i].defaultColor;

      // set quizArea 
      this.quizConfiguration.quizColorScheme[i].quizArea = this.parsedResData[i];
    }
    console.log("quizConfiguration", this.quizConfiguration);
  }

  lightOrDark = function (color) {

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      this.r = color[1];
      this.g = color[2];
      this.b = color[3];
    }
    else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'
      )
      );

      this.r = color >> 16;
      this.g = color >> 8 & 255;
      this.b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    this.hsp = Math.sqrt(
      0.299 * (this.r * this.r) +
      0.587 * (this.g * this.g) +
      0.114 * (this.b * this.b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (this.hsp > 127.5) {

      return '#000000';
    }
    else {

      return '#ffff';
    }
  }

  // [[start of functions used]]
  //  [[start of file upload]]
  // [[for input tag upload]]
  fileToUpload: File = null;

  // [[end of input tag upload]]

  // [[for drag and drop]]
  public files: UploadFile[] = [];

  // [[start of image crop changes]]
  imageChangedEvent: any = '';
  croppedImage: any = '';

  // close image model
  closeSeoModel = function (option) {
    var x = document.getElementById('quizSeoImageModal');
    var warning = document.getElementById("quizSeoImageSizeWarning");
    x.style.display = "none";
    this.cropImage = false;
    if (option == 'OK') {
      if (warning.style.display == 'none') {
        $('#seoImage').attr('src', this.croppedImage);
        // this.quizSeoImage = this.dataURItoFile(this.myCroppedImage, this.quizSeoImage.name);
      } else {
        alert("Selected file is greater than 2 MB");
      }
    }
  };

  //color picker related functions
  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    console.log("quizConfiguration in eventlog func", this.quizConfiguration);

    // need this to get the bgcolor binding work for right side quz customization
    if (event == "light") {

      this.colorType = "light";
      // set this variable to either Light/Dark based on last chosen type(font-light/dark)
      this.quizConfiguration.fontLightDark = event;
      this.quizConfiguration.fontColor = this.lightFontColor;
    } else if (event == "dark") {

      this.colorType = "dark";
      // set this variable to either Light/Dark based on last chosen type(font-light/dark)
      this.quizConfiguration.fontLightDark = event;
    }
    else {
      // binding quiz customization card on right side 
      this.colorType = 'background';
      this.color = data;
      // this.color.index = index;
      console.log(this.color);
    }

    // $(document).on('click', '.saturation-lightness', function () {
    // $(document).ready(function () {
    if (this.colorType == 'background') {
      if (this.color.quizArea && this.color.quizArea.id == 2) {
        $('.live-preview__offer').css("background", this.color.backColor);
        console.log(this.color)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.live-preview__offer h5, .live-preview__offer p').css("color", color);
        }

      } else if (this.color.quizArea.id == 1) {
        $('.live-preview__offer--btn').css("background-color", this.color.backColor)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.live-preview__offer--btn').css("color", color);
        }
      } else if (this.color.quizArea.id == 4) {
        $('.questionStyle').css("background-color", this.color.backColor)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.questionHeader').css("color", color);
          $('.questionStyleHeadline').css("color", color);
        }

      } else if (this.color.quizArea.id == 3) {
        $('.styleOutcome').css("background-color", this.color.backColor)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.styleOutcomeHeadline').css("color", color)
          $('.styleOutcomeShare').css("color", color)
          $('.styleOutcomeDesc').css("color", color);
        }

      } else if (this.color.quizArea.id == 6) {

        $('.live-preview__headers--title').css("background-color", this.color.backColor)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.live-preview__headers--title h4').css("color", color);
        }

      } else {

        $('.answerColor').css("background-color", this.color.backColor)
        if (this.quizConfiguration.fontColor == undefined) {
          var color = this.lightOrDark(this.color.backColor);
          $('.answerColor').css("color", color);
        }
      }
    } else if (this.colorType == 'light') {
      this.quizConfiguration.fontColor = this.lightFontColor;
      $('.questionHeader').css("color", this.lightFontColor);
      $('.live-preview__offer h5, .live-preview__offer p').css("color", this.lightFontColor);
      $('.live-preview__offer--btn').css("color", this.lightFontColor);
      $('.questionStyleHeadline').css("color", this.lightFontColor);
      $('.styleOutcomeHeadline').css("color", this.lightFontColor)
      $('.styleOutcomeShare').css("color", this.lightFontColor)
      $('.styleOutcomeDesc').css("color", this.lightFontColor);
      $('.live-preview__headers--title h4').css("color", this.lightFontColor);
      $('.answerColor').css("color", this.lightFontColor);
    } else {
      this.quizConfiguration.fontColor = this.darkFontColor;
      $('.questionHeader').css("color", this.darkFontColor);
      $('.live-preview__offer h5, .live-preview__offer p').css("color", this.darkFontColor);
      $('.live-preview__offer--btn').css("color", this.darkFontColor);
      $('.live-preview__question--heading').css("color", this.darkFontColor);
      $('.live-preview__outcome--heading').css("color", this.darkFontColor)
      $('.live-preview__outcome--share').css("color", this.darkFontColor)
      $('.live-preview__outcome--desc').css("color", this.darkFontColor);
      $('.live-preview__headers--title h4').css("color", this.darkFontColor);
      $('.answerColor').css("color", this.darkFontColor);

    }
    // });
  }

  // save colors
  async saveColors() {
    $('#loader').show();
    console.log(this.quizConfiguration);
    // this.authService.getAuthenticationToken().subscribe(data => {
    //   console.log(data);
    //   var token = JSON.parse(data._body);
    //   console.log(token.access_token);
    //   this.authService.saveToken(token)
    //   console.log('after save token', this.quizConfiguration);
    //   this.quizAPI.saveQuiz(this.quizConfiguration).subscribe(data => {
    //     console.log(data);
    //     $('#loader').hide();
    //     var quiz = JSON.parse(data._body);
    //     this.quizConfiguration = quiz.data;
    //     console.log('quiz object \n\n\n\n');
    //     console.log(quiz.data);
    //     this.quizConfigureservice.change(quiz.data);
    //     // this.router.navigate(['/quizSetup/Outcomes']); 
    //   });
    // });

    /*let data = await this.authService.getAuthenticationToken();
    var token = JSON.parse(data['_body']);
    this.authService.saveToken(token)
    console.log('after save token');*/

    let dataQuiz:any = await this.quizAPI.saveQuiz(this.quizConfiguration);
    console.log(this.quizConfiguration.quizMediaAttached);
    var quiz = dataQuiz;
    this.quizConfiguration = quiz.data;
    this.quizSetup.message = 'Data has been saved';
    setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    $("#messageBox").fadeIn();
    setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    console.log('quiz object in saveColors');
    console.log(quiz.data);
    if (dataQuiz)
      $('#loader').hide();
    this.quizConfigureservice.change(quiz.data);
  }

  resetColors = function () {
    $('.live-preview__offer').removeAttr("style");
    $('.live-preview__offer--btn').removeAttr("style");
    $('.questionStyle').removeAttr("style");
    $('.styleOutcome').removeAttr("style");
    $('.live-preview__headers--title').removeAttr("style");
    $('.answerColor').removeAttr("style");
    $('.live-preview__offer h5, .live-preview__offer p').removeAttr("style");
    $('.live-preview__offer--btn').removeAttr("style");
    $('.questionStyleHeadline').removeAttr("style");
    $('.styleOutcomeHeadline').removeAttr("style")
    $('.styleOutcomeShare').removeAttr("style")
    $('.styleOutcomeDesc').removeAttr("style");
    $('.live-preview__headers--title h4').removeAttr("style");
    $('.answerColor').removeAttr("style");
    $('.questionHeader').removeAttr("style");
    $(".setting__preview").removeAttr("style");
    $(".fontStyle").removeAttr("style");
    this.lightFontColor = "#E1E1E1"
    this.darkFontColor = "#363636"
    this.quizConfiguration.quizColorScheme.forEach(element => {
      element.backColor = element.quizArea.defaultColor;
    })
    this.quizConfiguration.fontName = null;
    this.quizConfiguration.fontColor = null;
    this.quizConfiguration.fontLightDark = null;
    this.saveColors();
  }

  updateQuizFont = function () {
    console.log(this.quizConfiguration.fontName);
    $(".setting__preview").css("font-family", this.quizConfiguration.fontName);
    $(".fontStyle").css("font-family", this.quizConfiguration.fontName);
    //this.quizConfiguration.fontName = this.fontStyle
  }

  // save settings seo data
  saveSeoData = async function () {
    // $('#loader').show();
    console.log(this.quizConfiguration);
    // this.loadingScreenService.startLoading();
    if (this.changedImage) {
      console.log("about to call uploadQuizSEOImage");
      await this.uploadQuizSEOImage();
    }
    console.log('after upload', this.quizConfiguration);

    // this.authService.getAuthenticationToken().subscribe(data => {
    //   console.log(data);
    //   var token = JSON.parse(data._body);
    //   console.log(token.access_token);
    //   this.authService.saveToken(token)
    //   console.log('after save token');
    //   this.quizAPI.saveQuiz(this.quizConfiguration).subscribe(data => {
    //     console.log(data);
    //     var quiz = JSON.parse(data._body);
    //     this.quizConfiguration = quiz.data;
    //     console.log('quiz object \n\n\n\n');
    //     console.log(quiz.data);
    //     this.quizConfigureservice.change(quiz.data);
    //     // this.router.navigate(['/quizSetup/Outcomes']); 
    //   });
    // });

    //let data = await this.authService.getAuthenticationToken();
    // let data = await this.authService.getToken();
    // var token = JSON.parse(data);
    //this.authService.saveToken(token)
    console.log('after save token');

    let dataQuiz:any = await this.quizAPI.saveQuiz(this.quizConfiguration);
    console.log(this.quizConfiguration.quizMediaAttached);
    var quiz = dataQuiz;
    this.quizConfiguration = quiz.data;
    console.log('quiz object in seo data');
    console.log(quiz.data);

    // if quizId doesn't exist in session storage, only then set it 
    // (to save data against the same id even after page reload)
    if (!localStorage.getItem("quizId")) {

      console.log("quizId for this SESSION", quiz.data.id);
      localStorage.setItem("quizId", quiz.data.id);
    }
    this.quizConfigureservice.change(quiz.data);
    this.quizSetup.message = 'Data has been saved';
    setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    $("#messageBox").fadeIn();
    setTimeout(function () { $("#messageBox").fadeOut(); }, 1000);
    // this.loadingScreenService.stopLoading();
  }

  uploadQuizSEOImage = async function () {
    var modKey = "quizImage";
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], "quizSEOImage", { type: 'image/jpeg' });
    let data: any = await this.fileUpload.uploadOutcomeImageToAmazonServer(imageFile);
    // .subscribe(data => {
    console.log(data);
    var res = data;
    this.apiresponse = res;
    // update seo image in quizConfo
    this.quizConfiguration.quizSEOMetadata.seoImage = res.message;
    //this.croppedImage = undefined;
    this.changedImage = false;

    console.log(res.message);
    // });
  }

  // convert image URI to Blob
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  // output event function of file upload
  onFileUpload(event: any) {
    console.log("this is the result of emitted output from file-upload component, uploaded file is", event.croppedImage);
    // update this component croppedImage binding with received image
    this.croppedImage = event.croppedImage;
    this.changedImage = event.changedImage;
  }


  //set database saved colors
  setColorAndTheme = function () {
    this.quizConfiguration.quizColorScheme.forEach(element => {
      if (element.quizArea != undefined) {
        if (element.quizArea.id == 2) {
          $('.live-preview__offer').css("background", element.backColor);
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            $('.live-preview__offer h5, .live-preview__offer p').css("color", color);
          }
        } else if (element.quizArea.id == 1) {
          $('.live-preview__offer--btn').css("background-color", element.backColor)
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            $('.live-preview__offer--btn').css("color", color);
          }
        } else if (element.quizArea.id == 4) {
          $('.questionStyle, .red-live-preview .questionStyle').css("background-color", element.backColor)
          this.questionBackgroundColor = element.backColor;
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            this.questionFontColor = color;
            $('.questionHeader').css("color", color);
            $('.questionStyleHeadline').css("color", color);
          } else {
            this.questionFontColor = this.quizConfiguration.fontColor
          }
        } else if (element.quizArea.id == 3) {
          $('.styleOutcome').css("background-color", element.backColor)
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            $('.styleOutcomeHeadline').css("color", color)
            $('.styleOutcomeShare').css("color", color)
            $('.styleOutcomeDesc').css("color", color);
          }
        } else if (element.quizArea.id == 6) {
          $('.live-preview__headers--title').css("background-color", element.backColor)
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            $('.live-preview__headers--title h4').css("color", color);
          }
        } else {
          $('.answerColor').css("background-color", element.backColor)
          this.answerBackgroundColor = element.backColor;
          if (this.quizConfiguration.fontColor == undefined) {
            var color = this.lightOrDark(element.backColor);
            this.answerFontColor = color;
            $('.answerColor').css("color", color);
          } else {
            this.answerFontColor = this.quizConfiguration.fontColor
          }
        }
      }
    })
    if (this.quizConfiguration.fontColor != null) {
      $('.questionHeader').css("color", this.quizConfiguration.fontColor);
      $('.live-preview__offer h5, .live-preview__offer p').css("color", this.quizConfiguration.fontColor);
      $('.live-preview__offer--btn').css("color", this.quizConfiguration.fontColor);
      $('.questionStyleHeadline').css("color", this.quizConfiguration.fontColor);
      $('.styleOutcomeHeadline').css("color", this.quizConfiguration.fontColor)
      $('.styleOutcomeShare').css("color", this.quizConfiguration.fontColor)
      $('.styleOutcomeDesc').css("color", this.quizConfiguration.fontColor);
      $('.live-preview__headers--title h4').css("color", this.quizConfiguration.fontColor);
      $('.answerColor').css("color", this.quizConfiguration.fontColor);
    }
    if (this.quizConfiguration.fontName != null) {
      $(".setting__preview").css("font-family", this.quizConfiguration.fontName);
      $(".fontStyle").css("font-family", this.quizConfiguration.fontName);
    }
  }
//Handeler that handels erorr if the status code of the api is not SUCCESS
serverError(data){
  Swal.fire({
    text: data.message,
    type: 'warning',

  }).then(result=>{
    if(result){
      this.router.navigate(['/']);
    }
  });
}

}
