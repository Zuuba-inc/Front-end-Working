import { Component, OnInit, ViewChild, ElementRef, HostListener  } from '@angular/core';
import * as $ from 'jquery';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormControl } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service'
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';
import { QuizQuestionsService } from 'src/app/services/coach/quiz/quiz-questions.service';

import { ScrollEvent } from 'ngx-scroll-event';
//import file upload component
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Jsonp } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';

import { FormValidationService } from '../../../../../services/global/form-validation.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  @ViewChild("questionForm")
  questionForm: NgForm;

  @HostListener('document:mousemove', ['$event'])
  
  onMouseMove(e) {

    if (this.x1 != undefined && this.y1 != undefined) {
      this.x2 = e.clientX;
      this.y2 = e.clientY;
      if (this.selectedBranchOrOutcome == 'Outcome')
        this.createLine(this.x1, this.y1, this.x2, this.y2, "outcomeMappingLine" + this.answer.answerNo);
      else
        this.createLine(this.x1, this.y1, this.x2, this.y2, "branchingMappingLine" + this.answer.answerNo);
    }

    // $scope.count=1;
  }
   
  @ViewChild("questionDescription") questionDescription: any;

  @ViewChild("answerDescription") answerDescription: any;

  constructor(public fileUpload: FileUploadAPIService,
    private ngxService: NgxUiLoaderService,
    public quizConfigureservice: QuizConfigureserviceService,
    public service: QuizapiserviceService,
    public formValidationService: FormValidationService,
    public router: Router,
  ) {
  }

  quizConfiguration = this.quizConfigureservice.quizConfiguration;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  response: any = {};
  newAnswer: any = {};
  answer: any = {};
  newQuestion: any = {
    answerTypeId: 1,
    questionNo: 1,
    quizAnswers: []
  };
  question: any = {
    answerTypeId: 1,
    quizAnswers: []
  };
  questionArray = [];
  questionArrayMulti = [];
  questionOne;
  selectedBranchOrOutcome;
  answerIndex = 0;
  answerNumber = 65;
  variationArray = []
  variationQuestionArray = [];
  variationIndex: any = {};
  fileToUpload;
  cropImage;
  croppedImage;
  files
  imageSize;
  isMultiVaritionQuiz: boolean = false;
  logicBranch: any;

  nextQuestion: any = { "questionNo": 0, "questionDescription": "This is the last question" };

  skipToSpecificQues: any;

  defaultActions = [];

  // pass this as input to file upload component
  questions: any = 'questions';

  module: any = "Questions";

  progresBarWidth;
  totalMultiVariationQuestion;
  @ViewChild(UploadFileComponent)
  private uploadFileComponent: UploadFileComponent;
  // questions: any = 'questions';
  logicBranchQuestionNo;
  x1; y1; x2; y2; lineColor; selectedAnswer
  branchingMappingLineA; branchingMappingLineB; branchingMappingLineC; branchingMappingLineD; branchingMappingLineE; branchingMappingLineF;
  answerLineA; answerLineB; answerLineC; answerLineD; answerLineE; answerLineF;
  scroll = 0;
  skipToQuesDisabled = false;

  token;
  colors = ['blue', 'red', 'greenyellow', 'purple', 'grey'];
  // this is used to persist id when user navigates from one module to other and
  // fetch data based on this value
  quizId: any;
  ques: any = {
  };
  quizVariationList: any = [];
  // used to hide 'add question', 'back', 'save'
  hideOutcomeButtons: any = false;
  variation:any;
  showMultiVariationDropDown:boolean=false;
  ngOnInit() {

    localStorage.setItem("lastVisitedSubModule", "Questions");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
    console.log("in ngOnit of questions module", this.quizConfiguration)
    this.resetOpenMappingTabs();
    this.getMultiVariationList();
    // get quizId from localStorage
    this.quizId = localStorage.getItem("quizId");

    if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {
      this.service.getQuiz(this.quizId).subscribe(dataQuiz => {
        console.log(dataQuiz);
        var quiz :any;
        quiz = dataQuiz;
        if (quiz.status == 'SUCCESS') {
        this.quizConfiguration = quiz.data;

        console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
        console.log(this.quizConfiguration);

        this.quizConfigureservice.change(this.quizConfiguration);

        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

        this.setQuestionsInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.Quiz){  
          if(this.quizConfiguration.colorSchemeObj.Quiz.length > 0){
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

        this.setQuestionsInitData(this.quizConfiguration);
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.Quiz){  
          if(this.quizConfiguration.colorSchemeObj.Quiz.length > 0){
        this.changePreviewColor();
          }
        }
      }
    }
  }
  questionVar ;
  setQuestionsInitData(quiz: any) {

        this.quizConfiguration = quiz;
        if(this.quizConfiguration.multiVariationNo == null){
            this.showMultiVariationDropDown = true;
          this.quizConfiguration.multiVariationNo = 1;
          this.variation = 1
        }else{
          this.showMultiVariationDropDown = false;
          this.variation = this.quizConfiguration.multiVariationNo;
        }
        console.log("in ngOnit of questions module", this.quizConfiguration)

        this.getQuiz();

        var variation = this.quizConfiguration.multiVariationNo;
        var alphabetASCII = 65;
        if(this.quizConfiguration.multiVariationNo > 1){
          this.changeTotalMultiVariationQuestion();
        }
        if(this.quizConfiguration.quizQuestions.length == 0){
          this.showQuestionCreateButton = true;
        }else{
          this.showQuestionCreateButton = false;
        }
        if(this.quizConfiguration.quizQuestions == undefined || this.quizConfiguration.quizQuestions.length == 0 || this.quizConfiguration.quizQuestions.length == 1)
        {
          if (this.quizConfiguration.multiVariationNo != 1 && this.quizConfiguration.quizQuestions.length <= (this.quizConfiguration.multiVariationNo)) {
             this.showDeleteVariationButton = true;
            for (var i = 0; i < this.quizConfiguration.multiVariationNo; i++) {
              this.variationArray.push("2 - " + String.fromCharCode(alphabetASCII + i));
            }
          }
        }
        else{
        this.questionVar  = (((this.quizConfiguration.quizQuestions.length-1)/this.quizConfiguration.multiVariationNo)* Number.parseFloat(this.quizConfiguration.multiVariationNo));
        console.log(this.questionVar);
        var variationNo = this.quizConfiguration.quizQuestions[this.quizConfiguration.quizQuestions.length-1].questionNo;
        if(((this.quizConfiguration.quizQuestions.length-1)/2) % 1 != 0)
          this.questionVar = this.questionVar -1;
        console.log(this.questionVar, ' : ' , (this.quizConfiguration.quizQuestions.length-1));
        if (this.quizConfiguration.multiVariationNo != 1 && this.questionVar < ((this.quizConfiguration.quizQuestions.length-1))) {
          for (var i = 0; i < ((this.quizConfiguration.quizQuestions.length-1)- this.questionVar); i++) {
            //this.variationArray.push(variationNo+" - " + String.fromCharCode(alphabetASCII + ((this.quizConfiguration.quizQuestions.length-1)- this.questionVar)));
            console.log()
            this.variationArray.push(variationNo+" - " + String.fromCharCode(alphabetASCII + this.questionArrayMulti[this.questionArrayMulti.length - 1].length));
          }
        }
      }

        this.getLogicBranch();

        this.quizConfigureservice.change(this.quizConfiguration);
        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
  }
  colorScheme= [];
  //Naincy :- This function will change the background and call to action button color for the welcome page
  changePreviewColor(){
       if(this.quizConfiguration.fontColor != null){
        $('.previewAnswerTable').css("color", this.quizConfiguration.fontColor);
        $('.questionTitle h4').css("color", this.quizConfiguration.fontColor);
        $('.quizDesign header span, .quizDesign h5').css("color", this.quizConfiguration.fontColor);
       }
       if(this.quizConfiguration.fontName != null){
        $(".previewAnswerTable").css("font-family", this.quizConfiguration.fontName);
        $(".questionTitle h4").css("font-family", this.quizConfiguration.fontName);
        $('.quizDesign header span, .quizDesign h5').css("font-family", this.quizConfiguration.fontName);
       }
      this.colorScheme = this.quizConfiguration.colorSchemeObj.Quiz;
      console.log(this.colorScheme);
      this.colorScheme.forEach(color =>{
        if(color.quizArea.areaName == "Answer Background color"){
          $('.previewAnswerTable').css("background", color.backColor);
          this.changeTextColor('.previewAnswerTable',color.backColor)
        }else if(color.quizArea.areaName == "Title Background color"){
          $('.questionTitle').css("background", color.backColor);
          this.changeTextColor('.questionTitle h4',color.backColor )
        }else if(color.quizArea.areaName == "Background color"){
          $('.quizDesign').css("background", color.backColor);
          this.changeTextColor('.quizDesign header span, .quizDesign h5',color.backColor )
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

  async getMultiVariationList() {
    let multi:any = await this.service.getMultiVariationPath();
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
  multiVariationArray=[];
  alphabetASCII: any = 65;
  showQuestionCreateButton = false;
  async updateQuizVarationArray() {
    this.multiVariationArray = [];
    this.changeTotalMultiVariationQuestion();
    console.log(this.quizConfiguration.multiVariationNo);
    if (this.variation == undefined || this.quizConfiguration.quizQuestions == undefined || this.quizConfiguration.quizQuestions.length == 0) {
      this.variation = this.quizConfiguration.multiVariationNo;
      if (this.quizConfiguration.multiVariationNo != 1) {

        for (var i = 0; i < this.quizConfiguration.multiVariationNo; i++) {
          this.multiVariationArray.push("2 - " + String.fromCharCode(parseInt(this.alphabetASCII) + i));
        }
      }
    } else {
      this.variation = this.quizConfiguration.multiVariationNo
     // this.quizConfiguration.multiVariationNo = this.variation;
      console.log('inside else');
      var changePath = confirm("If you change the path then all of you questions will be deleted");
      if (changePath == true) {
          let dataQuiz:any = await this.service.deleteQuestion(null,this.quizConfiguration.id);
          var res = dataQuiz;
          if (res.status == 'SUCCESS') {
           // var multiVariationNo = this.quizConfiguration.multiVariationNo;
            //console.log(this.quizConfiguration.multiVariationNo)
            this.showQuestionCreateButton = true;
            this.quizConfiguration = res.data;
            this.quizConfiguration.multiVariationNo = this.variation;
            this.quizConfigureservice.change(this.quizConfiguration);
            console.log("delete: ")
            console.log(this.quizConfiguration);
            this.questionArray = [];
            this.questionArrayMulti = [];
            this.questionOne = null;
            
            //this.changeTotalMultiVariationQuestion();
          }
      }
    }

    //  console.log(this.variationArray)
  }
  changeMultivariationNumber(action){
    if(action == 'Change'){
      this.showMultiVariationDropDown = true;
      if(this.quizConfiguration.quizQuestions.length > 0){
        this.showQuestionCreateButton = false;
      }
    }else if(action == 'Cancel'){
       this.showMultiVariationDropDown = false;
       if(this.quizConfiguration.quizQuestions.length > 0){
        setTimeout( ()=>{
          $('#newQuestion').hide();
          $('#text').show();
        }, 500);
       }
    }else{
      this.showMultiVariationDropDown = false;
     // console.log(this.variation);
      this.variationArray = [];
      this.setQuestionsInitData(this.quizConfiguration);
    }
    
  }
  async drop(event: CdkDragDrop<string[]>) {
    if(event.previousIndex != event.currentIndex){
    if(this.quizConfiguration.multiVariationNo == 1){
      moveItemInArray(this.questionArray, event.previousIndex, event.currentIndex);
      this.quizConfiguration.quizQuestions = this.questionArray
    }
    else
    {
      console.log(event.previousIndex, ' : ', event.currentIndex);
      if(this.questionArrayMulti[event.previousIndex].length == this.quizConfiguration.multiVariationNo){
      moveItemInArray(this.questionArrayMulti, event.previousIndex, event.currentIndex);
      this.questionOne = this.quizConfiguration.quizQuestions[0];
      this.quizConfiguration.quizQuestions = [];
      this.quizConfiguration.quizQuestions.push(this.questionOne);
      this.questionArrayMulti.forEach(ques => {
          ques.forEach(que => {
            this.quizConfiguration.quizQuestions.push(que);
        });   
      });
      }
    }
    console.log(this.questionArray);
   
    var res:any;
    if((this.quizConfiguration.multiVariationNo > 1 && this.questionArrayMulti[event.previousIndex].length == this.quizConfiguration.multiVariationNo) || this.quizConfiguration.multiVariationNo == 1)
    {
          res = await this.service.reorderQuestion(this.quizConfiguration)
        console.log(res);
        // res = JSON.parse(res['_body']);
        if(res.status == "SUCCESS"){
          localStorage.setItem("quizConfiguration", JSON.stringify(res.data));
          this.quizConfiguration = res.data;
          this.quizConfigureservice.change(this.quizConfiguration);
          this.questionArray = this.quizConfiguration.quizQuestions;

          this.questionArrayMulti = [];
          this.questionArrayMulti.length = 0;
          console.log(this.questionArrayMulti.length);
          this.variationQuestionArray = [];
          console.log(this.variationQuestionArray.length);
          this.variationQuestionArray.length = 0;
          if(this.quizConfiguration.multiVariationNo > 1){
          this.quizConfiguration.quizQuestions.forEach(que =>{
              if(que.questionNo != 1 && this.variationQuestionArray.length < Number.parseInt(this.quizConfiguration.multiVariationNo))
              {
                this.variationQuestionArray.push(que);
                console.log('1 ', this.variationQuestionArray);
              }
              else if(que.questionNo != 1)
              {
                this.questionArrayMulti.push(this.variationQuestionArray);
                this.variationQuestionArray = [];
                this.variationQuestionArray.push(que);
                console.log('2 ', this.variationQuestionArray);
              }
              else if(que.questionNo == 1)
              {
                this.questionOne = que;
              }
              
              console.log('3 ', this.questionArrayMulti.length);
          })
          }
          if(this.variationQuestionArray.length > 0)
              this.questionArrayMulti.push(this.variationQuestionArray);

          

        }
      }
   // .stopLoading();
    }
  
  }
  async getLogicBranch() {
    var data: any;
    data = await this.service.getLogicBranch();
    // data = JSON.parse(data['_body']);
    this.defaultActions = data.data;
  }
  getQuiz() {
    var variationList=[];
    var  PreQueNo= 2;
    if (this.quizConfiguration.quizQuestions != null) {
      if (this.quizConfiguration.quizQuestions.length > 0) {
        if(this.quizConfiguration.multiVariationNo != 1)
        {
          this.isMultiVaritionQuiz = true;
          //this.questionArrayMulti = this.questionArray;
          this.quizConfiguration.quizQuestions.forEach(que => {
           
                if(que.questionNo != 1)
                {
                  if(que.variation != null && PreQueNo == que.questionNo)
                    variationList.push(que);
                  else
                  {
                    this.questionArrayMulti.push(variationList);
                    
                    variationList = [];
                    variationList.push(que);
                    
                    //this.questionArrayMulti.push(variationList);
                  }
                  PreQueNo = que.questionNo;
                }
                else
                  this.questionOne = que;
          })
          if(variationList.length > 0)
            this.questionArrayMulti.push(variationList);
          this.questionArray = this.quizConfiguration.quizQuestions;
        }
        else
        {
          this.questionArray = this.quizConfiguration.quizQuestions;
          this.isMultiVaritionQuiz = false;
        }
       // console.log($('#newQuestion'));
        // alert("New Question hide")
        setTimeout( ()=>{
          $('#newQuestion').hide();
          $('#text').show();
        }, 1000);
       
      }
    }
  }
 
  changeTotalMultiVariationQuestion(){
    var variation = this.quizConfiguration.multiVariationNo;
    var n;
    n = this.quizConfiguration.quizQuestions.length - 1;
    if(n % variation == 0)
    n = n/variation;
    
    this.totalMultiVariationQuestion = n+1;
  }
  // this is used to set quizConfiguration object in service 
  quizQuestionArray: any = [];

  keyupFunction(charCount, from, to) {

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    if (from) {

      // update this quizConfigurationOutComes array data
      if (this.newQuestion.questionDescription || this.newQuestion.quizAnswers.length != 0) {
        this.quizConfiguration.quizQuestions = this.questionArray.concat([this.newQuestion]);

        this.quizConfigureservice.change(this.quizConfiguration);
      }
    }

    this.quizConfigureservice.change(this.quizConfiguration);

    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    // set formstatus
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

  imageChangedEvent: any = '';
  changedImage: any = false;

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

  async uploadAnswerImage(oldOrNew) {
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], "quizAnswerImage", { type: 'image/jpeg' });
    // this.fileUpload.uploadOutcomeImageToAmazonServer()


    let data:any = await this.fileUpload.uploadOutcomeImageToAmazonServer(imageFile)

    //if (data) {
    //  .stopLoading();
    //}
    var res = data;
    if (oldOrNew == 'Old') {
      this.answer.answerMediaAttached = res.message;
    } else {
      this.newAnswer.answerMediaAttached = res.message;
    }

    this.croppedImage = undefined;
  }

  async closeModel(option) {
    this.cropImage = false;
    if (option == "OK") {
      $('#imageAnswer' + this.answerIndex).attr('src', this.croppedImage);

      if (this.question.hasOwnProperty('index')) {
        if (this.answer.answerDescription == undefined || this.answer.answerDescription == '') {
          await this.uploadAnswerImage('Old');
          alert("Please enter answer description")
        } else {
          if (!this.answer.hasOwnProperty('index')) {
            await this.uploadAnswerImage('Old');
            this.addAnswer(this.question.index);
          }
        }
      } else {
        if (this.newAnswer.answerDescription == undefined || this.newAnswer.answerDescription == '') {
          await this.uploadAnswerImage('New');
          alert("Please enter answer description")
        } else {
          await this.uploadAnswerImage('New');
          this.addNewAnswer();
        }
      }
    }
  }

  addNewAnswer() {
    if (this.newQuestion.answerTypeId == "1") {
      $("#answer").focus();
      if (this.newAnswer.answerDescription != undefined) {
        if (this.newAnswer.index != undefined) {
          this.newQuestion.quizAnswers[this.newAnswer.index] = this.newAnswer
        } else {
          this.newAnswer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
          this.newAnswer.id = this.newQuestion.quizAnswers.length;
          this.newQuestion.quizAnswers.push(this.newAnswer)
        }
        this.newAnswer = {};
        this.answerIndex = this.newQuestion.quizAnswers.length;
        if (this.quizConfiguration.multiVariationNo == this.newQuestion.quizAnswers.length && this.quizConfiguration.multiVariationNo != 1) {
          $('#text').hide();
        } else if (this.quizConfiguration.multiVariationNo == 1 && this.newQuestion.quizAnswers.length == 6) {
          $('#text').hide();
        }
      } else {
        alert("Please add answer description")
      }
    } else {
      $("#answerImageText").focus();
      this.newAnswer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
      if (this.newAnswer.answerMediaAttached == undefined) {
        alert("Please upload a image")
      } else {
        if (this.newAnswer.index != undefined) {
          this.newQuestion.quizAnswers[this.newAnswer.index] = this.newAnswer
        } else {
          this.newAnswer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
          this.newAnswer.id = this.newQuestion.quizAnswers.length;
          this.newQuestion.quizAnswers.push(this.newAnswer)
        }
        this.newAnswer = {};
        this.answerIndex++;
        if (this.quizConfiguration.multiVariationNo == this.newQuestion.quizAnswers.length && this.quizConfiguration.multiVariationNo != 1) {
          $('#image-text').hide();
        } else if (this.quizConfiguration.multiVariationNo == 1 && this.newQuestion.quizAnswers.length == 6) {
          $('#image-text').hide();
        }

      }
    }
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
  }

  async saveQuestion() {

    this.hideOutcomeButtons = false;

    if (this.question.index != undefined && this.quizConfiguration.multiVariationNo > 1 && this.question.quizAnswers.length < this.quizConfiguration.multiVariationNo) {
      alert("You have not addedd all the answers")
    } else if (this.question.index == undefined && this.quizConfiguration.multiVariationNo > 1 && this.newQuestion.quizAnswers.length < this.quizConfiguration.multiVariationNo) {
      alert("You have not addedd all the answers")
    } else {
      console.log('this.question.index : ' , this.question.index);
      if (this.question.index != undefined) {
        var i = 0;
        this.question.quizAnswers.forEach(ans => {
          if (!ans.createdon && ans.id)
            delete ans.id;

          ans.answerNo = String.fromCharCode(this.answerNumber + i)
          i++;
        })
        if(this.quizConfiguration.multiVariationNo == 1)
        {
          this.questionArray[this.question.index] = this.question;
          document.getElementById("questionHeading" + this.question.index).style.display = 'block';
        document.getElementById("editQuestion" + this.question.index).style.display = 'none';
        }
        else
        {
            if(this.question.index == 1 && this.question.mainIndex == -1)
            {
              this.questionArray[0] = this.question;    
              document.getElementById("questionHeading" + this.question.index).style.display = 'block';
              document.getElementById("editQuestion" + this.question.index).style.display = 'none';
            }
            else
            {
            var questionArr = this.questionArrayMulti[this.question.mainIndex];
            var question = questionArr[this.question.index];
            var queIndex = (this.question.mainIndex * this.quizConfiguration.multiVariationNo)+ this.question.index + 1;
            console.log(queIndex);
            this.questionArray[queIndex] = this.question;
            document.getElementById("questionHeading" + this.question.index + this.question.mainIndex).style.display = 'block';
            document.getElementById("editQuestion" + this.question.index + this.question.mainIndex).style.display = 'none';
            }
        }
        // $("editQuestion"+this.question.index).hide();
        // $("questionHeading"+this.question.index).show();
        
      } else {
        //this.newQuestion.questionNo = this.questionArray.length + 1;
        this.newQuestion.quizAnswers.forEach(ans => {
          if (ans.id) delete ans.id;
        })
        if(this.quizConfiguration.multiVariationNo == 1)
        {
          this.isMultiVaritionQuiz = false;
          this.questionArray.push(this.newQuestion);
        }
        else
        {
          this.isMultiVaritionQuiz = true;
          this.questionArray.push(this.newQuestion);
          if(this.newQuestion.questionNo == 1)
            this.questionOne = this.newQuestion;
          else
          {
            
            console.log('inside else ', this.questionArrayMulti.length);
            
            if(this.questionArrayMulti.length == 0)
            {
              this.variationQuestionArray.push(this.newQuestion);
              this.questionArrayMulti.push(this.variationQuestionArray);
            }
            else
            {
              if(this.question.mainIndex == -1){
                  this.questionArrayMulti.forEach(ques=> {
                    console.log(ques);
                    ques.forEach(que=> {
                      this.variationQuestionArray.push(que);
                    });
                  })
                  this.questionArrayMulti = [];
                  console.log(this.variationQuestionArray);
                  this.variationQuestionArray.push(this.newQuestion);
                  console.log(this.variationQuestionArray);
                  this.questionArrayMulti.push(this.variationQuestionArray);
                }
                else
                {
                  this.variationQuestionArray = [];
                  console.log(this.variationQuestionArray.length, ' : ' ,(this.variationQuestionArray.length < Number.parseInt(this.quizConfiguration.multiVariationNo)));
                  this.quizConfiguration.quizQuestions.forEach(que =>{
                      if(que.questionNo != 1 && this.variationQuestionArray.length < Number.parseInt(this.quizConfiguration.multiVariationNo))
                      {
                        this.variationQuestionArray.push(que);
                        console.log('1 ', this.variationQuestionArray);
                      }
                      else if(que.questionNo != 1)
                      {
                        this.variationQuestionArray = [];
                        this.variationQuestionArray.push(que);
                        console.log('2 ', this.variationQuestionArray);
                      }
                      console.log('3 ', this.variationQuestionArray);
                  })
                  /*if(this.variationQuestionArray.length == this.quizConfiguration.multiVariationNo)
                      this.variationQuestionArray = [];*/
                  console.log('1 after ', this.variationQuestionArray.length, ' : ' ,this.quizConfiguration.multiVariationNo );
                  //this.variationQuestionArray.push(this.newQuestion);
                  console.log(this.questionArrayMulti);
                  //if(this.variationQuestionArray.length == Number.parseInt(this.quizConfiguration.multiVariationNo))
                  {
                    console.log('inside *************');
                    if(this.questionArrayMulti[this.questionArrayMulti.length-1].length < this.quizConfiguration.multiVariationNo)
                        this.questionArrayMulti[this.questionArrayMulti.length-1] = this.variationQuestionArray;
                    else if(this.questionArrayMulti[this.questionArrayMulti.length-1].length == this.quizConfiguration.multiVariationNo)
                    this.questionArrayMulti[this.questionArrayMulti.length] = this.variationQuestionArray;
                  }
                  console.log(this.questionArrayMulti);
                }
            }
          }
        }

      }
      // alert("Hiding new Question")
      $('#newQuestion').hide();
      $('#text').show();
      // empty this.quizConfiguration.quizQuestions, which was updated in keyUp func, to avoud duplicate data
      // this.quizConfiguration.quizQuestions = [];

      this.quizConfiguration.quizQuestions = this.questionArray;
      
      if (localStorage.getItem("edit") == "false") {
        this.quizConfiguration.moduleName = "LeadCapture";
        delete this.quizConfiguration.moduleStatus;
      }

      this.quizConfigureservice.change(this.quizConfiguration);
      this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
      this.selectedBranchOrOutcome = undefined;
      
      console.log(this.quizConfiguration);
      var data={ "id": this.quizId,"multiVariationNo": this.quizConfiguration.multiVariationNo, "quizQuestions":  this.quizConfiguration.quizQuestions};
      this.response = await this.service.saveQuiz(data);
      // this.response = JSON.parse(this.response['_body']);
      if (this.response.status == "SUCCESS") {
          if(this.quizConfiguration.multiVariationNo > 0){

            if(this.question.index != undefined && this.question.questionNo > 1 && this.variationArray.length > 0){
              this.showDeleteVariationButton = false;
            }else if(this.newQuestion.questionNo > 1 && this.variationArray.length > 0){
              this.showDeleteVariationButton = false;
            }
           
          }
         

          this.resetQuestion();
        // if quizId doesn't exist in session storage, only then set it 
        // (to save data against the same id even after page reload)
        if (!localStorage.getItem("quizId")) {

          console.log("quizId for this SESSION", this.response.data.id);
          localStorage.setItem("quizId", this.response.data.id);
        }

       
        this.quizConfigureservice.change(this.quizConfiguration, 'Question');
        this.quizConfiguration.quizQuestions = this.response.data.quizQuestions;
        this.quizConfiguration.multiVariationNo = this.response.data.multiVariationNo;
        this.questionArray = this.quizConfiguration.quizQuestions;
        if(this.quizConfiguration.multiVariationNo > 1){
          this.changeTotalMultiVariationQuestion();
        }
        this.questionArrayMulti = [];
        this.questionArrayMulti.length = 0;
        console.log(this.questionArrayMulti.length);
        this.variationQuestionArray = [];
        console.log(this.variationQuestionArray.length);
        this.variationQuestionArray.length = 0;
        if(this.quizConfiguration.multiVariationNo > 1){
        this.quizConfiguration.quizQuestions.forEach(que =>{
          if(que.questionNo != 1 && this.variationQuestionArray.length < Number.parseInt(this.quizConfiguration.multiVariationNo))
          {
            this.variationQuestionArray.push(que);
            console.log('1 ', this.variationQuestionArray);
          }
          else if(que.questionNo != 1)
          {
            this.questionArrayMulti.push(this.variationQuestionArray);
            this.variationQuestionArray = [];
            this.variationQuestionArray.push(que);
            console.log('2 ', this.variationQuestionArray);
          }
          else if(que.questionNo == 1)
          {
            this.questionOne = que;
          }
          
          console.log('3 ', this.questionArrayMulti.length);
      })
      if(this.variationQuestionArray.length > 0)
          this.questionArrayMulti.push(this.variationQuestionArray);
    }
      }
       console.log(this.quizConfiguration);
    }
  }
  cancelEditingVariation() {

    this.hideOutcomeButtons = false;
    // alert("Hiding new Question")
    $('#newQuestion').hide();
    $('#text').show();
    // this.selectedBranchOrOutcome = undefined;
    this.variationArray.splice(this.variationIndex.index, 0, this.variationIndex.variation);
    this.resetQuestion();
    this.newQuestion = {
      questionNo: 1,
      answerTypeId: "1",
      quizAnswers: []
    };
    this.newAnswer = {};
    this.answerIndex = 0;
    this.answerNumber = 65;
    
  }
  showDeleteVariationButton = false;
  addQuestion() {
    this.showDeleteVariationButton = true;
    this.hideOutcomeButtons = true;

    if (this.quizConfiguration.multiVariationNo == '1') {
      // $scope.questionNo = $scope.questionNo + 1;
      if (this.variationArray.includes(this.questionArray.length + 1) || this.questionArray.length == 0) {
        alert("Please complete the existing question before creating a new questin")
      } else {
        this.variationArray.push(this.questionArray.length + 1);
      }
    } else {
     // this.totalMultiVariationQuestion ++;
      var alphabetASCII = 65;
      if (this.variationArray.length > 0) {
        alert("Please complete the existing variations before creating a new qestion")
      } else {
        var questionNo = this.questionArray[this.questionArray.length - 1].questionNo
        var variationNumber = parseInt(questionNo, 10) + 1;
        for (var i = 0; i < this.quizConfiguration.multiVariationNo; i++) {
          this.variationArray.push(variationNumber + " - " + String.fromCharCode(alphabetASCII + i));
        }
      }
    }
  }

  createVariation(variation, index) {

    this.hideOutcomeButtons = true;
    // alert("Hiding new Question")
    $('#newQuestion').show();
    //console.log(variation)
    this.variationIndex.index = index;
    this.variationIndex.variation = variation;
    this.variationArray.splice(index, 1);
    if (this.quizConfiguration.multiVariationNo != '1') {
      var que = variation.trim().split("-");
      this.question.questionNo = que[0].trim();
      if (this.question.hasOwnProperty('index'))
        this.question.variation = que[1].trim();
      else {
        this.newQuestion.variation = que[1].trim();
        this.newQuestion.questionNo = que[0].trim();
      }
      //$scope.creatingVariation = true;
    } else {
      this.newQuestion.questionNo = variation;
    }
  }

  deleteVariation() {

    this.hideOutcomeButtons = false;

    if (this.quizConfiguration.multiVariationNo == '1') {
      this.variationArray = [];
    } else {
      //this.totalMultiVariationQuestion --;
      var count = 0;
      this.quizConfiguration.quizQuestions.forEach( (que)=>{
        //var queNo = que.questionNo+"-"+que.variation;

        this.variationArray.forEach((v)=>{
          //console.log(v+":"+queNo);
          var queNo = v.trim().split("-");
          console.log(queNo)
          console.log(queNo[0]);
            if(que.questionNo == queNo[0]){
              count++;
            }
        })
        // var index = this.variationArray.find( v => v == queNo)
       
      })
      if(count == 0){
         var con = confirm("Deleting this Question will delete all its variation,Are you sure you want to delete it");
        if (con == true) {
          this.variationArray = [];
        }
      }else{
        alert("You cannot delete this variation because you have saved a question for this variation")
      }
    }
  }

  resetQuestion() {
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
    this.answerIndex = 0;
    this.answerNumber = 65;
    this.skipToQuesDisabled = false;
    this.logicBranchQuestionNo = ""
    this.question = {
      questionNo: 1,
      answerTypeId: 1,
      quizAnswers: []
    };
    this.newQuestion = {
      questionNo: 1,
      answerTypeId: 1,
      quizAnswers: []
    };
    $('#questionCharCount').text('0/150');
    this.selectedBranchOrOutcome = undefined;
    this.keyupFunction('editAnswerCharCount', '', 'questionDescPreview');
    for (var i = 0; i < 6; i++) {
      this.keyupFunction('editAnswerCharCount', '', 'textAnswer' + i);
    }
    for (var i = 0; i < 6; i++) {
      $('#imageAnswer' + i).attr('src', '/assets/images/pexels-photo-175718.jpg');
    }
    $(".outcomeMappingLine").hide();
    console.log("Previre Tab")
    this.resetOpenMappingTabs();
  }

  editQuestion(question, index, mainIndex, operation) {

    this.hideOutcomeButtons = true;

     console.log(index+":"+mainIndex)
    if (index != this.question.index && this.question.index != undefined) {
      var con = confirm("Your exsting question changes will be removed if you open any other question");
      if (con == true) {
        $("#questionHeading" + this.question.index).show();
        this.cancelQuestionEditing(this.question.index,mainIndex);

        this.editQuestion(question, index,mainIndex, operation)
      }
    } else {
      console.log(question);
      if(mainIndex < 0){
      document.getElementById("questionHeading" + index).style.display = 'none';
      document.getElementById("editQuestion" + index).style.display = 'block';
      }
      else{
        document.getElementById("questionHeading" + index + mainIndex).style.display = 'none';
      document.getElementById("editQuestion" + index + mainIndex).style.display = 'block';
      }
      // this.questionForm.form.markAsPristine();
      // this.questionForm.form.markAsUntouched();
      // this.questionForm.form.updateValueAndValidity();
      
      this.resetOpenMappingTabs();
      this.question = {};
      this.question = question;
      this.question.index = index;
      this.question.mainIndex = mainIndex;
      this.question.answerTypeId = question.answerTypeId.toString();
      this.question.outcomeAnswerMapped = this.quizConfiguration.quizOutcomes;
      this.progresBarWidth = Math.round(100 / (this.questionArray.length)) * this.question.questionNo;
      $("#previewBar").css({ "width": this.progresBarWidth + "%" })
      console.log(this.question);
      for (var i = 0; i < this.question.outcomeAnswerMapped.length; i++) {
        this.question.outcomeAnswerMapped[i].answerNo = [];
      }

      this.keyupFunction('editQuestionCharCount' + index, this.question.questionDescription, 'questionDescPreview');
      setTimeout(() => {
        if (this.question.answerTypeId == 1) {
          this.newQuestion.answerTypeId = 1;
          if (this.quizConfiguration.multiVariationNo == "1" && this.question.quizAnswers.length < 6) {
            $('#text' + index).show();
            this.answerIndex = this.question.quizAnswers.length;
          } else if (this.quizConfiguration.multiVariationNo > 1 && this.question.quizAnswers.length < this.quizConfiguration.multiVariationNo) {
            $('#text' + index).show();
            this.answerIndex = this.question.quizAnswers.length;
          } else {
            $('#text' + index).hide();
          }
          for (var i = 0; i < this.question.quizAnswers.length; i++) {
            $('#textAnswer' + i).html(this.question.quizAnswers[i].answerDescription)
            //this.keyupFunction('null',this.question.quizAnswers[i].answerDescription,'textAnswer'+i, {questionDescription: this.questionDescription, answerDescription: this.answerDescription});

          }
        } else {
          this.newQuestion.answerTypeId = 2;
          if (this.quizConfiguration.multiVariationNo == "1" && this.question.quizAnswers.length < 6) {
            $('#AddNewImagetext' + index).show();
            this.answerIndex = this.question.quizAnswers.length;
          } else if (this.quizConfiguration.multiVariationNo > 1 && this.question.quizAnswers.length < this.quizConfiguration.multiVariationNo) {
            $('#AddNewImagetext' + index).show();
            this.answerIndex = this.question.quizAnswers.length;
          } else {
            $('#AddNewImagetext' + index).hide();
          }
          for (var i = 0; i < this.question.quizAnswers.length; i++) {
            $('#imageAnswer' + i).attr('src', this.question.quizAnswers[i].answerMediaAttached);
            $('#' + 'imageText' + i).text(this.question.quizAnswers[i].answerDescription)
          };

        }
        if (operation != 'Edit') {
          this.openMapping(operation, 'Edit');
        }

        this.quizConfigureservice.change(this.quizConfiguration);
        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
        if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.Quiz){  
          if(this.quizConfiguration.colorSchemeObj.Quiz.length > 0){
        this.changePreviewColor();
          }
        }
      }, 500);

    }
  }

  openMappingTabs(evt, tabName){
    var  tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if(tabName == 'outcomeMapping'){
      this.openMapping('Outcome','Old');
    }else if(tabName == 'branchingMapping'){
      this.openMapping('Branching','Old');
    }else{
      $(".outcomeMappingLine").hide();
    }
  }
  resetOpenMappingTabs(){
    var  tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById('previewQuestion').style.display = "block";
    tablinks[0].className += " active";
  }
  openMapping(type, newOrOld) { 
    $(".outcomeMappingLine").hide();
    this.skipToQuesDisabled = false;
    if (newOrOld == 'New') {
      this.question = this.newQuestion;
      this.question.outcomeAnswerMapped = this.quizConfiguration.quizOutcomes;
      for (var i = 0; i < this.question.outcomeAnswerMapped.length; i++) {
        this.question.outcomeAnswerMapped[i].answerNo = [];
      }
    }
    //console.log(this.question);
    this.selectedBranchOrOutcome = type;
    if (type == 'Outcome') {
     
     // evt.currentTarget.className += " active";
      window.scrollTo(0, 0);
      // $('.outcomeScroll').scrollTop(0);
      // $('.branchScroll').scrollTop(0);
      //if(this.question)
      if(this.question.id){
        this.ngxService.start();
        //  .startLoading();
          setTimeout(() => {
           
            this.question.quizAnswers.forEach(element => {
              if (element.outcome) {
                this.question.outcomeAnswerMapped.forEach(e => {
                  if (element.outcome.id == e.id) {
                    var foundIndex = e.answerNo.findIndex(x => x == element.answerNo);
                    console.log("Draft Index: "+foundIndex)
                   if(foundIndex == -1){
                    e.answerNo.push(element.answerNo);
                   }
                    var answerPoints;
                    if (this.question.answerTypeId == 1) {
                      answerPoints = document.getElementById("outcomeAnswerText" + element.id).getBoundingClientRect();
                    }
                    else {
                      answerPoints = document.getElementById("outcomeAnswerImage" + element.id).getBoundingClientRect();
                    }
                    var outcomePoints;
                    console.log(document.getElementById("outcomeMapping" + e.id).parentNode)
                    outcomePoints = document.getElementById("outcomeMapping" + e.id).getBoundingClientRect();
                    var connectedClass: any = {};
                    connectedClass = document.getElementById("outcomeMapping" + e.id);
                    connectedClass.parentNode.className += " connected";
                    this.selectColor(element.answerNo);
                    //  $("#outcomeMappingLine"+element.answerNo).show();
    
                    this.createLine(answerPoints.x + 10, answerPoints.y + 10, outcomePoints.x + 10, outcomePoints.y + 10, "outcomeMappingLine" + element.answerNo);
    
                    if (element.answerNo == 'A') this.answerLineA = $("#outcomeMappingLineA").css("top").split("px");
                    else if (element.answerNo == 'B') this.answerLineB = $("#outcomeMappingLineB").css("top").split("px");
                    else if (element.answerNo == 'C') this.answerLineC = $("#outcomeMappingLineC").css("top").split("px");
                    else if (element.answerNo == 'D') this.answerLineD = $("#outcomeMappingLineD").css("top").split("px");
                    else if (element.answerNo == 'E') this.answerLineE = $("#outcomeMappingLineE").css("top").split("px");
                    else if (element.answerNo == 'F') this.answerLineF = $("#outcomeMappingLineF").css("top").split("px");
    
                  }

                })
                console.log(this.question.outcomeAnswerMapped);
              }
              this.ngxService.stop();
            //  .stopLoading();
            })
          }, 2000);
      }
    
    }
    else if(type == 'Branching') {

      $('#branchingMapping').show();
      this.nextQuestion = { "questionNo": 0, "questionDescription": "This is the last question" }
      //  $('#loader').show();
     // .startLoading();
     window.scrollTo(0, 0);
    //  $('.outcomeScroll').scrollTop(0);
    //  $('.branchScroll').scrollTop(0);
    if(this.question.id){
     this.ngxService.start();
      setTimeout(() => {
        ///  this.$apply(function(){
       
        this.question.quizAnswers.forEach(element => {
          var answerPoints;
          if (this.question.answerTypeId == 1) answerPoints = document.getElementById("branchingTextAnswer" + element.id).getBoundingClientRect();
          else answerPoints = document.getElementById("branchingImageAnswer" + element.id).getBoundingClientRect();
          var branchPoints;
          var connectedClass: any = {};

          if (element.logicBranch && element.defaultSetting == false) {

            if (element.logicBranch.id == 1) {
              branchPoints = document.getElementById("logicBranching1").getBoundingClientRect();

              connectedClass = document.getElementById("logicBranching1");
              connectedClass.parentNode.className += " connected";
              this.selectColor(element.answerNo);
              //  $("#branchingMappingLine"+element.answerNo).show;
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);
            } else if (element.logicBranch.id == 2) {

              branchPoints = document.getElementById("logicBranching2").getBoundingClientRect();

              connectedClass = document.getElementById("connectedClass2");
              connectedClass.parentNode.className += " connected";
              this.selectColor(element.answerNo);
              // $("#outcomeMappingLine"+element.answerNo).css("z-index", 99);
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);
            } else if (element.logicBranch.id == 3) {
              this.logicBranchQuestionNo = element.logicBranchQuestionNo.toString();

              branchPoints = document.getElementById("logicBranching3").getBoundingClientRect();
              this.selectColor(element.answerNo);

              connectedClass = document.getElementById("logicBranching3");
              connectedClass.parentNode.className += " connected";
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);
            } else if (element.logicBranch.id == 4) {

              branchPoints = document.getElementById("logicBranching4").getBoundingClientRect();
              this.selectColor(element.answerNo);

              connectedClass = document.getElementById("connectedClass4");
              connectedClass.parentNode.className += " connected";
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);

            }
          } else {
            if (this.nextQuestion.questionNo == 0) {
              let branch = this.defaultActions.find(o => o.id == 2);
              element.logicBranch = branch;
              element.defaultSetting = true;
              branchPoints = document.getElementById("logicBranching2").getBoundingClientRect();
              var connectedClass: any = {};
              connectedClass = document.getElementById("connectedClass2");
              connectedClass.parentNode.className += " connected";
              this.selectColor(element.answerNo);
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);
            } else {
              let branch = this.defaultActions.find(o => o.id == 1);
              element.logicBranch = branch;
              element.defaultSetting = true;
              element.logicBranchQuestionNo = this.nextQuestion.id;
              branchPoints = document.getElementById("logicBranching1").getBoundingClientRect();
              connectedClass = document.getElementById("logicBranching1");
              connectedClass.parentNode.className += " connected";
              this.selectColor(element.answerNo);
              this.createLine(answerPoints.x + 10, answerPoints.y + 10, branchPoints.x + 10, branchPoints.y + 10, "branchingMappingLine" + element.answerNo);
            }
          }
          if (element.answerNo == 'A') this.branchingMappingLineA = $("#branchingMappingLineA").css("top").split("px");
          else if (element.answerNo == 'B') this.branchingMappingLineB = $("#branchingMappingLineB").css("top").split("px");
          else if (element.answerNo == 'C') this.branchingMappingLineC = $("#branchingMappingLineC").css("top").split("px");
          else if (element.answerNo == 'D') this.branchingMappingLineD = $("#branchingMappingLineD").css("top").split("px");
          else if (element.answerNo == 'E') this.branchingMappingLineE = $("#branchingMappingLineE").css("top").split("px");
          else if (element.answerNo == 'F') this.branchingMappingLineF = $("#branchingMappingLineF").css("top").split("px");
        })
        this.ngxService.stop();
      }, 2000);
    }
    }

    if(this.question.id){
      var nextQues = this.question.questionNo + 1;
      if (this.quizConfiguration.quizQuestions.length - 1 > this.question.index && this.question.questionNo == 1) {
        this.nextQuestion = this.quizConfiguration.quizQuestions[this.question.index + 1];
      } else {
        this.quizConfiguration.quizQuestions.some(e => {
          if (e.questionNo === nextQues && e.variation === this.question.variation) {
            this.nextQuestion = e;
          }
        })
      }
  
      // update skipToQues Array based on currently selected value
  
      if (this.question.index + 1 < this.questionArray.length) {
        this.skipToSpecificQues = this.questionArray.slice(this.question.index + 1);
        if (this.quizConfiguration.multiVariationNo > 1) {
          var skipQues = [];
          this.skipToSpecificQues.forEach(e => {
            if (e.variation == this.question.variation)
              skipQues.push(e);
          })
          console.log(skipQues);
          this.skipToSpecificQues = [];
          this.skipToSpecificQues = skipQues
        }
      }
      else
        // if last question is edit-clicked set the following
        this.skipToSpecificQues = [];
    }
    
  }

  selectSkipToQuestion(value) {
    this.logicBranchQuestionNo = value;
    console.log(this.logicBranchQuestionNo);
    console.log(this.answer.index)
    console.log(this.question.quizAnswers[this.answer.index]);
    this.question.quizAnswers[this.answer.index].logicBranchQuestionNo = this.logicBranchQuestionNo;
    //this.skipToQuesDisabled = false;
    //this.logicBranchQuestionNo = ""
    this.answer = {};
  }

  addAnswer(index) {
    if (this.question.answerTypeId == "1") {
      $("#answer" + index).focus();
      if (this.answer.answerDescription != undefined) {
        if (this.answer.index != undefined) {
          this.question.quizAnswers[this.answer.index] = this.answer
        } else {
          this.answer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
          this.answer.id = this.question.quizAnswers.length;
          this.question.quizAnswers.push(this.answer)
        }
        this.answer = {};
        this.answerIndex = this.question.quizAnswers.length;
        // console.log(this.quizConfiguration.multiVariationNo +":"+this.question.quizAnswers.length)
        if (this.quizConfiguration.multiVariationNo == this.question.quizAnswers.length && this.quizConfiguration.multiVariationNo != 1) {
          $('#text' + index).hide();
        } else if (this.quizConfiguration.multiVariationNo == 1 && this.question.quizAnswers.length == 6) {
          $('#text' + index).hide();
        }
        console.log(this.question);
      } else {
        alert("Please add answer description")
      }
    } else {
      $("#answerImageText" + index).focus();
      this.answer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
      if (this.answer.answerMediaAttached == undefined) {
        alert("Please upload a image")
      } else {
        this.answer.answerNo = String.fromCharCode(this.answerNumber + this.answerIndex)
        this.answer.id = this.question.quizAnswers.length;
        this.question.quizAnswers.push(this.answer)
        this.answer = {};
        this.answerIndex++;
        if (this.quizConfiguration.multiVariationNo == this.question.quizAnswers.length && this.quizConfiguration.multiVariationNo != 1) {
          $('#AddNewImagetext' + index).hide();
        } else if (this.quizConfiguration.multiVariationNo == 1 && this.question.quizAnswers.length == 6) {
          $('#AddNewImagetext' + index).hide();
        }

      }
    }
    console.log("New Question");
    console.log(this.question);
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
  }

  showAnswer(answer, index, questionIndex) {
    this.answer = answer;
    this.answerIndex = index;
    this.answer.index = index;
    this.keyupFunction('editAnswerCharCount' + questionIndex, this.answer.answerDescription, 'textAnswer' + index);
    if (this.question.hasOwnProperty('index')) $('#text' + this.question.index).show();
    else $('#text').show();
  }
  cancelQuestionEditing(index,mainIndex) {

    this.hideOutcomeButtons = false;

    if(mainIndex != -1){
      $('#editQuestion' + index + mainIndex).hide();
      $('#questionHeading' + index + mainIndex).show();
    }
    else
    {
    $('#editQuestion' + index).hide();
    $('#questionHeading' + index).show();
    }
    this.progresBarWidth = Math.round(100 / (this.questionArray.length));
    $("#previewBar").css({ "width": this.progresBarWidth + "%" })
    this.resetQuestion();
  }

  editAnswerImage(answer, index, quizIndex) {
    this.answer = answer;
    this.answerIndex = index;
    this.answer.index = index;
    if ($("#AddNewImagetext" + quizIndex).is(":visible")) {
      $("#AddNewImagetext" + quizIndex).hide();
    } else {
      $("#AddNewImagetext" + quizIndex).show();
    }
    if ($(".setting__answer--preview #imageAnswerSetupPreview" + index).is(":visible")) {
      //  console.log(index);
      $(".setting__answer--preview #imageAnswerSetupPreview" + index).hide();
      // $("#AddNewImagetext"+quizIndex).show();
      $(".setting__answer--preview #Imagetext" + index).show();
      this.keyupFunction('editAnswerCharCount' + quizIndex, this.answer.answerDescription, 'imageText' + index);

    } else {
      $(".setting__answer--preview #imageAnswerSetupPreview" + index).show();
      // $("#AddNewImagetext"+quizIndex).hide();
      $(".setting__answer--preview #Imagetext" + index).hide();
      this.answer = {};
      this.answerIndex = this.question.quizAnswers.length;
      $("#editAnswerCharCount" + quizIndex).text("0/200")
    }
  }
  async saveEditedAnswer() {
    console.log(this.croppedImage);
    if (this.croppedImage != undefined) {
      await this.uploadAnswerImage('Old')
    }
    this.question.quizAnswers[this.answer.index].answerDescription = this.answer.answerDescription;
    $(".setting__answer--preview #imageAnswerSetupPreview" + this.answer.index).show();
    $(".setting__answer--preview #Imagetext" + this.answer.index).hide();
    this.answerIndex = this.question.quizAnswers.length;
    $("#AddNewImagetext" + this.question.index).show();
    if (this.quizConfiguration.multiVariationNo == this.question.quizAnswers.length && this.quizConfiguration.multiVariationNo != 1) {
      $("#AddNewImagetext" + this.question.index).hide();
    } else if (this.quizConfiguration.multiVariationNo == 1 && this.question.quizAnswers.length == 6) {
      $("#AddNewImagetext" + this.question.index).hide();
    }
    //await this.addAnswer(this.question.index);
    this.answer = {};
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
  }
  editnewAnswer(answer, index) {
    this.newAnswer = answer;
    this.newAnswer.index = index;
    this.answerIndex = index;

    this.keyupFunction('editAnswerCharCount', this.newAnswer.answerDescription, 'textAnswer' + index);
    if (this.newQuestion.answerTypeId == "2" && $("#Imagetext").is(":hidden")) {
      $("#Imagetext").show();
    }
    if (this.newQuestion.answerTypeId == "1" && $("#text").is(":hidden")) {
      $("#text").show();
    }
  }
  async deleteAnswer(answer, index) {
    if (this.question.hasOwnProperty('index')) {
      this.question.quizAnswers.splice(index, 1);
      this.answerIndex = this.question.quizAnswers.length;
      if (this.question.answerTypeId == 1) {
        //  $("#answer"+this.question.index).focus();
        $('#text' + this.question.index).show();
        this.keyupFunction('null', "", 'textAnswer' + this.answerIndex);
      } else {
        //$("#answerImageText"+this.question.index).focus();
        $('#AddNewImagetext' + this.question.index).show();
        this.keyupFunction('null', "", 'imageText' + this.answerIndex);
        $('#imageAnswer' + this.answerIndex).attr('src', '/assets/images/pexels-photo-175718.jpg');
      }
      console.log(answer.id);
      var res = await this.service.deleteAnswers(answer.id);
      console.log(res);
    } else {

      this.newQuestion.quizAnswers.splice(index, 1);
      this.answerIndex = this.newQuestion.quizAnswers.length;
      console.log(this.newQuestion.quizAnswers.length)
      if (this.newQuestion.answerTypeId == 1) {
        // $("#answer").focus();
        $('#text').show();
        this.keyupFunction('null', "", 'textAnswer' + this.answerIndex);
      } else {
        //  $("#answerImageText").focus();
        $('#Imagetext').show();
        this.keyupFunction('null', "", 'imageText' + this.answerIndex);
        $('#imageAnswer' + this.answerIndex).attr('src', '/assets/images/pexels-photo-175718.jpg');
      }
      console.log(this.newQuestion);
    }
    $("#outcomeMappingLine"+answer.answerNo).hide();
    $("#branchingMappingLine"+answer.answerNo).hide();
    console.log(this.question);
    var outcomeIndex = this.question.outcomeAnswerMapped.findIndex(x => x.id == answer.outcome.id)
    if(outcomeIndex >= 0){
      var foundIndex = this.question.outcomeAnswerMapped[outcomeIndex].answerNo.findIndex(x => x == answer.answerNo);
      if(foundIndex >= 0){
        this.question.outcomeAnswerMapped[outcomeIndex].answerNo.splice(foundIndex,1);
      }
    }
   
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
  }

  clearAnswer() {
    if (this.question.hasOwnProperty('index')) {
      this.answer = {};
      if (this.question.answerTypeId == 1) {
        $("#answer" + this.question.index).focus();
        this.keyupFunction('null', "", 'textAnswer' + this.answerIndex);
      } else {
        $("#answerImageText" + this.question.index).focus();
        this.keyupFunction('null', "", 'imageText' + this.answerIndex);

      }

    } else {
      this.newAnswer = {}
      if (this.newQuestion.answerTypeId == 1) {
        $("#answer").focus();
        this.keyupFunction('null', "", 'textAnswer' + this.answerIndex);
      } else {
        $("#answerImageText").focus();
        this.keyupFunction('null', "", 'imageText' + this.answerIndex);

      }
    }
    this.questionForm.form.markAsPristine();
    this.questionForm.form.markAsUntouched();
    this.questionForm.form.updateValueAndValidity();
  }

  // output event function of file upload
  onFileUpload(event: any) {
    //console.log("this is the result of emitted output from upload-file component, uploaded file is", event.croppedImage);
    // update this component croppedImage binding with received image
    this.croppedImage = event.croppedImage;
    this.changedImage = event.changedImage;
    this.cropImage = event.cropImage;

    // call closeModal here 
    if (this.croppedImage) {

      // to update bindings
      this.closeModel("OK");
    } else {

      // to update bindings
      this.closeModel("CANCEL");
    }
  }
  async deleteQuestion(question) {
    var con = confirm("Deleting this question will delete all its variation, and the mapping branching with it, Are you sure you want to delete it");
    if (con == true) {
      //this.variationArray=[];
      for (var i = 0; i < this.questionArray.length; i++) {
        var index = this.questionArray.findIndex(x => x.questionNo == question.questionNo);
        if (index > 0) {
          this.questionArray.splice(index, 1);
        }
      }

      if(this.quizConfiguration.multiVariationNo > 1)
      {
        var remove= false;
        for (var i = 0; i < this.questionArrayMulti.length; i++) {
          
          for (var j = 0; j < this.questionArrayMulti[i].length; j++) {
            var que = this.questionArrayMulti[i][j];
            //var indexm = que.findIndex(x => x.questionNo == question.questionNo);
            //console.log(indexm);
            if (que.questionNo == question.questionNo) {
              console.log(this.questionArrayMulti);
              this.questionArrayMulti.splice(i, 1);
              console.log(this.questionArrayMulti);
              remove = true;
              break;
            }
          }
          if(remove)
            break;
        }
      }
      this.quizConfiguration.quizQuestions = this.questionArray;
      this.response = await this.service.deleteQuestion(question.id, this.quizConfiguration.id);
      console.log(this.response)
      // this.response = JSON.parse(this.response['_body']);
      console.log(this.response)
      if (this.response.status == "SUCCESS") {

        this.quizConfiguration = this.response.data;
        this.quizConfigureservice.change(this.quizConfiguration);
        this.quizConfiguration = this.quizConfigureservice.quizConfiguration;
        this.questionArray = this.quizConfiguration.quizQuestions;
        if(this.variationArray.length >0){
          this.variationArray = [];
          this.addQuestion()
        }
      }
      console.log(this.quizConfiguration)
    }
  }
  onAnswerSelect(event, answer, index) {
    console.log(answer)
    if(this.question.outcomeAnswerMapped && answer.outcome != null){ 
    var outcomeIndex = this.question.outcomeAnswerMapped.findIndex(x => x.id == answer.outcome.id)
    if(outcomeIndex >= 0){
      var foundIndex = this.question.outcomeAnswerMapped[outcomeIndex].answerNo.findIndex(x => x == answer.answerNo);
      if(foundIndex >= 0){
        this.question.outcomeAnswerMapped[outcomeIndex].answerNo.splice(foundIndex,1);
      }
    }
  }
  var branchValue = $("#outcomeMappingLine"+answer.answerNo).css('z-index');
  console.log(branchValue)
    if(!this.answer.id && this.answer.id != answer.id && (branchValue == 0 || branchValue == 'auto')){
      //$(".answer").removeClass("connected");
      this.x1 = event.clientX;
      this.y1 = event.clientY
      // var parentDiv = event.target.offsetParent;
      // parentDiv.className += " connected";
      this.selectedAnswer = answer.answerNo;
      this.answer = answer;
      this.answer.index = index;
      this.selectColor(answer.answerNo);
      console.log(answer.answerNo)
      this.onMouseMove(event);
      this.question.quizAnswers.forEach(ans =>{
        if(ans.id != this.answer.id){
          if(this.question.answerTypeId == 1)
          $("#outcomeAnswerText"+ans.id).css("pointer-events" ,"none");
          else
          $("#outcomeAnswerImage"+ans.id).css("pointer-events" ,"none");
        }else if(ans.id == this.answer.id){
            this.answer.outcome = null;
            ans.outcome = null
        }
      })
    }else{
      this.x1= undefined; this.y1 = undefined;
      this.answer = {};
      $("#outcomeMappingLine"+answer.answerNo).css('z-index',0);
    }
   
  }

  onBranchingAnswerSelect(event, answer, index) {
    //$(".answer").removeClass("connected");
    //console.log($scope.answer);
    //$(".outcome").removeClass("connected");
    // console.log(event)\
    var branchValue = $("#branchingMappingLine"+answer.answerNo).css('z-index');

    console.log(branchValue);
    if(!this.answer.id && this.answer.id != answer.id && branchValue == 0){
    this.x1 = event.clientX;
    this.y1 = event.clientY
    // var parentDiv = event.target.offsetParent.parentNode;
    // parentDiv.classList.remove("connected");
    //parentDiv.className += " connected";
    this.selectedAnswer = answer.answerNo;
    this.answer = answer;
    this.answer.index = index;
    this.selectColor(answer.answerNo);
    if (Object.keys(this.answer).length > 0) {
      this.skipToQuesDisabled = true;
    }
    console.log(answer)
    this.onMouseMove(event);
    this.question.quizAnswers.forEach(ans =>{
      if(ans.id != this.answer.id){

        if(this.question.answerTypeId == 1)
        $("#branchingTextAnswer"+ans.id).css("pointer-events" ,"none");
        else 
        $("#branchingImageAnswer"+ans.id).css("pointer-events" ,"none");
      }else if(ans.id == this.answer.id){
        ans.logicBranch = null;
        this.answer.logicBranch = null;
      }
    })
  }else{
    this.x1= undefined, this.y1 = undefined;
    $("#branchingMappingLine"+answer.answerNo).css('z-index',0);
    this.answer = {};
  }
  }

  onOutcomeSelect($event, outcome, index) {
    //$(".outcome").removeClass("connected");
    var parentDiv = $event.target.offsetParent;
    if(this.answer.id){
    this.x2 = $event.clientX;
    this.y2 = $event.clientY;
    parentDiv.className += " connected";
    this.answer.outcome = outcome;
    // console.log($scope.question)
    this.question.quizAnswers[this.answer.index] = this.answer;
    this.createLine(this.x1, this.y1, this.x2, this.y2, "outcomeMappingLine" + this.selectedAnswer);
    this.x1 = undefined, this.y1 = undefined
    for (var i = 0; i < this.question.outcomeAnswerMapped.length; i++) {
      var includeAns = this.question.outcomeAnswerMapped[i].answerNo.indexOf(this.selectedAnswer);
      if (includeAns >= 0) {
        this.question.outcomeAnswerMapped[i].answerNo.splice(includeAns, 1);
      }
    }
    if (!outcome.answerNo.includes(this.selectedAnswer)) {
      outcome.answerNo.push(this.selectedAnswer)
      this.question.outcomeAnswerMapped[index] = outcome;
    }
    if (this.answer.answerNo == 'A') {
      this.answerLineA = $("#outcomeMappingLineA").css("top").split("px");
      this.answerLineA = parseInt(this.answerLineA[0]) + this.scroll;
    }
    else if (this.answer.answerNo == 'B') {
      this.answerLineB = $("#outcomeMappingLineB").css("top").split("px");
      this.answerLineB = parseInt(this.answerLineB[0]) + this.scroll;
    }
    else if (this.answer.answerNo == 'C') {
      this.answerLineC = $("#outcomeMappingLineC").css("top").split("px");
      this.answerLineC = parseInt(this.answerLineC[0]) + this.scroll;
    }
    else if (this.answer.answerNo == 'D') {
      this.answerLineD = $("#outcomeMappingLineD").css("top").split("px");
      this.answerLineD = parseInt(this.answerLineD[0]) + this.scroll;
    }
    else if (this.answer.answerNo == 'E') {
      this.answerLineE = $("#outcomeMappingLineE").css("top").split("px");
      this.answerLineE = parseInt(this.answerLineE[0]) + this.scroll;
    }
    else if (this.answer.answerNo == 'F') {
      this.answerLineF = $("#outcomeMappingLineF").css("top").split("px");
      this.answerLineF = parseInt(this.answerLineF[0]) + this.scroll;
    }
    this.answer = {};
    this.scroll = 0;
    this.question.quizAnswers.forEach(ans =>{
      if(ans.id != this.answer.id){
        if(this.question.answerTypeId == 1)
        $("#outcomeAnswerText"+ans.id).css("pointer-events" ,"auto");
        else
        $("#outcomeAnswerImage"+ans.id).css("pointer-events" ,"auto");
      }else if(ans.id == this.answer.id){
          ans= this.answer
       }
    })
  }else{
    if(this.question.outcomeAnswerMapped){ 
          this.question.outcomeAnswerMapped.forEach(mapOutcome =>{
            mapOutcome.answerNo = [];
          })
    }
    parentDiv.classList.remove("connected");
    this.question.quizAnswers.forEach(ans =>{
      ans.outcome = null;
    })
    $("#outcomeMappingLine").css('z-index',0);
    //$('.outcomeMappingLine').hide();
  }
  }

  selectColor(answerNo) {
    if (answerNo == 'A') {
      this.lineColor = '#1DCB9A'
    } else if (answerNo == 'B') {
      this.lineColor = '#F0C22A'
    } else if (answerNo == 'C') {
      this.lineColor = '#2ac5f0'
    } else if (answerNo == 'D') {
      this.lineColor = '#ca1e1e'
    } else if (answerNo == 'E') {
      this.lineColor = '#180fc7'
    } else if (answerNo == 'F') {
      this.lineColor = '#c70faa'
    }
  }

  createLine(x1, y1, x2, y2, lineId) {
    var distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
    var xmid = (x1 + x2) / 2;
    var ymid = (y1 + y2) / 2;
    var d = distance / 2;
    var left = xmid - d;
    var slopeInRadius = Math.atan2(y1 - y2, x1 - x2);
    var slopeInDegree = (slopeInRadius * 180) / Math.PI;
    $("#" + lineId).css("width", distance);
    $("#" + lineId).css("background-color", this.lineColor);
    $("#" + lineId).css("top", (ymid));
    $("#" + lineId).css("left", (left));
    $("#" + lineId).css("z-index", 99);
    $("#" + lineId).css("transform", "rotate(" + slopeInDegree + "deg)");
    $("#" + lineId).show();
    var line = document.getElementById(lineId);

    // console.log(line)
  }


  onLogicBranchingSelect(event, branch) {
    var clasName = event.target.className;
    var parentDiv = event.target.offsetParent;
    console.log(event);
    if(this.answer.id){
    if (clasName.includes('disableNextQuestion') == false) {
      $(".branching").removeClass("connected");
      this.x2 = event.clientX;
      this.y2 = event.clientY;
     
      parentDiv.className += " connected";

      if (branch.id == '1') {
        this.answer.logicBranch = branch;
        this.answer.defaultSetting = false;
        this.question.quizAnswers[this.answer.index] = this.answer;
        this.question.quizAnswers[this.answer.index].logicBranchQuestionNo = this.nextQuestion.id;
        // delete $scope.answer.index;
      } else if (branch.id == '2' || branch.id == '4') {
        this.answer.logicBranch = branch;
        this.answer.defaultSetting = false;
        this.question.quizAnswers[this.answer.index] = this.answer;
        //     delete $scope.answer.index;
      } else if (branch.id == '3') {
        this.answer.logicBranch = branch;
        this.answer.defaultSetting = false;
        this.question.quizAnswers[this.answer.index] = this.answer;

      }
      this.createLine(this.x1, this.y1, this.x2, this.y2, "branchingMappingLine" + this.selectedAnswer);
      this.x1 = undefined, this.y1 = undefined
      if (this.answer.answerNo == 'A') {
        this.branchingMappingLineA = $("#branchingMappingLineA").css("top").split("px");

        this.branchingMappingLineA = parseInt(this.branchingMappingLineA[0]) + this.scroll;
        console.log(this.branchingMappingLineA)
      }
      else if (this.answer.answerNo == 'B') {
        this.branchingMappingLineB = $("#branchingMappingLineB").css("top").split("px");
        this.branchingMappingLineB = parseInt(this.branchingMappingLineB[0]) + this.scroll;
      }
      else if (this.answer.answerNo == 'C') {
        this.branchingMappingLineC = $("#branchingMappingLineC").css("top").split("px");
        this.branchingMappingLineC = parseInt(this.branchingMappingLineC[0]) + this.scroll;
      }
      else if (this.answer.answerNo == 'D') {
        this.branchingMappingLineD = $("#branchingMappingLineD").css("top").split("px");
        this.branchingMappingLineD = parseInt(this.branchingMappingLineD[0]) + this.scroll;
      }
      else if (this.answer.answerNo == 'E') {
        this.branchingMappingLineE = $("#branchingMappingLineE").css("top").split("px");
        this.branchingMappingLineE = parseInt(this.branchingMappingLineE[0]) + this.scroll;
      }
      else if (this.answer.answerNo == 'F') {
        this.branchingMappingLineF = $("#branchingMappingLineF").css("top").split("px");
        this.branchingMappingLineF = parseInt(this.branchingMappingLineF[0]) + this.scroll;
      }
      if (branch.id != '3') this.answer = {};
      this.scroll = 0;
      this.question.quizAnswers.forEach(ans =>{
        if(ans.id != this.answer.id){
          if(this.question.answerTypeId == 1)
          $("#branchingTextAnswer"+ans.id).css("pointer-events" ,"auto");
          else 
          $("#branchingImageAnswer"+ans.id).css("pointer-events" ,"auto");
        }else if (ans.id == this.answer.id){
          ans = this.answer; 
        }
      })
    }
  }else{

      parentDiv.classList.remove("connected");
      this.question.quizAnswers.forEach(ans =>{
        ans.logicBranch = null;
      })
      $('.outcomeMappingLine').css('z-index',0);
      //$('.outcomeMappingLine').hide();
      

  }
  }

  public handleBranchingScroll(event) {
    var scroll = event.originalEvent.target.scrollTop;
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'A')
      $("#branchingMappingLineA").css("top", (parseInt(this.branchingMappingLineA) - parseInt(scroll)));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'B')
      $("#branchingMappingLineB").css("top", (parseInt(this.branchingMappingLineB) - parseInt(scroll)));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'C')
      $("#branchingMappingLineC").css("top", (parseInt(this.branchingMappingLineC) - parseInt(scroll)));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'D')
      $("#branchingMappingLineD").css("top", (parseInt(this.branchingMappingLineD) - parseInt(scroll)));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'E')
      $("#branchingMappingLineE").css("top", (parseInt(this.branchingMappingLineE) - parseInt(scroll)));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'F')
      $("#branchingMappingLineF").css("top", (parseInt(this.branchingMappingLineF) - parseInt(scroll)));
    if (Object.keys(this.answer).length > 0 && this.question.answerTypeId == 1) {
      this.scroll = scroll;
      var coOrdinates: any;
      coOrdinates = document.getElementById("branchingTextAnswer" + this.answer.id).getBoundingClientRect();
      this.y1 = parseInt(coOrdinates.y) + 10;
      this.createLine(this.x1, this.y1, this.x2, this.y2, "branchingMappingLine" + this.answer.answerNo)

    } else if (Object.keys(this.answer).length > 0 && this.question.answerTypeId == 2) {
      this.scroll = scroll;
      var coOrdinates: any;
      coOrdinates = document.getElementById("branchingImageAnswer" + this.answer.id).getBoundingClientRect();
      this.y1 = parseInt(coOrdinates.y) + 10;
      this.createLine(this.x1, this.y1, this.x2, this.y2, "branchingMappingLine" + this.answer.answerNo)
    }
  }

  public handleOutcomeScroll(event) {
    //console.log(event)
    var scroll = event.originalEvent.target.scrollTop;
    console.log(scroll)
    // var data = document.getElementById('questions')
    // var scroll = data.scrollTop;
    // console.log(scroll)
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'A')
      $("#outcomeMappingLineA").css("top", (parseInt(this.answerLineA) - scroll));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'B')
      $("#outcomeMappingLineB").css("top", (parseInt(this.answerLineB) - scroll));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'C')
      $("#outcomeMappingLineC").css("top", (parseInt(this.answerLineC) - scroll));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'D')
      $("#outcomeMappingLineD").css("top", (parseInt(this.answerLineD) - scroll));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'E')
      $("#outcomeMappingLineE").css("top", (parseInt(this.answerLineE) - scroll));
    if (Object.keys(this.answer).length == 0 || this.answer.answerNo != 'F')
      $("#outcomeMappingLineF").css("top", (parseInt(this.answerLineF) - scroll));
    if (Object.keys(this.answer).length > 0 && this.question.answerTypeId == 1) {
      this.scroll = scroll;
      console.log(this.scroll);
      var coOrdinates: any;
      coOrdinates = document.getElementById("outcomeAnswerText" + this.answer.id).getBoundingClientRect();
      this.y1 = parseInt(coOrdinates.y) + 10;
      this.createLine(this.x1, this.y1, this.x2, this.y2, "outcomeMappingLine" + this.answer.answerNo)
    } else if (Object.keys(this.answer).length > 0 && this.question.answerTypeId == 2) {
      this.scroll = scroll;
      var coOrdinates: any;
      coOrdinates = document.getElementById("outcomeAnswerImage" + this.answer.id).getBoundingClientRect();
      this.y1 = parseInt(coOrdinates.y) + 10;
      this.createLine(this.x1, this.y1, this.x2, this.y2, "outcomeMappingLine" + this.answer.answerNo);
    }
  }
  async editChangeAnswerType(index, question) {
    console.log(index)
    var con = confirm("If you change the answer type then all your answers will be deleted, Do You want to continue");
    if (con == true) {
      this.answerIndex = 0;
      this.question.quizAnswers = [];
      this.answer = {};

      // if(this.question.answerTypeId == "1"){
      //   this.question.answerTypeId = 1
      //   this.newQuestion.answerTypeId = 1;
      // }else{
      //   this.newQuestion.answerTypeId = 2;
      //   this.question.answerTypeId = 2
      // }
      console.log(question.answerTypeId)
      this.response = await this.service.deleteAllAnswers(this.question.id)
      // this.response = JSON.parse(this.response['_body']);
      if (this.response.status == "SUCCESS") {
        this.question = this.response.data;
        this.question.answerTypeId = question.answerTypeId;
        this.newQuestion.answerTypeId = question.answerTypeId;
        this.question.index = index;
        console.log(this.question)
      }
    } else {
      if (question.answerTypeId == "1") {
        this.question.answerTypeId = 2
        this.newQuestion.answerTypeId = 2;
      } else {
        this.newQuestion.answerTypeId = 1;
        this.question.answerTypeId = 1
      }
    }

  }
  changeAnswerType() {
    this.answerIndex = 0;
    this.newQuestion.quizAnswers = [];
    this.newAnswer.answerDescription = "";
     if(this.newQuestion.answerTypeId == "1"){
        this.question.answerTypeId = 1
        this.newQuestion.answerTypeId = 1;
      }else{
        this.newQuestion.answerTypeId = 2;
        this.question.answerTypeId = 2
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
