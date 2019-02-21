import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HelperService } from '../../../shareds/services/helper.service';
import { BaseListComponent } from '../../../base-list.component';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { PhotoService } from './photo.service';
import { AlbumViewModel } from './view-models/album.viewmodel';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./album.component.scss'],
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService]
})

export class PhotoComponent extends BaseListComponent<AlbumViewModel> implements OnInit, AfterViewInit {
    isActive: boolean;
    type;
    height;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private location: Location,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef,
                private photoService: PhotoService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.ALBUM, 'Thư viện ảnh',
            'Thư viện ảnh');
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<AlbumViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        // this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    addAlbum() {

    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderLink();
        this.listItems$ = this.photoService.search(this.keyword, this.isActive, this.type, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<AlbumViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    resetFormSearch() {
        this.isActive = null;
        this.keyword = '';
        this.type = '';
        this.search(1);
    }

    edit(id: string) {
        // this.videoFormComponent.edit(id);
    }

    detail(videoLinkId: string) {
        // this.videoDetailComponent.getDetail(videoLinkId);
    }

    delete(id: string) {
        this.photoService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                this.search(this.currentPage);
            });
    }

    private renderLink() {
        const path = '/gallery/album';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('type', this.type),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
