import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { EventDayViewModel } from '../view-models/event-day.viewmodel';
import { EventDayFormComponent } from '../event-day-form/event-day-form.component';
import { EventService } from '../event.service';
import { EventDay } from '../models/event-day.model';
import * as _ from 'lodash';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { EventDayDetailComponent } from '../event-day-detail/event-day-detail.component';

@Component({
    selector: 'app-event-day',
    templateUrl: './event-day.component.html',
    styleUrls: ['./event-day.component.css']
})
export class EventDayComponent extends BaseListComponent<EventDayViewModel> implements OnInit {
    @ViewChild(EventDayFormComponent) eventDayFormComponent: EventDayFormComponent;
    @ViewChild(EventDayDetailComponent) eventDayDetailComponent: EventDayDetailComponent;
    @Input() eventId: string;
    @Input() readonly = false;
    @Input() eventDays: EventDay[];

    constructor(private eventService: EventService) {
        super();
    }

    ngOnInit() {
        if (this.eventId) {
            this.getEventDays();
        }
    }

    onSaveSuccessful(eventDays: EventDay | EventDay[]) {
        this.getEventDays();
    }

    add() {
        this.eventDayFormComponent.add(this.eventId);
    }

    edit(id: string) {
        this.eventDayFormComponent.edit(this.eventId, id);
    }

    detail(id: string) {
        this.eventDayDetailComponent.showDetail(id);
    }

    delete(id: string) {
        if (!this.eventId) {
            return;
        }
        this.eventService.deleteEventDay(this.eventId, id)
            .subscribe((result: ActionResultViewModel) => {
                _.remove(this.listItems, (eventDay: EventDay) => {
                    return eventDay.id === id;
                });
            });
    }


    private getEventDays() {
        this.subscribers.eventDayRegisters = this.eventService.getEventDays(this.eventId)
            .subscribe((result: EventDayViewModel[]) => this.listItems = result);
    }
}
