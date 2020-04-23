import { Component, OnInit } from '@angular/core';
import { Common } from '../../../services/global/common';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-recepient-details',
  templateUrl: './recepient-details.component.html',
  styleUrls: ['./recepient-details.component.css']
})
export class RecepientDetailsComponent implements OnInit {
  showInfo = false;
  activeSideBar = 'Order';
  constructor(public common: Common) { }
  customeField: any = [];
  orders: any = [
    {
      name: 'Order No 676784775',
      date: 'March 19, 2020 09:31 AM',
      revenu: '$10.00',
    },
    {
      name: 'Order No 7846784709',
      date: 'March 15, 2020 09:31 AM',
      revenu: '$15.00',
    },
    {
      name: 'Order No 676784775',
      date: 'March 10, 2020 09:31 AM',
      revenu: '$5.00',
    }
  ]
  websiteSession: any = [
    {
      name: 'Created a Cart',
      date: 'March 19, 2020 09:31 AM',
    },
    {
      name: 'Checkout Updated',
      date: 'March 19, 2020 09:31 AM',
    },
    {
      name: 'Placed an Order',
      date: 'March 19, 2020 09:31 AM',
    }
  ]
  emails: any = [
    {
      name: 'Email Broadcast One',
      date: 'March 19, 2020 09:31 AM',
      status: 'Opened',
    },
    {
      name: 'Email Broadcast Two',
      date: 'March 19, 2020 09:31 AM',
      status: 'Clicked',
    },
    {
      name: 'Email Broadcast Three',
      date: 'March 19, 2020 09:31 AM',
      status: 'Soft Bounced',
    }
  ]
  allActivity: any = [
    {
      name: 'Received “Test Broadcast”',
      date: 'March 19, 2020 09:31 AM',
      icon: 'assets/icons/mail.svg',
    },
    {
      name: 'Soft bounced “Test Broadcast 3”',
      date: 'March 19, 2020 09:31 AM',
      icon: 'assets/icons/mail.svg',
    },
    {
      name: 'Tagged as “Coaching List”',
      date: 'March 19, 2020 09:31 AM',
      icon: 'assets/icons/ic_tagsgreen.svg',
    },
    {
      name: 'Subscribe to “Coaching List”',
      date: 'March 19, 2020 09:31 AM',
      icon: 'assets/icons/mail.svg',
    },
    {
      name: 'Unsubscribe from “Coaching List”',
      date: 'March 19, 2020 09:31 AM',
      icon: 'assets/icons/mail.svg',
    },
  ]
  workFlows: any = []
  linechart = [];
  ngOnInit() {
    this.getBarchart();
  }
  async getBarchart(): Promise<void> {
    var canvas = <HTMLCanvasElement>document.getElementById("lineChart");
    var ctx = canvas.getContext("2d");
    var label = [];
    var barData = [];
    this.linechart = new Chart(ctx, {
      type: 'line',
      data: {
        xLabels: [new Date('Jan 20, 2020'), new Date('Jan 31, 2020'), new Date('Feb 1, 2020'), new Date('Feb 10, 2020'), new Date('Feb 20, 2020')],
				yLabels: [" ","5 Emails","0 Sessions", "0 Orders"],
        datasets: [
          {
            label: "Email",
            fill: false,
            data: [{
              x: new Date('Jan 23, 2020'),
              y: "5 Emails"
            }, {
              x: new Date('Jan 28, 2020'),
              y: "5 Emails"
            }, {
              x: new Date('Jan 28, 2020'),
              y: "5 Emails"
            },
            ],
            pointRadius: 6,
            pointBackgroundColor: '#0B8B8C',
            pointBorderColor: '#f1efef',
            pointBorderWidth: 5
          },
          {
            label: "0 Sessions",
            fill: false,
            data: [{
              x: new Date('Jan 28, 2020'),
              y: "0 Sessions"
            }, {
              x: new Date('Feb 7, 2020'),
              y: "0 Sessions"
            }, {
              x: new Date('Feb 8, 2020'),
              y: "0 Sessions"
            },
            ],
            pointRadius: 6,
            pointBackgroundColor: '#0B8B8C',
            pointBorderColor: '#f1efef',
            pointBorderWidth: 5
          },
          {
            label: "0 Orders",
            fill: false,
            data: [{
              x: new Date('Feb 7, 2020'),
              y: "0 Orders"
            }, {
              x: new Date('Feb 15, 2020'),
              y: "0 Orders"
            }, {
              x: new Date('Feb 25, 2020'),
              y: "0 Orders"
            },
            ],
            pointRadius: 6,
            pointBackgroundColor: '#0B8B8C',
            pointBorderColor: '#f1efef',
            pointBorderWidth: 5
          }
        ]
      },
      options: {
        
        showLines: false,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            color:'red',
            position: 'bottom',
            
            type: 'time',
            gridLines:{
              offsetGridLines: false,
              borderDash: [10,10],
              color: "#E5E5E5",
              zeroLineBorderDash: [10,10],
              zeroLineColor: "#E5E5E5"
            },
            time: {
              format: "ll",
              unit: 'week',
              unitStepSize: 0.5,
              displayFormats: {
                 week: 'll',  
                //  min: new Date('Jan 20, 2020'),
                //  max: new Date('Feb 25, 2020')               
              },
              min: new Date('Jan 23, 2020'),
              max: new Date('Feb 25, 2020'),
            },
            
            ticks: {
              padding: 15,
            }
          }],
          yAxes: [{
            type: 'category',
            position: 'left', 
            gridLines:{
              drawBorder: false,
              circular: true,
              color: "#E5E5E5",
              lineWidth:7,
              zeroLineColor :"#FFF",
              zeroLineWidth : 2
            } ,
            ticks: {
              padding: 15,
            }
          }],
        },
        tooltips: {
          xPadding: 15,
          yPadding: 15,
          titleFontColor: '#000000',
          bodyFontColor: '#000000',
          backgroundColor : '#FFFFFF',
          shadowOffsetX: 3,

          shadowOffsetY: 3,

          shadowBlur: 10,

          shadowColor: 'rgba(0, 0, 0, 0.5)',
          custom: function(tooltip) {
            //var tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;

            //tooltipEl.style.color = '#000000';
          },
          callbacks: {
            title: function(tooltipItem){
            
              // var date = new Date(this._data.labels[tooltipItem[0].index]);
              // var dayName = this.days[date.getDay()];
              
              return "Received : New Campaign by Vasall";
            },
            label: function(tooltipItem) {
              
                return "Campaign : New Campaign by Vasall";
            },
            // labelTextColor: function(tooltipItem, chart) {
            //   return '#000000';
            // }
         }
        },
      }
    });
    // // var ctxh = document.getElementById("barChart");
    // $("#barChart").css({ 'height': '341px', 'width': '878px;' });
  }
  changeShowInfo() {
    $("#showInfoTags").slideToggle("slow");
    $("#hideInfoTags").slideToggle("slow");
    if (this.showInfo == false) {
      this.showInfo = true;
    } else {
      this.showInfo = false;
    }
  }
  addCustomeField() {
    var obj = {
      'identifier': '',
      'value': ''
    }
    this.customeField.push(obj)
  }
  removeCustomeField(index) {
    this.customeField.splice(index, 1);
  }

  producDetails(tableId, imageId) {
    $("#" + tableId).slideToggle("slow");
    var image = $("#" + imageId)[0];
    var sorce = image.src;
    if (sorce.includes('assets/icons/arrow-top.svg')) {
      $("#" + imageId).attr("src", "assets/icons/arrow-down.svg");
    } else {
      $("#" + imageId).attr("src", "assets/icons/arrow-top.svg");
    }
  }
  changeSideBarOption(option) {
    this.activeSideBar = option;
    // console.log(event);
    // var sideOptions = document.getElementsByClassName("sideMenu");
    // console.log(sideOptions);
    // for(var i=0; i< sideOptions.length; i++){
    //   if($(sideOptions[i]).hasClass("activeSideMenu")){ $(sideOptions[i]).removeClass("activeSideMenu");  } 
    // }
    //   $(event.target).addClass("activeSideMenu");
  }
}
