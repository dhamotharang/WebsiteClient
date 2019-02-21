import {Component, ElementRef, ViewChild} from '@angular/core';
import {VideoService} from '../video.service';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {VideoSearchViewModel} from '../viewmodels/video-search.viewmodel';
import {VideoType} from '../models/video.model';

@Component({
    selector: 'app-video-detail',
    templateUrl: './video-detail.component.html',
    providers: [VideoService]
})

export class VideoDetailComponent {
    @ViewChild('videoDetailModal') videoDetail: NhModalComponent;
    url;

    constructor(private videoService: VideoService,
                private elementRef: ElementRef) {
    }

    onHiddenModal() {
    }

    getDetail(video: VideoSearchViewModel) {
        if (video) {
            if (video.type === VideoType.youtube) {
                this.url = `https://www.youtube.com/embed/${video.videoLinkId}?enablejsapi=1&amp;autoplay=1&amp;rel=0`;
            }
            if (video.type === VideoType.vimeo) {
                this.url = `https://player.vimeo.com/video/${video.videoLinkId}?color=0c88dd&title=0&byline=0&portrait=0&autoplay=1`;
            }

            if (video.type === VideoType.updateServer) {
                this.url = video.url;
            }
            this.videoDetail.open();
        }
    }

    onLoadFunc() {
        console.log(this.url);
    }

    closeModal() {
        this.videoDetail.dismiss();
    }
}
