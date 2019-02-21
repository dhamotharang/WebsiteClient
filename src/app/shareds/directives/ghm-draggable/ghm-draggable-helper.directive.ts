import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { GhmDraggableDirective } from './ghm-draggable.directive';
import { ComponentPortal, Portal, TemplatePortal } from '@angular/cdk/portal';

@Directive({
    selector: '[appGhmDraggableHelper]'
})
export class GhmDraggableHelperDirective implements OnInit, OnDestroy {
    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();
    private startPosition: { x: number; y: number };

    constructor(
        private ghmDraggableDirective: GhmDraggableDirective,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay,
        private renderer: Renderer2
    ) {
        console.log('init draggable helper.');
    }

    ngOnInit(): void {
        this.ghmDraggableDirective.dragStart.subscribe(event => this.onDragStart(event));
        this.ghmDraggableDirective.dragMove.subscribe(event => this.onDragMove(event));
        this.ghmDraggableDirective.dragEnd.subscribe(event => this.onDragEnd(event));

        const clientRect = this.ghmDraggableDirective.element.nativeElement.getBoundingClientRect();
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            width: clientRect.width,
            height: clientRect.height
        });
    }

    ngOnDestroy() {
        this.overlayRef.dispose();
    }

    private onDragStart(event: PointerEvent) {
        const clientRect = this.ghmDraggableDirective.element.nativeElement.getBoundingClientRect();
        // Get start position.
        this.startPosition = {
            x: event.clientX - clientRect.left,
            y: event.clientY - clientRect.top
        };
    }

    private onDragMove(event: PointerEvent) {
        if (!this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
            // this.overlayRef.attach(new Portal<ElementRef>(this.ghmDraggableDirective.element, this.viewContainerRef));
        }

        this.positionStrategy.left(`${event.clientX - this.startPosition.x}px`);
        this.positionStrategy.top(`${event.clientY - this.startPosition.y}px`);
        this.positionStrategy.apply();
    }

    private onDragEnd(event: PointerEvent) {
        this.overlayRef.detach();
        // this.viewContainerRef.clear();
    }
}
