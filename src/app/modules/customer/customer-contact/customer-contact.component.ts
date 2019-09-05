import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientContact } from '../model/patient-contact.model';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../service/customer.service';
import { finalize } from 'rxjs/internal/operators';
import * as _ from 'lodash';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import {ContactType, UserContact} from '../model/customer-contact.model';

@Component({
    selector: 'app-patient-contact',
    templateUrl: './customer-contact.component.html'
})

export class CustomerContactComponent implements OnInit {
    @Input() customerId;
    @Input() listPatientContact: PatientContact[];
    @Input() type;
    @Input() isUpdate;
    @Input() label = 'Mobile';
    @Input() placeholder = '';
    @Input() isDetail = false;
    @Output() onSelectPatientContact = new EventEmitter<PatientContact[]>();
    contactType = ContactType;

    constructor(private toastr: ToastrService,
                private customerService: CustomerService) {
    }

    ngOnInit() {
    }

    add(patientContact: PatientContact) {
        if (patientContact.contactValue === '' || patientContact.contactValue === undefined) {
            return this.toastr.error(this.label + ' is not empty!');
        }

        if (patientContact.contactValue && this.type === this.contactType.email && !this.validateEmail(patientContact.contactValue)) {
            return;
        }

        if (patientContact.contactValue && this.type === this.contactType.mobilePhone
            && !this.validatePhoneNumber(patientContact.contactValue)) {
            return;
        }

        const countPatientContact = _.filter(this.listPatientContact, (item: UserContact) => {
            return item.contactType === patientContact.contactType && item.contactValue === patientContact.contactValue;
        });

        if (countPatientContact && countPatientContact.length > 1) {
            this.toastr.error(this.label + ' already exists!');
            return;
        }

        if (!this.customerId || patientContact.id) {
            const patientContactInsert = new PatientContact();
            patientContactInsert.contactValue = '';
            patientContactInsert.contactType = this.type;
            patientContactInsert.patientId = this.customerId;
            patientContactInsert.id = '';
            this.listPatientContact.push(patientContactInsert);
            this.onSelectPatientContact.emit(this.listPatientContact);
        } else {
            if (patientContact.id === '') {
                this.customerService.insertPatientContact(this.customerId, patientContact).pipe(finalize(() => {
                }))
                    .subscribe((result: IActionResultResponse) => {
                        patientContact.id = result.data;
                        const patientContactInsert = new PatientContact();
                        patientContactInsert.contactValue = '';
                        patientContactInsert.contactType = this.type;
                        patientContactInsert.patientId = this.customerId;
                        patientContactInsert.id = '';
                        this.listPatientContact.push(patientContactInsert);
                        this.onSelectPatientContact.emit(this.listPatientContact);
                    });
            }
        }
    }

    delete(patientContact: PatientContact) {
        if (patientContact) {
            if (!this.customerId || !patientContact.id) {
                _.remove(this.listPatientContact, (item: PatientContact) => {
                    return item.contactValue === patientContact.contactValue && item.contactType === patientContact.contactType;
                });
                this.onSelectPatientContact.emit(this.listPatientContact);
            } else {
                this.customerService.deletePatientContact(this.customerId, patientContact.id).subscribe(() => {
                    _.remove(this.listPatientContact, (item: UserContact) => {
                        return item.contactValue === patientContact.contactValue && item.contactType === patientContact.contactType;
                    });
                    this.onSelectPatientContact.emit(this.listPatientContact);
                });
            }
        }
    }

    onKeyPress(patientContact: PatientContact, event) {
        if (event.keyCode === 13) {
            if (this.customerId && this.isUpdate) {
                this.updatePatientContact(patientContact);
            } else {
                this.add(patientContact);
            }
            event.preventDefault();
        }
    }

    updatePatientContact(patientContact: PatientContact) {
        if (patientContact.contactValue === '' || patientContact.contactValue === undefined) {
            return this.toastr.error(this.label + ' is not empty!');
        }

        if (patientContact.contactValue && this.type === this.contactType.email && !this.validateEmail(patientContact.contactValue)) {
            return;
        }

        if (patientContact.contactValue && this.type === this.contactType.mobilePhone
            && !this.validatePhoneNumber(patientContact.contactValue)) {
            return;
        }

        const countPatientContact = _.filter(this.listPatientContact, (item: UserContact) => {
            return item.contactType === patientContact.contactType && item.contactValue === patientContact.contactValue;
        });

        if (countPatientContact && countPatientContact.length > 1) {
            this.toastr.error(this.label + ' already exists!');
            return;
        }

        if (this.customerId) {
            countPatientContact.customer = this.customerId;
            this.customerService.updatePatientContact(this.customerId, patientContact.id, patientContact).subscribe((result: any) => {
                this.onSelectPatientContact.emit(this.listPatientContact);
            });
        }
    }

    private removeContact(contactId: string) {
        _.remove(this.listPatientContact, (contact: PatientContact) => {
            return contact.id === contactId;
        });
    }

    private validateEmail(email) {
        const re = /^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
        return re.test(email);
    }

    private validatePhoneNumber(phoneNumber) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
        return re.test(phoneNumber);
    }
}
