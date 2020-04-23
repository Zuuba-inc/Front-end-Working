import { Component, OnInit } from '@angular/core';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UserserviceService } from '../../../services/global/user/userservice.service';
import * as $ from 'jquery';
import { AuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { WebinarAPIService } from "../../../services/coach/webinar/webinar-api.service";
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socialUser: SocialUser;
  message: any;

  outcomeId = 0;

  quizConfigureObj = {
    allowSocialSharing: null,
    createdon: "",
    fontColor: null,
    fontLightDark: null,
    fontName: null,
    id: 392,
    isPvtPub: null,
    lastUpdate: "",
    mainUser: {},
    multiVariationNo: "1",
    quizCallActionLabel: "",
    quizColorScheme: [],
    quizDescription: "",
    quizLeadCaptureInfo: null,
    quizMediaAttached: "",
    quizName: null,
    quizOutcomes: [],
    quizQuestions: [],
    quizSEOMetadata: {},
    quizTitle: "",
    registeredUser: [],
    status: null,
    webinarCategoryId: null,
    webinarSubCategoryId: ""
  }

  constructor(private authService: AuthapiserviceService, private router: Router,
    private loginService: UserserviceService, private socialAuthService: AuthService,
    private route: ActivatedRoute, private webinar: WebinarAPIService,public quizAPI : QuizapiserviceService
  ) { }
  login = { 'username': '', 'password': '' };

  // editQuizId: any = 169;
  // editQuizId: any = "";

  // this is set at the time of login for a given quizId
    // quizId: any = 18;
    //quizId: any = "";

  ngOnInit() {

    console.log('message ', localStorage.getItem('message'));
    if(this.route.snapshot.paramMap.get('outcomeMapping') != null)
    {
      if (localStorage.getItem('message') != null)
        this.message = localStorage.getItem('message');

      if (localStorage.getItem('email') != null)
        this.login.username = localStorage.getItem('email');


     
    }
    if(localStorage.getItem('userRegisteredForWebinar') != null)
    this.login.username = localStorage.getItem('userRegisteredForWebinar');
   // alert(this.login.username)
    /*this.route.paramMap.subscribe(params => {
      console.log(params);
      console.log(this.route.snapshot.params.id);
    });  */
    //this.authService.logoutUser();
    // localStorage.removeItem("token");
    // localStorage.removeItem("currentUser");
    $.each(localStorage, function(key, value){

      // key magic
      // value magic
      if(key != 'storedOutcome' && key  != 'urlAfterLogin' && key  != 'timeSlot' && key  != 'replayTimeSlot' && key != 'webinarId' && key != 'quizId' && key != 'replay' && key != 'webinarRegistrationTime2' && key != 'webinarRegistrationTime')
          localStorage.removeItem(key);
    
    });
    //localStorage.clear();
    this.signOut();
    /*this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log("socialUser value in ngOnit", this.socialUser);

      // redirect to home page after getting successful response
      if (this.socialUser) {

        this.router.navigate(['/quizSetup/WelcomePage/' + this.editQuizId]); 
      }
    });*/
  }

  token:any={}
  async socialLogin(socialLogin) {
    console.log("about to sign with "+socialLogin);
    if(socialLogin == 'Google')
    this.socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    else if(socialLogin == 'Facebook')
    this.socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log("socialUser value in ngOnit", this.socialUser);

      // redirect to home page after getting successful response
      if (this.socialUser) {
        this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true)
          .then(authToken => {
            console.log(authToken);
            this.token = authToken;
            if (this.token.status == 'SUCCESS') {
              //var token = JSON.parse(authToken['_body']);
              this.authService.saveToken(this.token.data);
              this.loginService.login().then(data => {
                
                  this.socialUser = undefined;

                  // if (localStorage.getItem(this.quizId)) {
                  //   localStorage.setItem("quizId", this.quizId);
                  // }
                  if (data.status == 'SUCCESS') {
                    let loggedInUser = data.data;
                    var urlAfterLogin = localStorage.getItem('urlAfterLogin');
                    alert(urlAfterLogin)
                    if(urlAfterLogin != null || urlAfterLogin != undefined){
                      localStorage.removeItem("urlAfterLogin");
                      this.router.navigate([urlAfterLogin]);
                    }else{
                    this.router.navigate(['/QuizList']);
                    }
                    /*if (loggedInUser.uRole.roleId == 3) {
                      this.router.navigate(['/quizSetup/WelcomePage/']);
                    }
                    else if (loggedInUser.uRole.roleId == 2) {
                      this.router.navigate(['/TestQuiz/']);
                    }*/
                  }
                  else if (data.status == 'ERROR') {
                    this.message = data.message;
                    this.serverError(data);
                  }
              });
            }
            else if (this.token.status == 'ERROR') {
              this.message = this.token.message;
              this.serverError(this.token);
            }
          });
        //this.router.navigate(['/quizSetup/WelcomePage/169']); 
      }
    });
  }


  responseData:any={};
  async onloginButtonclick() {
    console.log(this.login.username);
    this.login.username = this.login.username.toLowerCase();
// start the loader
  //this.loadingScreenService.startLoading();
    // set this.quizId into localStorage as quizId
    // localStorage.setItem("quizId", this.quizId);

    localStorage.setItem("loggedIn", this.login.username);

    this.socialUser = undefined;
    let data = await this.authService.getAuthenticationToken(this.login.username,this.login.password,false)
    console.log(data);
    this.responseData = data
    if (this.responseData.status == 'SUCCESS') {
      await this.authService.saveToken(this.responseData.data)
      console.log('after save token');
      let udata = await this.loginService.login();
      let user = udata.data;
      console.log(user);
      //let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user != null) {
        // start the loader
     // this.loadingScreenService.stopLoading();
        // After loggin in from webinar registration page user will be redirected to thankyou page
        var urlAfterLogin = localStorage.getItem('urlAfterLogin');
        alert(urlAfterLogin)
        if(urlAfterLogin != null || urlAfterLogin != undefined){
          localStorage.removeItem("urlAfterLogin");
          var webinarId = localStorage.getItem('webinarId');
          
          this.router.navigate([urlAfterLogin]);
        }else{

          let outcome = localStorage.getItem('storedOutcome');
          if (outcome != null) {
            this.quizAPI.storeQuizCount(localStorage.getItem('quizId'),'noOfSignUps').then(record=>{
              console.log('Quiz count record response for noOfSignUps', record);
            });
            this.router.navigate(['/PlayQuiz']);
          }
          else {
            localStorage.removeItem('storedItem');
            this.router.navigate(['/dashboard']);
          }
        }

      }
    } else {
     // this.loadingScreenService.stopLoading();
      this.message = this.responseData.message;
      this.serverError(this.responseData);
    }
  }

  // signout when signed in with social login
  signOut(): void {
    this.socialAuthService.signOut();
  }

  serverError(error){
     
    Swal.fire({
      type: 'error',
      text: error.message,
    }).then((result) => {
      if (result.value) {
        if(error.appCode == 'ERR_USER_NOT_FOUND'){
          this.router.navigate(['/Registration']); 
        }
      }
    })
  }
}
