import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccompanyPerson, EventDayRegister, EventRegister} from '../models/event-register.model';
import {EventService} from '../event.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {EventDayViewModel} from '../view-models/event-day.viewmodel';
import * as _ from 'lodash';
import {Pattern} from '../../../shareds/constants/pattern.const';
import {UtilService} from '../../../shareds/services/util.service';
import {MatSnackBar} from '@angular/material';
import {CustomerService} from '../../customer/service/customer.service';
import {SuggestionViewModel} from '../../../shareds/view-models/SuggestionViewModel';
import {ToastrService} from 'ngx-toastr';
import {EventDayRegisterViewModel, EventRegisterDetailViewModel} from './event-register-detail.viewmodel';
import {NumberValidator} from '../../../validators/number.validator';
import {RegisterRole} from '../../../shareds/constants/register-role.conts';
import {ExplorerItem} from '../../../shareds/components/ghm-file-explorer/explorer-item.model';

@Component({
    selector: 'app-event-register',
    templateUrl: './event-register.component.html',
    providers: [CustomerService, NumberValidator]
})

export class EventRegisterComponent extends BaseFormComponent implements OnInit {
    @ViewChild('registerFormModal', {static: true}) registerFormModal: NhModalComponent;

    eventRegister = new EventRegister();
    eventRegisterDay = new EventDayRegister();
    accompanyPerson = new AccompanyPerson();
    eventRegisterDays: EventDayRegister[] = [];
    eventId: string;
    isSelectAll = false;
    accompanyPersonCopied: AccompanyPerson;
    isUpdateAccompanyPerson = false;
    customerSuggestion: SuggestionViewModel<string>[];

    accompanyFormErrors = [];
    accompanyValidationMessages = [];

    registerRole = RegisterRole;

    registerRoles = [
        {id: RegisterRole.customer, name: 'Customer'},
        {id: RegisterRole.invitation, name: 'Invitation'},
        {id: RegisterRole.walkInGuest, name: 'Walk In Guest'},
        {id: RegisterRole.professional, name: 'Professional'},
        {id: RegisterRole.sponsor, name: 'Sponsor'},
    ];

    constructor(private snackBar: MatSnackBar,
                private fb: FormBuilder,
                private utilService: UtilService,
                private numberValidator: NumberValidator,
                private toastr: ToastrService,
                private eventService: EventService,
                private customerService: CustomerService) {
        super();
    }

    get eventDayRegisters(): FormArray {
        return this.model.get('eventDayRegisters') as FormArray;
    }

    onCustomerSelected(event) {
        this.model.patchValue({
            userId: event.id,
            phoneNumber: event.phoneNumber,
            email: event.email,
            fullName: event.name
        });
    }

    onCustomerRemoved() {
        this.model.patchValue({
            userId: '',
            phoneNumber: '',
            email: '',
            fullName: ''
        });
    }

    onSearchCustomer(event) {
        this.customerService.suggestions(event)
            .subscribe((result: SuggestionViewModel<string>[]) => this.customerSuggestion = result);
        this.model.patchValue({
            phoneNumber: event
        });
    }

    getAccompanyPersonModel(mode: FormGroup): FormGroup {
        return mode.get('accompanyPerson') as FormGroup;
    }

    onModalHidden() {
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    ngOnInit() {
        this.buildForm();
    }

    add(eventId: string) {
        this.eventId = eventId;
        this.isUpdate = false;
        this.clearEventDayFormArray();
        this.subscribers.geteventDayRegisters = this.eventService.getAllActiveEventDays(this.eventId)
            .subscribe((result: EventDayViewModel[]) => {
                this.eventRegisterDays = [];
                _.each(result, (eventDay: EventDayViewModel) => {
                    this.eventDayRegisters.push(
                        this.buildEventDayForm(eventDay.id, eventDay.name, eventDay.eventDate)
                    );
                });
            });
        this.registerFormModal.open();
    }

    edit(eventId: string, id: string) {
        this.id = id;
        this.eventId = eventId;
        this.isUpdate = true;
        this.getDetail();
        this.registerFormModal.open();
    }

    changSelectAll() {
        this.isSelectAll = !this.isSelectAll;
        _.each(this.eventDayRegisters.controls, (eventDayModel: FormGroup) => {
            eventDayModel.patchValue({
                isSelected: !eventDayModel.value.isSelected
            });
        });
    }

    changeSelectStatus(eventDayModel: FormGroup) {
        // eventRegisterDay.isSelected = !eventRegisterDay.isSelected;
        const isSelected = !eventDayModel.get('isSelected').value;
        eventDayModel.patchValue({
            isSelected: isSelected
        });
        this.updateCheckAll();
        if (isSelected) {
            this.focusOnNameInput('fullName' + eventDayModel.value.eventDayId);
        }
    }

    onSelectedImage(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({
                avatar: file.absoluteUrl,
            });
        }
    }

    removeThumbnail() {
        this.model.patchValue({
            avatar: null
        });
    }

    save() {
        const isValid = this.validateModel(true);
        const selectedCount = this.getSelectedEventDayCount();
        if (!selectedCount) {
            this.formErrors['eventDayRegisters'] = 'required';
        }
        if (isValid && selectedCount > 0) {
            this.eventRegister = this.model.value;
            if (this.isUpdate) {
                this.eventService
                    .updateRegister(this.eventId, this.id, this.eventRegister)
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.toastr.success(result.message);
                        this.registerFormModal.dismiss();
                    });
            } else {
                this.eventService
                    .register(this.eventId, this.eventRegister)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                            return;
                        }
                        this.registerFormModal.dismiss();
                    });
            }
        }
    }

    saveAccompanyPerson(eventDay: FormGroup): boolean {
        const eventDayId = eventDay.value.eventDayId;
        const accompanyPersonModel = this.getAccompanyPersonModel(eventDay);
        const accompanyPersonModelValue = accompanyPersonModel.value;
        const isValid = this.validateFormGroup(accompanyPersonModel, this.accompanyFormErrors[eventDayId],
            this.accompanyValidationMessages[eventDayId], true);
        if (!isValid) {
            return false;
        }
        const accompanyPersons = eventDay.get('accompanyPersons').value;
        // Check phone number exists.
        const existsByPhoneNumber = _.countBy(accompanyPersons, (accompanyPerson: AccompanyPerson) => {
            return accompanyPerson.phoneNumber === accompanyPersonModelValue.phoneNumber
                && accompanyPerson.id !== accompanyPersonModelValue.id;
        }).true;
        if (existsByPhoneNumber > 0) {
            this.snackBar.open('Accompany person already exists.', '', {
                duration: 2500
            });
            return false;
        }
        // Check email exists.
        const existsByEmail = _.countBy(accompanyPersons, (accompanyPerson: AccompanyPerson) => {
            return accompanyPerson.email === accompanyPersonModelValue.email
                && accompanyPerson.id !== accompanyPersonModelValue.id;
        }).true;
        if (existsByEmail > 0) {
            return;
        }

        if (this.isUpdateAccompanyPerson) {
            const currentAccompanyPerson = _.find(accompanyPersons, (accompanyPerson: AccompanyPerson) => {
                return accompanyPerson.id === accompanyPersonModelValue.id;
            });
            if (currentAccompanyPerson) {
                currentAccompanyPerson.fullName = accompanyPersonModelValue.fullName;
                currentAccompanyPerson.phoneNumber = accompanyPersonModelValue.phoneNumber;
            }
        } else {
            accompanyPersons.push(_.cloneDeep(accompanyPersonModelValue));
            eventDay.patchValue({
                accompanyPersons: accompanyPersons
            });
        }
        accompanyPersonModel.patchValue(new AccompanyPerson());
        this.clearFormError(this.accompanyFormErrors[eventDayId]);
        this.isUpdateAccompanyPerson = false;
        return true;
    }

    copyAccompanyPerson(accompanyPerson: AccompanyPerson) {
        this.accompanyPersonCopied = accompanyPerson;
        this.snackBar.open('Copied', '', {
            duration: 2500
        });
    }

    pasteAccompanyPerson(eventDayModel: FormGroup) {
        const accompanyPersonModel = this.getAccompanyPersonModel(eventDayModel) as FormGroup;
        accompanyPersonModel.patchValue(this.accompanyPersonCopied);
        this.saveAccompanyPerson(eventDayModel);
    }

    accompanyModel(model: FormGroup) {
        return model.get('accompanyPersons');
    }

    editAccompanyPerson(eventDayModel: FormGroup, accompanyPerson: AccompanyPerson) {
        this.isUpdateAccompanyPerson = true;
        const accompanyPersonModel = this.getAccompanyPersonModel(eventDayModel) as FormGroup;
        accompanyPersonModel.patchValue(accompanyPerson);
    }

    removeAccompanyPerson(eventDay: EventDayRegister, accompanyPerson: AccompanyPerson) {
        _.remove(eventDay.accompanyPersons, accompanyPerson);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['phoneNumber', 'avatar', 'fullName', 'email', 'address', 'note', 'eventDayRegisters', 'role']);
        this.validationMessages = this.renderFormErrorMessage([
            {'phoneNumber': ['required', 'maxlength', 'pattern']},
            {'fullName': ['required', 'maxlength']},
            {'email': ['maxlength', 'pattern']},
            {'address': ['maxlength']},
            {'note': ['maxlength']},
            {'eventDayRegisters': ['required']},
            {'role': ['required', 'isValid']},
            {
                'avatar': ['maxlength',
                ]
            },
        ]);

        this.model = this.fb.group({
            userId: [this.eventRegister.userId],
            avatar: [this.eventRegister.avatar, [Validators.maxLength(500)]],
            phoneNumber: [this.eventRegister.phoneNumber, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)
            ]],
            fullName: [this.eventRegister.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            email: [this.eventRegister.email, [
                Validators.maxLength(500),
                Validators.pattern(Pattern.email)
            ]],
            address: [this.eventRegister.address, [
                Validators.maxLength(500)
            ]],
            note: [this.eventRegister.note, [
                Validators.maxLength(500)
            ]],
            role: [this.eventRegister.role, [Validators.required, this.numberValidator.isValid]],
            concurrencyStamp: [this.eventRegister.concurrencyStamp],
            eventDayRegisters: this.fb.array([], [
                Validators.required
            ])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.model.patchValue({
            userId: '',
            phoneNumber: '',
            fullName: '',
            email: '',
            address: '',
            note: '',
            avatar: '',
            role: RegisterRole.walkInGuest
        });
        // this.eventDayRegisters.controls.forEach((eventDayModel: FormGroup) => {
        //     eventDayModel.patchValue({
        //         isSelected: false,
        //         accompanyPersons: [],
        //         accompanyPerson: this.buildAccompanyPersonForm(eventDayModel.value.eventDayId)
        //     });
        // });
        this.clearFormError(this.formErrors);
    }

    private updateCheckAll() {
        const eventDayRegisters = this.eventDayRegisters.controls;
        this.isSelectAll = _.countBy(eventDayRegisters, (eventDayModel: FormGroup) => {
            return eventDayModel.value.isSelected;
        }).true === eventDayRegisters.length;
    }

    private buildEventDayForm(id: string, name: string, date: string, isSelected: boolean = false,
                              accompanyPersons: AccompanyPerson[] = []): FormGroup {
        const eventDayForm = this.fb.group({
            eventDayId: [id],
            eventDayName: [name],
            eventDayDate: [date],
            isSelected: [isSelected],
            accompanyPerson: this.buildAccompanyPersonForm(id),
            accompanyPersons: [accompanyPersons]
        });
        eventDayForm.valueChanges.subscribe(() => this.validateModel(false));
        return eventDayForm;
    }

    private buildAccompanyPersonForm(eventId: string): FormGroup {
        const accompanyPersonId = this.utilService.generateRandomNumber().toString();
        this.accompanyFormErrors[eventId] = this.renderFormError(['fullName', 'phoneNumber', 'email']);
        this.accompanyValidationMessages[eventId] = this.renderFormErrorMessage([
            {'fullName': ['required', 'maxlength', 'pattern']},
            {'phoneNumber': ['required', 'maxlength', 'pattern']},
            {'email': ['maxlength', 'pattern']}
        ]);
        const accompanyPersonModel = this.fb.group({
            id: [accompanyPersonId],
            fullName: [this.accompanyPerson.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            phoneNumber: [this.accompanyPerson.phoneNumber, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)
            ]],
            email: [this.accompanyPerson.email, [
                Validators.maxLength(50),
                Validators.pattern(Pattern.email)
            ]],
        });
        accompanyPersonModel.valueChanges.subscribe(
            () => this.validateFormGroup(accompanyPersonModel,
                this.accompanyFormErrors[eventId],
                this.accompanyValidationMessages[eventId],
                false));
        return accompanyPersonModel;
    }

    private focusOnNameInput(id: string) {
        this.utilService.focusElement(id);
    }

    private getSelectedEventDayCount() {
        return _.countBy(this.eventDayRegisters.controls, (eventDayModel: FormGroup) => {
            return eventDayModel.value.isSelected;
        }).true;
    }

    private clearEventDayFormArray() {
        while (this.eventDayRegisters.controls.length !== 0) {
            this.eventDayRegisters.removeAt(0);
        }
    }

    private getDetail() {
        this.eventService.getEventRegisterDetail(this.eventId, this.id)
            .subscribe((result: EventRegisterDetailViewModel) => {
                this.model.patchValue({
                    id: result.id,
                    userId: result.userId,
                    fullName: result.fullName,
                    address: result.address,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    concurrencyStamp: result.concurrencyStamp,
                    note: result.note,
                    role: result.role,
                    avatar: result.avatar
                });
                this.clearEventDayFormArray();
                if (result.eventDayRegisters) {
                    result.eventDayRegisters.forEach((eventDayRegister: EventDayRegisterViewModel) => {
                        this.eventDayRegisters.push(
                            this.buildEventDayForm(
                                eventDayRegister.eventDayId,
                                eventDayRegister.eventDayName,
                                eventDayRegister.eventDayDate,
                                eventDayRegister.isSelected,
                                eventDayRegister.accompanyPersons)
                        );
                    });
                }
            });
    }
}
