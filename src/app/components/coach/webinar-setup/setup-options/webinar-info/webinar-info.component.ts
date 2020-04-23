import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

//import file upload component
import { UploadFileComponent } from 'src/app/components/global/upload-file/upload-file.component';

// import jquery
import * as $ from 'jquery';

import { CommonService } from 'src/app/services/global/common.service';

import {AngularEditorConfig} from '@kolkov/angular-editor';

import { FileUploadAPIService } from 'src/app/services/coach/global/file-upload-api.service';

import { AuthapiserviceService } from 'src/app/services/coach/global/authapiservice.service';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

import { WebinarAPIService } from 'src/app/services/coach/webinar/webinar-api.service';

import { WebinarConfigureService } from 'src/app/services/coach/webinar/webinar-configure.service';

import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-webinar-info',
  templateUrl: './webinar-info.component.html',
  styleUrls: ['./webinar-info.component.css']
})
export class WebinarInfoComponent implements OnInit, AfterViewInit {

  // webinarMst: any = {};
  webinarMst = this.webinarConfigureService.webinarMstInfo;

  webinarCategoryList: any = [];

  mainCategoryList: any = [];

  htmlContent: any = "text editor content";

  items: any = [];

  itemsList: any = [];

  // editor config
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    /*customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]*/
  };

  croppedImage: any;

  changedImage: any;

  webinarId: any;

  // this is used for sending input value to file upload
  webinarInfo: any = "webinarInfo";
  
  webinarInfoFields = [
    "id",
    "isPrivatePublic",
    "moduleName",
    "webinarCardImgUploadPath",
    "webinarCategoryId",
    "webinarDesc",
    "webinarPresentationDetailList",
    "webinarSubCategoryId",
    "webinarTitle",
    "webinarType"
  ]

  // set recently updated property in keyupfunction
  recentlyUpdatedModule: any = "webinarMstInfo";

  // use this for setting post url 
  moduleUrl: any = "/webinarInfo";

  module: any = "WebinarInfo";

  // use this as getParam for webinar
  getParam: any = "WebinarInfo";

  // toolbarOptions: any = [
  //   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //   ['blockquote', 'code-block'],
  
  //   [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //   [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  //   // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  //   // [{ 'direction': 'rtl' }],                         // text direction
  
  //   [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
  //   [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  //   [{ 'font': [] }],
  //   // [{ 'align': [] }],
  
  //   ['clean']                                         // remove formatting button
  // ];

  // public editor;
  // public editorContent = `<h3>I am Example content</h3>`;
  // public editorOptions = {
  //   placeholder: "insert content...",
  //   modules: {
  //     toolbar: this.toolbarOptions
  //   }
  // };

  // onEditorBlured(quill) {
  //   // console.log('editor blur!', quill);
  // }

  // onEditorFocused(quill) {
  //   // console.log('editor focus!', quill);
  // }

  // onEditorCreated(quill) {
  //   // this.editor = quill;
  //   // this.webinarMst.webinarDesc = quill;
  //   // console.log('quill is ready! this is current quill instance object', quill);
  // }

  // onContentChanged({ quill, html, text }) {
  //   // console.log('quill content is changed!', quill, html, text);
  //   this.webinarMst.webinarDesc = html;
  //   this.keyupFunction('webinarDescriptionCharCount', text, 'webinarDescView', true);
  // }


  constructor(
    private commonService: CommonService,
    private authService: AuthapiserviceService,
    private router: Router,
    private fileUpload: FileUploadAPIService,
    private webinarAPI: WebinarAPIService,
    private webinarConfigureService: WebinarConfigureService
  ) { }

  edit: any;

  async ngOnInit() {

    // setTimeout(() => {
    //   this.editorContent = '<h1>content changed!</h1>';
    //   // console.log('you can use the quill instance object to do something', this.editor);
    //   // this.editor.disable();
    // }, 2800)

    // get only webinarInfo module data from service
    // this.webinarMst = this.webinarConfigureService.webinarMstInfo;

    // this.webinarMst.webinarCategoryId = "select";

    // this.webinarId = 519;
    // localStorage.setItem("webinarId", this.webinarId);

    // get webinarId from localStorage
    this.webinarId = localStorage.getItem("webinarId");
     //this.webinarId = 390;//live webinar
     // this.webinarId = 582;//auto webinar
      //localStorage.setItem("webinarId", this.webinarId);

    // console.log("in ngOnInit of wbeinar-info, found webinarId", this.webinarId, "and this.webinarMst", this.webinarMst);

    //this.cookie.delete('access_token','/');
    //localStorage.removeItem("token");
    // console.log(JSON.parse(this.authService.getToken()));
    // console.log(JSON.parse(localStorage.getItem('currentUser')));

    if (this.authService.getToken() == null) {
      Swal.fire({
        text: 'You are not logged in',
        type: 'warning',

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/'])
        }
      })
    }

    this.edit = localStorage.getItem('edit');

    // webinarId exists, get data based on webinarId and store in webinarservice
    // and on page refresh make an api if data does not exist in webinarservice
    // this is used for page refresh handling
    if (this.webinarMst != null && (this.webinarMst.fromService == true || this.edit == "true") && this.webinarId) {

      // if webinarId is empty on service like in case of page refresh
      // and webinarId exists make an API call
      // get data from webinarConf service
      let dataQuiz :any = await this.webinarAPI.getWebinar(this.webinarId, "WebinarInfo");
      // .subscribe(dataQuiz => {
        // console.log(dataQuiz);

        if(dataQuiz) {
        var webinar = dataQuiz;
        if (webinar.status == 'SUCCESS') {

          // bind the webinarinfo module related data coming from response
          this.webinarMst = webinar.data;

          // console.log('this // console implies that user has refreshed the page, fetch data based on param present in url for data binding');
          // console.log(this.webinarMst);

          // console.log("set webinarInfo related data in get response", this.webinarMst);
          
          // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);
          // set webinarinfo related fields into service
          this.webinarConfigureService.webinarMstInfo = this.webinarMst;
          this.webinarConfigureService.webinarMstInfo.moduleUrl = this.moduleUrl;

          // get info realted fields
          this.webinarMst = this.webinarConfigureService.webinarMstInfo;

           // set itemList from webinarsubcategoryid
           if (this.webinarMst.webinarSubCategoryId) {
            this.itemsList = this.webinarMst.webinarSubCategoryId.split(",");
          }

          this.croppedImage = this.webinarMst.webinarCardImgUploadPath;

          if (this.webinarMst.isPrivatePublic == "Private")
            this.setWebinarSecurity('Private','Public');
          else
            this.setWebinarSecurity('Public','Private');
        }
      }
      // })
    } else {
      // data exists in service, then don't make API call.
      if (this.webinarMst && (this.webinarMst.id != null || this.webinarMst.id != undefined || this.webinarMst.id != "")) {

        // set only webinarInfo module data
        this.webinarMst = this.webinarConfigureService.webinarMstInfo;
        // set itemList from webinarsubcategoryid
        if (this.webinarMst.webinarSubCategoryId) {
          this.itemsList = this.webinarMst.webinarSubCategoryId.split(",");
        }
        
        this.croppedImage = this.webinarMst.webinarCardImgUploadPath;

        if (this.webinarMst.isPrivatePublic == "Private")
          this.setWebinarSecurity('Private','Public');
        else
          this.setWebinarSecurity('Public','Private');
      }
    }

    // call this func to get categories
   // this.getCtegorySubCategoryList();
  }

  @ViewChild(UploadFileComponent)
  private uploadFileComponent: UploadFileComponent;

  ngAfterViewInit() {
    // set char count for title and description
    this.keyupFunction('webinarTitleCharCount', this.webinarMst.webinarTitle, 'webinarTitleView');
    this.keyupFunction('webinarDescriptionCharCount', this.webinarMst.webinarDesc, 'webinarDescView');
  }
  // output event function of file upload
  onFileUpload(event: any) {
    // console.log("this is the result of emitted output from upload-file component, uploaded file is", event.croppedImage);
    // update this component croppedImage binding with received image
    this.croppedImage = event.croppedImage;
    this.changedImage = event.changedImage;
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  setWebinarSecurity = function(securityType, other)
	{

    if (!this.webinarMst.webinarCategoryId) {
      this.webinarMst.webinarCategoryId = "select";
    }

    // set char count for title and description
    this.keyupFunction('webinarTitleCharCount', this.webinarMst.webinarTitle, 'webinarTitleView');
    this.keyupFunction('webinarDescriptionCharCount', this.webinarMst.webinarDesc, 'webinarDescView');

		// console.log('securityType : '+securityType);
		$("#"+securityType).addClass("active");
		$("#"+other).removeClass("active");
    this.webinarMst.isPrivatePublic = securityType; 
    
    // console.log("set isPrivatePublic in webinarMst", this.webinarMst);
	}

  // get category list
  // catData:any={};
  // async getCtegorySubCategoryList() {
  //   this.catData = await this.commonService.getCategory();
  //   if (this.catData.status == 'SUCCESS') {
  //     let categoryList = this.catData.data;

  //     // // console.log("data from category/sub list", JSON.stringify(catData.data));

  //     this.mainCategoryList = categoryList;
  //     categoryList.forEach(element => {
  //       // console.log('element', element);
  //       this.webinarCategoryList.push({ "id": element.id, "displayName": element.displayName });
  //     })


  //   }
  //   else if (this.catData.status == 'ERROR') {
  //     // console.log('No categories available nin database', this.catData.message);
  //   }
  // }

  // getSubCategoryList() {
  //   // console.log("in getSubCategoryList, selected category::", this.webinarMst.webinarCategoryId);

  //   this.itemsList = [];

  //   if (this.mainCategoryList.length > 0) {
  //     this.mainCategoryList.forEach(element => {
  //       // console.log('element in getSubCaetegoryList()', element);
  //       if (element.id == this.webinarMst.webinarCategoryId) {
  //         // this.items = [];
  //         // console.log(element.subcategoryList);
  //         element.subcategoryList.forEach(subCat => {

  //           // this.items.push({ "value": subCat.id, "display": subCat.displayName });
  //           this.items.push(subCat.displayName);
  //         });
  //       }
  //     })

  //     // console.log("sub-category itesm list", this.items);
  //   }
  // }

  keyupFunction = function (charCount, from, to, fromQuill? , validation?) {

    // console.log("in keyupFunction,", charCount, from, to, "checking for validation", validation);

    if (!fromQuill)
      $('#' + to).text(from);

    if (charCount != 'null') {
      var count = $('#' + charCount).text()
      count = count.split("/");
      if (from) {
        count[0] = from.length;
      } else {
        count[0] = 0
      }
      count = count[0] + "/" + count[1];
      $('#' + charCount).text(count);
    }
  }

  async saveWebinarInfo() {

    // if($scope.webinarMst.webinarType == undefined)
    //     	$scope.webinarMst.webinarType = 'live';
        	
    //     if(angular.element('#webinarConfig').scope().webinarMst.isPrivatePublic == 'private')
    //     {
    //     	$scope.cat.selected = '';
    //     }	
		// alert('$scope.cat : ' + $scope.cat.selected + ' : ' + $scope.webinarMst.webinarSubCategoryId);
		
    //     if($scope.cat !== undefined)
    //     	$scope.webinarMst.webinarSubCategoryId = $scope.cat.selected + '';
    //     if($scope.webinarImageFile && $scope.webinarImageFile != $scope.webinarMst.webinarCardImgUploadPath){
    //     	await $scope.uploadWebinarImageFile($scope.webinarImageFile);
    //     }
    // 	$http.post('http://localhost:9000/saveWebinarPageInfo', angular.toJson($scope.webinarMst), {
    //         // headers: {
    //         //     'Content-Type': 'application/json'

    //         // }
    //     }).
    //     then(function(response) {
    //         //$scope.greeting = response.data;
    //         // console.log("sdfsd" + response.data);
    //         $scope.webinarMst = response.data;
    //         //displayWebinarPreview();
    //     });

    // try {
    

    // get the token
    // console.log("token in saveWebinarInfo", this.authService.getToken());

    // console.log("itemsList in saeWebinarInfo", this.itemsList);

    // update subcategory fields
    this.webinarMst.webinarSubCategoryId = '';
    for (var i = 0; i < this.itemsList.length; i++) {

      if (this.webinarMst.webinarSubCategoryId == '')
        this.webinarMst.webinarSubCategoryId = (this.itemsList[i].value || this.itemsList[i]);
      else
        this.webinarMst.webinarSubCategoryId = this.webinarMst.webinarSubCategoryId + ',' + (this.itemsList[i].value || this.itemsList[i]);
    }

    // upload image
    if (this.changedImage) {
      var modKey = "quizImage";
      const imageBlob = this.dataURItoBlob(this.croppedImage);
      const imageFile = new File([imageBlob], "webinarInfoImage", { type: 'image/jpeg' });
      //this.cookie.delete('access_token','/');

      if (this.authService.getToken() == '') {

        Swal.fire({
          text: 'You are not logged in',
          type: 'warning',

        }).then((result) => {
          if (result.value) {

            // console.log("result.value", result.value);

            this.router.navigate(['/'])
          }
        })
      };
      let data:any = await this.fileUpload.uploadOutcomeImageToAmazonServer(imageFile)
      // console.log("res after image upload", res);
      var res = data;
      this.webinarMst.webinarCardImgUploadPath = res.message;
      this.changedImage = false;
      // console.log("res.message after image upload in saveWebinarInfo", res.message);
    }


    // console.log("about to save webinar-info data =>", this.webinarMst);

    // this directs user to outcomes page so get status until outcomes
      // TODO: ADD IF CONDITION FOR EDIT/NEW WEBINAR LATER ON
    // if (localStorage.getItem("edit") == "false") {
      this.webinarMst.moduleName = "WebinarType";
      if (this.webinarMst.moduleStatus) {
        delete this.webinarMst.moduleStatus;
      }
    // } 

    if (this.webinarId) {
      this.webinarMst.id = this.webinarId;
    }

    // set data into webinar service
    // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

    // set webinarinfo related fields into service
    this.webinarConfigureService.webinarMstInfo = this.webinarMst;

    // console.log("data being sent to save API in webinfo", this.webinarMst);

    // save webinar data
    let moduleUrl = "/webinarInfo";

    if (this.webinarMst.webinarCategoryId == "select") {
      delete this.webinarMst.webinarCategoryId;
      delete this.webinarMst.webinarSubCategoryId;
    }
    
    // delete webinarSubCategoryId, webinarCategoryId, isPvtPub at the time of save
    delete this.webinarMst.isPrivatePublic;
    delete this.webinarMst.webinarCategoryId;
    delete this.webinarMst.webinarSubCategoryId;

    let webinar :any = await this.webinarAPI.saveWebinar(this.webinarMst, moduleUrl);

    // console.log("found webinar after save", webinar);

    if (webinar.statusCode == 200) {
      
      // this.webinarMst = webinar.data;
      // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);

      // console.log('webinar object', webinar.data);

      // if quizId doesn't exist in session storage, only then set it 
      // (to save data against the same id even after page reload)
      if (!localStorage.getItem("webinarId")) {

        // console.log("webinarId for this SESSION", webinar.data.id);
        localStorage.setItem("webinarId", webinar.data.id);
      }

      // this.webinarConfigureService.changeWebinarConfigure(this.webinarMst);
      // set webinarinfo related fields into service
      this.webinarConfigureService.webinarMstInfo = webinar.data;
      this.webinarConfigureService.webinarMstInfo.moduleUrl = this.moduleUrl;

      // common module across all modules, to be updated on each save in each of the modules
      this.webinarConfigureService.moduleStatus = webinar.data.moduleStatus;
      
      // get info realted fields
      this.webinarMst = this.webinarConfigureService.webinarMstInfo;

      this.croppedImage = this.webinarMst.webinarCardImgUploadPath;

      // set itemList from webinarsubcategoryid
      if (webinar.data.webinarSubCategoryId) {
        this.itemsList = webinar.data.webinarSubCategoryId.split(",");
      }

      if (this.webinarMst.isPrivatePublic = "Private")
        this.setWebinarSecurity('Public','Private');
      else
        this.setWebinarSecurity('Private','Public');

      this.router.navigate(['/webinarSetup/WebinarType/']);
    
    }
//   }catch(error) {

//     // stop loader
//     this.loadingScreenService.stopLoading();

//     // Note that 'error' could be almost anything: http error, parsing error, type error in getPosts(), handling error in above code
//     // console.log("error in saving post", error);

//     //if the error is of invalid token type return to login page
//     error = JSON.parse(error['_body']);

//     // console.log("error after parsing", error);

//     if (error.error == "invalid_token") {

//       // redirect to login page iof token is inavlid
//       Swal.fire({
//         text: error.error+", Please login",
//         type: 'warning',

//       }).then((result) => {
//         if (result.value) {

//           // clear everything from locastorage

//           this.router.navigate(['/'])
//         }
//       })

//     }
// // }
  }
  backPreview(configureSetupForm,configure,configurePreview){
    
  }
}
