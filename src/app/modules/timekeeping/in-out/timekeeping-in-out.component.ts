import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { NumberValidator } from '../../../validators/number.validator';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { InLateOutEarlyShift, InOut } from './in-out.model';
import { UserSuggestion } from '../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { UserService } from '../../hr/user/services/user.service';
import { TimekeepingInOutService } from './timekeeping-in-out.service';
import { TimekeepingConfigService } from '../config/timekeeping-config.service';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { NhSelectData } from '../../../shareds/components/nh-select/nh-select.component';
import {
    InLateOutEarlyUpdateApproveStatusModel,
    InLateOutEarlyUpdateApproveStatusShiftModel
} from './in-late-out-early-update-approve-status.model';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { finalize } from 'rxjs/internal/operators';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-timkeeping-in-out',
    templateUrl: './timekeeping-in-out.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        NumberValidator]
})


export class TimekeepingInOutComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('formModal') formModal: NhModalComponent;
    @ViewChild('detailModal') detailModal: NhModalComponent;

    private _isInLate = false;
    private _isOutEarly = false;
    listShift = [];
    listInOut$: Observable<InOut[]>;
    type = 0;
    isGettingDetail = false;
    month: number;
    year: number;
    userId: string;
    isConfirm: boolean;
    listMonth = [];
    listYear = [];
    listUserSuggestion: UserSuggestion[];

    inOut = new InOut();
    shift = new InLateOutEarlyShift();
    model: FormGroup;
    selectedUser: UserSuggestion;
    maxInOutMin = 0;
    maxInOutTimes = 0;
    totalApprovedTimes = 0;
    isSearchingUser = false;

    STATUS = {
        WAITING_MANAGER_APPROVE: 0,
        MANAGER_APPROVE: 1,
        MANAGER_DECLINE: 2
    };

    userSuggestionKeyword$ = new Subject<string>();

    shiftFormError: any;
    shiftValidationMessage: any;
    totalApprovedInLateOutEarly: number;

    get shifts(): FormArray {
        return <FormArray>this.model.get('shifts');
    }

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private location: Location,
                private title: Title,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidators: NumberValidator,
                private utilService: UtilService,
                private userService: UserService,
                private spinnerService: SpinnerService,
                private inOutService: TimekeepingInOutService,
                private timekeepingConfigService: TimekeepingConfigService,
                private workscheduleService: TimekeepingWorkScheduleService) {
        super();
        this.title.setTitle('Danh sách đăng ký đi muộn về sớm.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_IN_LATE_OUT_EARLY, 'Chấm công', 'Danh sách đăng ký đi muộn về sớm.');
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;

        this.userSuggestionKeyword$
            .pipe(debounceTime(500),
                distinctUntilChanged())
            .subscribe(keyword => {
                // TODO: Check this later.
                // this.subscribers.searchUserSuggestion = this.userService.searchForSuggestion(keyword, '', 1, 20)
                //     .finally(() => this.isSearchingUser = false)
                //     .subscribe((result: any) => {
                //         // this.listUserSuggestion = result.users.map(user => new UserSuggestion(user.id, user.fullName,
                //         //     user.titleId, user.titleName, user.officeId, user.officeName, user.image));
                //     });
            });
    }

    ngOnInit() {
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.type) {
                this.type = parseInt(params.type);
            }
            if (params.id) {
                this.detailModal.open();
                this.getDetail(params.id);
            }
            if (params.showRegister) {
                setTimeout(() => {
                    // this.isUpdate = false;
                    this.formModal.open();
                });
            }
        });
        this.subscribers.listShift = this.workscheduleService.getMyWorkScheduleShift()
            .subscribe((result: any) => {
                _.each(result, (myWorkScheduleShift: any) => {
                    this.listShift = [...this.listShift, new NhSelectData(myWorkScheduleShift.id, myWorkScheduleShift
                        .reportName, myWorkScheduleShift)];
                });
            });
        this.listInOut$ = this.route.data
            .pipe(map((result: { data: any }) => {
                const searchResult = result.data;
                return searchResult.items;
            }));
        this.utilService.initListMonth().forEach((month) => {
            this.listMonth = [...this.listMonth, {id: month, name: `Tháng ${month}`}];
        });
        this.utilService.initListYear().forEach((year) => {
            this.listYear = [...this.listYear, {id: year, name: `Năm ${year}`}];
        });
        this.month = new Date().getMonth() + 1;
        this.year = new Date().getFullYear();
        this.buildForm();
        this.subscribers.timekeepingConfigs = this.timekeepingConfigService.getGeneralConfig()
            .subscribe((result: any) => {
                const maxMin = _.find(result, (item: any) => {
                    return item.key === 'Clinic.TimeKeeping.Models.MaxInOutMin';
                });
                const maxTimes = _.find(result, (item: any) => {
                    return item.key === 'Clinic.TimeKeeping.Models.MaxInOutTimes';
                });
                if (maxMin) {
                    this.maxInOutMin = maxMin.value;
                }
                if (maxTimes) {
                    this.maxInOutTimes = maxTimes.value;
                }
            });

        // Get total approved times
        // this.getTotalApprovedTimes(this.currentUser.id);
    }

    onChangeIsInLate(shiftModel: FormGroup) {
        shiftModel.patchValue({isInLate: !shiftModel.value.isInLate});
    }

    onSelectUser(user: any) {
        this.model.patchValue({userId: user.id});
        this.getTotalApprovedTimes(user.id);
    }

    onRemoveUser() {
        this.model.patchValue({userId: null});
    }

    onUserSuggestionKeyUp(keyword: string) {
        this.userSuggestionKeyword$.next(keyword);
    }

    onFormModalHidden() {
        const shiftLength = this.shifts.length;
        for (let i = 0; i < shiftLength; i++) {
            this.shifts.removeAt(0);
        }
        this.model.reset();
    }

    addNewMethod() {
        const shiftModel = this.buildShiftForm();
        this.shifts.push(shiftModel);
    }

    removeMethod(index: number) {
        this.shifts.removeAt(index);
    }

    changeType(type) {
        this.type = type;
        this.search(1);
    }

    showRegisterForm() {
        // this.isUpdate = false;
        this.model.reset(new InOut());
        this.formModal.open();
    }

    edit(inOut: InOut) {
        // this.isUpdate = true;
        this.inOut = inOut;
        // TODO: Check this later.
        // this.selectedUser = new UserSuggestion(inOut.userId, inOut.fullName, inOut.titleId, inOut.titleName, inOut.officeId,
        //     inOut.officeName, inOut.avatar);
        this.model.patchValue(inOut);
        setTimeout(() => {
            _.each(this.inOut.shifts, (shift: InLateOutEarlyShift) => {
                const shiftModel = this.buildShiftForm();
                shiftModel.patchValue({
                    shiftId: shift.shiftId,
                    shiftCode: shift.shiftCode,
                    isInLate: shift.isInLate,
                    totalMin: shift.totalMin,
                    reason: shift.reason
                });
                this.shifts.push(shiftModel);
            });
            this.formModal.open();
        }, 100);

    }

    detail(inOut: InOut) {
        _.each(inOut.shifts, (shift: InLateOutEarlyShift) => {
            shift.timeText = this.utilService.addTimeToTimeObject(shift.isInLate
                ? shift.startTime : shift.endTime, shift.totalMin, shift.isInLate);
        });
        this.inOut = inOut;
        this.detailModal.open();
    }

    getDetail(id: string) {
        this.isGettingDetail = true;
        this.subscribers.getInOutDetail = this.inOutService.getDetail(id)
            .pipe(finalize(() => this.isGettingDetail = false))
            .subscribe((result: { info: InOut, totalApprovedInLateOutEarly: number }) => {
                _.each(result.info.shifts, (shift: InLateOutEarlyShift) => {
                    shift.timeText = this.utilService.addTimeToTimeObject(shift.startTime, shift.totalMin, shift.isInLate);
                });
                this.inOut = result.info;
                this.totalApprovedInLateOutEarly = result.totalApprovedInLateOutEarly;
            });
    }

    delete(inOut: InOut) {
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn xóa bản đăng ký thời gian xin đi trễ về sớm này`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.inOutService.delete(inOut.id).subscribe(result => {
        //         this.toastr.success(this.formatString(this.message.deleteSuccess, 'đăng ký đi trễ về sớm'));
        //         this.inOut.isConfirmed = true;
        //         this.inOut.confirmDateTime = moment().toISOString();
        //         this.search(this.currentPage);
        //     });
        // }, () => {
        //
        // });
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.renderFilterLink();
        this.spinnerService.show();
        this.listInOut$ = this.inOutService.search(this.month, this.year, this.type, this.userId, this.isConfirm,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: { items: InOut[], totalRows: number }) => {
                    this.totalRows$ = new Observable(observable => observable.next(result.totalRows));
                    return result.items;
                }));
    }

    save() {
        // const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        // if (isValid) {
        //     // Kiểm tra ca đăng ký có bị lặp không.
        //     this.inOut = this.model.value;
        //     if (this.shifts.length === 0) {
        //         this.toastr.error('Vui lòng chọn ít nhất một hình thức đi muộn hoặc về sớm.');
        //         return;
        //     }
        //     this.spinnerService.show();
        //     // if (this.isUpdate) {
        //     //     this.inOutService.update(this.inOut)
        //     //         .pipe(finalize(() => this.spinnerService.hide()))
        //     //         .subscribe((result: IActionResultResponse) => {
        //     //             this.toastr.success(result.message);
        //     //             this.model.reset(new InOut());
        //     //             this.search(1);
        //     //             this.formModal.dismiss();
        //     //         });
        //     // } else {
        //     //     this.inOutService.insert(this.inOut)
        //     //         .pipe(finalize(() => this.spinnerService.hide()))
        //     //         .subscribe((result: IActionResultResponse) => {
        //     //             this.toastr.success(result.message);
        //     //             this.model.reset();
        //     //             this.search(1);
        //     //         });
        //     // }
        // }
    }

    approve(shift: InLateOutEarlyShift, isApprove: boolean) {
        if (!isApprove) {
            // swal({
            //     input: 'textarea',
            //     inputPlaceholder: 'Vui lòng nhập lý do không duyệt.',
            //     showCancelButton: true,
            //     confirmButtonColor: '#DD6B55',
            //     confirmButtonText: 'Đồng ý',
            //     cancelButtonText: 'Hủy bỏ'
            // }).then((text) => {
            //     if (text) {
            //         shift.isApprove = isApprove;
            //         shift.declineReason = text;
            //     }
            // }, () => {
            // });
        } else {
            shift.isApprove = true;
        }
    }

    confirm() {
        const inLateOutEarlyUpdateApproveStatus = new InLateOutEarlyUpdateApproveStatusModel();
        inLateOutEarlyUpdateApproveStatus.id = this.inOut.id;
        inLateOutEarlyUpdateApproveStatus.shifts = this.inOut.shifts.map((shift: InLateOutEarlyShift) => {
            return new InLateOutEarlyUpdateApproveStatusShiftModel(shift.shiftId, shift.isInLate, shift.isApprove, shift.declineReason);
        });

        const totalUnApproveInValidCount = _.countBy(inLateOutEarlyUpdateApproveStatus.shifts,
            (shift: InLateOutEarlyUpdateApproveStatusShiftModel) => {
                return !shift.isApprove && !shift.declineReason;
            }).true;

        if (totalUnApproveInValidCount > 0) {
            this.toastr.error('Vui lòng nhập nội dung không duyệt.');
            return;
        }

        this.spinnerService.show();
        this.inOutService.approve(inLateOutEarlyUpdateApproveStatus)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe((result: IActionResultResponse) => {
                this.toastr.success(result.message);
                this.inOut.isConfirmed = true;
                this.inOut.confirmDateTime = moment().toISOString();

                // Research list in late out early.
                this.search(this.currentPage);
            });
    }

    getTotalApprovedTimes(userId: string) {
        this.subscribers.getTotalApprovedTimes = this.inOutService.getTotalApprovedTimes(userId, moment().month() + 1, moment().year())
            .subscribe(totalApprovedTimes => {
                if (totalApprovedTimes === -1) {
                    this.toastr.error('Bạn không có quyền thực hiện chức năng này.');
                }
                this.totalApprovedTimes = totalApprovedTimes;
            });
    }

    private buildShiftForm() {
        const shiftForm = this.fb.group({
            'isInLate': [this.shift.isInLate, [
                Validators.required
            ]],
            'shiftId': [this.shift.shiftId, [
                Validators.required
            ]],
            'startTime': [this.shift.startTime],
            'endTime': [this.shift.endTime],
            'totalMin': [this.shift.totalMin, [
                Validators.required,
                this.numberValidators.isValid
            ]],
            'reason': [this.shift.reason, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'timeText': [this.shift.timeText]
        });
        // this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(shiftForm, this.formErrors, this.validationMessages));
        return shiftForm;
    }

    private buildForm() {
        this.model = this.fb.group({
            'id': [this.inOut.id],
            'userId': [this.inOut.userId],
            'registerDate': [this.inOut.registerDate, [
                Validators.required
            ]],
            'shifts': this.fb.array([])
        });

        // this.formErrors = this.utilService.renderFormError([
        //     'registerDate',
        //     {'shifts': ['shiftId', 'totalMin', 'reason']}
        // ]);
        // this.validationMessages = {
        //     'registerDate': {
        //         'required': 'Vui lòng chọn ngày xin đi trễ về sớm.'
        //     },
        //     'shifts': {
        //         'shiftId': {
        //             'required': 'Vui lòng chọn ca làm việc',
        //         },
        //         'totalMin': {
        //             'required': 'Vui lòng nhập số phút xin đi muộn về sớm.',
        //             'isValid': 'Số phút xin đi muộn về sớm phải là số.'
        //         },
        //         'reason': {
        //             'required': 'Vui lòng nhập lý do xin đi muộn về sớm.',
        //             'maxlength': 'Lý do xin đi muộn về sớm không được phép vượt quá 500 ký tự.'
        //         },
        //     }
        // };
        // this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private getStatusText(status: number) {
        return status === this.STATUS.WAITING_MANAGER_APPROVE ? 'Chờ QLTT phê duyệt'
            : status === this.STATUS.MANAGER_APPROVE ? 'QLTT đã duyệt' : 'QLTT không duyệt';
    }

    private renderFilterLink() {
        const path = '/timekeeping/in-out';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('type', this.type),
            new FilterLink('month', this.month),
            new FilterLink('year', this.year),
            new FilterLink('userId', this.userId)
        ]);

        this.location.go(path, query);
    }

    private initShiftValidators() {
        const validators = {
            totalMin: [
                Validators.required,
                this.numberValidators.isValid
            ],
            reason: [
                Validators.required
            ]
        };
        return validators;
    }

    private initShiftValidatorMessage() {
        const validatorMessage = {
            'totalMin': {
                'required': 'Số phút không được để trống.',
                'isValid': 'Số phút phải là số'
            },
            'reason': {
                'required': 'Lý do không được để trống'
            }
        };

        return validatorMessage;
    }
}
