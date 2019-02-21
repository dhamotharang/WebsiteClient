import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { repeat, switchMap, take, takeUntil } from 'rxjs/operators';


@Directive({
    selector: '[ghmDraggable]'
})
export class GhmDraggableDirective implements OnInit {
    @HostBinding('class.ghm-draggable') draggable = true;
    @HostBinding('class.ghm-dragging') dragging = false;

    @Input() ghmDraggable = 0;

    @Output() dragStart = new EventEmitter();
    @Output() dragMove = new EventEmitter();
    @Output() dragEnd = new EventEmitter();

    private pointerDown$ = new Subject<PointerEvent>();
    private pointerMove$ = new Subject<PointerEvent>();
    private pointerUp$ = new Subject<PointerEvent>();

    constructor(public element: ElementRef) {
        console.log('ghm draggable init.');
    }

    @HostListener('pointerdown', ['$event'])
    onPointerDown(event: PointerEvent): void {
        event.stopPropagation();
        this.pointerDown$.next(event);
    }

    @HostListener('document:pointermove', ['$event'])
    onPointerMove(event: PointerEvent): void {
        this.pointerMove$.next(event);
    }

    @HostListener('document:pointerup', ['$event'])
    onPointerUp(event: PointerEvent): void {
        this.pointerUp$.next(event);
    }

    ngOnInit(): void {
        this.pointerDown$.asObservable()
            .subscribe((event: PointerEvent) => {
                this.dragging = true;
                this.dragStart.emit(event);
            });

        this.pointerDown$
            .pipe(
                switchMap(() => this.pointerMove$),
                takeUntil(this.pointerUp$),
                repeat()
            )
            .subscribe((event: PointerEvent) => this.dragMove.emit(event));

        this.pointerDown$
            .pipe(
                switchMap(() => this.pointerUp$),
                take(1),
                repeat()
            )
            .subscribe((event: PointerEvent) => {
                this.dragging = false;
                this.dragEnd.emit(event);
            });
    }

}
