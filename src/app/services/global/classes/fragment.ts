import { Type } from '@angular/core';

export class Fragment {
  constructor(public component: Type<any>, public data: any) {}
}
