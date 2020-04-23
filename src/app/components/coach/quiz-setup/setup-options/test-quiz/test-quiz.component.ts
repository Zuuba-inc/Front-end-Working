import { Component, OnInit } from '@angular/core';
import { QuizConfigureserviceService } from 'src/app/services/coach/quiz/quiz-configureservice.service';
// import jquery
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';
import Swal from 'sweetalert2';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { AuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { UserserviceService } from 'src/app/services/global/user/userservice.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-test-quiz',
  templateUrl: './test-quiz.component.html',
  styleUrls: ['./test-quiz.component.css']
})
export class TestQuizComponent implements OnInit {
  socialUser: SocialUser;
  email: any;
  constructor(public quizConfigureservice: QuizConfigureserviceService, public router: Router,
              public location: Location,
              public quizAPI: QuizapiserviceService, public loginService: UserserviceService, public socialAuthService: AuthService, public authService: AuthapiserviceService, public route: ActivatedRoute) { }
  quizConfiguration;
  questionArray = [];
  show: boolean = true;
  testSelectedOutcome = [];
  questionBackgroundColor;
  questionFontColor; answerBackgroundColor; answerFontColor;
  currentUser = { id: '', uRole: { roleId: '' } };
  userRole = 0;
  totalNumberOfQuestions = 1;
  message = null;
  testProgresBarWidth: any;
  // this is used to persist id when user navigates from one module to other and fetch data based on this id
  quizId: any;
  finnalOutcome: any = {};
  selectedAnswerByUser: any = {};

  facebookPixelId: any;

  vidFormats = ['.webm', '.mkv', '.flv', '.vob', '.ogg', '.ogv', '.drc', '.gif', '.gifv', '.mng',
                              '	.avi', '.MTS', '.M2TS', '.TS', '.mov', '.qt', '.wmv', '.mp4', '.amv', 'm4p', 
                              '.mpg', '.mpeg', '.m4v', '.3gp', '.flv'];

  async ngOnInit() {

    localStorage.setItem("lastVisitedSubModule", "Test Quiz");

    // get data from from quizService and
    this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

    console.log("in ngOnit of testquiz module", this.quizConfiguration);

    // this.appendFBPixelScript();

    // get quizId from localStorage
    this.quizId = localStorage.getItem("quizId");
    this.selectedAnswerByUser.quizId = this.quizId;
    if (this.quizId == null && this.route.snapshot.queryParamMap.get('id') != null) {
      this.quizId = this.route.snapshot.queryParamMap.get('id');
      this.selectedAnswerByUser.quizId = this.quizId;
    }
    //this.quizId =2;
    this.message = '';
    this.socialUser = undefined;
    if (localStorage.getItem('currentUser') != null) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.currentUser);
      console.log(this.currentUser.uRole.roleId);
      this.userRole = parseInt(this.currentUser.uRole.roleId);
      this.selectedAnswerByUser.appUserId = this.currentUser.id;
    }
    /*if(this.authService.getToken() == null)
    {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',
      
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
      }
      })
    }*/
    console.log(this.route.snapshot.paramMap.get('outcomeId'));
    if (localStorage.getItem('storedOutcome') != null) {
      let selOutcome = JSON.parse(localStorage.getItem('storedOutcome'));
      console.log(selOutcome, ' : ', this.currentUser.id);
      let quizId = localStorage.getItem('quizId');
      this.selectedAnswerByUser.quizId = quizId;
      this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
      this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
        console.log('record user response', record);
      });
      this.openDirectOutcome(JSON.parse(localStorage.getItem('storedOutcome')));
    }

    /*this.route.paramMap.subscribe(params => {
      console.log(params);
      localStorage.removeItem('storedOutcome');
      console.log(this.route.snapshot.params.id);
        if(this.route.snapshot.params.id != null || this.route.snapshot.params.id != undefined)*/
    if (this.quizConfiguration != null && !this.quizConfiguration.id && this.quizId) {

      //this.quizId = this.route.snapshot.params.id;
      this.quizAPI.getQuiz(this.quizId).subscribe(dataQuiz => {
        console.log(dataQuiz);
        var quiz: any;
        quiz = dataQuiz;
        if (quiz.status == 'SUCCESS') {
          this.quizConfiguration = quiz.data;

          console.log('this console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          console.log(this.quizConfiguration);

          this.quizConfigureservice.change(this.quizConfiguration);

          this.quizConfiguration = this.quizConfigureservice.quizConfiguration;

          this.appendFBPixelScript();
          this.appendGTMLScript();
          this.appendGAScripts();
          // set settings init data
          this.setTestQuizInitData(this.quizConfiguration);
        } else {
          this.serverError(quiz);
        }
      });
    } else {

      // data exists in service, then don't make API call.
      if (this.quizConfiguration && (this.quizConfiguration.id != null || this.quizConfiguration.id != undefined || this.quizConfiguration.id != "")) {

        this.appendFBPixelScript();
        this.appendGTMLScript();
        this.appendGAScripts();

        this.setTestQuizInitData(this.quizConfiguration);
      }
    }
  }
  colorScheme=[];
  changeColors(quizPage){
    if(quizPage == 'Welcome Page'){
      
        this.changeFontColorAndFont('.welcomePageClass, #quiz-callToAction-preview')
      
        // this.changeFontColorAndFont('.welcomePageClass, #quiz-callToAction-preview')
        
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
    }else if(quizPage == 'Question'){
      this.changeFontColorAndFont('.previewAnswerTable, .questionTitle h4, .quizDesign header span, .quizDesign h5')
      this.colorScheme = this.quizConfiguration.colorSchemeObj.Quiz;
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
    }else if(quizPage == 'LeadCapture'){
      this.changeFontColorAndFont('.leadColor, #testLeadButton')
      this.colorScheme = this.quizConfiguration.colorSchemeObj.LeadCapture;
      console.log(this.colorScheme);
      this.colorScheme.forEach(color =>{
        if(color.quizArea.areaName == "Lead Capture Background"){
          $('.login').css("background", color.backColor);
          this.changeTextColor('.leadColor',color.backColor)
        }else if(color.quizArea.areaName == "Call to action button"){
          $('#testLeadButton').css("background", color.backColor);
          this.changeTextColor('#testLeadButton',color.backColor )
        }
      })
    }else if(quizPage == 'Outcome'){
      this.changeFontColorAndFont('.OutcomeDesign, #outcomeOfferDesign, #testOutcomeOfferButton')
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
          $('#testOutcomeOfferButton').css("background", color.backColor);
          this.changeTextColor('#testOutcomeOfferButton',color.backColor )
        }
      })
    }
    
  }
 // this function changes the font color of the section whose background color is lighter than the font color or vise versa
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
  // $(component).css("color", newColor);
}
  changeFontColorAndFont(className){
    if(this.quizConfiguration.fontColor != null){
      $(className).css("color", this.quizConfiguration.fontColor);
     }
     if(this.quizConfiguration.fontName != null){
      $(className).css("font-family", this.quizConfiguration.fontName);
      // $("#quiz-callToAction-preview").css("font-family", this.quizConfiguration.fontName);
     }
  }
  
  appendGTMLScript(){
    if(this.quizConfiguration.googleTagMngrId != null || this.quizConfiguration.googleTagMngrId != undefined){ 
    var gtm = "<script>"+
    "(function(w,d,s,l,i)"+
    "{w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});"+
    "var f=d.getElementsByTagName(s)[0],"+
    "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;"+
    "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);"+
    "})(window,document,'script','dataLayer','"+this.quizConfiguration.googleTagMngrId+"');</script>";
    console.log(gtm);
    var script = $(gtm).appendTo(document.head);
    var gtmlBodyScript = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id='+this.quizConfiguration.googleTagMngrId+'" '+
    'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
    var bodyScript = $(gtmlBodyScript).appendTo(document.body);
    }
      // console.log("Script was appended to", script[0].parentNode.nodeName);
  }
  appendFBPixelScript() {

    this.facebookPixelId = this.quizConfiguration.facebookPixelId;

    console.log(this.router.url.indexOf("/PlayQuiz") > -1);
    if (this.router.url.indexOf("/PlayQuiz") > -1) {
      this.show = false;
      var facebookScript = '<script>' +
        '!function(f,b,e,v,n,t,s)' +
        '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?' +
        'n.callMethod.apply(n,arguments):n.queue.push(arguments)};' +
        'if(!f._fbq)f._fbq=n  ;n.push=n;n.loaded=!0;n.version="2.0";' +
        'n.queue=[];t=b.createElement(e);t.async=!0;' +
        't.src=v;s=b.getElementsByTagName(e)[0];' +
        's.parentNode.insertBefore(t,s)}(window, document,"script",' +
        '"https://connect.facebook.net/en_US/fbevents.js");' +
        // 'fbq("init", "686924918495391");'+
        'fbq("init",' + this.facebookPixelId ? this.facebookPixelId : "686924918495391" + ');' +
        'fbq("track", "PageView");' +
        '</script>' +
        '<noscript><img height="1" width="1" style="display:none"' +
        'src="https://www.facebook.com/tr?id=686924918495391&ev=PageView&noscript=1"' +
        '/></noscript>';
      var script = $(facebookScript).appendTo(document.head);
      //console.log("Script was appended to", script[0].parentNode.nodeName);
    }
  }

  googleTrackingId: any = "";

  appendGAScripts() {

      this.googleTrackingId = this.quizConfiguration.googleTrackingId;

      console.log(this.router.url.indexOf("/PlayQuiz") > -1);
      if (this.router.url.indexOf("/PlayQuiz") > -1) {

        console.log("inside appendGAScripts");

        this.show = false;

      // TODO: CHECK IF APPENDING ACTUALLY LOADS TAGS
      // <!-- Global site tag (gtag.js) - Google Analytics -->
      let gaScript1 = `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.googleTrackingId}"></script>`
      let gaScript2 = `<script>
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', '${this.googleTrackingId}');
                      </script>`;


      let script1 = $(gaScript1).appendTo(document.head);
      let script2 = $(gaScript2).appendTo(document.head);
    }

  }

  isVideo: boolean = false;

  setTestQuizInitData(quiz: any) {

    this.quizConfiguration = quiz;

    for (let i=0; i<this.vidFormats.length; i++) {

      let item = this.vidFormats[i];

      this.isVideo = this.quizConfiguration.quizMediaAttached.includes(item);

      if (this.isVideo) {
        break;
      }
    }

    // store data in service call
    this.quizConfigureservice.change(this.quizConfiguration);

    this.testConfigurationPage();
    this.questionArray = this.quizConfiguration.quizQuestions;
    if (this.quizConfiguration.multiVariationNo == "1") {
      this.totalNumberOfQuestions = this.quizConfiguration.quizQuestions.length;
    } else {
      this.quizConfiguration.quizQuestions.forEach(element => {
        if (element.variation == 'A')
          this.totalNumberOfQuestions++;
      })
    }

    // this.setColorAndTheme();
    if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.WelcomePage){
      this.changeColors("Welcome Page")
    }
   
    console.log(this.quizConfiguration.allowSocialSharing);
    if (this.quizConfiguration != undefined && this.quizConfiguration.allowSocialSharing == false) {
      $('.shareLink').style('display:none');
    }
  }

  // write jquery functions for jquery functionality to be working
  ngAfterViewInit() {
    if (this.quizConfiguration != undefined && this.quizConfiguration.allowSocialSharing == false) {
      $('.shareLink').style('display:none');
    }
  }
  async signInWithGoogle() {
    console.log("about to sign with google");
    this.socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(async (user) => {
      this.socialUser = user;
      console.log("socialUser value in ngOnit", this.socialUser);

      // redirect to home page after getting successful response
      if (this.socialUser && this.socialUser.provider == 'GOOGLE') {
        let user = { 'email': '', 'firstName': '', 'lastName': '', 'profilePicture': '', 'provider': '', 'providerId': '', 'userRole': '' };
        user.email = this.socialUser.email;
        user.firstName = this.socialUser.firstName;
        user.lastName = this.socialUser.lastName;
        user.profilePicture = this.socialUser.photoUrl;
        user.provider = this.socialUser.provider;
        user.providerId = this.socialUser.id;
        user.userRole = 'CLIENT';
        console.log(this.authService.getToken());
        if (this.authService.getToken() == null) {

          this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true).then(data => {
            console.log(data);
            var token: any;
            token = data;
            if (token.status == 'SUCCESS') {
              console.log(token);
              this.authService.saveToken(token.data);
              //console.log('after dy')
              this.loginService.login().then(async loggedInUser => {
                if (loggedInUser.status == 'SUCCESS') {
                  let user = loggedInUser.data;
                  console.log(this.quizId, ':', user.id);
                  this.selectedAnswerByUser.quizId = this.quizId;
                  this.selectedAnswerByUser.appUserId = user.id;
                  this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
                  this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
                    console.log('record user response', record);
                  });
                  this.openOutcome();
                }
              });

            }
            else if (token.status == 'ERROR') {
              this.loginService.registerUser(user).subscribe(data => {
                var userObj: any = data;
                console.log(userObj);
                if (userObj.status == 'SUCCESS') {
                  let user = userObj.data;
                  this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true).then(data => {
                    console.log(data);
                    var token: any = data;
                    if (token.status == 'SUCCESS') {
                      console.log(token);
                      this.authService.saveToken(token.data);
                      //console.log('after dy')
                      this.loginService.login().then(loggedInUser => {
                        this.openOutcome();
                      });

                    }

                  });
                }
                else if (userObj.status == 'ERROR') {
                  this.message = userObj.message;
                }
              }
              );
            }

          });



        }
        else {
          this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
          this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
            console.log('record user response', record);
          });
          this.openOutcome();
        }
        //this.router.navigate(['/quizSetup/WelcomePage/169']); 
      }
    });

  }

  signInWithFB(): void {
    console.log("about to sign with facebook");
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(async (user) => {
      this.socialUser = user;
      console.log("socialUser value in ngOnit", this.socialUser);

      // redirect to home page after getting successful response
      if (this.socialUser && this.socialUser.provider == 'FACEBOOK') {
        let user = { 'email': '', 'firstName': '', 'lastName': '', 'profilePicture': '', 'provider': '', 'providerId': '', 'userRole': '' };
        user.email = this.socialUser.email;
        user.firstName = this.socialUser.firstName;
        user.lastName = this.socialUser.lastName;
        user.profilePicture = this.socialUser.photoUrl;
        user.provider = this.socialUser.provider;
        user.providerId = this.socialUser.id;
        user.userRole = 'CLIENT';
        console.log(this.authService.getToken());
        if (this.authService.getToken() == null) {

          this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true).then(data => {
            console.log(data);
            var token: any = data;
            if (token.status == 'SUCCESS') {
              console.log(token);
              this.authService.saveToken(token.data);
              //console.log('after dy')
              this.loginService.login().then(async loggedInUser => {
                if (loggedInUser.status == 'SUCCESS') {
                  let user = loggedInUser.data;
                  console.log(this.quizId, ':', user.id);
                  this.selectedAnswerByUser.quizId = this.quizId;
                  this.selectedAnswerByUser.appUserId = user.id;
                  this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
                  this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
                    console.log('record user response', record);
                  });
                  this.openOutcome();
                }
              });

            }
            else if (token.status == 'ERROR') {
              this.loginService.registerUser(user).subscribe(data => {
                var userObj: any = data;
                console.log(userObj);
                if (userObj.status == 'SUCCESS') {
                  let user = userObj.data;
                  this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true).then(data => {
                    console.log(data);
                    var token: any = data;
                    if (token.status == 'SUCCESS') {
                      console.log(token);
                      this.authService.saveToken(token.data);
                      //console.log('after dy')
                      this.loginService.login().then(loggedInUser => {
                        this.openOutcome();
                      });

                    }

                  });
                }
                else if (userObj.status == 'ERROR') {
                  this.message = userObj.message;
                }
              }
              );
            }

          });



        }
        else {
          this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
          this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
            console.log('record user response', record);
          });
          this.openOutcome();
        }
        //this.router.navigate(['/quizSetup/WelcomePage/169']); 
      }
    });
  }

  async checkFOrRegistration() {
    console.log('inside checkFOrRegistration');

    if (this.authService.getToken() == null) {
      //check if email address is registered or not  
      let userData: any = await this.loginService.checkUser(this.email);
      var userResponse = userData;
      console.log(userResponse);
      if (userResponse.status == 'SUCCESS') {
        var finalOutcome = this.mode(this.testSelectedOutcome)
        console.log(finalOutcome.outcomeMediaAttached);
        localStorage.setItem('message', 'Please login to see your outcome');
        localStorage.setItem('email', this.email);
        localStorage.setItem('outcomeId', finalOutcome.id);
        localStorage.setItem('storedOutcome', JSON.stringify(finalOutcome));
        this.router.navigate(['/login/', { outcomeMapping: true }]);
      }
      else if (userResponse.status == 'ERROR') {
        var finalOutcome = this.mode(this.testSelectedOutcome)
        console.log(finalOutcome.outcomeMediaAttached);
        localStorage.setItem('storedOutcome', JSON.stringify(finalOutcome));
        localStorage.setItem('quizId', this.quizId);
        localStorage.setItem('email', this.email);
        this.router.navigate(['/Registration', { outcomeMapping: true }]);
      }



    }
    else {
      this.selectedAnswerByUser.userSelectedAnswers = await this.quizConfigureservice.getStoredAnswer();
      this.quizAPI.recordUser(this.selectedAnswerByUser).then(record => {
        console.log('record user response', record);
      });
      this.openOutcome();
    }
  }

  // signout when signed in with social login
  signOut(): void {
    this.socialAuthService.signOut();
  }

  testConfigurationPage() {
    console.log(this.quizConfiguration.quizTitle);
    var x = $(".create-quiz__menu--item");
    if (this.quizConfiguration.quizTitle != null) this.keyupFunction('null', this.quizConfiguration.quizTitle, 'testQuizHeadline');
    if (this.quizConfiguration.quizDescription != null) this.keyupFunction('null', this.quizConfiguration.quizDescription, 'testQuizDesc');
    if (this.quizConfiguration.quizCallActionLabel != null) this.keyupFunction('null', this.quizConfiguration.quizCallActionLabel, 'testQuizCallToAction');
    if (this.quizConfiguration.quizMediaAttached != null) $('#testQuizImage').attr('src', this.quizConfiguration.quizMediaAttached);
  }

  keyupFunction = function (charCount, from, to) {

    // console.log("in keyupFunction", charCount, from, to);
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

  startQuizTest() {
    alert('hello');
    // window.scrollTo(0, 0);
    if (this.router.url.indexOf("/PlayQuiz") > -1) {
    this.quizAPI.storeQuizCount(this.quizId, 'noOfParticipants').then(record => {
      console.log('Quiz record count response for noOfParticipants', record);
    });
    }
    for (var i = 0; i < this.questionArray.length; i++) {
      this.questionArray[i].index = i;
    }
    $(".testQ").hide();
    $('.live-preview__quiz--answers').show();
    $('.quizQuestion').show();
    if (this.quizConfiguration.quizQuestions.length > 0) {
      $("#testQuizQuestion0").show();
    } else {
      $("#testQuizQuestion").show();
    }
    console.log('total no of  question', this.totalNumberOfQuestions);
    this.testProgresBarWidth = Math.round(100 / (this.totalNumberOfQuestions));
    console.log('progress bar width ', this.testProgresBarWidth);
    $(".completed").css({ "width": this.testProgresBarWidth + "%" });
    //console.log(this.questionArray)
    if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.Quiz){
    this.changeColors("Question");
    }
  }


  nextQuestion1(question, answer) {
    var noOfQuestion = this.questionArray.length;
    this.message = '';
    //console.log(index , ' : ', answer );
    if (answer.outcome == undefined || answer.logicBranch == undefined) {
      this.message = "You have not mapped this answer with a branch or outcome";

    } else {
      this.quizConfigureservice.storeSelectedAnswers(question.id, answer);
      if (answer.logicBranch.id == '1' || answer.logicBranch.id == '3') {
        for (var i = 0; i < this.questionArray.length; i++) {
          if (answer.logicBranchQuestionNo == this.questionArray[i].id) {
            var qNumber = parseInt(this.questionArray[i].questionNo)
            this.testProgresBarWidth = Math.round(100 / (this.totalNumberOfQuestions)) * qNumber;
            $(".completed").css({ "width": this.testProgresBarWidth + "%" })
            $("#testQuizQuestion" + question.index).hide();
            $("#testQuizQuestion" + i).show();
            break;
          }
        }
        this.testSelectedOutcome.push(answer.outcome)
        noOfQuestion--;
        if (noOfQuestion == 0) {
          this.showLead();
        }
      } else if (answer.logicBranch.id == '2') {
        this.testSelectedOutcome.push(answer.outcome)
        this.showLead();
        noOfQuestion--;
        if (noOfQuestion == 0) {
          this.showLead();
        }
      } else {
        this.openDirectOutcome(answer.outcome);
      }

    }
  }

  showLead() {
    $(".testQ").hide();
    $(".quizQuestion").hide();
    $(".leadTest").show();
    if (this.router.url.indexOf("/PlayQuiz") > -1) {
      this.quizAPI.storeQuizCount(this.quizId, 'noOfCompleted').then(record => {
        console.log('Quiz count record response for noOfCompleted', record);
      });
    }
    if (this.quizConfiguration.quizLeadCaptureInfo.headline != null) this.keyupFunction('null', this.quizConfiguration.quizLeadCaptureInfo.headline, 'testLeadHadline');
    if (this.quizConfiguration.quizLeadCaptureInfo.headlineDesc != null) this.keyupFunction('null', this.quizConfiguration.quizLeadCaptureInfo.headlineDesc, 'testLeadDesc');
    if (this.quizConfiguration.quizLeadCaptureInfo.callActionLabel != null) this.keyupFunction('null', this.quizConfiguration.quizLeadCaptureInfo.callActionLabel, 'testLeadButton');
    if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.LeadCapture){  
      this.changeColors("LeadCapture");
    }
  }

  openDirectOutcome(outcome) {
    console.log("Open Outcome")
    console.log(outcome)
    localStorage.removeItem('storedOutcome');
    this.keyupFunction('null', outcome.outcomeTitle, 'testOutcomeHeadline');
    this.keyupFunction('null', outcome.outcomeDescription, 'testOutcomeDesc');
    this.keyupFunction('null', outcome.offerHeadline, 'testOutcomeOfferHeadline');
    this.keyupFunction('null', outcome.offerDescription, 'testOutcomeOfferDesc');
    this.keyupFunction('null', outcome.offerCallActionLabel, 'testOutcomeOfferButton');
    console.log(outcome.outcomeMediaAttached);
    if (outcome.isOutcomeImgVideo != undefined && outcome.isOutcomeImgVideo.trim() == 'Image') {
      $("#testVideoPreview").hide();
      $('#testOutcomeImage').show();
      $('#testOutcomeImage').attr('src', outcome.outcomeMediaAttached);
    }
    else {
      $("#testVideoPreview").show();
      $('#testOutcomeImage').hide();
      $("#testVideoPreview").attr("src", outcome.outcomeMediaAttached);
      $("#testVideoPreview")[0].load();
    }
    console.log($(".testQ")[0]);
    $(".testQ").css({ "display": "none" });
    $(".outcomeTest").show();
    if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.OutcomePage){  
    this.changeColors("Outcome");
    }
  }

  restartQuiz() {
    console.log('inside restart quiz');
    this.message = '';
    this.testSelectedOutcome = [];
    $(".testQ").hide();
    // console.log($("#testVideoPreview"));
    $("#testVideoPreview")[0].pause();
    // $("#testQuizQuestion").show();
    $("#testQuizConfig").show();
  }

  openShareWindowOnTest() {
    var x = document.getElementById("shareQuizModalTest");
    if (x.style.display == 'block') {
      x.style.display = 'none';
    } else {
      x.style.display = 'block';
    }
  }


  setColorAndTheme() {
    this.quizConfiguration.quizColorScheme.forEach(element => {
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

  lightOrDark(color) {
    var r, g, b, hsp;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    }
    else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'
      )
      );

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

      return '#000000';
    }
    else {

      return '#ffff';
    }
  }

  openOutcome() {
    console.log(this.testSelectedOutcome);
    var finalOutcome = this.mode(this.testSelectedOutcome)
    this.finnalOutcome = finalOutcome;
    console.log(finalOutcome);
    this.keyupFunction('null', finalOutcome.outcomeTitle, 'testOutcomeHeadline');
    this.keyupFunction('null', finalOutcome.outcomeDescription, 'testOutcomeDesc');
    this.keyupFunction('null', finalOutcome.offerHeadline, 'testOutcomeOfferHeadline');
    this.keyupFunction('null', finalOutcome.offerDescription, 'testOutcomeOfferDesc');
    this.keyupFunction('null', finalOutcome.offerCallActionLabel, 'testOutcomeOfferButton');
    console.log('finalOutcome.isOutcomeImgVideo', finalOutcome.isOutcomeImgVideo);
    if (finalOutcome.isOutcomeImgVideo.trim() == 'Image') {
      $("#testVideoPreview").hide();
      $('#testOutcomeImage').show();
      $('#testOutcomeImage').attr('src', finalOutcome.outcomeMediaAttached);
    }
    else if (finalOutcome.isOutcomeImgVideo.trim() == 'Video') {
      $("#testVideoPreview").show();
      $('#testOutcomeImage').hide();
      $("#testVideoPreview").attr("src", finalOutcome.outcomeMediaAttached);
      //$("#testVideoPreview")[0].load();
    }

    $(".testQ").hide();
    console.log($(".outcomeTest"));
    $(".outcomeTest").show();
    if(this.quizConfiguration.colorSchemeObj != null && this.quizConfiguration.colorSchemeObj.OutcomePage){  
      this.changeColors("Outcome");
      }
  }
  mode(array) {
    if (array.length == 0)
      return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }
  backToQuiz() {
    this.message = '';
    this.location.back();
    // this.router.navigate(['/quizSetup/LeadCapture/']);
  }

  storeCount() {
      if (this.router.url.indexOf("/PlayQuiz") > -1) {
        this.quizAPI.storeQuizCount(this.quizId, 'noOfAction').then(record => {
          console.log('Quiz count record response for noOfAction', record);
          var outcome: any = {};
          if (localStorage.getItem('storedOutcome'))
            outcome = JSON.parse(localStorage.getItem('storedOutcome'))
          else
            outcome = this.finnalOutcome;
          console.log(outcome);
          this.router.navigate([]).then(result => { window.open(outcome.offerSendTo, '_blank'); });
        });
    }
  }
  serverError(data) {
    Swal.fire({
      text: data.message,
      type: 'warning',

    }).then(result => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }
}
