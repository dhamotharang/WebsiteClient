import {
    AfterContentInit,
    ContentChild,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    Output,
    QueryList
} from '@angular/core';
import { GhmSortableDirective } from './ghm-sortable.directive';

const distance = (rectA: ClientRect, rectB: ClientRect): number => {
    const math = Math.sqrt(
        Math.pow(rectB.top - rectA.top, 2) + Math.pow(rectB.left - rectA.left, 2)
    );
    // console.log(math);
    return math;
};

export interface SortEvent {
    currentIndex: number;
    newIndex: number;
    currentData?: any;
    swapData?: any;
}

@Directive({
    selector: '[ghmSortableList]'
})
export class GhmSortableListDirective implements AfterContentInit {
    @ContentChildren(GhmSortableDirective) sortables: QueryList<GhmSortableDirective>;
    @Output() sort = new EventEmitter();
    @Output() sorted = new EventEmitter();

    @Input() sources: any[] = [];

    private clientRects: ClientRect[];
    private sortEvent: SortEvent = {
        currentIndex: 0,
        newIndex: 0
    };

    constructor() {
    }

    ngAfterContentInit() {
        // console.log(this.sortables.length);
        this.sortables.forEach(sortable => {
            sortable.dragStart.subscribe(() => this.measureClientRects());
            sortable.dragMove.subscribe((event => this.detectSorting(sortable, event)));
            sortable.dragEnd.subscribe((() => this.sortComplete()));
        });
    }

    private measureClientRects() {
        this.clientRects = this.sortables.map(sortable => sortable.element.nativeElement.getBoundingClientRect());
    }

    private detectSorting(sortable: GhmSortableDirective, event: PointerEvent) {
        const currentIndex = this.sortables.toArray().indexOf(sortable);
        const currentRect = this.clientRects[currentIndex];
        // console.log(this.clientRects);
        this.clientRects
            .slice()
            // .sort((rectA, rectB) => distance(rectA, currentRect) - distance(rectB, currentRect))
            .some(rect => {
                if (rect === currentRect) {
                    return false;
                }

                const isHorizontal = rect.top === currentRect.top;
                const isBefore = isHorizontal ? rect.left < currentRect.left : rect.top < currentRect.top;
                let moveBack = false;
                let moveForward = false;

                if (isHorizontal) {
                    moveBack = isBefore && event.clientX < rect.left + rect.width / 2;
                    moveForward = !isBefore && event.clientX > rect.left + rect.width / 2;
                } else {
                    moveBack = isBefore && event.clientY < rect.top + rect.height / 2;
                    moveForward = !isBefore && event.clientY > rect.top + rect.height / 2;
                }

                if (moveBack || moveForward) {
                    this.sortEvent.currentIndex = currentIndex;
                    this.sortEvent.newIndex = this.clientRects.indexOf(rect);
                    this.sort.emit(this.sortEvent);
                    this.reOrder(this.sortEvent.currentIndex, this.sortEvent.newIndex);
                    return true;
                }
                return false;
            });
    }

    private reOrder(currentIndex: number, newIndex: number) {
        const current = this.sources[currentIndex];
        const swapItem = this.sources[newIndex];
        // console.log(this.sources);
        // console.log(currentIndex, newIndex);
        // console.log(current, swapItem);
        if (current && swapItem) {
            this.sources[currentIndex] = swapItem;
            this.sources[newIndex] = current;

            this.sortEvent.currentData = current;
            this.sortEvent.swapData = swapItem;
        }
    }

    private sortComplete() {
        if (this.sortEvent.currentIndex !== this.sortEvent.newIndex) {
            this.sorted.emit(this.sortEvent);
            return true;
        }
        return false;
    }
}
