import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { OvertimeRegister } from './overtime-register.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { BaseFormComponent } from '../../../base-form.component';

@Component({
    selector: 'app-timekeeping-overtime-register',
    templateUrl: './timekeeping-overtime-register.component.html',
})
export class TimekeepingOvertimeRegisterComponent extends BaseFormComponent implements OnInit {
    @ViewChild('registerFormModal') registerFormModal: NhModalComponent;
    @ViewChild('detailModal') detailModal: NhModalComponent;
    listMonth = [];
    listYear = [];
    overtimeRegister = new OvertimeRegister();
    listOvertimeRegisters: OvertimeRegister[] = [];
    model: FormGroup;


    STATUS = {
        WAITING_FOR_MANAGER_APRPOVE: 0,
        MANAGER_APPROVE: 1,
        MANAGER_DECLINE: 2
    };

    constructor( @Inject(PAGE_ID) pageId: IPageId,
        private title: Title,
        private fb: FormBuilder,
        private utilService: UtilService) {
        super();
        this.title.setTitle('Danh sách làm thêm giờ.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_OVERTIME, 'Chấm công', 'Danh sách làm thêm giờ.');
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.renderFormValidation();
        this.builForm();

        this.listMonth = this.utilService.initListMonth();
        this.listYear = this.utilService.initListYear();
    }

    search(currentPage: number) {
        // this.currentPage = currentPage;
        // this.isSearching = true;
    }

    edit(overtimeRegister: OvertimeRegister) {
        this.model.patchValue(overtimeRegister);
        this.registerFormModal.open();
    }

    detail(overtimeRegister: OvertimeRegister) {
        this.overtimeRegister = overtimeRegister;
        this.detailModal.open();
    }

    delete(overtimeRegister: OvertimeRegister) {

    }

    approve(overtimeRegister: OvertimeRegister, isApprove: boolean) {
        if (!isApprove) {
            swal({
                title: `Bạn có chắc chắn muốn không duyệt cho đơn đăng ký làm thêm giờ của: "${overtimeRegister.fullName}"`,
                text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được người dùng này.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ'
            }).then(() => {
                swal({
                    input: 'textarea',
                    inputPlaceholder: 'Vui lòng cho biết lý do vì sao không duyệt!',
                    showCancelButton: true,
                    confirmButtonText: 'Gửi',
                    cancelButtonText: 'Hủy bỏ'
                }).then(function(text) {
                    if (text) {
                        this.updateApproveStatus(overtimeRegister.id, isApprove);
                    }
                });
            }, () => {
            });
        } else {
            this.updateApproveStatus(overtimeRegister.id, isApprove);
        }
    }

    save() {
        this.overtimeRegister = this.model.value;
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages);
        if (isValid) {
            if (this.isUpdate) {

            } else {

            }
        }
    }

    onSelectYear(value) {

    }

    onSelectMonth(value) {

    }

    showRegisterFormModal() {

    }

    private updateApproveStatus(id: string, isApprove: boolean, note?: string) {
        // this.overtimeRegisterService.approve(id, isApprove, note)
        // .subscribe(() => this.toastr.success(isApprove ? 'Duyệt đăng ký làm thêm giờ thành công.'
        // : 'Không duyệt đăng ký làm thêm giờ thành công.'));
    }

    private builForm() {
        this.model = this.fb.group({
            'userId': [this.overtimeRegister.userId, [
                Validators.required
            ]],
            'note': [this.overtimeRegister.note, [
                Validators.maxLength(500)
            ]],
            'totalMinutes': [this.overtimeRegister.totalMinutes, [
                Validators.required
            ]]
        });
        this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages);
    }

    private renderFormValidation() {
        this.formErrors = this.utilService.renderFormError(['userId', 'shiftId', 'note']);
        this.validationMessages = {
            'userId': {
                'required': 'Vui lòng chọn nhân viên làm thêm giờ.'
            },
            'shiftId': {
                'required': 'Vui lòng chọn ca làm việc.'
            },
            'note': {
                'maxLength': 'Ghi chú không được phép vượt quá 500 ký tự.'
            }
        };
    }
}
