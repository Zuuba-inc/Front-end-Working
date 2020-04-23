import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { Common } from '../../../services/global/common';

// import jquery
import * as $ from 'jquery';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  cropImage: boolean;

  // use this variable to adjust css of settings module
  // rest of the module in quiz didn't need any customized css changes
  settings: any;
  onlyImage: any = true;
  showPdfMessage:any= false;
  onlyPdf: any = false;
  showImageMessage:any = false;
  showFile : any = false;
  showFileErrorMessage:any = false;
  constructor(
    private common : Common
  ) { }
    showImage = false;
    isLogoImage = false;
  @Input()
  set module(module: string) {

    if (module == "settings") {
      this.settings = true;
    }else if(module == 'outcomes' || module == 'presentation' || module == 'configure' || module == 'Image' || module == 'logoImage') {
      this.onlyImage = false;
      if(module == 'Image' || module == 'logoImage' ){
        this.showImage = true;
      }
      if(module == 'logoImage'){
        this.isLogoImage = true;
      }
    }else if(module == 'File'){
      this.showFile = true;
    }
    else {
      this.settings = false;
      setTimeout(()=>{
        $(".setting__image--upload .ngx-file-drop__drop-zone input").css({"display":"none"});
      }, 200);
    }
  }

  @Input()
  set fileType(fileType: string)
  {
    // console.log('file type ', fileType);
    if(fileType == "pdf")
      this.onlyPdf = true;
    else if(fileType == "video")
      this.onlyImage = false;
  }
  @Output() file = new EventEmitter<any>();

  ngOnInit() {
  }

  //  [[start of file upload]]
  // [[for input tag upload]]
  fileToUpload: File = null;

  fileToUploadSize: any;

  // allowed image size
  allowedImageSize: any = this.common.allowedImageSize; // this is in MB;

  allowedVideoSize: any = this.common.allowedVideoSize; // this is in MB

  allowedFileSize: any; // this is in MB

  imageAllowed: any = false;

  videoAllowed: any = false;

  handleFileInput(event: any) {
    // set this.videoAllowed to false, to clear off existing msg set for video size error
    this.videoAllowed = false;

    // console.log("file is changed in handleFileInput, event is", event);
    if(event.target.files.item(0) != undefined && event.target.files.item(0) != null){
    this.fileToUpload = event.target.files.item(0);
      // console.log(this.fileToUpload.type);
    if ((this.fileToUpload.type == 'image/png' || this.fileToUpload.type == 'image/jpeg') && !this.onlyPdf && !this.showFile) {

      this.fileToUploadSize = this.fileToUpload.size / 1000000; // this give in MB

      // set allowedFileSize for image
      this.allowedFileSize = this.allowedImageSize;

      // console.log("uploaded file size in input file", this.fileToUploadSize);

      // call this function to set image for cropping
      // this.fileChangeEvent(event);

      if(this.isLogoImage == false){
        // show modal to crop the image
        this.cropImage = true;
      }else{
          this.closeModel('OK')
      }
      
      // remove existing image selected
      this.croppedImage = "";
      
      //do not show only image allowed message
      this.showImageMessage = false;
    }
    else if(this.onlyPdf && this.fileToUpload.type != 'application/pdf')
    {
        this.showPdfMessage = true;
        // console.log('incase of video has been uploaded instead of pdf ');
    }
    else if(this.onlyPdf && this.fileToUpload.type == 'application/pdf')
    {
        this.showPdfMessage = false;
    } 
    else if(this.fileToUpload.type != 'image/jpeg' && this.onlyImage && !this.showFile){
          // console.log('incase video is uploaded');
          this.showImageMessage = true;

    } else if((this.fileToUpload.type == 'video/mp4' || this.fileToUpload.type == 'video/quicktime') && !this.onlyImage && !this.showFile){

      // console.log("uploaded file is a video", this.fileToUpload.type);
      // calculate video size  for allowed size check
      this.fileToUploadSize = this.fileToUpload.size / 1000000; // this give in MB

      // set allowedFileSize for video
      this.allowedFileSize = this.allowedVideoSize;

      // show modal if video size is greater than alllowed
      if (this.fileToUploadSize > this.allowedFileSize) {
        // show modal to show video size restriction
        this.cropImage = false;
        // console.log('insdie if *************');
        // show vid size err
        this.videoAllowed = true;

        // show image size err msg
        this.imageAllowed = false;

        //do not show only image allowed message
        this.showImageMessage = false;
      }
      

      // Checks if the file is not a image or video and only doc or zip file is selected
     
    }else if(this.fileToUpload.type == 'image/jpeg' || (this.fileToUpload.type == 'video/mp4' || this.fileToUpload.type == 'video/quicktime') ||  this.showFile){
        this.showFileErrorMessage = true;
    }else if(this.fileToUpload.type != 'image/jpeg' && (this.fileToUpload.type != 'video/mp4' && this.fileToUpload.type != 'video/quicktime') &&  this.showFile){
      this.showFileErrorMessage = false;
    }

    if (this.fileToUploadSize > this.allowedFileSize) {

      if (this.fileToUpload.type == 'image/png' || this.fileToUpload.type == 'image/jpeg') {
        // show image size err msg
        this.imageAllowed = true;

        // hide vid size err
        this.videoAllowed = false;
      }
      // console.log("uploaded image size", this.fileToUploadSize, "MB");
      // show alert if size > 2MB in modal
      // $("#outcomeImageSizeWarning").show();
      this.sizeInLimit = false;
      this.displaySet = 'none';

      //this.fileChangeEvent(event);
    } else {

      this.sizeInLimit = true;
      this.displaySet = 'block';
      // call this function to set image for cropping
      this.fileChangeEvent(event);
    }
  }
  }
  // [[end of input tag upload]]

  // [[for drag and drop]]
  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;

    const fileEntry = event.files[0].fileEntry as FileSystemFileEntry;

    fileEntry.file(
      (ev) => {

        // console.log("checking file size from drag and drop", ev)
        // calculate uploaded image size
        this.fileToUpload = ev;

        this.fileToUploadSize = this.fileToUpload.size / 1000000; // this give in MB

        if (this.fileToUploadSize > this.allowedImageSize) {

          // console.log("uploaded image size", this.fileToUploadSize, "MB");
          // show alert if size > 2MB in modal
          // $("#outcomeImageSizeWarning").show();
          this.sizeInLimit = false;
          this.displaySet = 'none';
        } else {

          this.sizeInLimit = true;
          this.displaySet = 'block';

          this.imageChangedEvent = { target: { files: [ev] } }
        }
      }
    );

    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: any) => {

          // check file type, if it is video don't update 'this.cropImage' variable
          console.log("file", file);

          if (file.type.includes("video")) {

            // don't show modal when image is uploaded
            this.cropImage = false;

            // ONLY SINGLE VIDEO FILE UPLOADED SUPPORTED

            this.fileToUploadSize = this.fileToUpload.size / 1000000; // this give in MB

            if (this.fileToUploadSize > this.allowedVideoSize) {

              console.log("inside this.fileToUploadSize > this.allowedImageSize", this.fileToUploadSize, this.allowedImageSize);

              // show modal to show video size restriction
              // console.log('insdie if *************');
              // show vid size err
              this.videoAllowed = true;

              // show image size err msg
              this.imageAllowed = false;

              //do not show only image allowed message
              this.showImageMessage = false;
            } else {
              
              console.log("inside else of drag AND DROP");

              this.sizeInLimit = true;
              this.displaySet = 'block';

              this.fileChangeEvent(event);
            }
          } else {

            // show modal to crop the image
            this.cropImage = true;
          }

          // remove existing image selected
          this.croppedImage = "";

          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }

  // [[end of file input]]
  // [[start of image crop changes]]
  imageChangedEvent: any = '';
  croppedImage: any = '';
  changedImage: any = false;
  sizeInLimit: any = true;
  displaySet : any='block';
  fileChangeEvent(event: any): void {

    if (this.fileToUpload.type == 'image/png' || this.fileToUpload.type == 'image/jpeg') {
      
      this.imageChangedEvent = event;
    } else {

      console.log("in fileChangeEvent from upload", event);

      // on emit clear input file value
      // clear file input value
      $("#file").prop("value", "");
      // console.log("$(#file)", $("#file"));

      // emit an event if video is uploaded 
      this.file.emit({ croppedImage: this.croppedImage, changedImage: this.changedImage, cropImage: this.cropImage, file: this.fileToUpload, event: this.imageChangedEvent });
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.changedImage = true;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  uploadedLogo = ' ';
  async getBase64(): Promise<any> {
    let me = this;
    // let file = event.target.files[0];
    let reader = new FileReader();
    var dataURL;
    reader.onload = await function (file) {
      dataURL = reader.result;
      me.file.emit({croppedImage: dataURL, file: me.fileToUpload})
      return reader.result
    };
    reader.readAsDataURL(this.fileToUpload);
        
 }

  // close cropper modal
  closeModel =async function (option) {

    this.cropImage = false;
    
    // var x = document.getElementById('quizImageModal');
    // x.style.display = "none";
    // var warning = document.getElementById("quizImageSizeWarning");
    // warning.style.display = 'none'
    // console.log("About to emit file output event, should be recevied on parent component")
    if(option == 'OK') {

      // console.log("$(#file)", $("#file").value);

      // clear file input value
      $("#file").prop("value", "");
      if(this.isLogoImage == false){
        this.file.emit({ croppedImage: this.croppedImage, changedImage: this.changedImage, cropImage: this.cropImage, file: this.fileToUpload, event: this.imageChangedEvent });
      }else{
        //console.log(this.fileToUpload);
        await this.getBase64();
       // this.file.emit({croppedImage: this.fileToUpload, file: this.fileToUpload, event: this.imageChangedEvent})

        // var imgReader = new FileReader();
        // imgReader.readAsDataURL(this.fileToUpload);
        //  imgReader.onloadend = function () {
        //   console.log('Base64 Format', imgReader.result);
        // }
        // console.log(imgReader.result);
          
      }
      
    } else {

       // clear file input value
       $("#file").prop("value", "");
    }
    // TODO: ADD IMAGE SIZE RESTRICTION
    // if(option == 'OK'){
    //   if(this.quizImageSize > 2){
    //       alert("Selected image is more than 2 MB")
    //   }else{
    //       $('#quizImagePreview').attr('src', this.myCroppedImage);
    //           this.quizImage = this.dataURItoFile(this.myCroppedImage,globalThis.quizImage.name);
    //       }
    // }
  }
}
