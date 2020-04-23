import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChange } from '@angular/core';

import {FunnelAutomationRulesService} from 'src/app/services/coach/funnel/funnel-automation-rules.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() dropdownData: any;

  @Input() automationRule: any;

  @Output() selectedRuleOP = new EventEmitter<any>();

  constructor(
    private funnelAutomationRulesService: FunnelAutomationRulesService
  ) {
    this.onAddThenDataTagRef = this.onAddThenDataTag.bind(this);

    console.log("automationRule", this.automationRule);
   }

   onAddThenDataTagRef: any;

  bindLabel: any;

  bindValue: any;

  selectedRule: any;

  bindLabels: any = ["tagName", "webinarTitle", "quizTitle","emailCapaignTitle"];

  inputDropdownData: any = [];

  ngOnInit() {
  }
  placeHoldertext;
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];

    let changedProp: any;

    for (let propName in changes) {

      changedProp = changes[propName];
      console.log("changedProp", changedProp);
      this.inputDropdownData = changedProp.currentValue;

      if (!Array.isArray(changedProp.currentValue)) {
          this.inputDropdownData = this.dropdownData;
        // update binding for edit
        if (changedProp.currentValue.tag) {
          this.selectedRule = changedProp.currentValue.tag.id;
        }else{
          this.selectedRule = changedProp.currentValue.thenEmailCampId;
        }
      }

    }
    console.log(this.dropdownData);
    console.log(this.automationRule);
    if(this.automationRule){
      if (this.automationRule.tag.id) {
        this.selectedRule = this.automationRule.tag.id;
      }else{
        this.selectedRule = this.automationRule.thenEmailCampId;
      }
    }
    for (let bl in this.bindLabels) {

      let label = this.bindLabels[bl];

      if (this.inputDropdownData.length > 0) {

        this.bindLabel = this.inputDropdownData[0][label] ? label : null;

        // console.log("checking for bindLabel", this.inputDropdownData[0], 
        //           "this.inputDropdownData[0][bl]", this.inputDropdownData[0][bl], "bl", bl,
        //             "this.bindLabel", this.bindLabel);

        // break out of loop when bindLabel is found
        if (this.bindLabel)
          break;  
      }
    }
    if(this.bindLabel == 'emailCapaignTitle'){
      this.placeHoldertext = 'Not Found';
    }else{
      this.placeHoldertext = 'Create';
    }
  }

  // add event on ng select
  // male a post request with tag name to add it into automation rules tags
  async onAddThenDataTag(tag) {

    console.log(tag);
    if(this.bindLabel == 'tagName'){
      console.log("tag inside onAddThenDataTag", tag, this.funnelAutomationRulesService);
      let data :any = await this.funnelAutomationRulesService.saveTag(tag);

      console.log("response after succesffulyy adding tag into automation rules", data);
      this.dropdownData.push(data.data);
      return tag;
    }
    
  }

  // change event on ng select
  onThenDataChange() {

    console.log("Inside onThenDataChange", this.selectedRule);
    var selectedRuleId = null;
    if(this.bindLabel == 'tagName'){
        this.dropdownData.forEach(element => {
          console.log(this.selectedRule+ "==" + element.tagName)
              if(this.selectedRule == element.tagName){
                selectedRuleId = element.id;
              }
        });
    }
    // emit selected object as output event, received in parent component
    if(selectedRuleId == null)
    this.selectedRuleOP.emit(this.selectedRule);
    else
    this.selectedRuleOP.emit(selectedRuleId);
  }

}
