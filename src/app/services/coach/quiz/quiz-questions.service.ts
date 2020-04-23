import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class QuizQuestionsService {

  baseUrl = "http://165.227.113.32:8080";

  constructor(private http: HttpClient) { }

  async getLogicBranch() {
    
    return await this.http.get(this.baseUrl+"/getLogicBranch").toPromise();
  }
}
