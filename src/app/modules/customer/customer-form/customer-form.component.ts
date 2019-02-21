import { EventEmitter, Input, Output, ViewChild, Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { BaseFormComponent } from '../../../base-form.component';
import { CustomerService } from '../service/customer.service';
import { UtilService } from '../../../shareds/services/util.service';
import { NumberValidator } from '../../../validators/number.validator';
import * as _ from 'lodash';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { DateTimeValidator } from '../../../validators/datetime.validator';
import { CustomerTranslation } from '../model/customer-translation.model';
import { finalize } from 'rxjs/internal/operators';
import { NationalService } from '../../hr/user/services/national.service';
import { Gender } from '../../hr/user/models/user.model';
import { PatientContact, ContactType } from '../model/patient-contact.model';
import { UserContact } from '../../hr/user/models/user-contact.model';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { CustomerDetailViewModel } from '../model/customer-detail.viewmodel';
import { JobService } from '../config/jobs/service/job.service';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Job } from '../config/jobs/models/job.model';
import { PatientResource } from '../config/patient-source/models/patient-resource.model';
import { PatientResourceService } from '../config/patient-source/service/patient-resource.service';
import { ContactPerson } from '../model/contact-person.model';
import { ISearchResult } from '../../../interfaces/isearch.result';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    providers: [CustomerService, NationalService, NumberValidator, DateTimeValidator,
        JobService, PatientResourceService]
})

export class CustomerFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('customerModal') customerModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    customer = new Customer();
    modelTranslation = new CustomerTranslation();
    listPatientResource = [];
    listJob = [];
    listNational = [];
    listProvince = [];
    listDistrict = [];
    listEthnic = [];
    listReligion = [];
    listContactPerson = [];
    listRelationshipTypes = [];
    enableSelectProvince = false;
    enableSelectDistrict = false;
    gender = Gender;
    listPatientContact: PatientContact[] = [];
    customerId;
    contactType = ContactType;
    urlSearchJobForSelect;
    urlJob;
    patientSourceUrl;
    tabNo = 0;

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                @Inject(APP_CONFIG) appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private customerService: CustomerService,
                private datetimeValidator: DateTimeValidator,
                private numberValidator: NumberValidator,
                private nationalService: NationalService,
                private jobService: JobService,
                private patientResourceService: PatientResourceService,
                private utilService: UtilService) {
        super();
        this.urlJob = `${appConfig.PATIENT_API_URL}jobs/`;
        this.patientSourceUrl = `${appConfig.PATIENT_API_URL}patientSources/`;
    }

    ngOnInit(): void {
        this.renderForm();
    }

    onModalShow() {
        this.nationalService.getAll().subscribe((result: any) => {
            this.listNational = result.listNationals.items;
            this.listEthnic = result.listEthnics.items;
            this.listReligion = result.listReligions.items;
        });
        this.getListJob();
        this.getListPatientSource();
        this.isModified = false;
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.resetForm();
        this.insertPatientContactDefault(this.contactType.mobilePhone);
        this.insertPatientContactDefault(this.contactType.email);
        this.insertDefaultContactPerson();
        this.customerModal.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.insertPatientContactDefault(this.contactType.mobilePhone);
        this.insertPatientContactDefault(this.contactType.email);
        // this.insertDefaultContactPerson();
        this.customerModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.customer = this.model.value;
            this.customer.patientContact = _.filter(this.listPatientContact, (item: PatientContact) => {
                return item.contactValue !== '' && item.contactValue !== undefined;
            });
            this.customer.contactPersons = _.filter(this.listContactPerson, (contactPerson: ContactPerson) => {
                return contactPerson.fullName && contactPerson.phoneNumber;
            });
            this.isSaving = true;
            if (this.isUpdate) {
                this.customerService
                    .update(this.id, this.customer)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.customerModal.dismiss();
                    });
            } else {
                this.customerService
                    .insert(this.customer)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.customerModal.dismiss();
                        }
                    });
            }
        }
    }

    onSelectNational(national) {
        this.enableSelectProvince = true;
        if (national) {
            this.getProvinceByNationalId(national.id);
        }
    }

    closeModal() {
        this.customerModal.dismiss();
    }

    onSelectEmployee(value) {
        if (value) {
        }
    }

    insertJob(value) {
        if (value) {
            const job = new Job();
            job.isActive = true;
            job.modelTranslations.push({
                jobId: 0,
                languageId: this.currentLanguage,
                name: value,
                description: '',
            });
            this.jobService.insert(job).subscribe((result: any) => {
                if (result) {
                    this.model.patchValue({jobId: result.data});
                }
            });
        }
    }

    insertPatientResource(value) {
        if (value) {
            const patientResource = new PatientResource();
            patientResource.isActive = true;
            patientResource.modelTranslations.push({
                patientResourceId: '',
                languageId: this.currentLanguage,
                name: value,
                description: '',
            });
            this.patientResourceService.insert(patientResource).subscribe((result: IActionResultResponse) => {
                if (result) {
                    this.model.patchValue({patientSourceId: result.data});
                }
            });
        }
    }

    changeTabView(tabNo: number) {
        this.tabNo = tabNo;
    }

    private getDetail(id: string) {
        this.subscribers.customerService = this.customerService
            .getDetail(id)
            .subscribe((result: IActionResultResponse<CustomerDetailViewModel>) => {
                    const customerDetail = result.data;
                    if (customerDetail) {
                        this.model.patchValue(customerDetail);
                        this.model.patchValue({address: customerDetail.address});
                        this.listContactPerson = customerDetail.contactPatients;
                        this.listPatientContact = customerDetail.patientContacts;
                        this.id = customerDetail.id;
                        if (customerDetail.nationalId) {
                            this.getProvinceByNationalId(customerDetail.nationalId);
                        }

                        if (customerDetail.provinceId) {
                            this.getDistrictByProvinceId(customerDetail.provinceId);
                        }
                        this.insertPatientContactDefault(this.contactType.mobilePhone);
                        this.insertPatientContactDefault(this.contactType.email);
                        this.insertDefaultContactPerson();
                    }
                }
            );
    }

    selectPatientContact(value) {
        if (value) {
            this.listPatientContact = value;
        }
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

    private getProvinceByNationalId(nationalId: number) {
        this.enableSelectProvince = true;
        this.nationalService.getProvinceByNational(nationalId).subscribe((result: ISearchResult<any>) => {
            this.listProvince = result.items;
        });
    }

    onProvinceSelect(province) {
        this.enableSelectDistrict = true;
        this.model.patchValue({provinceId: province.id});
        this.getDistrictByProvinceId(province.id);
    }

    private getDistrictByProvinceId(provinceId: number) {
        this.nationalService.getDistrictByProvinceId(provinceId).subscribe((result: ISearchResult<any>) => {
            this.enableSelectDistrict = true;
            this.listDistrict = result.items;
        });
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

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['fullName', 'customerCode', 'birthday',
            'gender', 'ethnicId', 'religionId', 'provinceId', 'districtId',
            'patientResourceId', 'idCardNumber', 'jobId', 'nationalId', 'address']);

        this.validationMessages = {
            'fullName': {
                'required': 'Tên người dùng không được để trống',
                'maxlength': 'Tên người dùng không được phép vượt quá 100 ký tự'
            },
            'birthday': {
                'required': 'Vui lòng chọn ngày sinh.',
                'isValid': 'Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'gender': {
                'required': 'Vui lòng chọn giới tính',
                'isValid': 'Giới tính không  hợp lệ. Vui lòng kiểm tra lại'
            },
            'ethnicId': {
                'isValid': 'Dân tộc không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'religionId': {
                'isValid': 'Tôn giáo không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'nationalId': {
                'isValid': 'Quốc gia không hợp lệ. Vui lòng kiểm tra lại'
            },
            'provinceId': {
                'isValid': 'Tỉnh/TP không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'districtId': {
                'isValid': 'Quận/Huyện không hợp lệ. Vui lòng kiểm tra lại'
            },
            'idCardNumber': {
                'maxlength': 'Số CMND không được phép vượt quá 30 ký tự.',
            },
            'jobId': {
                'isValid': 'Nghề nghiệp không hợp lệ. Vui lòng kiểm tra lại'
            },
            'patientResourceId': {},
            'address': {
                'maxLength': 'Địa chỉ không được  vượt quá 500 ký tự'
            }
        };

        this.model = this.fb.group({
            customerCode: [this.customer.customerCode],
            fullName: [this.customer.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            birthday: [this.customer.birthday, [
                Validators.required,
                this.datetimeValidator.isValid
            ]],
            gender: [this.customer.gender, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            ethnicId: [this.customer.ethnicId,
                [this.numberValidator.isValid]],
            religionId: [this.customer.religionId, [
                this.numberValidator.isValid
            ]],
            idCardNumber: [this.customer.idCardNumber, [
                Validators.maxLength(30)
            ]],
            nationalId: [this.customer.nationalId, [
                this.numberValidator.isValid
            ]],
            provinceId: [this.customer.provinceId, [
                this.numberValidator.isValid
            ]],
            districtId: [this.customer.districtId, [
                this.numberValidator.isValid
            ]],
            jobId: [this.customer.jobId, [
                this.numberValidator.isValid
            ]],
            patientResourceId: [this.customer.patientResourceId],
            address: [this.customer.address, [
                Validators.maxLength(500)
            ]],
            concurrencyStamp: [this.customer.concurrencyStamp],
            modelTranslations: this.fb.array([]),
        });

        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(['address']);
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {'address': ['maxlength']},
        ]);
        const pageTranslationModel = this.fb.group({
            languageId: [language],
            address: [this.modelTranslation.address, [
                Validators.maxLength(500)
            ]],
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return pageTranslationModel;
    }

    private insertDefaultContactPerson() {
        if (!this.listContactPerson || this.listContactPerson.length === 0) {
            const person = new ContactPerson();
            person.patientId = this.customerId;
            this.listContactPerson.push(person);
        }
    }

    private resetForm() {
        this.model.reset();
        this.model.patchValue({});
        this.listContactPerson = [];
        this.listPatientContact = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
        this.insertPatientContactDefault(this.contactType.mobilePhone);
        this.insertPatientContactDefault(this.contactType.email);
        this.insertDefaultContactPerson();
    }
}
