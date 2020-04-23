import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[app-component-builders-host]'
})
export class ComponentBuildersHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
