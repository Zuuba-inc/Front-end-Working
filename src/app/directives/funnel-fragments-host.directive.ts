import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[app-funnel-fragments-host]'
})
export class FunnelFragmentsHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
