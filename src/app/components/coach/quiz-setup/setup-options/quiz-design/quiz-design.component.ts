import { Component, OnInit } from '@angular/core';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';
// import jquery
import * as $ from 'jquery';
import {CommonService} from  '../../../../../services/global/common.service';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
@Component({
  selector: 'app-quiz-design',
  templateUrl: './quiz-design.component.html',
  styleUrls: ['./quiz-design.component.css']
})
export class QuizDesignComponent implements OnInit {

  constructor(public quizConfigureservice: QuizConfigureserviceService,
              public commonService :CommonService,
              public quizAPI: QuizapiserviceService,) { }
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
  data: any =  {}
  tabData=[];
  quizConfiguration = this.quizConfigureservice.getConfigurationObj();
  colorSchems = [];
  lightFontColor = "#E1E1E1";
  darkFontColor = "#363636";
  color: any = {};
  quizId;
  colorType;

  module: any = "Quiz Design";

  ngOnInit() {
    
    console.log(this.quizConfiguration);
    // get editQuizId from localStorage
    this.quizId = localStorage.getItem("quizId");
    if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {

      // if quizConfiguration is empty on service like in  case of page refresh
      // and quizId exists make an API call
      // get data from quizConf service
      this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {
        
        var quiz :any;
        quiz = dataQuiz;
        console.log(quiz.data);
        if (quiz.status == 'SUCCESS') {
          this.quizConfiguration = quiz.data;
          this.quizConfigureservice.change(this.quizConfiguration);

          this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
          this.getDeafultcolors();
        }else{
            this.commonService.serverError(quiz);
        }
      })
    }else{
      this.getDeafultcolors();
    }
    
  }
  openTab(event, page){
    var  tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabPreviewContent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(page).style.display = "block";
    event.currentTarget.className += " active";
    if(page == 'welcomePage'){
      this.tabData = this.data.WelcomePage;
      this.changePreviewColor();
    }else if(page == 'quiz'){
      this.tabData = this.data.Quiz;
      this.changePreviewColor();
    }else if(page == 'leadCapture'){
      this.tabData = this.data.LeadCapture;
      this.changePreviewColor();
    }else if(page == 'outcomePage'){
      this.tabData = this.data.OutcomePage;
      this.changePreviewColor();
    }
  }
  defaultColors=[];
  async getDeafultcolors(){
    let data: any = await this.quizConfigureservice.getDefaultColor();
    console.log(data);
    if(data.status == 'SUCCESS'){
      this.data = data.data
      var welcomePage = document.getElementById('welcomePage');
      welcomePage.style.display = 'block';
      console.log(this.data);
      this.tabData = this.data.WelcomePage;
      console.log(this.tabData)
      if(this.quizConfiguration.fontLightDark == 'light'){
        this.lightFontColor = this.quizConfiguration.fontColor;
        this.onEventLog(this.quizConfiguration.fontLightDark, null)
      }else if(this.quizConfiguration.fontLightDark == 'dark'){
        this.darkFontColor = this.quizConfiguration.fontColor;
        this.onEventLog(this.quizConfiguration.fontLightDark, null)
      }
      if(this.quizConfiguration.fontName != null){
        this.updateQuizFont();
      }
      if(this.quizConfiguration.colorSchemeObj != null){  
      this.changePreviewColor();
    }
    }else{
        this.commonService.serverError(data);
    }
  }

  outcome=[];
  leadCapture=[];
  question=[];
  welcomePage=[];
  changePreviewColor(){
      if(this.quizConfiguration.quizColorScheme.length > 0){
        this.colorSchems = this.quizConfiguration.quizColorScheme;
        this.tabData.forEach(e=>{
          if(e.moduleName == "WelcomePage"){
                this.quizConfiguration.colorSchemeObj.WelcomePage.forEach(wp => {
                        if(e.areaName == wp.quizArea.areaName){
                          e.defaultColor = wp.backColor;
                          this.onEventLog('background',e);
                        }
                });
          }else if(e.moduleName == 'LeadCapture'){
            this.quizConfiguration.colorSchemeObj.LeadCapture.forEach(wp => {
              if(e.areaName == wp.quizArea.areaName){
                e.defaultColor = wp.backColor;
                this.onEventLog('background',e);
              }
              });
          }else if(e.moduleName == 'OutcomePage'){
            this.quizConfiguration.colorSchemeObj.OutcomePage.forEach(wp => {
              if(e.areaName == wp.quizArea.areaName){
                e.defaultColor = wp.backColor;
                this.onEventLog('background',e);
              }
              });
          }else if(e.moduleName == 'Quiz'){
            this.quizConfiguration.colorSchemeObj.Quiz.forEach(wp => {
              if(e.areaName == wp.quizArea.areaName){
                e.defaultColor = wp.backColor;
                this.onEventLog('background',e);
              }
              });
          }
        })
      }
  }

  //color picker related functions
  public onEventLog(event: string, data: any): void {
    console.log(event, data);
    // console.log("quizConfiguration in eventlog func", this.quizConfiguration);

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
      this.quizConfiguration.fontColor = this.darkFontColor;
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
      var colorSchem:any={};
      if (this.color.moduleName == "WelcomePage") {
        if(this.color.areaName == "Call to action button"){
          console.log(this.color.areaName)
          $('#quiz-callToAction-preview').css("background", this.color.defaultColor);
          this.changeTextColor('#quiz-callToAction-preview',this.color.defaultColor )
        }else if (this.color.areaName == "Background color"){
          console.log(this.color.areaName)
         
          $('.welcomePageBackground').css("background", this.color.defaultColor);
          this.changeTextColor('.welcomePageClass',this.color.defaultColor )
        }
      } else if (this.color.moduleName == "LeadCapture") {
        if(this.color.areaName == "Lead Capture Background"){
          $('.login').css("background", this.color.defaultColor);
          this.changeTextColor('.leadColor',this.color.defaultColor )
        }else{
          $('#leadActionBtnPreview').css("background", this.color.defaultColor);
          this.changeTextColor('#leadActionBtnPreview',this.color.defaultColor )
        }
      } else if (this.color.moduleName == "Quiz") {
        if(this.color.areaName == "Answer Background color"){
          $('.previewAnswerTable').css("background", this.color.defaultColor);
          this.changeTextColor('.previewAnswerTable',this.color.defaultColor )
        }else if(this.color.areaName == "Title Background color"){
          $('.questionTitle').css("background", this.color.defaultColor);
          this.changeTextColor('.questionTitle h4',this.color.defaultColor )
        }else{
          $('.quizDesign').css("background", this.color.defaultColor);
          this.changeTextColor('.quizDesign header span',this.color.defaultColor )
        }
      } else{
        if(this.color.areaName == "Outcome Background"){
          $('.styleOutcome').css("background", this.color.defaultColor);
          this.changeTextColor('.OutcomeDesign',this.color.defaultColor )
        }else if(this.color.areaName == "Offer Background"){
          $('.live-preview__offer').css("background", this.color.defaultColor);
          this.changeTextColor('.outcomeOfferDesign',this.color.defaultColor )
        }else{
          $('#outcomeOfferButtonPreview').css("background", this.color.defaultColor);
          this.changeTextColor('#outcomeOfferButtonPreview',this.color.defaultColor )
        }
      } 
       
           var count = 0
          this.colorSchems.forEach(element => {
            if(element.quizArea != null){ 
                if(element.quizArea.id == this.color.id){
                      element.backColor = this.color.defaultColor;
                      count ++;
                }
            }
          });
          if(count == 0){
            colorSchem.backColor = this.color.defaultColor;
            colorSchem.quizArea ={ 'id' : this.color.id } ;
            this.colorSchems.push(colorSchem);
            
          } else{
            count = 0;
          }
        // var index = this.data.WelcomePage.find( x=> x.id == this.color.id);
        

    } else if (this.colorType == 'light') {
      this.quizConfiguration.fontColor = this.lightFontColor;
      $('#quiz-callToAction-preview').css("color", this.lightFontColor);
      $('.welcomePageClass').css("color", this.lightFontColor);
      $('.leadColor').css("color", this.lightFontColor);
      $('#leadActionBtnPreview').css("color", this.lightFontColor);
      $('.previewAnswerTable').css("color", this.lightFontColor);
      $('.questionTitle h4').css("color", this.lightFontColor);
      $('.quizDesign header span').css("color", this.lightFontColor)
      $('.OutcomeDesign').css("color", this.lightFontColor)
      $('.outcomeOfferDesign').css("color", this.lightFontColor);
      $('#outcomeOfferButtonPreview').css("color", this.lightFontColor);
    } else if(this.colorType == 'dark') {
      this.quizConfiguration.fontColor = this.darkFontColor;
      $('#quiz-callToAction-preview').css("color", this.darkFontColor);
      $('.welcomePageClass').css("color", this.darkFontColor);
      $('.leadColor').css("color", this.darkFontColor);
      $('#leadActionBtnPreview').css("color", this.darkFontColor);
      $('.previewAnswerTable').css("color", this.darkFontColor);
      $('.questionTitle h4').css("color", this.darkFontColor);
      $('.quizDesign header span').css("color", this.darkFontColor)
      $('.OutcomeDesign').css("color", this.darkFontColor)
      $('.outcomeOfferDesign').css("color", this.darkFontColor);
      $('#outcomeOfferButtonPreview').css("color", this.darkFontColor);

    }
    // });
  }

  async changeTextColor(component,color){
      if(this.quizConfiguration.fontColor != null){
        var fontColor = await this.quizConfigureservice.getPerceptualBrightness(this.quizConfiguration.fontColor);
        var backColor = await this.quizConfigureservice.getPerceptualBrightness(color);
        console.log(fontColor+":"+backColor);
        if ((fontColor+120) < backColor) 
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
    // console.log(newColor)
    // if(newColor == null){
    //   $(component).css("color", this.quizConfiguration.fontColor);
    // }else{
    //   $(component).css("color", newColor);
    // }
    
  }
  updateQuizFont () {
    console.log(this.quizConfiguration.fontName);
    //$(".setting__preview").css("font-family", this.quizConfiguration.fontName);
    $(".QuizfontStyle").css("font-family", this.quizConfiguration.fontName);
    //this.quizConfiguration.fontName = this.fontStyle
  }
  message:any;
  showPopUpMessage = false;
  async saveColors(){
    console.log(this.colorSchems);
    this.quizConfiguration.quizColorScheme = this.colorSchems;
    var colorData = { "id": this.quizId, "fontLightDark":this.quizConfiguration.fontLightDark, "fontColor": this.quizConfiguration.fontColor,"fontName":this.quizConfiguration.fontName ,"quizColorScheme" : this.colorSchems}
    var data:any = await this.quizAPI.saveQuiz(colorData);
    console.log(data);
    if(data.status == 'SUCCESS'){
      this.message = { 'type': 'SUCCESS', 'message': 'Colors Saved Successfully'  };
      this.showPopUpMessage = true;
      this.quizConfigureservice.change(data.data,'Quiz Design');
      this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    }else{
      this.commonService.serverError(data);
    }
  }

  async resetColors(){
    console.log(this.quizConfiguration);
    // console.log(this.defaultColors);
    if(this.quizConfiguration.fontName != null){
      $(".QuizfontStyle").removeAttr('font-family');
    }
    if(this.quizConfiguration.fontColor != null){
      this.lightFontColor = '#E1E1E1';
      this.darkFontColor = '#363636';
      this.colorType = null;
      $('#quiz-callToAction-preview').removeAttr("color");
      $('.welcomePageClass').removeAttr("color");
      $('.leadColor').removeAttr("color");
      $('#leadActionBtnPreview').removeAttr("color");
      $('.previewAnswerTable').removeAttr("color");
      $('.questionTitle h4').removeAttr("color");
      $('.quizDesign header span').removeAttr("color")
      $('.OutcomeDesign').removeAttr("color")
      $('.outcomeOfferDesign').removeAttr("color");
      $('#outcomeOfferButtonPreview').removeAttr("color");
    }
    let data: any = await this.quizConfigureservice.getDefaultColor();
    this.quizConfiguration.fontLightDark = null;
    this.quizConfiguration.fontColor = null;
    this.quizConfiguration.fontName = null;
    console.log(data);
    if(data.status == "SUCCESS"){
      // this.quizConfiguration.colorSchemeObj.WelcomePage(element =>{

      // })
      this.tabData.forEach(element =>{
         if(element.moduleName == "WelcomePage"){
           this.defaultColors = data.data.WelcomePage;
         }else if(element.moduleName == "OutcomePage"){
          this.defaultColors = data.data.OutcomePage;
         }else if(element.moduleName == "Quiz"){
          this.defaultColors = data.data.Quiz;
         }else if(element.moduleName == "LeadCapture"){
          this.defaultColors = data.data.LeadCapture;
         }
         this.defaultColors.forEach(color =>{
          console.log(color.areaName +"=="+ element.areaName);
            if(color.areaName == element.areaName){
             if(color.defaultColor == 'default')
              color.defaultColor = "#FFFFFF";
              element.defaultColor = color.defaultColor;
              this.onEventLog('background',element);
            }
        })
      })
      this.colorSchems = [];
      this.quizConfiguration.colorSchemeObj = null;
      this.quizConfiguration.quizColorScheme = [];
      var resetColor:any = await this.quizAPI.resetQuizColors(this.quizId);
      console.log(resetColor);
      if(resetColor.status == 'SUCCESS'){
        this.quizConfigureservice.change(resetColor.data);
      }
    }
    
  }
}
