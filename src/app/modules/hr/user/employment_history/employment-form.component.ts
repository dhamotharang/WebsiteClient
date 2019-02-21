///<reference path="../../../../validators/datetime.validator.ts"/>
/**
 * Created by HoangNH on 12/20/2016.
 */
import {Component, OnInit, Input, Output, Inject, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BaseComponent} from '../../../../base.component';
import {DateTimeValidator} from '../../../../validators/datetime.validator';
import {EmploymentHistory} from './employment-history.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {EmploymentHistoryService} from './employment-history.service';
import {TreeData} from '../../../../view-model/tree-data';
import {OfficePositionService} from '../../organization/office/services/office-position.service';
import {OfficeService} from '../../organization/office/services/office.service';

@Component({
    selector: 'employment-form',
    templateUrl: './employment-form.component.html',
    providers: [DateTimeValidator, OfficePositionService]
})
export class EmploymentHistoryFormComponent extends BaseComponent implements OnInit {
    @Input() listType = [];
    @Input() userId: string;
    @Output() onCloseForm = new EventEmitter();

    model: EmploymentHistory = new EmploymentHistory();
    modelForm: FormGroup;
    searchAfterCloseForm = false;
    officeTree = [];
    listTitle = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private dateTimeValidator: DateTimeValidator,
                private utilService: UtilService,
                private employmentService: EmploymentHistoryService,
                private officeTitleService: OfficePositionService,
                private officeService: OfficeService) {
        super();
        this.officeService.getTree().subscribe((result: any) => this.officeTree = result);
    }

    ngOnInit(): void {
        this.buildForm();
        this.modelForm.controls['officeId'].valueChanges.subscribe(x => {
            this.listTitle = [];
            if (x != null) {
                this.officeTitleService.search('', x, 1, 10000)
                    .subscribe((result: any) => {
                        this.listTitle = result.items.map((item) => {
                            return {id: item.titleId, name: item.titleName};
                        });
                    });
            }
        });
    }

    onSelectCompany(company: { id: number, name: string }) {
        this.modelForm.patchValue({companyId: company.id, companyName: company.name});
    }

    onSelectOfficeSearch(office: { id: number, name: string }) {
        this.modelForm.patchValue({officeId: office.id, officeName: office.name});
    }

    onSelectTitleSearch(title: { id: number, name: string }) {
        this.modelForm.patchValue({titleId: title.id, titleName: title.name});
    }

    onSelectOffice(office: TreeData) {
        this.modelForm.patchValue({officeName: office.text});
    }

    onSelectTitle(title: { id: number, name: string }) {
        this.modelForm.patchValue({titleId: title.id, titleName: title.name});
    }

    save() {
        this.isSubmitted = true;
        this.model = this.modelForm.value;
        const isValid = this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
        if (isValid) {
            this.isSaving = true;

            if (this.model.id && this.model.id !== -1) {
                this.employmentService.update(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists,
                                'Quá trình công tác đã tồn tại. Vui lòng kiểm tra lại'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Phòng ban'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Chức danh'));
                            return;
                        }

                        if (result === -4) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Công ty'));
                            return;
                        }

                        if (result === -5) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Quá trình công tác'));
                            return;
                        }

                        if (result === -6) {
                            this.toastr.error('Đến ngày không được trước từ ngày.');
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.onCloseForm.emit(true);
                            this.toastr.success(this.formatString(this.message.updateSuccess, 'quá trình công tác'));
                            return;
                        }

                        if (result === 0) {
                            this.toastr.warning('Vui lòng nhập nội dung cần thay đổi');
                            return;
                        }
                    });
            } else {
                this.model.userId = this.userId;
                this.employmentService.insert(this.model)
                    .subscribe((result) => {
                        this.isSaving = false;
                        if (result === -1) {
                            this.toastr.error(this.formatString(this.message.notExists,
                                'Quá trình công tác đã tồn tại. Vui lòng kiểm tra lại'));
                            return;
                        }

                        if (result === -2) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Phòng ban'));
                            return;
                        }

                        if (result === -3) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Chức danh'));
                            return;
                        }

                        if (result === -4) {
                            this.toastr.error(this.formatString(this.message.notExists, 'Công ty'));
                            return;
                        }

                        if (result === -5) {
                            this.toastr.error('Đến ngày không được trước từ ngày.');
                            return;
                        }

                        if (result === -6) {
                            this.toastr.error('Thông tin người dùng không tồn tại. Vui lòng kiểm tra lại.');
                            return;
                        }

                        if (result > 0) {
                            this.isSubmitted = false;
                            this.modelForm.reset();
                            this.modelForm.patchValue({id: -1, isCurrent: false});
                            this.searchAfterCloseForm = true;
                            this.toastr.success(this.formatString(this.message.insertSuccess, 'quá trình đào tạo'));
                            return;
                        }
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit(this.searchAfterCloseForm);
    }

    private buildForm() {
        this.formErrors = {
            'type': '',
            'fromDate': '',
            'toDate': '',
            'officeName': '',
            'titleName': '',
            'result': '',
        };

        this.validationMessages = {
            'type': {
                'required': 'Quá trình không được để trống.'
            },
            'officeName': {
                'required': 'Phòng ban không được để trống.',
                'maxlength': 'Tên Phòng ban không được vượt quá 250 ký tự.'
            },
            'titleName': {
                'required': 'Tên chức danh không được để trống.',
                'maxlength': 'Tên chức danh không được phép vượt quá 250 ký tự.'
            },
            'fromDate': {
                'required': 'Vui lòng chọn từ ngày',
                'notAfter': 'Từ ngày không thể sau đến ngày.',
                'isValid': 'Từ ngày không hợp lệ.'
            },
            'companyName': {
                'maxlength': 'Tên công ty không được phép vượt quá 250 ký tự.'
            },
            'toDate': {
                'notBefore': 'Đến ngày không thể trước từ ngày',
                'isValid': 'Đến ngày không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'note': {
                'maxlength': 'Ghi chú không được phép vượt quá 4000 ký tự.'
            }
        };
        this.modelForm = this.fb.group({
            'id': [this.model.id],
            'userId': [this.model.userId],
            'type': [this.model.type, [
                Validators.required
            ]],
            'officeId': [this.model.officeId],
            'officeName': [this.model.officeName, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'titleId': [this.model.titleId],
            'titleName': [this.model.titleName, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'companyId': [this.model.companyId],
            'companyName': [this.model.companyName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'fromDate': [this.model.fromDate, [
                Validators.required,
                Validators.maxLength(50),
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notAfter('toDate')
            ]],
            'toDate': [this.model.toDate, [
                this.dateTimeValidator.isValid,
                this.dateTimeValidator.notBefore('fromDate')
            ]],
            'note': [this.model.note, [
                Validators.maxLength(4000)
            ]],
            'isCurrent': [this.model.isCurrent],
        });

        this.modelForm.valueChanges.subscribe(data => this.utilService
            .onValueChanged(this.modelForm, this.formErrors, this.validationMessages, data));
        this.utilService.onValueChanged(this.modelForm, this.formErrors, this.validationMessages);
    }
}
