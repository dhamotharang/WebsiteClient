/**
 * Created by HoangNH on 5/5/2017.
 */
import {
    AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnInit,
    Output,
    Renderer2, TemplateRef, ViewChild, ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { NhModalHeaderComponent } from './nh-modal-header.component';
import { NhModalFooterComponent } from './nh-modal-footer.component';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NhModalService } from './nh-modal.service';

@Component({
    selector: 'nh-modal',
    template: `
        <ng-template #modalTemplate>
            <div [ngClass]="'nh-modal-container nh-modal-' + size">
                <ng-content></ng-content>
            </div><!-- END: nh-modal-container -->
        </ng-template>
    `,
    styleUrls: ['./nh-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NhModalComponent implements OnInit {
    @ContentChild(NhModalHeaderComponent) modalHeaderComponents: NhModalHeaderComponent;
    @ContentChild(NhModalFooterComponent) modalFooterComponents: NhModalFooterComponent;
    @ViewChild('modalTemplate') modalTemplateRef: TemplateRef<any>;

    @Input() effect = 'slideDown'; // zoom, fade, slideUp, slideDown, slideLeft, slideRight
    @Input() size = 'sm';
    @Input() hasBackdrop = true;
    @Input() backdropStatic = false;

    // -- Hàm không sử dụng.
    @Output() onShow = new EventEmitter();
    @Output() onShown = new EventEmitter();
    @Output() onHide = new EventEmitter();
    @Output() onHidden = new EventEmitter();
    @Output() onClose = new EventEmitter();
    // END: -- Hàm không sử dụng.

    @Output() show = new EventEmitter();
    @Output() shown = new EventEmitter();
    @Output() hide = new EventEmitter();
    @Output() hidden = new EventEmitter();
    @Output() close = new EventEmitter();

    isShow = false;
    state = '';
    hideState = ['zoomOut', 'fadeOut', 'slideUpHide', 'slideDownHide', 'slideLeftHide', 'slideRightHide'];
    showState = '';
    isDone = false;

    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();

    constructor(private el: ElementRef,
                private overlay: Overlay,
                private viewContainerRef: ViewContainerRef,
                private renderer: Renderer2,
                private nhModalService: NhModalService) {
        this.changeState(true);
        this.nhModalService.dismiss$.subscribe(result => {
            this.close.emit();
            this.dismiss();
        });
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            hasBackdrop: this.hasBackdrop
        });
        this.overlayRef.backdropClick().subscribe((event: MouseEvent) => {
            if (this.backdropStatic) {
                return;
            }

            this.dismiss();
        });
    }

    @HostListener('window:resize', ['$event'])
    windowResize() {
        this.updatePosition();
    }

    open() {
        this.show.emit();
        this.renderer.addClass(document.body, 'nh-modal-open');
        if (this.overlayRef && !this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.modalTemplateRef, this.viewContainerRef));
        }
        this.updatePosition();
    }

    dismiss() {
        this.hide.emit();
        if (this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
            this.hidden.emit();
            this.renderer.removeClass(document.body, 'modal-open');
        }
    }

    showContainerDone(event) {
        if (event.fromState === 'hide' && event.toState === 'open') {
            // this.changeState();
            this.onShown.emit();
        }
        if (event.fromState === 'open' && event.toState === 'hide') {
            this.onHidden.emit();
        }
    }

    showEffectDone(event) {
        if (this.hideState.indexOf(this.state) > -1) {
            this.showState = 'hide';
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
            this.onHidden.emit();
        }
        this.isDone = true;
    }

    private changeState(isHide = false) {
        switch (this.effect) {
            case 'zoom':
                this.state = isHide ? 'zoomOut' : this.state === 'zoomIn' ? 'zoomOut' : 'zoomIn';
                break;
            case 'fade':
                this.state = isHide ? 'fadeOut' : this.state === 'fadeIn' ? 'fadeOut' : 'fadeIn';
                break;
            case 'slideUp':
                this.state = isHide ? 'slideUpHide' : this.state === 'slideUpShow' ? 'slideUpHide' : 'slideUpShow';
                break;
            case 'slideDown':
                this.state = isHide ? 'slideDownHide' : this.state === 'slideDownShow' ? 'slideDownHide' : 'slideDownShow';
                break;
            case 'slideLeft':
                this.state = isHide ? 'slideLeftHide' : this.state === 'slideLeftShow' ? 'slideLeftHide' : 'slideLeftShow';
                break;
            case 'slideRight':
                this.state = isHide ? 'slideRightHide' : this.state === 'slideRightShow' ? 'slideRightHide' : 'slideRightShow';
                break;
            default:
                this.state = isHide ? 'zoomOut' : this.state === 'zoomIn' ? 'zoomOut' : 'zoomIn';
                break;
        }
    }

    private updatePosition() {
        if (!this.overlayRef.hasAttached()) {
            return;
        }

        if (this.size && this.size.toLowerCase() === 'full') {
            this.renderer.setStyle(this.overlayRef.overlayElement, 'width', '100%');
        }
        const windowWidth = window.innerWidth;
        const elementRect = this.overlayRef.overlayElement.getBoundingClientRect();
        const left = windowWidth / 2 - elementRect.width / 2;
        this.positionStrategy.top('55px');
        this.positionStrategy.left(left + 'px');
        this.positionStrategy.apply();
        this.shown.emit();
    }
}
