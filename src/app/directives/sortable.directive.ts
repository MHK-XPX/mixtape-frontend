/*
  Taken from this guide:
    https://stackblitz.com/edit/draggable-part-5?file=app%2Fdraggable%2Fsortable.directive.ts
*/
import { Directive, forwardRef, HostBinding } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

@Directive({
  selector: '[appSortable]',
  providers: [
    { provide: DraggableDirective, useExisting: forwardRef(() => SortableDirective) }
  ]
})
export class SortableDirective extends DraggableDirective {
  @HostBinding('class.sortable') sortable = true;
}
