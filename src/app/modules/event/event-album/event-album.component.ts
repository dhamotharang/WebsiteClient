import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {EventAlbumViewmodel} from './viewmodel/event-album.viewmodel';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {UtilService} from '../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {ActivatedRoute} from '@angular/router';
import {EventAlbumFormComponent} from './event-album-form/event-album-form.component';
import {EventService} from '../event.service';
import {finalize} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-event-album',
    templateUrl: './event-album.component.html'
})

export class EventAlbumComponent extends BaseListComponent<EventAlbumViewmodel> implements OnInit {
    @ViewChild(EventAlbumFormComponent) eventAlbumForm: EventAlbumFormComponent;
    listAlbum: EventAlbumViewmodel[];
    eventId;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private location: Location,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef,
                private eventService: EventService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.EVENT, this.pageId.EVENT_LIST, 'Danh sách album',
            'Quản lý sự kiện');
        this.subscribers.routeParams = this.route.params.subscribe(params => {
            if (params.id) {
                this.eventId = params.id;
                this.search(1);
            }
        });
    }

    addAlbum() {
        this.eventAlbumForm.add(this.eventId);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.eventService
            .searchAlbum(this.eventId, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<EventAlbumViewmodel>) => {
                this.totalRows = result.items.length;
                this.listAlbum = result.items;
            });
    }

    edit(id: string) {
        this.eventAlbumForm.edit(this.eventId, id);
    }

    delete(id: string) {
        this.eventService.deleteEventAlbum(this.eventId, id)
            .subscribe((result: ActionResultViewModel) => {
                this.search(this.currentPage);
            });
    }
}
