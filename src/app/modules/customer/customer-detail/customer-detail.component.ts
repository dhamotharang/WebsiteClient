import {Component, ViewChild} from '@angular/core';
import {CustomerDetailViewModel} from '../model/customer-detail.viewmodel';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {CustomerService, Gender} from '../service/customer.service';
import {ContactType, PatientContact} from '../model/patient-contact.model';
import {JobService} from '../config/jobs/service/job.service';
import {PatientResourceService} from '../config/patient-source/service/patient-resource.service';
import {IActionResultResponse} from '../../../interfaces/iaction-result-response.result';
import {ContactPerson} from '../model/contact-person.model';
import * as _ from 'lodash';
import {UserContact} from '../model/customer-contact.model';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    providers: [CustomerService, JobService, PatientResourceService]
})

export class CustomerDetailComponent {
    @ViewChild('customerDetailModal') customerDetailModal: NhModalComponent;
    tabNo = 1;
    customerDetail = new CustomerDetailViewModel();
    gender = Gender;
    listPatientContact = [];
    contactType = ContactType;
    listPatientResource = [];
    listJob = [];
    listTypeRelationship = [];
    listContactPerson = [];

    constructor(private jobService: JobService,
                private patientResourceService: PatientResourceService,
                private customerService: CustomerService) {
    }

    onModalShow() {
        this.getListJob();
        this.getListPatientSource();
    }

    clickTabNo(tabNo) {
        this.tabNo = tabNo;
    }

    closeModal() {
        this.customerDetailModal.dismiss();
    }

    getDetail(id: string) {
        this.customerService
            .getDetail(id)
            .subscribe((result: IActionResultResponse<CustomerDetailViewModel>) => {
                    if (result.data) {
                        this.customerDetail = result.data;
                        this.listContactPerson = result.data.contactPatients;
                        this.listPatientContact = result.data.patientContacts;
                        this.insertPatientContactDefault(this.contactType.mobilePhone);
                        this.insertPatientContactDefault(this.contactType.email);
                        this.insertDefaultContactPerson();
                    }
                    this.customerDetailModal.open();
                }
            );
    }

    private getListJob() {
        this.jobService.searchForSelect('', 1, 20).subscribe(result => {
            this.listJob = result;
        });
    }

    private getListPatientSource() {
        this.patientResourceService.searchForSelect('', 1, 20).subscribe(result => {
            this.listPatientResource = result;
        });
    }

    private insertPatientContactDefault(contactType: number) {
        const listPatientContact = _.filter(this.listPatientContact, (item: UserContact) => {
            return item.contactType === contactType;
        });
        if (!listPatientContact || listPatientContact.length === 0) {
            const item = new PatientContact();
            item.contactType = contactType;
            item.contactValue = '';
            this.listPatientContact.push(item);
        }
    }

    private insertDefaultContactPerson() {
        if (!this.listContactPerson || this.listContactPerson.length === 0) {
            const person = new ContactPerson();
            person.id = this.customerDetail.id;
            this.listContactPerson.push(person);
        }
    }
}
