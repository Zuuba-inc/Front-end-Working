import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Common } from '../../global/common';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FileUploadAPIService {
  constructor(private http: HttpClient,
    // private http: Http,
    private common : Common) { }
  //apiresponse : any;
  baseURL = this.common.baseurl;

  async uploadOutcomeImageToAmazonServer(imageFile) {
    var fileFormData = new FormData();
            fileFormData.append('file', imageFile);
            const val = await this.http.post(this.baseURL+"/bucket/uploadFile", fileFormData).toPromise();
            return  val;
  }
}
