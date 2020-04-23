import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { NgForm } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router, NavigationEnd } from '@angular/router';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service'
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { CookieService } from 'ngx-cookie-service';
import { MatVideoModule } from 'mat-video';
import Swal from 'sweetalert2';
//import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';
import { ActivatedRoute } from '@angular/router';
import { Common } from '../../../../../services/global/common';
import { FormValidationService } from '../../../../../services/global/form-validation.service';

@Component({
  selector: 'app-outcomes',
  templateUrl: './outcomes.component.html',
  styleUrls: ['./outcomes.component.css']
})
export class OutcomesComponent implements OnInit {

  questionImageSize: any;
  response;
  quizOutcome = {
    outcomeImageSize: 0,
    isOutcomeImgVideo: '',
    outcomeMediaAttached:'',
    outcomeTitle:'',
    outcomeDescription:'',
    offerHeadline:'',
    offerDescription:'',
    offerCallActionLabel:'',
    offerSendTo:''
  };
  quizOutcomeArray = [];
  index: any = this.quizOutcomeArray.length;
  cropImage: boolean = false;
  quizConfiguration = this.quizConfigureservice.getConfigurationObj();
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  changedImage: any = false;
  outcomeNumber = 1;
  baseUrl = this.common.serverUrl;
  constructor(
    public quizAPI: QuizapiserviceService, 
    public fileUpload: FileUploadAPIService,
    public router: Router,
    private common : Common,
    public quizConfigureservice: QuizConfigureserviceService,
    public formValidationService: FormValidationService
  ) {
    
    // this.router.events.subscribe((val) => {

    //   if (val instanceof NavigationEnd) {
    //   console.log("in router.events.subscribe of outcomes", val);
    //   // when there is a route change in middle of editing outcomes and without hitting save, 
    //   // add then into quizConfiguration variable

    //   console.log("quizOutcomesArray before switching to another tab", this.quizConfiguration, this.quizOutcome, this.quizOutcomeArray);

    //   // whenever there is a route change, save data into service and session storage
    //   // this.quizConfiguration.quizOutcomes.push(this.quizOutcome);
    //   this.quizConfigureservice.change(this.quizConfiguration);

    //   localStorage.setItem("quizConfiguration", JSON.stringify(this.quizConfiguration));
    //   }
    // })
  }

  // pass this as input to file upload component
  outcomes: any = 'outcomes';

  module: any = "outcomes";

  // @ViewChild(FileUploadComponent)
  // private fileUploadComponent: FileUploadComponent;

  @ViewChild(UploadFileComponent)
  private uploadFileComponent: UploadFileComponent;

  @ViewChild('outcomeTitle') outcomeTitle: any;

  @ViewChild('outcomeDesc') outcomeDesc: any;

  @ViewChild('offerHeadling') offerHeadling: any;

  @ViewChild("offerDescription") offerDescription: any;

  @ViewChild("actionLabel") actionLabel: any;

  @ViewChild("OutcomeCategory") OutcomeCategory: any;

  // this is used to persist id when user navigates from one module to other
  quizId: any;

  // this variable is used to hide 'add outcomes'/'save'/'cancel' buttons when user clicks on existing outcomes
  hideOutcomeButtons: boolean = false;

  ngOnInit() {

    localStorage.setItem("lastVisitedSubModule", "outcomes");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    if (this.quizConfiguration != null && !this.quizConfiguration.id) {

      this.quizConfiguration = {};

      this.quizConfiguration.quizOutcomes = [];
    }

    // get quizId from localStorage
    this.quizId = localStorage.getItem("quizId");

    // console.log("In the ngOninit of outcomes page, this.quizConfiguration", this.quizConfiguration, "this.quizId", this.quizId);

    // in configure page, based on id we fetch data and store in service
    // on page reload, this.quizConfiguration is empty bc data from service is gone, fetch data in this case using API
    if ( this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {

      // this.route.paramMap.subscribe(params => {
      //   console.log(params);
      //   console.log(this.route.snapshot.params.id);

      // if (this.route.snapshot.params.id != null || this.route.snapshot.params.id != undefined) {
      this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {
        console.log(dataQuiz);
        var quiz :any;
        quiz =  dataQuiz;

        if (quiz.status == 'SUCCESS') { 
        this.quizConfiguration = quiz.data;

        console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
        console.log(this.quizConfiguration);

        this.quizConfigureservice.change(this.quizConfiguration);

        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

        this.setOutcomesInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.OutcomePage){  
          if(this.quizConfiguration.colorSchemeObj.OutcomePage.length > 0){
        this.changePreviewColor();
          }
        }
      }else{
        this.serverError(quiz);
      }
      });
      //     $(".QuizTitleHeadline").text(this.quizConfiguration.quizTitle)
      //     if (this.quizConfiguration.quizLeadCaptureInfo != null) {
      //       if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', null);
      //       if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', null)
      //       if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', null)
      //     }

      //     if (this.quizConfiguration.isPvtPub == false) {
      //       $('.scopeOfQuiz').removeClass('active');
      //       $('#publicMarketPlace').addClass('active');
      //       $('.publicCategory').show();
      //       //this.quizConfiguration.webinarCategoryId = data.webinarCategoryId.toString();
      //       if (this.quizConfiguration.webinarSubCategoryId != null) {
      //         var subCategory = this.quizConfiguration.webinarSubCategoryId.split(",");
      //         for (var i = 0; i < subCategory.length; i++) {
      //           this.quizSubCategoryList.push({ tag: subCategory[i] });
      //         }
      //       }
      //     }
      // console.log('here ***************11111' + this.quizConfiguration.quizTitle);
      //     if (this.quizConfiguration.quizTitle != null) { this.keyupFunction('quizTitleCharCount', this.quizConfiguration.quizTitle, 'quiz-title-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //     if (this.quizConfiguration.quizDescription != null) { this.keyupFunction('quizDescCharCount', this.quizConfiguration.quizDescription, 'quiz-decs-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //     if (this.quizConfiguration.quizCallActionLabel != null) { this.keyupFunction('quizActionBtnCharCount', this.quizConfiguration.quizCallActionLabel, 'quiz-callToAction-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //     if (this.quizConfiguration.quizMediaAttached != null) { $("#quizImagePreview").attr("src", this.quizConfiguration.quizMediaAttached); }
      //     console.log(this.quizConfiguration);
      //     this.quizConfigureservice.change(this.quizConfiguration);
      //   });
      // }
      // else {
      //   $(".QuizTitleHeadline").text(this.quizConfiguration.quizTitle)
      //   if (this.quizConfiguration.quizLeadCaptureInfo != null) {
      //     if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', null);
      //     if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', null)
      //     if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', null)
      //   }


      //   if (this.quizConfiguration.isPvtPub == false) {
      //     $('.scopeOfQuiz').removeClass('active');
      //     $('#publicMarketPlace').addClass('active');
      //     $('.publicCategory').show();
      //     //this.quizConfiguration.webinarCategoryId = data.webinarCategoryId.toString();
      //     if (this.quizConfiguration.webinarSubCategoryId != null) {
      //       var subCategory = this.quizConfiguration.webinarSubCategoryId.split(",");
      //       for (var i = 0; i < subCategory.length; i++) {
      //         this.quizSubCategoryList.push({ tag: subCategory[i] });
      //       }
      //     }
      //   }
      // console.log('here ***************11111' + this.quizConfiguration.quizMediaAttached);
      //   if (this.quizConfiguration.quizTitle != null) { this.keyupFunction('quizTitleCharCount', this.quizConfiguration.quizTitle, 'quiz-title-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //   if (this.quizConfiguration.quizDescription != null) { this.keyupFunction('quizDescCharCount', this.quizConfiguration.quizDescription, 'quiz-decs-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //   if (this.quizConfiguration.quizCallActionLabel != null) { this.keyupFunction('quizActionBtnCharCount', this.quizConfiguration.quizCallActionLabel, 'quiz-callToAction-preview', { quizTitle: this.quizTitle, quizDescription: this.quizDescription, quizCallActionLabel: this.quizCallActionLabel }) }
      //   if (this.quizConfiguration.quizMediaAttached != null) {
      //     console.log($("#quizImagePreview").attr("src"));
      //     $("#quizImagePreview").attr("src", this.quizConfiguration.quizMediaAttached);
      //     console.log($("#quizImagePreview").attr("src"));
      //   }
      // }
      // })
    } else {

      // data exists in service, then don't make API call.
      if (this.quizConfiguration != null && (this.quizConfiguration.id != null || this.quizConfiguration.id != undefined || this.quizConfiguration.id != "")) {

        this.setOutcomesInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.OutcomePage){  
          if(this.quizConfiguration.colorSchemeObj.OutcomePage.length > 0){
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
        $('.OutcomeDesign').css("color", this.quizConfiguration.fontColor);
        $('#outcomeOfferDesign').css("color", this.quizConfiguration.fontColor);
        $('#outcomeOfferButtonPreview').css("color", this.quizConfiguration.fontColor);
        $('.questionTitle h4').css("color", this.quizConfiguration.fontColor);
       }
       if(this.quizConfiguration.fontName != null){
        $(".OutcomeDesign").css("font-family", this.quizConfiguration.fontName);
        $("#outcomeOfferDesign").css("font-family", this.quizConfiguration.fontName);
        $('#outcomeOfferButtonPreview').css("font-family", this.quizConfiguration.fontName);
        $('.questionTitle h4').css("font-family", this.quizConfiguration.fontName);
       }
      this.colorScheme = this.quizConfiguration.colorSchemeObj.OutcomePage;
      console.log(this.colorScheme);
      this.colorScheme.forEach(color =>{
        if(color.quizArea.areaName == "Outcome Background"){
          $('.styleOutcome').css("background", color.backColor);
          this.changeTextColor('.OutcomeDesign',color.backColor)
        }else if(color.quizArea.areaName == "Offer Background"){
          $('.live-preview__offer').css("background", color.backColor);
          this.changeTextColor('#outcomeOfferDesign',color.backColor )
        }else if(color.quizArea.areaName == "Call to action button"){
          $('#outcomeOfferButtonPreview').css("background", color.backColor);
          this.changeTextColor('#outcomeOfferButtonPreview',color.backColor )
        }
      })
      this.quizConfiguration.colorSchemeObj.Quiz.forEach(quizColor =>{
        if(quizColor.quizArea.areaName == 'Title Background color'){
          $('.questionTitle').css("background", quizColor.backColor);
          this.changeTextColor('.questionTitle h4',quizColor.backColor )
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
    // var newColor =await this.quizConfigureservice.lightOrDark(color);
    // $(component).css("color", newColor);
  }

  setOutcomesInitData(quiz: any) {

    this.quizConfiguration = quiz;

        console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
        console.log(this.quizConfiguration);

        // update this.quizOutcome, if it exists in this.quizConfiguration
        if (this.quizConfiguration.quizOutcomes && this.quizConfiguration.quizOutcomes.length > 0) {

          // this.quizOutcome = this.quizConfiguration.quizOutcomes[0];
          this.quizOutcomeArray = this.quizConfiguration.quizOutcomes;
        }else{
          if(localStorage.getItem("funnelUrl") == 'QuizandWebinar')
          this.quizOutcome.offerSendTo = this.baseUrl+'/registerForWebinar?id='+localStorage.getItem("webinarId");
        }
         
        if (this.quizConfiguration.quizOutcomes) {
          this.quizOutcomeArray = this.quizConfiguration.quizOutcomes;
          if (this.quizConfiguration.quizOutcomes.length > 0) {
            $('#newOutcome').hide();
          }
        }

        // store data in service 
        this.quizConfigureservice.change(this.quizConfiguration);

        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
  }

  // write jquery functions for jquery functionality to be working
  ngAfterViewInit() {

    this.quizConfiguration = this.quizConfigureservice.getConfigurationObj();
    console.log('After view is initialised');
    if (this.quizConfiguration != null && this.quizConfiguration.quizOutcomes) {
      this.quizOutcomeArray = this.quizConfiguration.quizOutcomes;
      if (this.quizConfiguration.quizOutcomes.length > 0) {
        $('#newOutcome').hide();
      }
    }
    //this.outcomeNumber = this.quizOutcomeArray.length + 1;
  }


  keyupFunction = function (charCount, from, to, validation) {

    console.log("in keyupFunction", charCount, from, to, validation);

    console.log("this.quizConfiguration", this.quizConfiguration);

    // update this quizConfigurationOutComes array data
    // if (this.quizOutcomeArray.length > 0) {

    //   this.quizConfiguration.quizOutcomes = this.quizOutcomeArray;

    //   // set latest updated quizOutcome to localStorage for validation to work
    //   // localStorage.setItem("quizOutcome", JSON.stringify(this.quizConfiguration.quizOutcomes[this.quizOutcomeArray.length - 1]));
    // } else {
    //   // if there is no quizOutcomeArray, it means only one unsaved outcomes is present
    //   // this.quizOutcomeArray = this.quizOutcomeArray.concat([this.quizOutcome]);
    //   this.quizConfiguration.quizOutcomes = [this.quizOutcome];

    //   // set latest updated quizOutcome to localStorage for validation to work
    //   // localStorage.setItem("quizOutcome", JSON.stringify(this.quizOutcome));
    // }

    // update this quizConfigurationOutComes array data
    // this.newQuestion.questionDescription || this.newQuestion.quizAnswers.length != 0
    // TODO:handle edit, charCount.includes(0) <-- used this to prvent duplicate eneries at the of edit outcomes
    if ( !charCount.includes(0) && validation != null && (this.quizOutcome.offerCallActionLabel ||
      this.quizOutcome.offerDescription ||
      this.quizOutcome.offerHeadline ||
      this.quizOutcome.outcomeDescription ||
      this.quizOutcome.outcomeTitle)) {
      this.quizConfiguration.quizOutcomes = this.quizOutcomeArray.concat([this.quizOutcome]);

      this.quizConfigureservice.change(this.quizConfiguration);
      this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    }

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



  saveSingleOutcome = async function () {
   
    // set hideOutcomeButtons to false, to show save, back, add outcomes buttons
    this.hideOutcomeButtons = false;
    
    //console.log(this.quizPage2)
    if (this.changedImage) {
      var modKey = "quizOutcomeImage";
      console.log(this.outcomeImage);
      let data = await this.fileUpload.uploadOutcomeImageToAmazonServer(this.outcomeImage);
      console.log(data);
      var res = data;
      this.apiresponse = res;
      this.quizOutcome.outcomeMediaAttached = res.message;
      this.changedImage = false;
      this.croppedImage = false;
      // hide video tag
      this.videoToShow = true;
      console.log(res.message);
    }
    /*else if(!this.videoToShow)
    {
       var modKey="quizOutcomeImage";
       /*const imageBlob = this.dataURItoBlob(this.croppedImage);
        const imageFile = new File([imageBlob], "outcomeImage", { type: 'image/jpeg' });*/
    /*console.log(this.outcomeImage);
    let data = await this.fileUpload.uploadOutcomeImageToAmazonServer(this.outcomeImage);
    console.log(data);
    var res = JSON.parse(data._body);
    this.apiresponse = res;
    this.quizOutcome.outcomeMediaAttached = res.message;
    this.changedImage = false;
    this.croppedImage = '';
    console.log(res.message);
}*/
console.log(this.quizOutcome.indexValue);
    // if(localStorage.getItem("funnelUrl") == 'QuizandWebinar')
    // this.quizOutcome.offerSendTo = '/registerForWebinar?id='+localStorage.getItem('webinarId');

    if (this.quizOutcome.indexValue != undefined) {
      var i = this.quizOutcome.indexValue;
      // hide modal to crop the image
      this.cropImage = false;
      // delete this.quizOutcome.indexValue;
      // this.quizOutcomeArray.splice(i,1);
      // this.quizOutcomeArray.push(this.quizOutcome);
      this.quizOutcomeArray[i] = this.quizOutcome;
      this.saveOutcomes();
    } else {
      // hide modal to crop the image
      this.cropImage = false;
      this.quizOutcomeArray.push(this.quizOutcome);
      this.saveOutcomes();
    }
    //this.$apply();
    // this.quizOutcome = {};
    //  console.log("Without Upload Outcome Image")
    //  console.log(this.quizOutcomeArray);
    // this.outcomeNumber = this.quizOutcomeArray.length + 1 ;
    // hide modal to crop the image
    this.cropImage = false;
    console.log(this.quizOutcomeArray)
    this.resetOutcome();
   
  }

  uploadOutcomeImage = async function () {
    var modKey = "quizOutcomeImage";
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], "outcomeImage", { type: 'image/jpeg' });
    let data = await this.fileUpload.uploadOutcomeImageToAmazonServer(imageFile);
    console.log(data);
    var res = JSON.parse(data._body);
    this.apiresponse = res;
    this.quizOutcome.outcomeMediaAttached = res.message;
    this.changedImage = false;
    console.log(res.message);
  }


  saveOutcomes2() {
    var index = $('.create-quiz__menu li.active').index();
    $('.create-quiz__menu li').eq(index).addClass('done')
    $('.create-quiz__menu li span').eq(index).addClass('cf-correct');
  }

  async saveOutcomes(fromSaveAndNext?) {

    //this.configuration.quizOutcomes = this.quizOutcomeArray;
    // show modal to crop the image
    this.cropImage = false;
    // empty and push to avouid duplicate data
    // this.quizConfiguration.quizOutcomes = [];

     //this.quizOutcomeArray.forEach((item) => {
    //   // empty and push to avouid duplicate data
    //   this.quizConfiguration.quizOutcomes = [];

       //this.quizConfiguration.quizOutcomes.push(item);
     //});

    var index = $('.create-quiz__menu li.active').index();
    $('.create-quiz__menu li').eq(index).addClass('done')
    $('.create-quiz__menu li span').eq(index).addClass('cf-correct');
    this.resetOutcome();

    /*this.$http({
          method: 'POST',
          url: '/saveQuiz',
          data: this.quizConfiguration,
          headers: {'Content-Type': 'application/json'},
       }).then(function mySuccess(response) {
           console.log("Success:")
           this.configure.getQuizconfiguration = response.data;
           this.quizOutcomeArray = response.data.quizOutcomes;
           this.questionArray = response.data.quizQuestions;
           console.log(this.quizConfiguration)
       },function myError(response) {
            console.log("Error")
            console.log(response)
       });*/
    //if(this.authService.getToken("access_token") == null ||  this.authService.getToken("access_token") == '')
    // {
    console.log('inside if ');
    /*let data = await this.authService.getAuthenticationToken();
    console.log(data);
    var token = JSON.parse(data['_body']);
    console.log(token.access_token);
    this.authService.saveToken(token);
    console.log('after save token\n\n\n');*/
    console.log(this.quizConfiguration);
    // this directs user to outcomes page so get status until outcomes
    if (localStorage.getItem("edit") == "false") {
      this.quizConfiguration.moduleName = "Questions";
      delete this.quizConfiguration.moduleStatus;
    }

    this.quizConfigureservice.change(this.quizConfiguration);

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
     var data = { "id": this.quizId, "quizOutcomes":this.quizConfiguration.quizOutcomes  };
    let dataQuiz:any = await this.quizAPI.saveQuiz(data);
    console.log(dataQuiz);
    var quiz = dataQuiz;

    if (quiz) {

      // if quizId doesn't exist in session storage, only then set it 
      // (to save data against the same id even after page reload)
      if (!localStorage.getItem("quizId")) {

        console.log("quizId for this SESSION", quiz.data.id);
        localStorage.setItem("quizId", quiz.data.id);
      }

      this.quizConfigureservice.change(quiz.data,"Outcome");

      this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
      this.quizOutcomeArray = quiz.data.quizOutcomes;

      if (fromSaveAndNext) {
        this.router.navigate(['/quizSetup/Questions']);
      }
    }
    // this.qc = JSON.parse(localStorage.getItem('quizConfiguration')).id;

    // console.log("localStorage.getItem('quizConfiguration')", this.qc);

    // }
  }

  resetOutcome = function () {

    this.hideOutcomeButtons = false;

    //this.quizForm.reset();
    this.quizForm.form.markAsPristine();
    this.quizForm.form.markAsUntouched();
    this.quizForm.form.setErrors({ 'invalid': false });
    console.log('resetting form');
    Object.keys(this.quizForm.form.controls).forEach(control => {
      this.quizForm.form.controls[control].setErrors({ 'incorrect': false });

      this.quizForm.form.controls[control].markAsUntouched();
      this.quizForm.form.controls[control].markAsPristine();
      console.log(control + ' : ' + this.quizForm.form.controls[control].invalid);
    });
    console.log(this.quizForm.valid);
    if (this.quizOutcome.indexValue != undefined) {
      $('#editOutcomeId' + this.quizOutcome.indexValue).hide();
      $("#outcomeTitleList" + this.quizOutcome.indexValue).show();
    } else {
      $('#newOutcome').hide();
    }
    $('#outcomeImagePreview').show();
    $('#outcomeVideoPreview').hide();
    this.quizOutcome = {};
    this.videoToShow = true;
    this.imageToShow = true;
    // this.cropImage = true;
    this.cropImage = false;
    // remove existing image selected
    this.croppedImage = false;

    // if croppedImage exists do not show default image/video
    if (this.croppedImage) {
      this.videoToShow = false;
      this.imageToShow = false;
    }
    $('#quizOutcomeTitleCharCount').text('0/100');
    $('#outcomeDescCharCount').text('0/100');
    $('#outcomeOffferTitleCharCount').text('0/100');
    $('#outcomeOffferDescCharCount').text('0/100');
    $('#outcomeImagePreview').attr('src', '/assets/images/joel-filipe-196000-unsplash.jpg');

    this.keyupFunction('null', 'Outcome Number 1', 'outcome-title-preview', { outcomeTitle: this.outcomeTitle, outcomeDesc: this.outcomeDesc, offerHeadling: this.offerHeadling, offerDescription: this.offerDescription, actionLabel: this.actionLabel });
    this.keyupFunction('null', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero,sequi itaque aliquam, deleniti similique ipsum facere esse rerum dolorem', 'outcome-desc-preview', { outcomeTitle: this.outcomeTitle, outcomeDesc: this.outcomeDesc, offerHeadling: this.offerHeadling, offerDescription: this.offerDescription, actionLabel: this.actionLabel });
    this.keyupFunction('null', 'Dummy Offer Healine', 'outcomeOfferTitlePreview', { outcomeTitle: this.outcomeTitle, outcomeDesc: this.outcomeDesc, offerHeadling: this.offerHeadling, offerDescription: this.offerDescription, actionLabel: this.actionLabel });
    this.keyupFunction('null', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum excepturi iusto odio enim consectetur minima.', 'outcomeOfferDescPreview', { outcomeTitle: this.outcomeTitle, outcomeDesc: this.outcomeDesc, offerHeadling: this.offerHeadling, offerDescription: this.offerDescription, actionLabel: this.actionLabel });
    this.keyupFunction('null', 'Get Offer', 'outcomeOfferButtonPreview', { outcomeTitle: this.outcomeTitle, outcomeDesc: this.outcomeDesc, offerHeadling: this.offerHeadling, offerDescription: this.offerDescription, actionLabel: this.actionLabel });
    if(localStorage.getItem("funnelUrl") == 'QuizandWebinar')
    this.quizOutcome.offerSendTo = this.baseUrl+'registerForWebinar?id='+localStorage.getItem("webinarId");
  }

  addNewoutcome = function () {

     // set hideOutcomeButtons to false, to show save, back, add outcomes buttons
     this.hideOutcomeButtons = true;

    if(localStorage.getItem("funnelUrl") == 'QuizandWebinar')
    this.quizOutcome.offerSendTo = this.baseUrl+'/registerForWebinar?id='+localStorage.getItem("webinarId");
    $("#newOutcome").show();
  }

  deleteOutcome(index) {
    console.log('index : ', index);
    this.quizOutcomeArray.splice(index, 1);
    this.outcomeNumber = this.quizOutcomeArray.length + 1;
    this.saveOutcomes();
    this.resetOutcome();
  }

  viewOutcome = async function (index) {

    console.log("this.cropImage", this.cropImage);
    console.log(Object.keys(this.quizOutcome).length);
    if (Object.keys(this.quizOutcome).length == 0) {

      // show modal to crop the image
      // this.cropImage = true;
      console.log(this.quizOutcomeArray[index]);
      $("#outcomeTitleList" + index).hide();
      this.quizOutcome = this.quizOutcomeArray[index];
      this.quizOutcome.indexValue = index;
      this.outcomeNumber = index + 1;



      $("#editOutcomeId" + index).show();
      $("#newOutcome").hide();
      //  console.log(this.quizOutcomeArray[index])
      if (this.quizOutcome.isOutcomeImgVideo == "Video") {
        this.videoToShow = false;
        this.imageToShow = false;
        const video: HTMLVideoElement = this.outcomeVideoPreview.nativeElement;
        video.src = this.quizOutcome.outcomeMediaAttached
        this.croppedImage = "hide";
      } else {
        this.imageToShow = false;
        //$('#outcomeImagePreview').attr('src', this.quizOutcome.outcomeMediaAttached);
        this.croppedImage = this.quizOutcome.outcomeMediaAttached;

      }

      if (this.quizOutcome.outcomeTitle) this.keyupFunction('quizOutcomeTitleCharCount', this.quizOutcome.outcomeTitle, 'outcome-title-preview', null);
      if (this.quizOutcome.outcomeDescription) this.keyupFunction('outcomeDescCharCount', this.quizOutcome.outcomeDescription, 'outcome-desc-preview', null);
      if (this.quizOutcome.offerHeadline) this.keyupFunction('outcomeOffferTitleCharCount', this.quizOutcome.offerHeadline, 'outcomeOfferTitlePreview', null);
      if (this.quizOutcome.offerDescription) this.keyupFunction('outcomeOffferDescCharCount', this.quizOutcome.offerDescription, 'outcomeOfferDescPreview', null);
      if (this.quizOutcome.offerCallActionLabel) this.keyupFunction('null', this.quizOutcome.offerCallActionLabel, 'outcomeOfferButtonPreview', null);
    } else {
      var con = confirm("Your exsting outcome changes will be removed if you open any other outcome");
      // show modal to crop the image
      // this.cropImage = true;
      if (con == true) {
        $('#editOutcomeId' + this.quizOutcome.indexValue).hide();
        $("#outcomeTitleList" + this.quizOutcome.indexValue).show();
        this.quizOutcome = {};
        this.viewOutcome(index);

        // hide 'ad outcomes', 'save', 'back' options on clicking any outcome
        this.hideOutcomeButtons = true;
      }
    }

    this.quizConfigureservice.change(this.quizConfiguration);
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
  }

  sizeInLimit: any = true;
  fileToUpload: File = null;
  public video: ElementRef;
  @ViewChild('outcomeVideoPreview') outcomeVideoPreview: ElementRef;
  @ViewChild('quizPage2') quizForm: NgForm;
  imageToShow: boolean = true;
  videoToShow: boolean = true;
  outcomeImage: any;
  outcomeImageSize: any;
  acceptableFileSize: any = 2; // this is in MB;

  setVideoBinding(file: any) {
    this.outcomeImage = file;
    this.cropImage = false;
    this.uploadedVideo = true;
    this.quizOutcome.isOutcomeImgVideo = 'Video'
    this.croppedImage = "hide"; // wrote hide for effect on ngIf
    this.changedImage = true;
    const video: HTMLVideoElement = this.outcomeVideoPreview.nativeElement;
    this.imageToShow = false;
    this.videoToShow = false;
    console.log('file : ' + video.src);
    var fileUrl = window.URL.createObjectURL(file);
    //$(".video").attr("src", fileUrl);
    // to show video preview
    video.src = fileUrl;
    console.log('file : ' + video.src);
    /* setTimeout(() => {
         this.video.nativeElement.src = fileUrl;
     }, 3000);*/
  }

  file: any;

  // [[for drag and drop]]
  public files: UploadFile[] = [];

  // [[start of image crop changes]]
  imageChangedEvent: any = '';
  croppedImage: any = '';
  uploadedVideo: any = false;

  closeModel = function (option) {

    this.cropImage = false;
    var x = document.getElementById('outcomeImageModal');
    x.style.display = "none";
    // var warning = document.getElementById("outcomeImageSizeWarning");
    // warning.style.display = 'none';

    // if (option == 'OK') {
    if (!this.sizeInLimit) {
      alert("Selected image is more than 2 MB");
      // clear off cropped image when there is image not in size limit 
      this.croppedImage = "";
    } else {
      // $('#quizImagePreview').attr('src', this.myCroppedImage);
      //     this.quizImage = this.dataURItoFile(this.myCroppedImage,globalThis.quizImage.name);
    }
    // }
  };

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
    console.log("this is the result of emitted output from upload-file component, uploaded file is", event.file.type);
    // update this component croppedImage binding with received image
    this.croppedImage = event.croppedImage;
    this.changedImage = event.changedImage;
    this.cropImage = event.cropImage;
    // handle video tag updation logic
    if (event.file.type != 'image/png' && event.file.type != 'image/jpeg') {
      this.setVideoBinding(event.file);
      console.log(this.quizOutcome.outcomeMediaAttached);
    } else {
      console.log("inside else ******");
      // hide video element 
      this.videoToShow = true;

      // set this.outcomeImage to event.file to get the fioe uploaded
      this.outcomeImage = event.file;

      this.quizOutcome.isOutcomeImgVideo = 'Image';
    }
  }

  preview (setupForm, sectionId, previewBox) {

    $("#quizSideBar").hide();
    $("." + setupForm).hide();
    $("#" + sectionId).css({ 'margin-left': '0' });
    console.log(previewBox)
    console.log($("#" + previewBox).hasClass('col-lg-7'))
    if (previewBox == 'previewQuestion') {
      $("#" + previewBox).removeClass('col-lg-7');
    }
    $("#" + previewBox).addClass('col-md-12');
    $(".backButton").show();
  }
  backPreview (setupForm, sectionId, previewBox) {

    $("#quizSideBar").show();
    $("." + setupForm).show();
    $("#" + sectionId).css({ 'margin-left': '225px' });
    if (previewBox == 'previewQuestion') {
      $("#" + previewBox).addClass('col-lg-7');
    }
    $("#" + previewBox).removeClass('col-md-12');
    $(".backButton").hide();
  }
  howareyou(){
    console.log('hello');
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

// on clicking back in outciomes module
onOCBack() {

  this.router.navigate(['/quizSetup/WelcomePage']);
}

}
