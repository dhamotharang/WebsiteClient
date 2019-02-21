import { Component, Inject, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../models/event.model';
import { EventDayViewModel } from '../view-models/event-day.viewmodel';
import { BaseFormComponent } from '../../../base-form.component';
import { EventTranslation } from '../models/event-translation.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html'
})

export class EventDetailComponent extends BaseFormComponent implements OnInit {
    eventDetail: Event;
    eventDays: EventDayViewModel[] = [];
    eventTranslations: EventTranslation[] = [];
    viewType = 0;


    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private eventService: EventService) {
        super();
        this.route.params.subscribe(params => {
            if (params.id) {
                this.id = params.id;
                this.getEventDetail();
            }
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.EVENT, this.pageId.EVENT_LIST, 'Chi tiết sự kiện',
            'Quản lý sự kiện');
    }

    changeViewType(viewType: number) {
        if (this.viewType === viewType) {
            return;
        }
        this.viewType = viewType;
        if (this.viewType === 0 && !this.eventDetail) {
            this.getEventDetail();
        }
    }

    private getEventDetail() {
        this.eventService.getDetail(this.id)
            .subscribe((result: Event) => this.eventDetail = result);
    }
}
