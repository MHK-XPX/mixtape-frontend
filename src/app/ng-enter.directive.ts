import { Directive, ElementRef, HostListener, Output, EventEmitter } from'@angular/core';

@Directive({
  selector: '[ngEnter]'
})
export class NgEnterDirective {

  private el: ElementRef;

  @Output() ngEnter: EventEmitter<any> = new EventEmitter();

  constructor(private _el: ElementRef) {
    this.el = this._el;
  }

  @HostListener('keyup', ['$event']) onKeyDown(e){
    if((e.which == 13 || e.keyCode == 13)){
      this.ngEnter.emit(e);
    }
  }
}
