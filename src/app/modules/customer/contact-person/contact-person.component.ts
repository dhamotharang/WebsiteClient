import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ContactPerson } from '../model/contact-person.model';
import { BaseListComponent } from '../../../base-list.component';
import { CustomerService } from '../service/customer.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';

@Component({
    selector: 'app-customer-contact-person',
    templateUrl: './contact-person.component.html'
})
export class ContactPersonComponent extends BaseListComponent<ContactPerson> {
    @Input() customerId: string;
    @Input() isDetail = false;
    @Input() isUpdate = true;
    @Input() listContactPerson: ContactPerson[] = [];
    @Output() selectListContactPerson = new EventEmitter<ContactPerson[]>();

    constructor(private toastr: ToastrService,
                private customerService: CustomerService) {
        super();
    }

    edit(contactPerson: ContactPerson) {
        if (!contactPerson.phoneNumber || contactPerson.fullName === undefined) {
            return this.toastr.error('FullName or PhoneNumber is not empty!');
        }
        if (contactPerson.id) {
            this.customerService.updateContactPerson(this.customerId, contactPerson.id, contactPerson).subscribe(() => {
            });
        } else {
            this.customerService.insertContactPerson(this.customerId, contactPerson).subscribe((result: IActionResultResponse) => {
                contactPerson.id = result.data;
                const person = new ContactPerson();
                person.patientId = this.customerId;
                this.listContactPerson.push(person);
            });
        }
    }

    delete(id: string) {
        if (this.customerId && id) {
            this.customerService.deleteContactPerson(this.customerId, id).subscribe((result: any) => {
                _.remove(this.listContactPerson, (item: ContactPerson) => {
                    return item.id === id;
                });
            });
        } else {
            _.remove(this.listContactPerson, (item: ContactPerson) => {
                return item.id === id;
            });
        }
    }

    add(contactPerson: ContactPerson) {
        if (!contactPerson.phoneNumber || contactPerson.fullName === undefined) {
            this.toastr.error('FullName or PhoneNumber is not empty!');
            return;
        }

        if (contactPerson.phoneNumber && this.validatePhone(contactPerson.phoneNumber)) {
            return;
        }
        const person = new ContactPerson();
        person.patientId = this.customerId;
        this.listContactPerson.push(person);
    }

    private validatePhone(phoneNumber: string) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
        return re.test(phoneNumber);
    }
}
