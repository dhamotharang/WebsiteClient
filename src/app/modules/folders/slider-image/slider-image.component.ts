import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FileSearchViewModel} from '../viewmodels/file-search.viewmodel';
import * as _ from 'lodash';

@Component({
    selector: 'app-slider-image',
    templateUrl: './slider-image.component.html',
    styleUrls: ['../folder.scss']
})

export class SliderImageComponent implements AfterViewInit {
    @ViewChild('sliderImageModal', {static: true}) sliderImageModal: NhModalComponent;
    imageSelect: FileSearchViewModel;
    listImage: FileSearchViewModel[];
    isEnablePrevious;
    isEnableNex;
    indexFile;
    height;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 220;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 220;
    }

    show() {
        this.sliderImageModal.open();
        this.checkIndexImage();
    }

    showImage(item: FileSearchViewModel, isShowModal) {
        if (!item.isClick) {
            item.isClick = true;
            this.imageSelect = item;
            this.checkIndexImage();
            item.isClick = false;
        }
    }

    checkIndexImage() {
        this.indexFile = _.findIndex(this.listImage, (item) => {
            return item.id === this.imageSelect.id;
        });

        if (this.indexFile === 0 && this.listImage.length > 1) {
            this.isEnablePrevious = false;
            this.isEnableNex = true;
        } else if (this.indexFile === this.listImage.length - 1 && this.listImage.length > 1) {
            this.isEnableNex = false;
            this.isEnablePrevious = true;
        } else if (this.listImage.length === 1) {
            this.isEnablePrevious = false;
            this.isEnableNex = false;
        } else {
            this.isEnablePrevious = true;
            this.isEnableNex = true;
        }
    }

    nextImage() {
        this.imageSelect = this.listImage[this.indexFile + 1];
        this.showImage(this.imageSelect, false);
    }

    previousImage() {
        this.imageSelect = this.listImage[this.indexFile - 1];
        this.showImage(this.imageSelect, false);
    }
}
