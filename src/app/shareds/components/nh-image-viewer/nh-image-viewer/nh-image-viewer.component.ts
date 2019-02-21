import { Component, ElementRef, HostListener, Injector, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NhImageViewerService } from '../nh-image-viewer.service';
import { ImageViewer } from '../nh-image-viewer.model';

@Component({
    selector: 'nh-image-viewer',
    templateUrl: './nh-image-viewer.component.html',
    styleUrls: ['./nh-image-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NhImageViewerComponent implements OnInit {
    @ViewChild('imageViewport') imageViewport: ElementRef;
    image: ImageViewer;
    private scale = 1;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private injector: Injector,
        private nhImageViewerService: NhImageViewerService
    ) {
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: MouseWheelEvent) {
        const deltaY = event.deltaY;
        if (deltaY < 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            this.next();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            this.back();
        }
    }

    ngOnInit() {
        const id = this.injector.get('id');
        if (id) {
            this.image = this.nhImageViewerService.getCurrentImage(id);
            this.updateImagePosition();
        }
    }

    closeViewer() {
        this.nhImageViewerService.dismissImageViewer$.next();
    }

    print() {
        console.log('print');
    }

    download() {
        console.log('download');
    }

    reset() {
        this.scale = 1;
        this.updateScale();
    }

    zoomIn() {
        if (this.scale >= 4.5) {
            return;
        }
        this.scale += .5;
        this.updateScale();
    }

    zoomOut() {
        if (this.scale <= 0.5) {
            return;
        }
        this.scale -= .5;
        this.updateScale();
    }

    back() {
        const currentIndex = this.nhImageViewerService.images.indexOf(this.image);
        let backIndex = currentIndex - 1;
        if (backIndex <= 0) {
            backIndex = this.nhImageViewerService.images.length - 1;
        }
        this.image = this.nhImageViewerService.images[backIndex];
        this.updateImagePosition();
    }

    next() {
        // const currentImage = this.nhImageViewerService.getCurrentImage(this.image.id);
        const currentIndex = this.nhImageViewerService.images.indexOf(this.image);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= this.nhImageViewerService.images.length) {
            nextIndex = 0;
        }
        this.image = this.nhImageViewerService.images[nextIndex];
        this.updateImagePosition();
    }

    private updateScale() {
        this.renderer.setStyle(this.imageViewport.nativeElement, 'transform', `scale(${this.scale})`);
    }

    private updateImagePosition() {
        setTimeout(() => {
            this.renderer.setStyle(this.imageViewport.nativeElement, 'transform', `scale(1)`);
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const imageViewerRect = this.imageViewport.nativeElement.getBoundingClientRect();
            const left = (windowWidth - Math.round(imageViewerRect.width)) / 2;
            const top = (windowHeight - Math.round(imageViewerRect.height)) / 2;
            this.renderer.setStyle(this.imageViewport.nativeElement, 'top', `${top}px`);
            this.renderer.setStyle(this.imageViewport.nativeElement, 'left', `${left}px`);
        });
    }
}
