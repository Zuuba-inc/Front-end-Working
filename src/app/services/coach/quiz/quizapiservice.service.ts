import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Common } from '../../global/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class QuizapiserviceService {

  constructor(private http: HttpClient,
    private authService : AuthapiserviceService,
              private common : Common, private router: Router, ) { }
 baseURL = this.common.baseurl;
 quizBaseUrl = this.baseURL+"/quiz"
 public headers = new HttpHeaders({'Content-Type':'application/json'});
 public options=({headers:this.headers});
 authToken;
 updateHeader() {
   console.log('inside update header');
    if (this.authService.getToken() == '') {
        Swal.fire({
            text: 'You are not logged in',
            type: 'warning',
          
          }).then((result) => {
            if (result.value) {
                this.router.navigate(['/'])
            } 
          })
    } else {
        console.log("Inside if:"+this.authService.getToken());
        this.authToken = JSON.parse(this.authService.getToken());
         console.log(this.authToken.access_token);
         this.headers = new HttpHeaders()
         .set('Authorization', 'bearer ' + this.authToken.access_token)
         .set('Content-Type', 'application/json')
         this.options = ({headers:this.headers})
        
    }
 }

  async saveQuiz(quizObject)
  {
     // const uploadUrl = 'http://165.227.113.32:8080/quiz';
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //   console.log('save api');
    //   options.headers.append('Content-Type', 'application/json');
    //  options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
    this.quizBaseUrl = '';

     this.quizBaseUrl = this.baseURL+"/quiz"   
     await this.updateHeader();
     
        return await this.http.post(this.quizBaseUrl, quizObject,this.options).toPromise();  
      
  }

  async resetQuizColors(quizId)
  {
    this.quizBaseUrl = '';
    this.quizBaseUrl = this.baseURL+"/quiz/resetQuizFontColors?quizId="+quizId;   
    return await this.http.get(this.quizBaseUrl).toPromise();  
      
  }

  getQuiz(quizId)
  {
   // const uploadUrl = 'http://165.227.113.32:8080/quiz?id='+quizId;
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //  // console.log('save api');
     // options.headers.append('Content-Type', 'application/json');
     // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
    // this.updateHeader();
     this.quizBaseUrl = '';
     this.quizBaseUrl = this.baseURL+"/quiz?id="+quizId   
     var user:any  = JSON.parse(localStorage.getItem("currentUser"));
    // var url = this.quizBaseUrl+"?id="+quizId
     if(user != null || user != undefined){
      this.quizBaseUrl  = this.quizBaseUrl +"&userId="+user.id; 
     }
      return this.http.get(this.quizBaseUrl);  
  }

  async deleteAnswers(id)
  {
    //   const uploadUrl = 'http://165.227.113.32:8080/quiz';
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //   options.headers.append('Content-Type', 'application/json');
     // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
     await this.updateHeader();
     this.quizBaseUrl = '';
     this.quizBaseUrl = this.baseURL+'/quiz'
      return await this.http.delete(this.quizBaseUrl+"/deleteAnswer?id="+id,this.options).toPromise();  
  }

  async deleteQuestion(id, quizId)
  {
    //   const uploadUrl = 'http://165.227.113.32:8080/quiz';
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //   options.headers.append('Content-Type', 'application/json');
     // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
     this.quizBaseUrl = '';
     //this.quizBaseUrl = this.baseURL+'/quiz';
     if(id != null){
      this.quizBaseUrl = this.baseURL+'/quiz/deleteQuestion?id='+id+'&quizId='+quizId;
     }else {
      this.quizBaseUrl = this.baseURL+'/quiz/deleteQuestion?quizId='+quizId;
     }
     await this.updateHeader();
      return await this.http.get(this.quizBaseUrl,this.options).toPromise();  
  }

  async deleteAllQuestion(quizId)
  {
    //   const uploadUrl = 'http://165.227.113.32:8080/quiz';
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //   options.headers.append('Content-Type', 'application/json');
     // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
     this.quizBaseUrl = '';
     this.quizBaseUrl = this.baseURL+'/quiz';
     await this.updateHeader();
      return await this.http.get(this.quizBaseUrl+"/deleteQuestion?quizId="+quizId,this.options).toPromise();  
  }

//   getQuiz(quizId)
//   {
//     const uploadUrl = 'http://165.227.113.32:8080/quiz?id='+quizId;
//       let options = new RequestOptions();
//       options.headers = new Headers();
//       console.log('save api');
//       options.headers.append('Content-Type', 'application/json');
//       options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
      
//       return this.http.get(uploadUrl,options);  
//   }

async getLogicBranch() {
    
  return await this.http.get(this.baseURL+"/getLogicBranch").toPromise();
}

// async recordUser(quizId, userId)
// {
//   this.quizBaseUrl='';
  
//   this.quizBaseUrl = this.baseURL+"/quiz/recordUser?quizId="+quizId +"&userId="+ userId;
//   //this.updateHeader();
//   console.log('record user api call');
    
//   let data= this.http.get(this.quizBaseUrl).toPromise();  
//   return data;
// }
async recordUser(selectedAnswer)
{
  this.quizBaseUrl='';
  
  this.quizBaseUrl = this.baseURL+"/quiz/recordUser";
  await this.updateHeader();
  console.log('record user api call');
    
  let data= this.http.post(this.quizBaseUrl, selectedAnswer, this.options).toPromise();  
  return data;
}

async deleteAllAnswers(questionid)
{
  await this.updateHeader();
  let data= this.http.delete(this.quizBaseUrl+"/deleteAllAnswer?id="+questionid, this.options).toPromise();  
  return data;
}

async getMultiVariationPath(){
  this.quizBaseUrl = '';
  this.quizBaseUrl = this.baseURL+"/getMultiVariationPath"
  let data= await this.http.get(this.quizBaseUrl).toPromise();  
  var pathObj:any = data;
  return pathObj;

 
}

async deleteQuiz(quizId)
{
  this.quizBaseUrl='';
  
  this.quizBaseUrl = this.baseURL+"/quiz/deleteQuiz?id="+quizId ;
  //this.updateHeader();
  console.log('delete quiz api call');
    await this.updateHeader();
  let data= this.http.delete(this.quizBaseUrl, this.options).toPromise();  
  return data;
}

  async getPublishedQuiz()
  {
   // const uploadUrl = 'http://165.227.113.32:8080/quiz?id='+quizId;
    //   let options = new RequestOptions();
    //   options.headers = new Headers();
    //  // console.log('save api');
     // options.headers.append('Content-Type', 'application/json');
     // options.headers.append('Authorization', 'bearer ' + this.authService.getToken());
     this.updateHeader();
     this.quizBaseUrl = '';
     this.quizBaseUrl = this.baseURL+"/quizPublished?quizStatus=All"  
      return this.http.get(this.quizBaseUrl,this.options).toPromise();  
  }
  async reorderQuestion(quiz)
  {
    this.updateHeader();
    this.quizBaseUrl = '';
    this.quizBaseUrl = this.baseURL + '/quiz';
     return this.http.post(this.quizBaseUrl+"/reorder",quiz,this.options).toPromise();  
  }

  async storeQuizCount(id, name)
  {
    this.quizBaseUrl = '';
    this.quizBaseUrl = this.baseURL+"/quiz/saveQuizStats?countName="+name+"&id="+id;    
     return this.http.get(this.quizBaseUrl,this.options).toPromise();  
  }

  async removeIntegration(params) {
    this.updateHeader();
     this.quizBaseUrl = '';
     this.quizBaseUrl = this.baseURL+"/quiz/removeQuizIntegration?moduleName="+params.moduleName+"&quizId="+params.quizId;  
      return this.http.get(this.quizBaseUrl,this.options).toPromise();  
  }

}
