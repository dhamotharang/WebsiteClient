import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { EventViewModel } from '../view-models/event.viewmodel';
import { finalize } from 'rxjs/operators';
import { EventService } from '../event.service';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { ActivatedRoute } from '@angular/router';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { EventStatus } from '../constants/event-status.const';
import * as _ from 'lodash';
import { EventRegisterComponent } from '../event-register/event-register.component';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html'
})

export class EventListComponent extends BaseListComponent<EventViewModel> implements OnInit {
    @ViewChild(EventRegisterComponent) eventRegisterComponent: EventRegisterComponent;
    startDate: string;
    endDate: string;
    isActive: boolean;
    errorMessage: string;
    listSelectedEvents: string[] = [];
    status = EventStatus;
    searchStatus?: number;
    creatorId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private eventService: EventService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.EVENT, this.pageId.EVENT_LIST, 'Danh sách sự kiện', 'Quản lý sự kiện');
        this.subscribers.getListItems = this.route.data
            .subscribe((result: { data: SearchResultViewModel<EventViewModel> }) => {
                const data = result.data;
                if (data) {
                    this.totalRows = data.totalRows;
                    this.listItems = data.items;
                }
            });
    }

    onCreatorSelected(user: any) {
        this.creatorId = user ? user.id : '';
    }

    onRemoveCreator() {
        this.creatorId = null;
    }

    refresh() {
        this.keyword = '';
        this.startDate = null;
        this.endDate = null;
        this.isActive = null;
        this.search(1);
    }

    changeStatus(id: string, status: number, declineReason?: any) {
        this.eventService.updateStatus(id, status, declineReason)
            .subscribe((result: ActionResultViewModel) => {
                const eventInfo = _.find(this.listItems, (item: EventViewModel) => {
                    return item.id === id;
                });
                if (eventInfo) {
                    eventInfo.status = status;
                    eventInfo.declineReason = _.cloneDeep(declineReason);
                }
            });
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.subscribers.getListItems = this.eventService
            .search(this.keyword, this.startDate, this.endDate, this.creatorId, this.searchStatus,
                this.isActive, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false)
            ).subscribe((result: SearchResultViewModel<EventViewModel>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
    }

    delete(id: string) {
        this.subscribers.delete = this.eventService.delete(id)
            .subscribe((result: ActionResultViewModel) => this.search(this.currentPage));
    }

    report(id: string) {

    }

    updateStatus(status: number) {
        if (this.listSelectedEvents.length === 0) {
            this.errorMessage = 'choose_event';
            return;
        }

        this.subscribers.updateMultipleStatus = this.eventService.updateMultipleStatus(
            this.listSelectedEvents.map((id: string) => {
                return {
                    id: id,
                    status: status
                };
            })
        ).subscribe((result: ActionResultViewModel) => {
            this.search(this.currentPage);
        });
    }

    deleteMultiple() {
        if (this.listSelectedEvents.length === 0) {
            this.errorMessage = 'choose_event';
            return;
        }

        this.subscribers.updateMultipleStatus = this.eventService.deleteMultiple(
            this.listSelectedEvents.map((id: string) => {
                return id;
            })
        ).subscribe((result: ActionResultViewModel) => {
            this.search(this.currentPage);
        });
    }

    register(eventId: string) {
        this.eventRegisterComponent.add(eventId);
    }
}
