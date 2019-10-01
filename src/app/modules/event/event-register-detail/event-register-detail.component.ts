import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../base-form.component';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { EventService } from '../event.service';
import {
    EventRegisterDetailViewModel
} from '../event-register/event-register-detail.viewmodel';

@Component({
    selector: 'app-event-register-detail',
    templateUrl: './event-register-detail.component.html',
})

export class EventRegisterDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild('registerModal') registerModal: NhModalComponent;

    eventRegisterDetail: EventRegisterDetailViewModel;
    eventId: string;

    constructor(private eventService: EventService) {
        super();
    }

    ngOnInit() {
    }

    show(eventId: string, id: string) {
        this.id = id;
        this.eventId = eventId;
        this.getDetail();
        this.registerModal.open();
    }

    private getDetail() {
        this.subscribers.getEventRegisterDetail = this.eventService.getEventRegisterDetail(this.eventId, this.id)
            .subscribe((eventRegisterDetail: EventRegisterDetailViewModel) => {
                this.eventRegisterDetail = eventRegisterDetail;
            });
    }
}
