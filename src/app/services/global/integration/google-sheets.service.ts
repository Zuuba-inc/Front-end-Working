import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthapiserviceService } from '../../coach/global/authapiservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Common } from '../common';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

  constructor(
    private http: HttpClient,
    private authService : AuthapiserviceService,
    private router: Router,
    private common : Common
  ) { }

  baseURL = this.common.baseurl;
  quizBaseUrl = this.baseURL+"/quiz"
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

 async CreateEditSheets(body) { 
   
    await this.updateHeader();

    this.quizBaseUrl = this.baseURL+"/quiz/createEditSheet";
      
    return await this.http.post(this.quizBaseUrl, body, this.options).toPromise();
  }

async getConnectedGAccountsList() {

  await this.updateHeader();

  this.quizBaseUrl = this.baseURL+"/quiz/getGoogleAuthUsers";
  
  return await this.http.get(this.quizBaseUrl, this.options).toPromise(); 
}
}
