import { Component, OnInit, OnDestroy, Renderer, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { LaborContractListComponent } from '../labor-contract/labor-contract-list.component';
import { InsuranceListComponent } from '../insurance/insurance-list.component';
import { TrainingHistoryListComponent } from '../training-history/training-history-list.component';
import { EmploymentHistoryListComponent } from '../employment_history/employment-list.component';
import { CommendationDisciplineListComponent } from '../commendation-discipline/commendation-discipline-list.component';
import { RecordsManagementFormComponent } from '../records-management/records-management-form.component';
import { AcademicLevelComponent } from '../academic-level/academic-level.component';
import { IAppConfig } from '../../../../interfaces/iapp-config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { DestroySubscribers } from '../../../../shareds/decorator/destroy-subscribes.decorator';
import { APP_CONFIG } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { NumberValidator } from '../../../../validators/number.validator';
import { DateTimeValidator } from '../../../../validators/datetime.validator';
import { AuthService } from '../../../../shareds/services/auth.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { UserService } from '../services/user.service';
import { NationalService } from '../services/national.service';
import { AcademicRank, Gender, MarriedStatus, User, UserType } from '../models/user.model';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { FileUpload } from '../../../../shareds/components/nh-upload/nh-upload.model';
import { finalize } from 'rxjs/operators';
import { OfficePositionService } from '../../organization/office/services/office-position.service';
import { TitleService } from '../../organization/title/title.service';
import { OfficeService } from '../../organization/office/services/office.service';
import { BaseFormComponent } from '../../../../base-form.component';
import { UserTranslation } from '../models/user-translation.model';
import { UserContact, ContactType } from '../models/user-contact.model';
import * as _ from 'lodash';
import { PositionService } from '../../organization/position/position.service';
import { TitleSearchForSelectViewModel } from '../../organization/title/title-search-for-select.viewmodel';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import * as moment from 'moment';
import { UserDetailViewModel } from '../models/user-detail.viewmodel';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['../../../../../assets/pages/css/profile.css'],
    providers: [OfficePositionService, TitleService, NumberValidator, DateTimeValidator, NationalService, OfficeService, PositionService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})

export class UserFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    // @ViewChild(LaborContractListComponent) laborContractList: LaborContractListComponent;
    // @ViewChild(AcademicLevelComponent) academicLevelComponent: AcademicLevelComponent;
    // @ViewChild(InsuranceListComponent) insuranceList: InsuranceListComponent;
    // @ViewChild(TrainingHistoryListComponent) trainingHistoryList: TrainingHistoryListComponent;
    // @ViewChild(EmploymentHistoryListComponent) employmentHistoryList: EmploymentHistoryListComponent;
    // @ViewChild(CommendationDisciplineListComponent) commendationDisciptionList: CommendationDisciplineListComponent;
    // @ViewChild(RecordsManagementFormComponent) recordsFormComponent: RecordsManagementFormComponent;
    @Output() onCloseForm = new EventEmitter<any>();

    pageTitle = 'Thêm mới người dùng';
    user = new User();
    modelTranslation = new UserTranslation();
    enableSelectDistrict = false;
    enableSelectProvince = false;
    isEnableSelectTitleButton = false;
    positionName: string;
    formValue = 1;
    formTitle = 'Thông tin nhân viên';
    listNational = [];
    listProvince = [];
    listDistrict = [];
    listReligion = [];
    listEthnic = [];
    listTitle = [];
    listPosition = [];
    officeTree = [];
    listUserContact = [];
    contactType = ContactType;
    academicRank = AcademicRank;
    userType = UserType;
    marriedStatus = MarriedStatus;
    gender = Gender;
    isGettingTree = false;
    userId;
    userDetail: UserDetailViewModel;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private location: Location,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer,
                private title: Title,
                private numberValidator: NumberValidator,
                private datetimeValidator: DateTimeValidator,
                private authService: AuthService,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private userService: UserService,
                private nationalService: NationalService,
                private officeService: OfficeService,
                private officePositionService: OfficePositionService,
                private positionService: PositionService,
                private titleService: TitleService) {
        super();
        this.reloadTree();
        this.nationalService.getAll().subscribe((result: any) => {
            this.listNational = result.listNationals.items;
            this.listEthnic = result.listEthnics.items;
            this.listReligion = result.listReligions.items;
        });
    }

    ngOnInit(): void {
        this.renderForm();
        // setTimeout(() => {
        this.subscribers.routeData = this.route.data.subscribe((data: { detail: any }) => {
            this.userDetail = data.detail;
            if (this.userDetail) {
                this.isUpdate = true;
                this.model.patchValue(this.userDetail);
                this.model.patchValue({officeId: this.userDetail.officeId});
                this.userId = this.userDetail.id;
                if (this.userDetail.userContacts && this.userDetail.userContacts.length > 0) {
                    this.listUserContact = this.userDetail.userContacts;
                }
                if (this.userDetail.userTranslations && this.userDetail.userTranslations.length > 0) {
                    this.modelTranslations.controls.forEach(
                        (model: FormGroup) => {
                            const detail = _.find(
                                this.userDetail.userTranslations,
                                (userTranslation: UserTranslation) => {
                                    return (
                                        userTranslation.languageId === model.value.languageId
                                    );
                                }
                            );
                            if (detail) {
                                model.patchValue(detail);
                            }
                        }
                    );
                }
                this.pageTitle = 'Cập nhật thông tin người dùng';
            }
        });
        // }, 200);

        this.appService.setupPage(this.pageId.HR, this.pageId.USER, 'Quản lý nhân sự', this.pageTitle);
        this.insertUserContactDefault(this.contactType.mobilePhone);
        this.insertUserContactDefault(this.contactType.email);
    }

    ngOnDestroy(): void {
    }

    closeForm() {
        this.router.navigate(['/users']);
    }

    getDetail(id: string) {
        this.spinnerService.show();
        this.userService.getDetail(id)
            .subscribe(detail => {
                this.title.setTitle(this.pageTitle);
                this.model.patchValue(detail);
                // this.model.patchValue({birthday: detail.code..bi, })
            });
    }

    onSelectNational(national) {
        if (national) {
            this.getProvinceByNationalId(national.id);
        }
    }

    onProvinceSelect(province: any) {
        this.model.patchValue({provinceId: province.id});
        this.getDistrictByProvinceId(province.id);
    }

    onSelectOffice(office) {
        if (office.id != null) {
            this.getPositionByOfficeId(office.id);
        }
        this.model.patchValue({positionId: null});
        this.modelTranslations.controls.forEach(
            (model: FormGroup) => {
                const detail = _.find(
                    this.modelTranslation,
                    (userTranslation: UserTranslation) => {
                        return (
                            userTranslation.languageId === model.value.languageId
                        );
                    }
                );
                model.patchValue({titleName: ''});
            }
        );
        this.isEnableSelectTitleButton = false;
        this.listPosition = [];
    }

    onSelectPosition(position) {
        if (position) {
            this.positionService.getTitleByPositionId(position.data.positionId)
                .subscribe((result: IActionResultResponse<TitleSearchForSelectViewModel>) => {
                    this.model.patchValue({titleId: result.data.id, positionId: position.data.positionId});
                    this.modelTranslations.controls.forEach(
                        (model: FormGroup) => {
                            const detail = _.find(
                                this.modelTranslation,
                                (userTranslation: UserTranslation) => {
                                    return (
                                        userTranslation.languageId === model.value.languageId
                                    );
                                }
                            );
                            model.patchValue({titleName: result.data.name});
                        }
                    );
                });
        }
    }

    save() {
        this.user = this.model.value;
        this.user.userContacts = this.listUserContact;
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.isSaving = true;
            if (this.isUpdate) {
                this.userService.update(this.userId, this.user)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.router.navigate(['/users']);
                        return;
                    });
            } else {
                this.userService.insert(this.user)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isSubmitted = false;
                        if (this.isCreateAnother) {
                            this.resetForm();
                            return;
                        } else {
                            this.router.navigate(['/users']);
                        }
                    });
            }
        } else {
            const query = document.querySelector('input.ng-invalid');
            if (query) {
                this.renderer.invokeElementMethod(query, 'focus');
            }
        }
    }

    afterUploadAvatar(file: FileUpload) {
        this.model.patchValue({avatar: file.path});
        if (this.isUpdate && file) {
            this.userService.updateAvatar(this.model.value.userId, file.path);
        }
    }

    selectUserContact(value) {
        if (value) {
            this.listUserContact = value;
        }
    }

    // Child component
    showForm(value) {
        this.formValue = value;
        switch (value) {
            case 0: // Show detail
                this.formTitle = 'Chi tiết nhân viên';
                break;
            case 1: // Show Update form
                this.formTitle = 'Thông tin nhân viên';
                break;
            default:
                this.router.navigate(['/users']);
                this.onCloseForm.emit();
                break;
            //     case 2: // Show labor contract
            //         this.formTitle = 'Quản lý hợp đồng';
            //         this.laborContractList.getAllContractTypes();
            //         this.laborContractList.search(1);
            //         break;
            //     case 3: // show Academic level
            //         this.formTitle = 'Quản lý trình độ học vấn';
            //         this.academicLevelComponent.search(1);
            //         break;
            //     case 4: // Show insurance
            //         this.formTitle = 'Quản lý quá trình bảo hiểm';
            //         this.insuranceList.search(1);
            //         break;
            //     case 5: // Show employment history
            //         this.formTitle = 'Quản lý quá trình công tác';
            //         this.employmentHistoryList.search(1);
            //         break;
            //     case 6: // Show training history
            //         this.formTitle = 'Quản lý quá trình đào tạo';
            //         this.trainingHistoryList.getListCourse();
            //         this.trainingHistoryList.getListCoursePlace();
            //         this.trainingHistoryList.search(1);
            //         break;
            //     case 7: // Show record management
            //         this.formTitle = 'Quản lý hồ sơ giấy tờ';
            //         this.recordsFormComponent.getListRecords();
            //         break;
            //     case 8: // Show commendation and discipline
            //         this.formTitle = 'Quản lý khen thưởng kỷ luật';
            //         this.commendationDisciptionList.getListCategory('');
            //         this.commendationDisciptionList.search(1);
            //         break;
            //     default:
            //         // this.router.navigate(["/user"]);
            //         this.onCloseForm.emit();
            //         break;
        }
    }

    private reloadTree() {
        this.isGettingTree = true;
        this.officeService.getTree()
            .pipe(finalize(() => this.isGettingTree = false))
            .subscribe((result: any) => {
                this.officeTree = result;
                if (this.userDetail) {
                    setTimeout(() => {
                        this.model.patchValue({officeId: this.userDetail.officeId});
                        this.getPositionByOfficeId(this.userDetail.officeId);
                        this.getProvinceByNationalId(1);
                        if (this.userDetail.provinceId) {
                            this.getDistrictByProvinceId(this.userDetail.provinceId);
                        }
                    });
                }
            });
    }

    private insertUserContactDefault(contactType: number) {
        const listUserContact = _.filter(this.listUserContact, (item: UserContact) => {
            return item.contactType === contactType;
        });
        if (!listUserContact || listUserContact.length === 0) {
            const item = new UserContact();
            item.contactType = contactType;
            item.contactValue = '';
            this.listUserContact.push(item);
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['fullName', 'userName', 'password', 'avatar', 'ext', 'birthday',
            'idCardNumber', 'idCardDateOfIssue', 'gender', 'ethnic', 'denomination',
            'tin', 'joinedDate', 'bankingNumber', 'nationalId', 'provinceId', 'districtId', 'academicRank', 'cardNumber',
            'marriedStatus', 'officeId', 'positionId', 'userType', 'passportId', 'passportDateOfIssue', 'enrollNumber']);

        this.validationMessages = {
            'fullName': {
                'required': 'Tên người dùng không được để trống',
                'maxlength': 'Tên người dùng không được phép vượt quá 50 ký tự'
            },
            'userName': {
                'required': 'Tài khoản không được để trống.',
                'maxlength': 'Tài khoản không được phép vượt quá 30 ký tự.',
                'pattern': 'Tài khoản không đúng định dạng'
            },
            'birthday': {
                'required': 'Vui lòng chọn ngày sinh.',
                'isValid': 'Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'userType': {
                'required': 'Vui lòng chọn là trưởng đơn vị hay không.'
            },
            'ext': {
                'maxlength': 'Số máy lẻ không được phép vượt quá 15 ký tự.',
                'isValid': 'Số máy lẻ'
            },
            'idCardNumber': {
                'required': 'Vui lòng nhập số CMND',
                'maxlength': 'Tên ngân hàng không được phép vượt quá 30 ký tự.'
            },
            'idCardDateOfIssue': {
                'isValid': 'Ngày cấp CMT không hợp lệ. Vui lòng kiểm tra lại'
            },
            'gender': {
                'required': 'Vui lòng chọn giới tính'
            },
            'ethnic': {},
            'denomination': {},
            'tin': {
                'maxlength': 'Mã số thuế thu nhập cá nhân không được phép vượt quá 20 ký tự.',
            },
            'joinedDate': {
                'isValid': 'Ngày bắt đầu làm việc không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'bankingNumber': {
                'maxlength': 'Số tài khoản không được phép vượt quá 50 ký tự.',
            },
            'nationalId': {},
            'provinceId': {},
            'districtId': {},
            'marriedStatus': {},
            'officeId': {
                'required': 'Vui lòng chọn phòng ban'
            },
            'positionId': {
                'required': 'Vui lòng chọn chức vụ.'
            },
            'titleId': {
                'required': 'Vui lòng chọn chức danh'
            },
            'passportId': {
                'maxlength': 'Số hộ chiếu không được phép vượt quá 50 ký tự.'
            },
            'passportDateOfIssue': {
                'isValid': 'Ngày cấp hộ chiếu không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'enrollNumber': {
                'required': 'Mã chấm công'
            },
            'academicRank': {
                'isValid': 'Học hàm học vị không hợp lệ. Vui lòng kiểm tra lại'
            },
            'cardNumber': {
                'maxlength': 'Số thẻ không được phép vượt quá 20 ký tự.'
            }
        };

        this.model = this.fb.group({
            id: [this.user.id],
            fullName: [this.user.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            userName: [this.user.userName, [
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern('^[a-z0-9]+([-_\\.][a-z0-9]+)*[a-z0-9]$')
            ]],
            userType: [this.user.userType, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            avatar: [this.user.avatar],
            ext: [this.user.ext, [
                Validators.maxLength(15),
                this.numberValidator.isValid
            ]],
            birthday: [this.user.birthday, [
                Validators.required,
                this.datetimeValidator.isValid
            ]],
            idCardNumber: [this.user.idCardNumber, [
                Validators.required,
                Validators.maxLength(30)
            ]],
            idCardDateOfIssue: [this.user.idCardDateOfIssue, [
                this.datetimeValidator.isValid
            ]],
            gender: [this.user.gender, [
                Validators.required
            ]],
            ethnic: [this.user.ethnic],
            denomination: [this.user.denomination],
            tin: [this.user.tin, [
                Validators.maxLength(20)
            ]],
            joinedDate: [this.user.joinedDate, [
                this.datetimeValidator.isValid
            ]],
            bankingNumber: [this.user.bankingNumber, [
                Validators.maxLength(50)
            ]],
            nationalId: [this.user.nationalId],
            provinceId: [this.user.provinceId],
            districtId: [this.user.districtId],
            marriedStatus: [this.user.marriedStatus],
            officeId: [this.user.officeId, [
                Validators.required
            ]],
            positionId: [this.user.positionId, [
                Validators.required
            ]],
            titleId: [this.user.titleId, [
                Validators.required
            ]],
            passportId: [this.user.passportId, [
                Validators.maxLength(50)
            ]],
            passportDateOfIssue: [this.user.passportDateOfIssue, [
                this.datetimeValidator.isValid
            ]],
            enrollNumber: [this.user.enrollNumber, [
                this.numberValidator.isValid]],
            cardNumber: [this.user.cardNumber, [
                Validators.maxLength(20)
            ]],
            academicRank: [this.user.academicRank, [this.numberValidator.isValid]],
            concurrencyStamp: [this.user.concurrencyStamp],
            modelTranslations: this.fb.array([]),
        });

        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(['titleName',
            'idCardPlaceOfIssue', 'passportPlaceOfIssue', 'nativeCountry', 'address', 'branchBank', 'bankName', 'nationality',
            'residentRegister']);
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {'titleName': ['required', 'maxlength']},
            {'idCardPlaceOfIssue': ['maxlength']},
            {'passportPlaceOfIssue': ['maxlength']},
            {'passportPlaceOfIssue': ['maxlength']},
            {'nativeCountry': ['maxlength']},
            {'address': ['maxlength']},
            {'branchBank': ['maxlength']},
            {'bankName': ['maxlength']},
            {'nationality': ['maxlength']},
            {'residentRegister': ['maxlength']}
        ]);
        const pageTranslationModel = this.fb.group({
            languageId: [language],
            titleName: [this.modelTranslation.titleName, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            idCardPlaceOfIssue: [this.modelTranslation.idCardPlaceOfIssue,
                [Validators.maxLength(100)]],
            passportPlaceOfIssue: [this.modelTranslation.passportPlaceOfIssue,
                [Validators.maxLength(500)]],
            nativeCountry: [this.modelTranslation.nationality, [
                Validators.maxLength(500)
            ]],
            address: [this.modelTranslation.address, [
                Validators.maxLength(500)
            ]],
            branchBank: [this.modelTranslation.branchBank, [
                Validators.maxLength(100)
            ]],
            bankName: [this.modelTranslation.bankName, [
                Validators.maxLength(100)
            ]],
            nationality: [this.modelTranslation.nationality, [
                Validators.maxLength(256)
            ]],
            residentRegister: [this.modelTranslation.residentRegister, [
                Validators.maxLength(500)
            ]]
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return pageTranslationModel;
    };

    private resetForm() {
        this.model.patchValue({
            id: '',
            fullName: '',
            userName: '',
            avatar: '',
            birthday: '',
            idCardNumber: '',
            idCardDateOfIssue: '',
            gender: null,
            ethnic: null,
            denomination: null,
            tin: '',
            joinedDate: null,
            bankingNumber: '',
            nationalId: null,
            provinceId: null,
            districtId: null,
            marriedStatus: null,
            officeId: null,
            titleId: '',
            positionId: '',
            userType: null,
            passportId: '',
            passportDateOfIssue: '',
            enrollNumber: null,
            cardNumber: '',
            ext: '',
            concurrencyStamp: '',
            academicRank: null,
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                titleName: '',
                idCardPlaceOfIssue: '',
                passportPlaceOfIssue: '',
                nativeCountry: '',
                address: '',
                branchBank: '',
                bankName: '',
                nationality: '',
                residentRegister: ''
            });
        });
        this.listUserContact = [];
        this.insertUserContactDefault(this.contactType.mobilePhone);
        this.insertUserContactDefault(this.contactType.email);
        // this.model.patchValue({});
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private getPositionByOfficeId(officeId: number) {
        this.officePositionService.search('', officeId, 1, 10000).subscribe((positions: any) => {
            this.isEnableSelectTitleButton = true;
            const positionsTmp = [];
            positions.items.forEach((item: any) => {
                positionsTmp.push({id: item.positionId, name: item.positionName, data: item});
            });
            this.listPosition = positionsTmp;
        });
    }

    private getDistrictByProvinceId(provinceId: number) {
        this.nationalService.getDistrictByProvinceId(provinceId).subscribe((result: ISearchResult<any>) => {
            this.enableSelectDistrict = true;
            this.listDistrict = result.items;
        });
    }

    private getProvinceByNationalId(nationalId: number) {
        this.nationalService.getProvinceByNational(nationalId).subscribe((result: ISearchResult<any>) => {
            this.enableSelectProvince = true;
            this.listProvince = result.items;
        });
    }
}
