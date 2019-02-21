import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InOutFrequently, InOutFrequentlyDetail } from './in-out-frequently.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { InOutFrequentlyService } from './in-out-frequently.service';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { ActivatedRoute } from '@angular/router';
import { NumberValidator } from '../../../validators/number.validator';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { UserSuggestion } from '../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import { UtilService } from '../../../shareds/services/util.service';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UserService } from '../../hr/user/services/user.service';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-timekeeping-in-out-frequently',
    templateUrl: './timekeeping-in-out-frequently.component.html',
    providers: [NumberValidator]
})

export class TimekeepingInOutFrequentlyComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('fromModal') formModal: NhModalComponent;
    @ViewChild('fromDetailModal') formDetailModal: NhModalComponent;

    fromDate?: string;
    toDate?: string;
    isUpdateDetail = false;
    currentDetailIndex = -1;

    model: FormGroup;
    detailModel: FormGroup;
    inOutFrequently: InOutFrequently = new InOutFrequently();
    inOutFrequentlyDetail: InOutFrequentlyDetail = new InOutFrequentlyDetail();
    listInOutFrequently: InOutFrequently[] = [];
    listInOutFrequentlyDetail: InOutFrequentlyDetail[] = [];
    listUserSuggestion: UserSuggestion[] = [];
    selectedUser: UserSuggestion;
    userSuggestionKeyword$ = new Subject<string>();
    isSearchingUser: any = false;
    detailFormErrors: any = {};
    detailValidationMessage: any = {};
    dayOfWeeks = [];
    shifts = [];

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private title: Title,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private userService: UserService,
                private workScheduleService: TimekeepingWorkScheduleService,
                private inOutFrequentlyService: InOutFrequentlyService) {
        super();
        const pageTitle = 'Cấu hình đi muộn về sớm dài hạn';
        this.title.setTitle(pageTitle);
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_IN_LATE_OUT_EARLY_FREQUENTLY,
            'Chấm công', pageTitle);
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;

        for (let i = 0; i < 7; i++) {
            this.dayOfWeeks = [...this.dayOfWeeks, {id: i, name: i === 0 ? 'CN' : 'T' + (i + 1)}];
        }
    }

    ngOnInit() {
        this.buildForm();
        this.buildFormDetail();

        this.subscribers.detailFormModal = this.formDetailModal.onHidden.subscribe(() => {
            this.isUpdateDetail = false;
            this.detailModel.reset();
            this.inOutFrequentlyDetail = new InOutFrequentlyDetail();
        });

        this.subscribers.routeData = this.route.data.subscribe((result: { data: ISearchResult<InOutFrequently> }) => {
            const data = result.data;
            if (data) {
                this.listInOutFrequently = data.items;
                this.totalRows = data.totalRows;
            }
        });

        // TODO: Check this later.
        // this.userSuggestionKeyword$
        //     .pipe(debounceTime(500),
        //         distinctUntilChanged())
        //     .subscribe(keyword => {
        //         this.subscribers.searchUserSuggestion = this.userService.searchForSuggestion(keyword, '', 1, 20)
        //             .finally(() => this.isSearchingUser = false)
        //             .subscribe((result: any) => {
        //                 this.listUserSuggestion = result.users.map(user => new UserSuggestion(user.id, user.fullName, user.titleId,
        //                     user.titleName, user.officeId, user.officeName, user.image, false, false, user.enrollNumber));
        //             });
        //     });
    }

    onChangeIsInLateValue(isInLate: boolean) {
        this.detailModel.patchValue({isInLate: isInLate});
    }

    onSelectShift(shift: any) {
        this.detailModel.patchValue({shiftReportName: shift.name});
    }

    search(currentPage: number) {
        // this.currentPage = this.currentPage;
        // this.spinnerService.open();
        // this.subscribers.search = this.inOutFrequentlyService.search(this.keyword, this.isActiveSearch, this.fromDate, this.toDate,
        //     this.currentPage, this.pageSize)
        //     .pipe(finalize(() => this.spinnerService.hide()))
        //     .subscribe((result: ISearchResult<InOutFrequently>) => {
        //         this.listInOutFrequently = result.items;
        //         this.totalRows = result.totalRows;
        //     });
    }

    addNew() {
        // this.isUpdate = false;
        this.model.reset(new InOutFrequently());
        this.listInOutFrequentlyDetail = [];
        this.selectedUser = null;
        this.formModal.open();
    }

    addDetail() {
        this.isUpdateDetail = false;
        if (!this.model.value.userId) {
            this.toastr.error('Vui lòng chọn người dùng đăng ký.');
            return;
        }

        this.detailModel.reset(new InOutFrequentlyDetail());
        this.formDetailModal.open();
    }

    edit(inOutFrequently: InOutFrequently) {
        // this.isUpdate = true;
        // // TODO: Check this later.
        // // this.selectedUser = new UserSuggestion(inOutFrequently.userId, inOutFrequently.fullName,
        // //     this.inOutFrequently.titleId, inOutFrequently.titleName,
        // //     inOutFrequently.officeId, inOutFrequently.officeName, inOutFrequently.avatar, true, true);
        // this.listInOutFrequentlyDetail = inOutFrequently.inOutFrequentlyDetails.map((item: InOutFrequentlyDetail) => {
        //     item.dayOfWeekName = this.getDayOfWeekName(item.dayOfWeek);
        //     return item;
        // });
        // this.model.patchValue(inOutFrequently);
        // this.formModal.open();
        // this.getWorkScheduleByUserId(inOutFrequently.userId);
    }

    editDetail(inOutFrequentlyDetail: InOutFrequentlyDetail, index: number) {
        this.currentDetailIndex = index;
        this.isUpdateDetail = true;
        this.detailModel.patchValue(inOutFrequentlyDetail);
        this.formDetailModal.open();
    }

    save() {
        // const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        // if (isValid) {
        //     if (this.listInOutFrequentlyDetail.length === 0) {
        //         this.toastr.error('Vui lòng chọn thêm ít nhất 1 ca làm việc.');
        //         return;
        //     }
        //     this.inOutFrequently = this.model.value;
        //     this.inOutFrequently.inOutFrequentlyDetails = this.listInOutFrequentlyDetail;
        //     // if (this.isUpdate) {
        //     //     this.spinnerService.open('Đang cập nhật thông tin đăng ký đi muộn về sớm.');
        //     //     this.inOutFrequentlyService.update(this.inOutFrequently)
        //     //         .pipe(finalize(() => this.spinnerService.hide()))
        //     //         .subscribe((result: IActionResultResponse) => {
        //     //             this.toastr.success(result.message);
        //     //
        //     //             // Find item in list
        //     //             // const inOutFrequently = _.find(this.listInOutFrequently, (item: InOutFrequently) => {
        //     //             //     return item.id === this.inOutFrequently.id;
        //     //             // });
        //     //             //
        //     //             // if (inOutFrequently) {
        //     //             //     inOutFrequently.userId = this.inOutFrequently.userId;
        //     //             //     inOutFrequently.fullName = this.inOutFrequently.fullName;
        //     //             //     inOutFrequently.titleId = this.inOutFrequently.titleId;
        //     //             //     inOutFrequently.titleName = this.inOutFrequently.titleName;
        //     //             //     inOutFrequently.avatar = this.inOutFrequently.avatar;
        //     //             //     inOutFrequently.officeId = this.inOutFrequently.officeId;
        //     //             //     inOutFrequently.officeName = this.inOutFrequently.officeName;
        //     //             //     inOutFrequently.fromDate = this.inOutFrequently.fromDate;
        //     //             //     inOutFrequently.toDate = this.inOutFrequently.toDate;
        //     //             //     inOutFrequently.reason = this.inOutFrequently.reason;
        //     //             //     inOutFrequently.note = this.inOutFrequently.note;
        //     //             //     inOutFrequently.inOutFrequentlyDetails = this.inOutFrequently.inOutFrequentlyDetails;
        //     //             //     inOutFrequently.isActive = this.inOutFrequently.isActive;
        //     //             // }
        //     //
        //     //             this.formModal.dismiss();
        //     //             this.search(this.currentPage);
        //     //         });
        //     // } else {
        //     //     this.spinnerService.open('Đang thêm mới đăng ký đi muộn về sớm.');
        //     //     this.inOutFrequentlyService.insert(this.inOutFrequently)
        //     //         .pipe(finalize(() => this.spinnerService.hide()))
        //     //         .subscribe((result: IActionResultResponse) => {
        //     //             this.toastr.success(result.message);
        //     //             this.model.reset(new InOutFrequently());
        //     //             this.selectedUser = null;
        //     //             this.listInOutFrequentlyDetail = [];
        //     //             this.search(1);
        //     //         });
        //     // }
        // }
    }

    saveDetail() {
        // const isValid = this.utilService.onValueChanged(this.detailModel, this.detailFormErrors,
        //     this.detailValidationMessage, true);
        // if (isValid) {
        //     this.inOutFrequentlyDetail = this.detailModel.value;
        //
        //     if (this.isUpdate && this.isUpdateDetail) {
        //         this.spinnerService.open('Đang cập nhật thông tin chi tiết ca xin đi muộn về sớm. Vui lòng đợi...');
        //         this.inOutFrequentlyService.updateDetail(this.model.value.id, this.inOutFrequentlyDetail)
        //             .pipe(finalize(() => this.spinnerService.hide()))
        //             .subscribe((result: IActionResultResponse) => {
        //                 this.toastr.success(result.message);
        //                 const detail = this.listInOutFrequentlyDetail[this.currentDetailIndex];
        //                 if (detail) {
        //                     detail.isInLate = this.inOutFrequentlyDetail.isInLate;
        //                     detail.shiftId = this.inOutFrequentlyDetail.shiftId;
        //                     detail.shiftReportName = this.inOutFrequentlyDetail.shiftReportName;
        //                     detail.totalMinutes = this.inOutFrequentlyDetail.totalMinutes;
        //                     detail.dayOfWeek = this.inOutFrequentlyDetail.dayOfWeek;
        //                     detail.dayOfWeekName = this.getDayOfWeekName(this.inOutFrequentlyDetail.dayOfWeek);
        //                 }
        //                 setTimeout(() => this.formDetailModal.dismiss());
        //             });
        //     } else if (this.isUpdate && !this.isUpdateDetail) {
        //         this.spinnerService.open('Đang thêm mới chi tiết ca xin đi muộn về sớm. Vui lòng đợi...');
        //         this.inOutFrequentlyService.insertDetail(this.model.value.id, this.inOutFrequentlyDetail)
        //             .pipe(finalize(() => this.spinnerService.hide()))
        //             .subscribe((result: IActionResultResponse<any>) => {
        //                 this.toastr.success(result.message);
        //                 this.detailModel.reset(new InOutFrequentlyDetail());
        //                 this.inOutFrequentlyDetail.dayOfWeekName = this.getDayOfWeekName(this.inOutFrequentlyDetail.dayOfWeek);
        //                 this.inOutFrequentlyDetail.id = result.data.id;
        //                 this.listInOutFrequentlyDetail = [...this.listInOutFrequentlyDetail, _.clone(this.inOutFrequentlyDetail)];
        //             });
        //     } else {
        //         // Check exists
        //         const exists = _.find(this.listInOutFrequentlyDetail, (inOutFrequentlyDetail: InOutFrequentlyDetail) => {
        //             return inOutFrequentlyDetail.dayOfWeek === this.inOutFrequentlyDetail.dayOfWeek
        //                 && inOutFrequentlyDetail.shiftId === this.inOutFrequentlyDetail.shiftId
        //                 && inOutFrequentlyDetail.isInLate === this.inOutFrequentlyDetail.isInLate;
        //         });
        //
        //         if (!exists) {
        //             this.listInOutFrequentlyDetail = [...this.listInOutFrequentlyDetail,
        //                 new InOutFrequentlyDetail(this.inOutFrequentlyDetail.dayOfWeek, this.inOutFrequentlyDetail.shiftId,
        //                     this.inOutFrequentlyDetail.shiftReportName, this.inOutFrequentlyDetail.isInLate,
        //                     this.inOutFrequentlyDetail.totalMinutes)];
        //         } else {
        //             this.toastr.error('Chi tiết ca làm việc đã tồn tại.');
        //         }
        //     }
        // }
    }

    delete(inOutFrequently: InOutFrequently) {
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn xóa đăng ký đi trễ cho người dùng: "${inOutFrequently.fullName}" không?`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open();
        //     this.inOutFrequentlyService.delete(inOutFrequently.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe((result: IActionResultResponse) => {
        //             this.toastr.success(result.message);
        //             this.search(this.currentPage);
        //         });
        // }, () => {
        // });
    }

    deleteDetail(inOutFrequentlyDetail: InOutFrequentlyDetail) {
        // if (this.isUpdate) {
        //     // swal({
        //     //     title: '',
        //     //     text: `Bạn có chắc chắn muốn xóa chi tiết đăng ký này không?`,
        //     //     type: 'warning',
        //     //     showCancelButton: true,
        //     //     confirmButtonColor: '#DD6B55',
        //     //     confirmButtonText: 'Đồng ý',
        //     //     cancelButtonText: 'Hủy bỏ'
        //     // }).then(() => {
        //     //     this.spinnerService.open();
        //     //     this.inOutFrequentlyService.deleteDetail(this.model.value.id, inOutFrequentlyDetail.id)
        //     //         .finally(() => this.spinnerService.hide())
        //     //         .subscribe((result: IActionResultResponse) => {
        //     //             this.toastr.success(result.message);
        //     //             _.remove(this.listInOutFrequentlyDetail, (item: InOutFrequentlyDetail) => {
        //     //                 return item.id === inOutFrequentlyDetail.id;
        //     //             });
        //     //         });
        //     // }, () => {
        //     // });
        // } else {
        //     _.remove(this.listInOutFrequentlyDetail, (item: InOutFrequentlyDetail) => {
        //         return item.dayOfWeek === inOutFrequentlyDetail.dayOfWeek && item.shiftId === inOutFrequentlyDetail.shiftId
        //             && item.isInLate === inOutFrequentlyDetail.isInLate;
        //     });
        // }
    }

    onSelectUser(user: UserSuggestion) {
        this.selectedUser = user;
        this.model.patchValue({userId: user.id});
        this.getWorkScheduleByUserId(this.model.value.userId);
    }

    onRemoveUser() {
        this.model.patchValue({userId: null});
    }

    onUserSuggestionKeyUp(keyword: string) {
        this.userSuggestionKeyword$.next(keyword);
    }

    onRemoveFromDate() {
        this.model.patchValue({fromDate: null});
    }

    onRemoveToDate() {
        this.model.patchValue({toDate: null});
    }

    private getDayOfWeekName(dayOfWeek: number): string {
        return dayOfWeek === 0 ? 'CN' : 'T' + (dayOfWeek + 1);
    }

    private getWorkScheduleByUserId(userId: string) {
        // Get work schedule by userId
        this.spinnerService.show('Đang lấy thông tin ca làm việc. Vui lòng đợi...');
        this.subscribers.shifts = this.workScheduleService.getWorkScheduleShift(userId)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe((shifts: any) => {
                this.shifts = shifts.map((item: any) => {
                    return {id: item.id, name: item.reportName};
                });
            });
    }

    private buildForm() {
        // this.formErrors = this.utilService.renderFormError(['userId', 'reason', 'note']);
        // this.validationMessages = {
        //     'userId': {
        //         'required': 'Vui lòng chọn nhân viên đăng ký.'
        //     },
        //     'reason': {
        //         'required': 'Vui lòng nhập lý do xin đi muộn về sớm.',
        //         'maxlength': 'Lý do đi muộn về sớm không được phép lớn hơn 500 ký tự.'
        //     },
        //     'note': {
        //         'maxlength': 'Ghi chú không được phép lớn hơn 500 ký tự.'
        //     }
        // };
        // this.model = this.fb.group({
        //     'id': [this.inOutFrequently.id],
        //     'userId': [this.inOutFrequently.userId, [
        //         Validators.required
        //     ]],
        //     'fullName': [this.inOutFrequently.fullName],
        //     'avatar': [this.inOutFrequently.avatar],
        //     'titleId': [this.inOutFrequently.titleId],
        //     'titleName': [this.inOutFrequently.titleName],
        //     'officeId': [this.inOutFrequently.officeId],
        //     'officeName': [this.inOutFrequently.officeName],
        //     'fromDate': [this.inOutFrequently.fromDate],
        //     'toDate': [this.inOutFrequently.toDate],
        //     'reason': [this.inOutFrequently.reason, [
        //         Validators.required,
        //         Validators.maxLength(500)
        //     ]],
        //     'note': [this.inOutFrequently.note, [
        //         Validators.maxLength(500)
        //     ]],
        //     'isActive': [this.inOutFrequently.isActive]
        // });
        // this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages);
    }

    private buildFormDetail() {
        this.detailFormErrors = this.utilService.renderFormError(['dayOfWeek', 'shiftId', 'totalMinutes']);
        this.detailValidationMessage = {
            'dayOfWeek': {
                'required': 'Vui lòng chọn ngày nghỉ.'
            },
            'shiftId': {
                'required': 'Vui lòng chọn ca nghỉ.'
            },
            'totalMinutes': {
                'required': 'Vui lòng nhấp số phút đi muộn hoặc về sớm.',
                'isValid': 'Số phút phải là số.'
            }
        };
        this.detailModel = this.fb.group({
            'id': [this.inOutFrequentlyDetail.id],
            'dayOfWeek': [this.inOutFrequentlyDetail.dayOfWeek, [
                Validators.required
            ]],
            'shiftId': [this.inOutFrequentlyDetail.shiftId, [
                Validators.required
            ]],
            'shiftReportName': [this.inOutFrequentlyDetail.shiftReportName],
            'isInLate': [this.inOutFrequentlyDetail.isInLate],
            'totalMinutes': [this.inOutFrequentlyDetail.totalMinutes, [
                Validators.required,
                this.numberValidator.isValid
            ]]
        });
        this.utilService.onValueChanged(this.detailModel, this.detailFormErrors, this.detailValidationMessage);
    }
}
