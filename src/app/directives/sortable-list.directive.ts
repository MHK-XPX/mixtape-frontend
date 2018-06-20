/*
Taken from this guide:
  https://stackblitz.com/edit/draggable-part-5?file=app%2Fdraggable%2Fsortable-list.directive.ts
*/
import { AfterContentInit, ContentChildren, Directive, EventEmitter, Output, QueryList } from '@angular/core';
import { SortableDirective } from './sortable.directive';

export interface SortEvent {
  currentIndex: number;
  newIndex: number;
}

const distance = (rectA: ClientRect, rectB: ClientRect): number => {
  return Math.sqrt(
    Math.pow(rectB.top - rectA.top, 2) +
    Math.pow(rectB.left - rectA.left, 2)
  )
};

const hCenter = (rect: ClientRect): number => {
  return rect.left + rect.width / 2;
};

const vCenter = (rect: ClientRect): number => {
  return rect.top + rect.height / 2;
};

@Directive({
  selector: '[appSortableList]'
})
export class SortableListDirective implements AfterContentInit {
  @ContentChildren(SortableDirective) sortables: QueryList<SortableDirective>;

  @Output() sort = new EventEmitter<SortEvent>();

  private clientRects: ClientRect[];

  private lastLength: number; //This will work unless the user has two playlists with the same length...(FIX ME)

  ngAfterContentInit(): void {
    this.doOnChange();

    this.lastLength = this.sortables.length;

    this.sortables.changes.subscribe(res => this.doOnChange());
  }

  /*
    This method is called on init and whenever the playlist changes
    It will resub each list element => turning it into a sortable list element
  */
  private doOnChange(){
    if(this.sortables.length === this.lastLength) return;

    this.lastLength = this.sortables.length;

    this.sortables.forEach(sortable => {
      sortable.dragStart.subscribe(() => this.measureClientRects());
      sortable.dragMove.subscribe(event => this.detectSorting(sortable, event));
    });
  }

  private measureClientRects() {
    this.clientRects = this.sortables.map(sortable => sortable.element.nativeElement.getBoundingClientRect());
  }

  private detectSorting(sortable: SortableDirective, event: PointerEvent) {
    const currentIndex = this.sortables.toArray().indexOf(sortable);
    const currentRect = this.clientRects[currentIndex];

    this.clientRects
      .slice()
      .sort((rectA, rectB) => distance(rectA, currentRect) - distance(rectB, currentRect))
      .filter(rect => rect !== currentRect)
      .some(rect => {
        const isHorizontal = rect.top === currentRect.top;
        const isBefore = isHorizontal ?
          rect.left < currentRect.left :
          rect.top < currentRect.top;

        // refactored this part a little bit after my Youtube video
        // for improving readability
        const moveBack = isBefore && (isHorizontal ?
          event.clientX < hCenter(rect) :
          event.clientY < vCenter(rect)
        );

        const moveForward = !isBefore && (isHorizontal ?
          event.clientX > hCenter(rect) :
          event.clientY > vCenter(rect)
        );

        if (moveBack || moveForward) {
          this.sort.emit({
            currentIndex: currentIndex,
            newIndex: this.clientRects.indexOf(rect)
          });

          return true;
        }

        return false;
      });
  }
}
