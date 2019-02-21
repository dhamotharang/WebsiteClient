import { Injectable } from '@angular/core';
import { ImageViewer } from './nh-image-viewer.model';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Injectable()
export class NhImageViewerService {
    private _images: ImageViewer[] = [];
    // showImageViewer$ = new Subject<string>();
    dismissImageViewer$ = new Subject();

    constructor() {
    }

    get images() {
        return this._images;
    }

    add(imageViewer: ImageViewer) {
        this._images = [...this._images, imageViewer];
    }

    getCurrentImage(id: string): ImageViewer {
        const image = _.find(this.images, (imageViewer: ImageViewer) => {
            return imageViewer.id === id;
        });
        return image;
    }
}
