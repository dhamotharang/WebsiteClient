import { AfterViewInit, Directive, HostListener, Injector, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NhImageViewerService } from './nh-image-viewer.service';
import { ImageViewer } from './nh-image-viewer.model';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { NhImageViewerComponent } from './nh-image-viewer/nh-image-viewer.component';

@Directive({
    selector: '[nhImageViewer]'
})
export class NhImageViewerDirective implements OnInit, AfterViewInit, OnDestroy {
    private readonly _id: string;

    @Input() nhImageViewer: string;

    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private nhImageViewerService: NhImageViewerService) {
        this._id = Math.random().toString(36).substr(2, 9);
        this.nhImageViewerService.dismissImageViewer$.subscribe(() => {
            this.dismissImageViewer();
        });
    }

    @HostListener('click', ['$event'])
    click(event: MouseEvent) {
        // this.nhImageViewerService.showImageViewer$.next(this._id);
        this.showImageViewer();
    }

    ngOnInit() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            width: windowWidth,
            height: windowHeight
        });
    }

    ngAfterViewInit() {
        this.nhImageViewerService.add(new ImageViewer(this._id, this.nhImageViewer));
    }

    ngOnDestroy() {
        if (this.overlayRef.hasAttached()) {
            this.dismissImageViewer();
        }
    }

    private showImageViewer() {
        if (!this.overlayRef.hasAttached()) {
            const injector = Injector.create({
                providers: [{provide: 'id', useValue: this._id.toString()}]
            });
            this.overlayRef.attach(new ComponentPortal(NhImageViewerComponent, this.viewContainerRef, injector));
            this.positionStrategy.top('0px');
            this.positionStrategy.left('0px');
            this.positionStrategy.apply();
        }
    }

    private dismissImageViewer() {
        this.overlayRef.detach();
    }
}
