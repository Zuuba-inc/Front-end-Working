import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import jquery
import * as $ from 'jquery';
import { UserserviceService } from 'src/app/services/global/user/userservice.service';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import Swal from 'sweetalert2';
import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';
import { AuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { QuizapiserviceService } from 'src/app/services/coach/quiz/quizapiservice.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  socialUser: SocialUser;

  constructor(private route: ActivatedRoute, private loginService: UserserviceService,
    private socialAuthService: AuthService,
    private authService: AuthapiserviceService, private router: Router, private webinar: WebinarAPIService
    ,public quizAPI : QuizapiserviceService) { }
  register = { 'name': '', 'email': '', 'password': '', 'userRole': 'CLIENT' };
  message;
  webinarId;
  user:any={};
  ngOnInit() {
    if (this.route.snapshot.paramMap.get('outcomeMapping') != null) {
      if (localStorage.getItem('email') != null) {
        this.register.email = localStorage.getItem('email');
        $('.register-fb').hide();
        $('.register-gl').hide();
        $('.or').hide();
      }
    } else if (localStorage.getItem('loggedIn') != null) {
      this.register.email = localStorage.getItem('loggedIn');
    }

  }


  onRegisterButtonclick() {
    console.log(this.register);
    this.register.email = this.register.email.toLowerCase();
    this.loginService.registerUser(this.register).subscribe(data => {
      //var userObj = JSON.parse(data['_body']);
      var userObj:any = data;
      console.log(userObj);
      if (userObj.status == 'SUCCESS') {
        let user = userObj.data;
        this.authService.getAuthenticationToken(this.register.email, this.register.password, false).then(data => {
          console.log(data);
          var token :any = data;
          if (token.status == 'SUCCESS') {
            console.log(token);
            this.authService.saveToken(token.data);
            //console.log('after dy')
            this.loginService.login().then(async loggedInUser => {
              //this.openOutcome();
              console.log(loggedInUser.data);
              var urlAfterLogin = localStorage.getItem('urlAfterLogin');
              alert(urlAfterLogin)
              if (urlAfterLogin == '/thankyou') {
                localStorage.removeItem("urlAfterLogin");
                this.webinarId = localStorage.getItem('webinarId');
                this.webinarId = new Number(this.webinarId);
                var webinarRegTime = localStorage.getItem("userRegistrationTime");
                var intime = localStorage.getItem("inrimeRegInterval");
                var res = await this.webinar.recordWebinarUser(this.webinarId, loggedInUser.data.id, webinarRegTime, intime);

                this.router.navigate(['/thankyou']);


              } else {
                this.quizAPI.storeQuizCount(localStorage.getItem('quizId'),'noOfSignUps').then(record=>{
                  console.log('Quiz count record response for noOfSignUps', record);
                });
                this.router.navigate(['/TestQuiz']);
              }

            });

          }
          else if (token.status == 'ERROR') {
            this.message = token.message;
            this.serverError(token);
          }

        });
      }
      else if (userObj.status == 'ERROR') {
        this.message = userObj.message;
        this.serverError(userObj);
      }
    }
    );
    //this.router.navigate(['/TestQuiz']);
  }
  async socialLogin(socialLogin) {
    console.log("about to sign with " + socialLogin);
    if (socialLogin == 'Google')
      this.socialUser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    else if (socialLogin == 'Facebook')
      this.socialUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(user => {
      this.socialUser = user;
      console.log(this.socialUser)
      if (this.socialUser) {
        this.user.email = this.socialUser.email;
        this.user.firstName = this.socialUser.firstName;
        this.user.lastName = this.socialUser.lastName;
        this.user.profilePicture = this.socialUser.photoUrl;
        this.user.provider = this.socialUser.provider;
        this.user.providerId = this.socialUser.id;
        this.user.userRole = "CLIENT";
        console.log("socialUser value in ngOnit", this.socialUser);
        this.loginService.registerUser(this.user).subscribe(data => {
          var userObj = JSON.parse(data["_body"]);
          console.log(userObj);
          if (userObj.status == "SUCCESS") {
            this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true)
              .then(data => {
                console.log(data);
                var token = JSON.parse(data["_body"]);
                if (token.status == "SUCCESS") {
                  this.authService.saveToken(token.data);
                  this.router.navigate(['/dashboard']);
                }
              });
          } else if (userObj.status == "ERROR") {
            this.authService.getAuthenticationToken(this.socialUser.email, this.socialUser.id, true)
              .then(data => {
                this.message = userObj.message;
                this.router.navigate(['/dashboard']);
              });
          }
        });
      }else{
        var error= {'message':"Unable to register using social Login"}
        this.serverError(error)
      }
    });
  }

  serverError(error){
     
    Swal.fire({
      type: 'error',
      text: error.message,
    })
  }
}
