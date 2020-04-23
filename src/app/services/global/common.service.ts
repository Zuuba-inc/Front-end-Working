import { Injectable } from '@angular/core';
import { AuthapiserviceService } from '../coach/global/authapiservice.service';
import { Common } from './common';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import {HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private authService : AuthapiserviceService,private common : Common, private router: Router,private http: HttpClient) { }
  baseURL = this.common.baseurl;
  quizBaseUrl = this.baseURL+"/user"
  async getCategory(){
    this.quizBaseUrl = '';
    this.quizBaseUrl = this.baseURL+"/getCategory"
    let data= await this.http.get(this.quizBaseUrl).toPromise();  
    var catObj = data;
    console.log(catObj);
    return catObj;
  }
     //Handeler that handels erorr if the status code of the api is not SUCCESS
     serverError(data){
      Swal.fire({
        text: data.message,
        type: 'warning',
  
      });
  }
}
