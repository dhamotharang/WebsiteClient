import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {EventService} from '../event.service';
import {EventRegisterDayViewModel, EventRegisterListViewModel} from './event-register-list.viewmodel';
import {ActivatedRoute} from '@angular/router';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {finalize} from 'rxjs/operators';
import {EventRegisterComponent} from '../event-register/event-register.component';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {EventRegisterStatus} from '../constants/event-status.const';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {EventRegisterDetailComponent} from '../event-register-detail/event-register-detail.component';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-event-register-list',
    templateUrl: './event-register-list.component.html'
})

export class EventRegisterListComponent extends BaseListComponent<EventRegisterListViewModel> implements OnInit {
    @ViewChild(EventRegisterComponent) eventRegisterComponent: EventRegisterComponent;
    @ViewChild(EventRegisterDetailComponent) eventRegisterDetailComponent: EventRegisterDetailComponent;
    eventId: string;
    statusSearch: number;
    status = EventRegisterStatus;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private eventService: EventService) {
        super();

        this.subscribers.routeParams = this.route.params.subscribe(params => {
            if (params.id) {
                this.eventId = params.id;
                this.search(1);
            }
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.EVENT, this.pageId.EVENT_LIST, 'Danh sách người tham gia',
            'Quản lý sự kiện');
    }

    onSaveSuccessful() {
        this.search(this.currentPage);
    }

    changeStatus(eventDay: EventRegisterDayViewModel, status: number) {
        eventDay.status = status;
        this.eventService.updateEventRegisterStatus(this.eventId, eventDay.id, eventDay.registerId, status)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
            });
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.subscribers.search = this.eventService
            .searchRegister(this.eventId, this.keyword, this.statusSearch, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<EventRegisterListViewModel>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
                console.log(this.listItems);
            });
    }

    refresh() {
        this.keyword = '';
        this.status = null;
        this.search(1);
    }

    register() {
        this.eventRegisterComponent.add(this.eventId);
    }

    showDetail(registerId: string) {
        this.eventRegisterDetailComponent.show(this.eventId, registerId);
    }

    edit(registerId: string) {
        this.eventRegisterComponent.edit(this.eventId, registerId);
    }

    delete(item: EventRegisterListViewModel) {
        this.eventService.deleteEventRegister(item.eventId, item.id).subscribe(() => {
            _.remove(this.listItems, (register: EventRegisterListViewModel) => {
                return register.id === item.id;
            });
        });
    }
}
