import {AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Video, VideoType} from './models/video.model';
import {ActivatedRoute} from '@angular/router';
import {VideoService} from './video.service';
import {VideoFormComponent} from './video-form/video-form.component';
import {VideoSearchViewModel} from './viewmodels/video-search.viewmodel';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {VideoDetailComponent} from './video-detail/video-detail.component';
import {HelperService} from '../../../shareds/services/helper.service';
import {BaseListComponent} from '../../../base-list.component';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {UtilService} from '../../../shareds/services/util.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService]
})

export class VideoComponent extends BaseListComponent<VideoSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(VideoFormComponent) videoFormComponent: VideoFormComponent;
    @ViewChild(VideoDetailComponent) videoDetailComponent: VideoDetailComponent;
    @Input() albumId: string;
    @Input() videos: Video[] = [];

    isActive: boolean;
    type;
    height;
    currentLanguage: string;

    videoTypes = [{
        id: VideoType.youtube,
        name: 'Youtube'
    }, {
        id: VideoType.vimeo,
        name: 'Vimeo'
    }, {
        id: VideoType.pinterest,
        name: 'Pinterest',
    }, {
        id: VideoType.updateServer,
        name: 'UpdateServer'
    }
    ];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private videoService: VideoService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.ALBUM, 'Quản lý Video', 'Danh sách video');
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.type = params.type ? parseInt(params.type) : '';
            this.isActive = params.isActive ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    onSaveVideoSuccess(result: { data: Video, isUpdate: boolean }) {
        if (result.isUpdate) {
            const videoInfo = _.find(this.videos, (video: Video) => {
                return video.id === result.data.id;
            }) as Video;

            if (videoInfo) {
                const video = result.data;
                videoInfo.translations = video.translations;
                videoInfo.thumbnail = video.thumbnail;
                videoInfo.type = video.type;
                videoInfo.url = video.url;
                videoInfo.isHomePage = video.isHomePage;
                videoInfo.videoLinkId = video.videoLinkId;
            }
        } else {
            this.videos.push(result.data);
        }
    }

    add() {
        this.videoFormComponent.add();
    }

    search() {
        // this.currentPage = currentPage;
        // this.isSearching = true;
        // this.renderLink();
        // this.listItems$ = this.videoService.search(this.albumId, this.keyword, this.type, this.isActive,
        //     this.currentPage, this.pageSize)
        //     .pipe(finalize(() => this.isSearching = false),
        //         map((result: SearchResultViewModel<VideoSearchViewModel>) => {
        //             this.totalRows = result.totalRows;
        //             return result.items;
        //         }));
    }

    resetFormSearch() {
        this.isActive = null;
        this.keyword = '';
        this.type = '';
        this.search();
    }

    edit(video: Video) {
        this.videoFormComponent.edit(video);
    }

    detail(video: VideoSearchViewModel) {
        this.videoDetailComponent.getDetail(video);
    }

    delete(index: number) {
        this.videos.splice(index, 1);
    }

    updateIsHomePage(item: VideoSearchViewModel) {
        this.videoService.updateIsHomePage(item.id, !item.isHomePage).subscribe(() => {
            item.isHomePage = !item.isHomePage;
        });
    }

    updateStatus(item: VideoSearchViewModel) {
        this.videoService.updateStatus(item.id, !item.isActive).subscribe(() => {
            item.isActive = !item.isActive;
        });
    }

    // private renderLink() {
    //     const path = '/gallery/album';
    //     const query = this.utilService.renderLocationFilter([
    //         new FilterLink('albumId', this.albumId),
    //         new FilterLink('keyword', this.keyword),
    //         new FilterLink('type', this.type),
    //         new FilterLink('isActive', this.isActive),
    //         new FilterLink('page', this.currentPage),
    //         new FilterLink('pageSize', this.pageSize)
    //     ]);
    //     this.location.go(path, query);
    // }
}
