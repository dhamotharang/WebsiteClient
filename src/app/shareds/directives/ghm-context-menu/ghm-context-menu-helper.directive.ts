import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
    selector: '[ghmContextMenuHelper]'
})
export class GhmContextMenuHelperDirective implements OnInit {
    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay) {
        // this.ghmContextMenu.rightClick$.subscribe((event: MouseEvent) => {
        //     this.showContextMenu(event);
        // });
        // this.ghmContextMenu.documentClick$.subscribe((event: MouseEvent) => {
        //     this.dismissContextMenu();
        // });
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy
        });
    }

    showContextMenu(event: MouseEvent) {
        if (!this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
            this.updatePosition(event);
        } else {
            this.updatePosition(event);
        }
    }

    dismissContextMenu() {
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        }
    }

    private updatePosition(event: MouseEvent) {
        const top = event.clientY;
        const left = event.clientX;
        this.positionStrategy.top(top + 'px');
        this.positionStrategy.left(left + 'px');
        this.positionStrategy.apply();
    }
}
