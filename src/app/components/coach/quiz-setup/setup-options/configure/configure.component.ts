import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service'

import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

// import jquery
import * as $ from 'jquery';

import { Subscription } from 'rxjs'

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';

//import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';
import Swal from 'sweetalert2';
// import { LocalStorage } from '@ngx-pwa/local-storage';

import { FormValidationService } from '../../../../../services/global/form-validation.service';
import { CommonService } from 'src/app/services/global/common.service';

import * as _ from 'lodash';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit, AfterViewInit {

  /*quizConfiguration: any = {
    allowSocialSharing: true,
    isPvtPub: true,
    multiVariationNo: "1",
    quizColorScheme: []
  };*/

  quizConfiguration = this.quizConfigureservice.quizConfiguration;
  quizSEOMetadata: any = {};
  quizSubCategoryList: any = [
    { tag: "item1" },
    { tag: "goodthing" },
    { tag: "mentalhealth" },
    { tag: "business" }
  ];

  variation: any;

  quizImage: any;

  tags: any;

  subCategoryLimit: any;

  itemsList: any = [];

  module: any = "Welcome Page";

  mainCategoryList: any = [];
  // this is sub-category chips list
  // TODO: get this from api call may be?
  public items = [
    // {display: 'Debt Managemen', value: 1},
    // {display: 'Depression', value: 2},
    // {display: 'Adventure', value: 3},
    // {display: 'Mindfulness', value: 4},
    // {display: 'Friends Relationships', value: 5},
    // {display: 'Career', value: 6},
  ];

  itemsAsObjects = [{ id: 0, name: 'Angular' }, { id: 1, name: 'React' }];

  cropImage: boolean = false;

  // use this elements to set form validity using service call and update
  // left side nav based on a given module form validation
  @ViewChild('quizPage1') quizForm: NgForm;

  @ViewChild('quizTitle') quizTitle: any;

  @ViewChild('quizDescription') quizDescription: any;

  @ViewChild('quizCallActionLabel') quizCallActionLabel: any;

  // constructor(public HttpClient:HttpClient){ }
  constructor(public fileUpload: FileUploadAPIService,
    public authService: AuthapiserviceService,
    public quizAPI: QuizapiserviceService, public router: Router,
    public quizConfigureservice: QuizConfigureserviceService,
    public commonService: CommonService) {

  }

  // pass this as input to file upload component
  configure: any = 'configure';

  @ViewChild(UploadFileComponent)
  private uploadFileComponent: UploadFileComponent;

  @ViewChild('configureVideoPreview') configureVideoPreview: ElementRef;

  // this is used to to set id when user navigates from one module to other and fetches data based on this id
  // does not appear in the url
  quizId: any;

  currentUser: any;

  ngOnInit() {
    // window.scrollTo(0, 0);
    //$('body').scrollTop(0);
    localStorage.setItem("lastVisitedSubModule", "Configure");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    // get editQuizId from localStorage
    this.quizId = localStorage.getItem("quizId");

    console.log("in ngOnInit of configure, founf quizId", this.quizId);

    //this.cookie.delete('access_token','/');
    //localStorage.removeItem("token");
    // console.log(this.quizConfiguration);
    // console.log(JSON.parse(this.authService.getToken()));
    // console.log(JSON.parse(localStorage.getItem('currentUser')));
    //this.getMultiVariationList();
   // this.getCtegorySubCategoryList();

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

    // quizId exists, get data based on quizId and store in quizservice
    // and on page refresh make an api if data does not exist in quizservice
    // this is used for page refresh handling
    if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {

      // if quizConfiguration is empty on service like in  case of page refresh
      // and quizId exists make an API call
      // get data from quizConf service
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

          this.setConfigureInitData(this.quizConfiguration);
          if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.WelcomePage){ 
          if(this.quizConfiguration.colorSchemeObj.WelcomePage.length > 0){
            this.changePreviewColor();
          }
        }
        }else{
            this.serverError(quiz);
        }
      })
    } else {
      // data exists in service, then don't make API call.
      if (this.quizConfiguration && (this.quizConfiguration.id != null || this.quizConfiguration.id != undefined || this.quizConfiguration.id != "")) {

        this.setConfigureInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.WelcomePage){  
          if(this.quizConfiguration.colorSchemeObj.WelcomePage.length > 0){
          this.changePreviewColor();
        }
      }
      }
    }
  }

  colorScheme= [];
  //Naincy :- This function will change the background and call to action button color for the welcome page
  changePreviewColor(){
       if(this.quizConfiguration.fontColor != null){
        $('.welcomePageClass').css("color", this.quizConfiguration.fontColor);
       }
       if(this.quizConfiguration.fontName != null){
        $(".welcomePageClass").css("font-family", this.quizConfiguration.fontName);
        $("#quiz-callToAction-preview").css("font-family", this.quizConfiguration.fontName);
       }
      this.colorScheme = this.quizConfiguration.colorSchemeObj.WelcomePage;
      this.colorScheme.forEach(color =>{
        if(color.quizArea.areaName == "Call to action button"){
          $('#quiz-callToAction-preview').css("background", color.backColor);
          this.changeTextColor('#quiz-callToAction-preview',color.backColor )
        }else if(color.quizArea.areaName == "Background color"){
          $('.welcomePageBackground').css("background", color.backColor);
          this.changeTextColor('.welcomePageClass',color.backColor )
        }
      })
      
  }
// this function changes the font color of the section whose background color is lighter than the font color or vise versa
  async changeTextColor(component,color){
    if(this.quizConfiguration.fontColor != null){
      var fontColor = await this.quizConfigureservice.getPerceptualBrightness(this.quizConfiguration.fontColor);
      var backColor = await this.quizConfigureservice.getPerceptualBrightness(color);
      console.log(fontColor+":"+backColor);
      if (fontColor < backColor) 
      { 
          $(component).css("color", this.quizConfiguration.fontColor);
      }else{
        var newColor = await this.quizConfigureservice.lightOrDark(color);
        $(component).css("color", newColor);
      }
    }else {
       var newColor = await this.quizConfigureservice.lightOrDark(color);
        $(component).css("color", newColor);
    }
    // var newColor = await this.quizConfigureservice.lightOrDark(color);
    // $(component).css("color", newColor);
  }



  // initialization logic
  setConfigureInitData(quiz: any) {
    // window.scrollTo(0, 0);
    this.quizConfiguration = quiz;
          this.variation = this.quizConfiguration.multiVariationNo;
          $(".QuizTitleHeadline").text(this.quizConfiguration.quizTitle)
          if (this.quizConfiguration.quizLeadCaptureInfo != null) {
            if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', null);
            if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', null)
            if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', null)
          }
          if (this.quizConfiguration.isPvtPub == false) {
            $('.scopeOfQuiz').removeClass('active');
            $('#publicMarketPlace').addClass('active');
            $('.publicCategory').show();
            //this.quizConfiguration.webinarCategoryId = data.webinarCategoryId.toString();
            if (this.quizConfiguration.webinarSubCategoryId != null) {
              var subCategory = this.quizConfiguration.webinarSubCategoryId.split(",");
              for (var i = 0; i < subCategory.length; i++) {
                this.quizSubCategoryList.push({ tag: subCategory[i] });
              }
            }
          }
          if (this.quizConfiguration.quizTitle != null) { this.keyupFunction('quizTitleCharCount', this.quizConfiguration.quizTitle, 'quiz-title-preview', this.quizTitle) }
          if (this.quizConfiguration.quizDescription != null) { this.keyupFunction('quizDescCharCount', this.quizConfiguration.quizDescription, 'quiz-decs-preview', this.quizDescription) }
          if (this.quizConfiguration.quizCallActionLabel != null) { this.keyupFunction('quizActionBtnCharCount', this.quizConfiguration.quizCallActionLabel, 'quiz-callToAction-preview', this.quizCallActionLabel) }
          if (this.quizConfiguration.quizMediaAttached != null) { 

            let vidFormats = ['.webm', '.mkv', '.flv', '.vob', '.ogg', '.ogv', '.drc', '.gif', '.gifv', '.mng',
                              '	.avi', '.MTS', '.M2TS', '.TS', '.mov', '.qt', '.wmv', '.mp4', '.amv', 'm4p', 
                              '.mpg', '.mpeg', '.m4v', '.3gp', '.flv'];

            for (let i=0; i<vidFormats.length; i++) {

              let item = vidFormats[i];
              if (this.quizConfiguration.quizMediaAttached.includes(item)) {

                this.fileType = "video";

                $("#quizVideoPreview").attr("src", this.quizConfiguration.quizMediaAttached); 

                break;

              }
            };  
            

            if (this.fileType != "video") {
              this.fileType = "image";

              $("#quizImagePreview").attr("src", this.quizConfiguration.quizMediaAttached); 
            }
              
          }

          // console.log("THIS.FILETYPE", this.fileType);

          // console.log(this.quizConfiguration);
          if (this.quizConfiguration.allowSocialSharing == false) {
            if ($('#socialSharingBtn').hasClass('on')) {
              $('#socialSharingBtn').removeClass('on')
              $('#socialSharingBtn').addClass('off')
              $('.shareLink').hide();
            }
          }

           // store data in service 
           this.quizConfigureservice.change(this.quizConfiguration);

           this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
           window.scrollTo(0, 0);
  }

  videoELement: HTMLVideoElement;

  // write jquery functions for jquery functionality to be working
  ngAfterViewInit() {

    this.videoELement = this.configureVideoPreview.nativeElement;

    // Jquery for Toggeling on off button for social Media on Quiz configure page
    $('.toggle-on-off').on('click', function () {
      if ($('.toggle-on-off').hasClass('on')) {
        $('.toggle-on-off').removeClass('on');
        $('.toggle-on-off').addClass('off');
        $('.shareLink').hide();
      } else {
        $('.toggle-on-off').removeClass('off');
        $('.toggle-on-off').addClass('on');
        $('.shareLink').show();
      }
    });

    // Jquery for adding activated class when selected Private and Public Button on Quiz configure page
    $('.scopeOfQuiz').on('click', function () {
      $('.scopeOfQuiz').removeClass('active');
      $(this).addClass('active');
      if ($(this).text() == 'Public') {
        $('.publicCategory').show();
      } else if ($(this).text() == 'Private') {
        $('.publicCategory').hide();
      }
    });

    // Jquery for adding activated class when selected Private and Public Button on Quiz configure page
    $('.scopeOfQuiz').on('click', function () {
      $('.scopeOfQuiz').removeClass('active');
      $(this).addClass('active');
      if ($(this).text() == 'Public') {
        $('.publicCategory').show();
      } else if ($(this).text() == 'Private') {
        $('.publicCategory').hide();
      }
    });


    $(".QuizTitleHeadline").text(this.quizConfiguration.quizTitle)
    if (this.quizConfiguration.quizLeadCaptureInfo != null) {
      if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', null);
      if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', null)
      if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', null)
    }


    if (this.quizConfiguration.isPvtPub == false) {
      $('.scopeOfQuiz').removeClass('active');
      $('#publicMarketPlace').addClass('active');
      $('.publicCategory').show();
      //this.quizConfiguration.webinarCategoryId = data.webinarCategoryId.toString();
      if (this.quizConfiguration.webinarSubCategoryId != null) {
        var subCategory = this.quizConfiguration.webinarSubCategoryId.split(",");
        for (var i = 0; i < subCategory.length; i++) {
          this.quizSubCategoryList.push({ tag: subCategory[i] });
        }
      }
    }
    console.log('here ***************11111' + this.quizConfiguration.quizMediaAttached);
    if (this.quizConfiguration.quizTitle != null) { this.keyupFunction('quizTitleCharCount', this.quizConfiguration.quizTitle, 'quiz-title-preview', null) }
    if (this.quizConfiguration.quizDescription != null) { this.keyupFunction('quizDescCharCount', this.quizConfiguration.quizDescription, 'quiz-decs-preview', null) }
    if (this.quizConfiguration.quizCallActionLabel != null) { this.keyupFunction('quizActionBtnCharCount', this.quizConfiguration.quizCallActionLabel, 'quiz-callToAction-preview', null) }
    if (this.quizConfiguration.quizMediaAttached != null) {
      $("#quizImagePreview").attr("src", this.quizConfiguration.quizMediaAttached);
    }
    if (this.quizConfiguration.webinarSubCategoryId != null) {
      var subCatArr = this.quizConfiguration.webinarSubCategoryId.split(',');
      this.itemsList= [];
      subCatArr.forEach(element => {
        if (element != '') {
          //this.items.push({"display":element,"value":3});
          this.itemsList.push({ "display": element });
        }
      })
    }

    if (this.quizConfiguration.allowSocialSharing == false) {
      if ($('#socialSharingBtn').hasClass('on')) {
        $('#socialSharingBtn').removeClass('on')
        $('#socialSharingBtn').addClass('off')
        $('.shareLink').hide();
      }
    }
  }

  preview(setupForm, sectionId, previewBox) {

    $("#quizSideBar").hide();
    $("." + setupForm).hide();
    $("#" + sectionId).css({ 'margin-left': '0' });
    if (previewBox == 'previewQuestion') {
      $("#" + previewBox).removeClass('col-lg-7');
    }
    $("#" + previewBox).addClass('col-md-12');
    $(".backButton").show();
  }

  backPreview(setupForm, sectionId, previewBox) {

    $("#quizSideBar").show();
    $("." + setupForm).show();
    $("#" + sectionId).css({ 'margin-left': '225px' });
    if (previewBox == 'previewQuestion') {
      $("#" + previewBox).addClass('col-lg-7');
    }
    $("#" + previewBox).removeClass('col-md-12');
    $(".backButton").hide();
  }

  subCategoryList = function (type) {

    if (type == "Public") {
      this.quizConfiguration.webinarSubCategoryId = '';
      this.quizConfiguration.webinarCategoryId = "0";
      this.quizConfiguration.isPvtPub = false;

    } else {
      this.quizConfiguration.isPvtPub = true;
    }

  }

  closeModel = function (option) {

    this.cropImage = false;
    var x = document.getElementById('quizImageModal');
    x.style.display = "none";
    var warning = document.getElementById("quizImageSizeWarning");
    warning.style.display = 'none'

  };

  allowSocialSharing = function (event) {
   
    var allow = event.currentTarget.classList[1];
    
    if (allow == 'on') {
      this.quizConfiguration.allowSocialSharing = false;
    } else {
      this.quizConfiguration.allowSocialSharing = true;
    }
  }

  qc: any;

  changeSubCategory()
  {
    this.quizConfiguration.webinarSubCategoryId = '';
    for (var i = 0; i < this.itemsList.length; i++) {

      if (this.quizConfiguration.webinarSubCategoryId == '')
        this.quizConfiguration.webinarSubCategoryId = this.itemsList[i].display;
      else
        this.quizConfiguration.webinarSubCategoryId = this.quizConfiguration.webinarSubCategoryId + ',' + this.itemsList[i].display;
    }
  }

  videoFile: any;

  async saveConfiguration() {
    
    var quizConfig;

    // delete webinarSubCategoryId, webinarCategoryId, isPvtPub at the time of save
    delete this.quizConfiguration.webinarSubCategoryId;
    delete this.quizConfiguration.webinarCategoryId;
    delete this.quizConfiguration.isPvtPub;

    // !this.quizConfiguration.webinarSubCategoryId || this.quizConfiguration.webinarCategoryId == 'select' ||  || !this.quizConfiguration.quizMediaAttached

    if (!this.quizConfiguration.quizTitle || !this.quizConfiguration.quizDescription ||
      !this.quizConfiguration.quizCallActionLabel) {
      var index = $('.create-quiz__menu li.active').index();
     
      $('.create-quiz__menu li').eq(index).addClass('not-completed')
      $('.create-quiz__menu li span').eq(index).removeClass('cf-correct');
      $('.create-quiz__menu li span').eq(index).addClass('cf-alert');
    } else {
      var index = $('.create-quiz__menu li.active').index();
     
      if ($('.create-quiz__menu li').eq(index).hasClass('not-completed')) {
        $('.create-quiz__menu li').eq(index).removeClass('not-completed')
      }
      if ($('.create-quiz__menu li span').eq(index).hasClass('cf-alert')) {
        $('.create-quiz__menu li span').eq(index).removeClass('cf-alert')
      }
      $('.create-quiz__menu li').eq(index).addClass('done')
      $('.create-quiz__menu li span').eq(index).addClass('cf-correct');
      this.quizSEOMetadata.seoMetaTitle = this.quizConfiguration.quizTitle;
      this.quizSEOMetadata.seoMetaDesc = this.quizConfiguration.quizDescription;
      this.quizSEOMetadata.seoImage = this.quizConfiguration.quizMediaAttached;
      this.quizConfiguration.quizSEOMetadata = this.quizSEOMetadata;
    }
   
    let data: any;

    if (this.changedImage && this.croppedImage) {
      var modKey = "quizImage";
      const imageBlob = this.dataURItoBlob(this.croppedImage);
      const imageFile = new File([imageBlob], "quizImage", { type: 'image/jpeg' });
      //this.cookie.delete('access_token','/');

      if (this.authService.getToken() == '') {

        Swal.fire({
          text: 'You are not logged in',
          type: 'warning',

        }).then((result) => {
          if (result.value) {

          

            this.router.navigate(['/'])
          }
        })
      };
      data = await this.fileUpload.uploadOutcomeImageToAmazonServer(imageFile)
    } else {

      if (this.changedImage) {

        if (this.authService.getToken() == '') {

          Swal.fire({
            text: 'You are not logged in',
            type: 'warning',

          }).then((result) => {
            if (result.value) {

         
              this.router.navigate(['/'])
            }
          })
        };

        data = await this.fileUpload.uploadOutcomeImageToAmazonServer(this.videoFile);
      }
    }


    if (data) {

      var res;
      res = data;
      this.quizConfiguration.quizMediaAttached = res.message;
      this.changedImage = false;
      
      this.croppedImage = this.quizConfiguration.quizMediaAttached;


      this.videoELement.src = this.quizConfiguration.quizMediaAttached;

    }
    
    // this directs user to outcomes page so get status until outcomes
    if (localStorage.getItem("edit") == "false") {
      this.quizConfiguration.moduleName = "outcomes";
      delete this.quizConfiguration.moduleStatus;
    }

    this.quizConfigureservice.change(this.quizConfiguration);

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    var welcomePageData :any = {};
    welcomePageData.allowSocialSharing = this.quizConfiguration.allowSocialSharing;
    welcomePageData.quizDescription = this.quizConfiguration.quizDescription;
    welcomePageData.quizMediaAttached = this.quizConfiguration.quizMediaAttached;
    welcomePageData.quizTitle = this.quizConfiguration.quizTitle;
    welcomePageData.quizCallActionLabel = this.quizConfiguration.quizCallActionLabel;
    if(this.quizConfiguration.id)
    welcomePageData.id = this.quizConfiguration.id;
    let dataQuiz:any = await this.quizAPI.saveQuiz(welcomePageData);
    var quiz = dataQuiz;
    if (quiz.statusCode == 200) {
    this.quizConfiguration = quiz.data;
    this.quizConfigureservice.change(this.quizConfiguration,'WelcomePage');


    // if quizId doesn't exist in session storage, only then set it 
    // (to save data against the same id even after page reload)
    if (!localStorage.getItem("quizId")) {
      localStorage.setItem("quizId", quiz.data.id);
    }

    this.router.navigate(['/quizSetup/Outcomes/']);
  }
  }

  openShareWindow = function () {

    var x = document.getElementById("shareQuizModal");
    if (x.style.display == 'block') {
      x.style.display = 'none';
    } else {
      x.style.display = 'block';
    }
  }

  // TODO: update quizCategoryList using a service request and populate with response, right now hard-coded
  quizCategoryList = [
    // {
    //   id: 1,
    //   displayName: "Business/Career"
    // },
    // {
    //   id: 2,
    //   displayName: "Money"
    // },
    // {
    //   id: 3,
    //   displayName: "Relationships"
    // },
    // {
    //   id: 4,
    //   displayName: "Emotions"
    // },
    // {
    //   id: 5,
    //   displayName: "Health"
    // },
    // {
    //   id: 6,
    //   displayName: "Spirituality"
    // },
    // {
    //   id: 7,
    //   displayName: "Impact"
    // },
    // {
    //   id: 8,
    //   displayName: "Personal Development"
    // }
  ];

  quizVariationList: any = [];
  /*{
    number: 2,
    words: "Two Paths"
  },
  {
    number: 3,
    words: "Three Paths"
  },
  {
    number: 4,
    words: "Four Paths"
  },
  {
    number: 5,
    words: "Five Paths"
  },
  ];*/
  variationArray: any = [];
  alphabetASCII: any = 65;

  keyupFunction = function (charCount, from, to, validation) {

    // console.log("in keyupFunction,", charCount, from, to, "checking for validation", validation);

    // console.log("this.quizConfiguration", this.quizConfiguration);

    // update this quizConfiguration data into localStorage
    this.quizConfigureservice.change(this.quizConfiguration);

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

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

  handleQuizImageFileSelect = function (event) {

  };

  fileToUpload: File = null;

  public files: UploadFile[] = [];

  imageChangedEvent: any = '';
  croppedImage: any = '';
  changedImage: any = false;

  async uploadQuizImage() {

  }
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

  setVideoBinding(file: any) {
    
    this.videoELement = this.configureVideoPreview.nativeElement;

    var fileUrl = window.URL.createObjectURL(file);
    //$(".video").attr("src", fileUrl);
    // to show video preview
    this.videoELement.src = fileUrl;
  }

  fileType: any = "image";

  // output event function of file upload
  onFileUpload(event: any) {
    console.log("this is the result of emitted output from upload-file component, uploaded file is", event);
    // update this component croppedImage binding with received image
    this.croppedImage = event.croppedImage;
    this.changedImage = event.changedImage;

    if (event.file.type.includes("video")) {
      this.videoFile = event.file;

      this.changedImage = true;

      this.fileType = "video";

      // remove binding of image upload when video has been uploaded
      this.croppedImage = "";

      this.setVideoBinding(event.file);
    }
  }

  async getMultiVariationList() {
    let multi:any = await this.quizAPI.getMultiVariationPath();
    //let multi =  JSON.parse(multiPathList['_body']);
    var a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
    // console.log('inside multi *******');
    if (multi.status == 'SUCCESS') {
      let multiData = multi.data;
      multiData.forEach(element => {
        // console.log('element', element);
        if (element > 1) {
          this.quizVariationList.push({ "number": element, "words": a[element] + " Paths" });
        }
      })
      // console.log(multiData);
    }
  }
  catData: any={};
  // async getCtegorySubCategoryList() {
  //   //let catData = {};
  //   this.catData =  await this.commonService.getCategory();
  //   if (this.catData.status == 'SUCCESS') {
  //     let categoryList = this.catData.data;
  //     this.mainCategoryList = categoryList;
  //     categoryList.forEach(element => {
  //       console.log('element', element);
  //       this.quizCategoryList.push({ "id": element.id, "displayName": element.displayName });
  //     })


  //   }
  //   else if (this.catData.status == 'ERROR') {
  //     console.log('No categories available nin database', this.catData.message);
  //   }
  // }

  // getSubCategoryList() {
  //   console.log(this.quizConfiguration.webinarCategoryId);
  //   if(this.quizConfiguration.webinarCategoryId == 'select')
  //   this.quizConfiguration.webinarCategoryId = 0;

  //   if (this.mainCategoryList.length > 0) {
  //     this.mainCategoryList.forEach(element => {
  //       console.log('element', element);
  //       if (element.id == this.quizConfiguration.webinarCategoryId) {
  //         this.items = [];
  //         console.log(element.subcategoryList);
  //         element.subcategoryList.forEach(subCat => {

  //           this.items.push({ "value": subCat.id, "display": subCat.displayName });
  //         })
  //         //this.items.push({"value":element.id,"display":element.displayName});
  //       }
  //     })
  //   }
  // }
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
