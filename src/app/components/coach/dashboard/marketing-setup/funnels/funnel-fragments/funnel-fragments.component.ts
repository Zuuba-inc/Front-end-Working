import { Component, Input, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver, ChangeDetectorRef,
  OnChanges, SimpleChanges,  } from '@angular/core';

import { FunnelFragmentsHostDirective } from 'src/app/directives/funnel-fragments-host.directive';
import { Fragment } from 'src/app/services/global/classes/fragment';

// import interface
import { FragmentComponent} from 'src/app/services/global/interfaces/fragment-component';

@Component({
  selector: 'app-funnel-fragments',
  templateUrl: './funnel-fragments.component.html',
  styleUrls: ['./funnel-fragments.component.css']
})
export class FunnelFragmentsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() fragments: Fragment[];

  @ViewChild(FunnelFragmentsHostDirective) appFunnelFragmentsHost: FunnelFragmentsHostDirective;

  constructor(
    private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
    ) { }

  ngOnInit() {
  }

  // detect changes to fragments happened due api response in funnel-create component
  // and populate fragments dynamically
  ngOnChanges(changes: SimpleChanges) {

    // console.log("changes detect inside fragments component", changes);

    // only run when property "fragments" changed
    if (changes['fragments']) {
        // this.groupPosts = this.groupByCategory(this.data);

        // console.log("changes['fragments']", changes['fragments']);
        this.fragments = changes['fragments'].currentValue;

        this.loadComponent();
        // detect changes, added this bc since there was an error on console related binding changes detection
        this.cdr.detectChanges();
    }
  }

  // call loadComponent inside ngAfterViewInit
  ngAfterViewInit() {

    // console.log("FunnelFragmentsHostDirective", FunnelFragmentsHostDirective, "appFunnelFragmentsHost", this.appFunnelFragmentsHost);

    this.loadComponent();

    // detect changes, added this bc since there was an error on console related binding changes detection
    this.cdr.detectChanges();
  }

  // iterates over fragments and appends it to viewContainerRef
  loadComponent() {

    // console.log("this.fragments", this.fragments);

    if (this.fragments) {
      for (let fragment of this.fragments) {

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(fragment.component);

        let viewContainerRef = this.appFunnelFragmentsHost.viewContainerRef;

        // viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);

        // console.log("fragment.data", fragment.data);

        // use this for dynamic data binding
        (<FragmentComponent>componentRef.instance).data = fragment.data;
      }
    }
  }
}
