import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';
import { Common } from '../../global/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FunnelAutomationRulesService {

  constructor(
    private http: HttpClient,
    private authService: AuthapiserviceService,
    private common: Common,
    private router: Router
  ) { }

  baseURL: any = this.common.baseurl;

  authToken: any;

  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  public options = ({ headers: this.headers });

  automationRulesBaseUrl = this.baseURL+'/automationRules';

  //To update the header, add bearer token in the header
  async updateHeader(): Promise<void> {
    //  console.log('inside update header');
    if (this.authService.getToken() == '' || this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    } else {
      // console.log("Inside if:"+this.authService.getToken());
      this.authToken = JSON.parse(this.authService.getToken());
      console.log(this.authToken.access_token);
      this.headers = new HttpHeaders()
      .set('Authorization', 'bearer ' + this.authToken.access_token)
      .set('Content-Type', 'application/json')
      this.options = ({ headers: this.headers });
      // if (this.headers.get('Authorization') == null) {
      //   this.headers.append('Authorization', 'bearer ' + this.authToken.access_token);
      //   // this.headers.append('Authorization', 'bearer ' + "inavlidtokenrandowmylput");
      //   this.options = new RequestOptions({ headers: this.headers });
      //   // return 1;
      // }

    }
  }

  // API request to save tags
  async saveTag(tagName) {
    await this.updateHeader();
    try {
    return this.http.post(this.automationRulesBaseUrl+'/addEditTag?tagName='+tagName, {}, this.options).toPromise();
  } catch(error) {
    this.errorHandler(error);
  };
  }

  async getTags() {

    await this.updateHeader();

    try {
      return this.http.get(this.automationRulesBaseUrl+'/listTags', this.options).toPromise();
    } catch(error) {
      this.errorHandler(error);
    };
  }

  // handler to handel any server error
  errorHandler(error) {
    console.log("err found", error);

    if (error['_body']) {

      let e = JSON.parse(error['_body']);

      if(e.error == 'invalid_token'){
        //localStorage.setItem("urlAfterLogin", "/webinarAutoStreamPage");
        this.router.navigate(['/login']);
      }
    }
  }
}
