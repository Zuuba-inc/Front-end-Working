import { Injectable } from '@angular/core';
import { Common } from '../common';
import { Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthapiserviceService } from '../../coach/global/authapiservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private authService : AuthapiserviceService,private common : Common, private router: Router,private http: HttpClient) { }
  baseURL = this.common.baseurl;
  quizBaseUrl = this.baseURL+"/user"
  public headers = new HttpHeaders ({'Content-Type':'application/json'});
  public options= {headers:this.headers};
  authToken;
  userObj:any={};
  async updateHeader(): Promise<void> {
     if (this.authService.getToken() == '') {
         Swal.fire({
             text: 'You are not logged in',
             type: 'warning',
           
           }).then((result) => {
             if (result.value) {
                 this.router.navigate(['/login'])
             } 
           })
     } else {
       
         console.log("Inside if:"+this.authService.getToken());
         this.authToken = JSON.parse(this.authService.getToken());
         // console.log(this.JWTtoken);
         //this.headers.set('Authorization', 'bearer ' + this.authToken.access_token)
         this.headers = new HttpHeaders()
         .set('Authorization', 'bearer ' + this.authToken.access_token)
         .set('Content-Type', 'application/json'),
         this.options = { headers: this.headers };
         console.log(this.headers);
     }
  }

  async login(){
    await this.updateHeader();
    this.quizBaseUrl = '';
    this.quizBaseUrl = this.baseURL+"/user"
    console.log(this.headers)
    let data= await this.http.get(this.quizBaseUrl, this.options).toPromise();  
    this.userObj = data;
    console.log(this.userObj);
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(this.userObj.data));

    return this.userObj;

   
  }

  registerUser(user)
  { 
    this.quizBaseUrl='';
    this.quizBaseUrl = this.baseURL+"/signup";
    //this.updateHeader();
      
    let data= this.http.post(this.quizBaseUrl, user);  
    return data;
  }


  async logout(){
    localStorage.removeItem("currentUser");
  }


  async checkUser(email)
  { 
    this.quizBaseUrl='';
    this.quizBaseUrl = this.baseURL+"/checkUser?email="+email;
    //this.updateHeader();
      
    let data= this.http.get(this.quizBaseUrl).toPromise();  
    return data;
  }
}
