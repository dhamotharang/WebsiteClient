import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewContainerRef
} from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { NhMenuComponent } from './nh-menu/nh-menu.component';
import { NhContextMenuService } from './nh-context-menu.service';

@Directive({
    selector: '[nhContextMenuTrigger]'
})
export class NhContextMenuTriggerDirective implements OnInit, OnDestroy {
    @Input() nhContextMenuData: any;
    @Input() nhContextMenuTriggerFor: NhMenuComponent;

    private positionStrategy = new GlobalPositionStrategy();
    private overlayRef: OverlayRef;

    isActive = false;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private nhContextMenuService: NhContextMenuService) {
        this.renderer.listen(this.el.nativeElement, 'contextmenu', (event: MouseEvent) => {
            this.rightClick(event);
        });
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy
        });
        this.nhContextMenuService.add(this);
    }

    ngOnDestroy() {
        this.closeContextMenu();
    }

    rightClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.nhContextMenuService.setActive(this, event);
        this.nhContextMenuTriggerFor.active(true, event);
    }

    showContextMenu(event: MouseEvent) {
        // this.initOverlay(event);
    }

    closeContextMenu() {
        this.nhContextMenuTriggerFor.active(false);
    }

    // private initOverlay(event: MouseEvent) {
    //     if (!this.overlayRef.hasAttached()) {
    //         this.overlayRef.attach(new TemplatePortal(this.nhContextMenuTriggerFor, this.viewContainerRef));
    //     }
    //     this.updateContextMenuPosition(event);
    // }

    // private updateContextMenuPosition(event: MouseEvent) {
    //     if (this.overlayRef.hasAttached()) {
    //         this.positionStrategy.top(`${event.clientY}px`);
    //         this.positionStrategy.left(`${event.clientX}px`);
    //         this.positionStrategy.apply();
    //     }
    // }
}



