import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css']
})
export class SegmentsComponent implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit() {
  }
  segmentDetails(){
    this.router.navigate(['/segmentDetails']);
  }
}
