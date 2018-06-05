import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[ngEnter]'
})
export class NgEnterDirective{
    private el: ElementRef;

    @Output() ngEnter: EventEmitter<any> = new EventEmitter();

    constructor(private _el: ElementRef){
        this.el = this._el;
    }

    @HostListener('keyup', ['$event']) onkeydown(e){
        if((e.which == 13 || e.keycode == 13)){
            this.ngEnter.emit(e);
        }
    }
}