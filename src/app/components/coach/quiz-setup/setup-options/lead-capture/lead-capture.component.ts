import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import jquery
import * as $ from 'jquery';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormValidationService } from '../../../../../services/global/form-validation.service';

@Component({
  selector: 'app-lead-capture',
  templateUrl: './lead-capture.component.html',
  styleUrls: ['./lead-capture.component.css']
})
export class LeadCaptureComponent implements OnInit {

  // [[start of variable declarations]]
  /*quizConfiguration: any = {
    allowSocialSharing: true,
    isPvtPub: true,
    multiVariationNo: "1",
    quizColorScheme: [],
    quizLeadCaptureInfo: {}
  };*/
  quizConfiguration = this.quizConfigureservice.getConfigurationObj();

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // [[end of variable declarations]]

  @ViewChild('headline') headline: any;

  @ViewChild('headlineDesc') headlineDesc: any;

  @ViewChild('callActionLabel') callActionLabel: any;

  constructor(
    
    public quizAPI: QuizapiserviceService, public router: Router,
    public quizConfigureservice: QuizConfigureserviceService,
   
    public formValidationService: FormValidationService
  ) {
  }

  quizSubCategoryList: any = [
    { tag: "item1" },
    { tag: "goodthing" },
    { tag: "mentalhealth" },
    { tag: "business" }
  ];

  // this is used to persist id when user navigates from one module to other
  quizId: any;

  module: any = "LeadCapture";

  ngOnInit() {

    localStorage.setItem("lastVisitedSubModule", "LeadCapture");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.getConfigurationObj();

    // if this.quizConfiguration is an empty object, initialize quizConf obj to avoid frontend undefined error
    if (this.quizConfiguration && !this.quizConfiguration.id) {
      this.quizConfiguration = {};
      this.quizConfiguration.quizLeadCaptureInfo = {};
      this.quizConfiguration.quizLeadCaptureInfo.headline = "";
      this.quizConfiguration.quizLeadCaptureInfo.headlineDesc = "";
      this.quizConfiguration.quizLeadCaptureInfo.callActionLabel = "";
    }

    // get quizId from localStorage
    this.quizId = localStorage.getItem("quizId");
 
    // if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {
    if (this.quizConfiguration == null && this.quizId) {
      this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {
        console.log(dataQuiz);
        var quiz : any;
        quiz = dataQuiz;
        if (quiz.status == 'SUCCESS') {
        this.quizConfiguration = quiz.data;

        console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
        console.log(this.quizConfiguration);

        this.quizConfigureservice.change(this.quizConfiguration);

        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

        this.setLeadCaptureInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.LeadCapture ){  
          if(this.quizConfiguration.colorSchemeObj.LeadCapture.length > 0){
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

    } else {

      // data exists in service, then don't make API call.
      if (this.quizConfiguration != null && this.quizConfiguration.id != null && this.quizConfiguration.id != undefined && this.quizConfiguration.id != "") {

        this.setLeadCaptureInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.LeadCapture ){ 
          if(this.quizConfiguration.colorSchemeObj.LeadCapture.length > 0){
        this.changePreviewColor();
          }
        }
      }
    }
  }

  setLeadCaptureInitData(quiz: any) {
    this.quizConfiguration = quiz;

        console.log('this console implies that fetch data from service');
        console.log(this.quizConfiguration);

        console.log(this.quizConfiguration);
        if ( this.quizConfiguration && this.quizConfiguration.quizLeadCaptureInfo != null) {
          if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel });
          if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel })
          if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel })
        } else {
          
            this.quizConfiguration.quizLeadCaptureInfo = {};
        }

        // store data in service 
        this.quizConfigureservice.change(this.quizConfiguration);

        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
  }

  // write jquery functions for jquery functionality to be working
  ngAfterViewInit() {
    // console.log(this.quizConfiguration.quizLeadCaptureInfo);
    // if (this.quizConfiguration.quizLeadCaptureInfo != null) {
    //   if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('leadHeadlineCharCount', this.quizConfiguration.quizLeadCaptureInfo.headline, 'leadHeadlinePreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel });
    //   if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('leadDescriptionCharCount', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'leadDescPreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel })
    //   if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('leadButtonCharCount', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'leadActionBtnPreview', { headline: this.headline, headlineDesc: this.headlineDesc, callActionLabel: this.callActionLabel })
    // }

  }
  // [[start of functions]]
  colorScheme= [];
  //Naincy :- This function will change the background and call to action button color for the welcome page
  changePreviewColor(){
    console.log(this.quizConfiguration.colorSchemeObj)
       if(this.quizConfiguration.fontColor != null){
        $('.leadColor').css("color", this.quizConfiguration.fontColor);
        $('#leadActionBtnPreview').css("color", this.quizConfiguration.fontColor);
        $('.questionTitle h4').css("color", this.quizConfiguration.fontColor);
       }
       if(this.quizConfiguration.fontName != null){
        $(".leadColor").css("font-family", this.quizConfiguration.fontName);
        $("#leadActionBtnPreview").css("font-family", this.quizConfiguration.fontName);
        $('.questionTitle h4').css("font-family", this.quizConfiguration.fontName);
       }
      this.colorScheme = this.quizConfiguration.colorSchemeObj.LeadCapture;
      console.log(this.colorScheme);
      this.colorScheme.forEach(color =>{
        if(color.quizArea.areaName == "Lead Capture Background"){
          $('.login').css("background", color.backColor);
          this.changeTextColor('.leadColor',color.backColor)
        }else if(color.quizArea.areaName == "Call to action button"){
          $('#leadActionBtnPreview').css("background", color.backColor);
          this.changeTextColor('#leadActionBtnPreview',color.backColor )
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

  keyupFunction = function (charCount, from, to, validation: any) {

    console.log("in keyupFunction", charCount, from, to, validation);

    // upda this quizConfiguration data into localStorage
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

  async saveLead() {

    console.log(this.quizConfiguration);

    /*let data = await this.authService.getAuthenticationToken();
    var token = JSON.parse(data['_body']);
    this.authService.saveToken(token)
    console.log('after save token');*/

    // this.quizConfigureservice.change(this.quizConfiguration);

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
     var data = { "id": this.quizId, "quizLeadCaptureInfo": this.quizConfiguration.quizLeadCaptureInfo }
    let dataQuiz:any = await this.quizAPI.saveQuiz(data);
    this.quizConfigureservice.change(dataQuiz.data,'Lead Capture');

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
   
    // console.log(quiz.data);

    // if quizId doesn't exist in session storage, only then set it 
    // (to save data against the same id even after page reload)
    if (!localStorage.getItem("quizId")) {

      localStorage.setItem("quizId",this.quizConfiguration.id);
    }

    this.quizConfigureservice.change(this.quizConfiguration);
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    if (this.quizConfiguration && this.quizConfiguration.quizLeadCaptureInfo != null) {
      if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel == undefined ||
        this.quizConfiguration.quizLeadCaptureInfo.headline == undefined ||
        this.quizConfiguration.quizLeadCaptureInfo.headlineDesc == undefined) {
        $('.create-quiz__menu li').eq(3).removeClass('done')
        $('.create-quiz__menu li span').eq(3).removeClass('cf-correct');
        $('.create-quiz__menu li').eq(3).addClass('not-completed')
        $('.create-quiz__menu li span').eq(3).addClass('cf-alert');
      } else {
        $('.create-quiz__menu li').eq(3).removeClass('not-completed')
        $('.create-quiz__menu li span').eq(3).removeClass('cf-alert')
        $('.create-quiz__menu li').eq(3).addClass('done')
        $('.create-quiz__menu li span').eq(3).addClass('cf-correct');
      }
      // this.cancelQuestionEditing(null);
      $("#outcomeMappingLineA").css("background-color", '#ffff');
      $("#outcomeMappingLineB").css("background-color", '#ffff');
      $("#outcomeMappingLineC").css("background-color", '#ffff');
      $("#outcomeMappingLineD").css("background-color", '#ffff');
      $("#outcomeMappingLineE").css("background-color", '#ffff');
      $("#outcomeMappingLineF").css("background-color", '#ffff');
    }

    this.router.navigate(['/quizSetup/QuizDesign/']);

  }
  // [[end of functions]]
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
