import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ContactService} from './service/contact.service';
import * as _ from 'lodash';
import {ContactFormComponent} from './contact-form/contact-form.component';
import {Contact} from './model/contact.model';
import {ToastrService} from 'ngx-toastr';
import {BaseListComponent} from '../../../base-list.component';
import {WorkStatus} from '../../../shareds/constants/work-status.const';
import {ContactType} from '../../../shareds/constants/contact-type.const';

@Component({
    selector: 'app-product-contact',
    templateUrl: './contact.component.html',
    providers: [ContactService]
})

export class ContactComponent extends BaseListComponent<Contact> {
    @ViewChild(ContactFormComponent) contactForm: ContactFormComponent;
    @Input() type = ContactType.supplier;
    @Input() listContact: Contact[];
    @Input() isUpdate: boolean;
    @Input() subjectId: string;
    @Input() isReadOnly = false;

    @Output() saveSuccess = new EventEmitter();

    workStatus = WorkStatus;

    constructor(private contactService: ContactService,
                private toastr: ToastrService) {
        super();
    }

    add() {
        this.contactForm.add();
    }

    delete(id: string) {
        if (this.isUpdate) {
            this.contactService.delete(id, this.type).subscribe(() => {
                _.remove(this.listContact, (item: Contact) => {
                    return item.id === id;
                });
            });
        } else {
            _.remove(this.listContact, (item: Contact) => {
                return item.id === id;
            });
        }
    }

    edit(contact: Contact) {
        this.contactForm.edit(contact);
    }

    updateSuccess(value: Contact) {
        if (value) {
            const listContactById = _.filter(this.listContact, (item: Contact) => {
                return item.id === value.id;
            });

            if (listContactById && listContactById.length > 0) {
                const contactById: Contact = _.head(listContactById);
                contactById.email = value.email;
                contactById.status = value.status;
                contactById.description = value.description;
                contactById.positionName = value.positionName;
                contactById.phoneNumber = value.phoneNumber;
                contactById.fullName = value.fullName;
                contactById.concurrencyStamp = value.concurrencyStamp;
            }

            this.saveSuccess.emit(this.listContact);
        }
    }

    addSuccess(value: Contact) {
        if (value) {
            const countContact = _.countBy(this.listContact, (item: Contact) => {
                return item.phoneNumber === value.phoneNumber && item.fullName === value.fullName;
            }).true;

            if (!countContact || countContact === 0) {
                if (!this.subjectId) {
                    value.id = (this.listContact.length + 1).toString();
                }
                this.listContact.push(value);
                this.saveSuccess.emit(this.listContact);
            } else {
                this.toastr.error('User already exists');
            }
        }
    }

    confirm(value: Contact) {
        this.delete(value.id);
    }
}
