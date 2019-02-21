import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../../base-list.component';
import { OfficeContact } from '../models/office-contact.model';
import { OfficeContactFormComponent } from './office-contact-form.component';
import { OfficeService } from '../services/office.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-office-contact',
    templateUrl: './office-contact.component.html'
})

export class OfficeContactComponent extends BaseListComponent<OfficeContact> implements OnInit {
    @ViewChild(OfficeContactFormComponent) officeContactFormComponent: OfficeContactFormComponent;
    @Input() officeId: number;
    @Input() officeContacts: OfficeContact[] = [];

    constructor(private officeService: OfficeService) {
        super();
    }

    ngOnInit() {
    }

    onSaveSuccess(officeContact: OfficeContact) {
        const officeContactInfo = _.find(this.officeContacts, (contact: OfficeContact) => {
            return contact.id === officeContact.id;
        });
        if (officeContactInfo) {
            officeContactInfo.userId = officeContact.userId;
            officeContactInfo.fullName = officeContact.fullName;
            officeContactInfo.avatar = officeContact.avatar;
            officeContactInfo.phoneNumber = officeContact.phoneNumber;
            officeContactInfo.email = officeContact.email;
            officeContactInfo.fax = officeContact.fax;
        } else {
            this.officeContacts.push(officeContact);
        }
    }

    add() {
        this.officeContactFormComponent.add();
    }

    edit(officeContact: OfficeContact) {
        this.officeContactFormComponent.edit(officeContact);
    }

    delete(contactId: string) {
        if (this.officeId) {
            this.subscribers.deleteContact = this.officeService.deleteContact(this.officeId, contactId)
                .subscribe(() => {
                    this.removeContact(contactId);
                });
        } else {
            this.removeContact(contactId);
        }
    }

    private removeContact(contactId: string) {
        _.remove(this.officeContacts, (contact: OfficeContact) => {
            return contact.id === contactId;
        });
    }
}
