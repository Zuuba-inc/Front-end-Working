import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { Common } from '../../global/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { localStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthapiserviceService {

  constructor( private http: HttpClient,
    // private http: Http,
    private cookie : CookieService,private common : Common,
    // protected localStorage: localStorage, 
    private router: Router) { }
  baseURL = this.common.baseurl;
  clientApp = this.common.clientApp;
  clientSecrete = this.common.clientSecrete;
  public headers = new HttpHeaders({'Content-Type':'application/json'});
  public options= ({headers:this.headers});
  
  async getAuthenticationToken(username,password,isSocial)
  {
   // const uploadUrl = 'http://165.227.113.32:8080/oauth/token';
   /*var user :any ={};
   username = "nancyjn3@gmail.com";
   password="nancy";*/
   //await this.logoutUser();
    //var body = "grant_type=password&" + "username="+username+"&" + "password="+password+"&" + "scope=read write";
    //var body = "email="+username+"&" + "password="+password;
    var body: any = {};
    body.email = username;
    if(isSocial)
      body.providerId = password;  
    else
      body.password = password;
    //console.log(body);
    /*this.headers.delete('Authorization');
    this.headers.append('Authorization', 'Basic ' + btoa(this.clientApp+ ':' + 
    this.clientSecrete));*/
    console.log(body);
    this.headers = new HttpHeaders().set('Content-Type', 'application/json')
    //return await this.http.post(this.baseURL+"/oauth/token", body, this.options).toPromise()
    return await this.http.post(this.baseURL+"/login", body, this.options).toPromise()
      .catch((e) => {
        console.log(e);
            let error = JSON.parse(e);
            /*if(error.error == 'invalid_token')
            {
              body = "grant_type=refresh_token&" + "refresh_token="+ this.cookie.get('refresh_token');
              return this.http.post(this.baseURL+"/oauth/token", body, this.options).toPromise();
            }*/
      });
    

  }

  
  saveToken(token){
    //console.log(token.access_token);
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    //this.cookie.set("access_token", token.access_token, expireDate);
    //this.cookie.set("access_token",token.access_token);
    //this.cookie.set("refresh_token",token.refresh_token);
    localStorage.setItem("token",JSON.stringify(token));
    //this.localStorage.setItem("access_token", JSON.stringify(token));
  }

  getToken(){
   // console.log(localStorage.getItem("token"));
    //return this.cookie.get("access_token");
    return localStorage.getItem("token");
    
  }

  async logoutUser(){
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    this.router.navigate(['/']);
  }

  
}
