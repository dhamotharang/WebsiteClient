import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { EventDay } from '../models/event-day.model';
import { BaseFormComponent } from '../../../base-form.component';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { EventService } from '../event.service';

@Component({
    selector: 'app-event-day-detail',
    templateUrl: './event-day-detail.component.html'
})

export class EventDayDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild('eventDayDetailModal') eventDayDetailModal: NhModalComponent;
    @Input() eventId: string;

    eventDayDetail: EventDay;

    constructor(private eventService: EventService) {
        super();
    }

    ngOnInit() {
    }

    showDetail(id: string) {
        this.eventDayDetailModal.open();
        this.eventService.getEventDayDetail(this.eventId, id)
            .subscribe(result => this.eventDayDetail = result);
    }
}
