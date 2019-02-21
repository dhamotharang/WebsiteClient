import {Component, OnInit, Renderer, Inject, Output, EventEmitter} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {FormBuilder} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {IAppConfig} from '../../../../interfaces/iapp-config';
import {DestroySubscribers} from '../../../../shareds/decorator/destroy-subscribes.decorator';
import {APP_CONFIG} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {NumberValidator} from '../../../../validators/number.validator';
import {DateTimeValidator} from '../../../../validators/datetime.validator';
import {AuthService} from '../../../../shareds/services/auth.service';
import {NationalService} from '../services/national.service';
import {AcademicRank, Gender, MarriedStatus, UserType} from '../models/user.model';
import {CheckPermission} from '../../../../shareds/decorator/check-permission.decorator';
import {OfficePositionService} from '../../organization/office/services/office-position.service';
import {TitleService} from '../../organization/title/title.service';
import {OfficeService} from '../../organization/office/services/office.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {UserContact, ContactType} from '../models/user-contact.model';
import * as _ from 'lodash';
import {PositionService} from '../../organization/position/position.service';
import {UserDetailViewModel} from '../models/user-detail.viewmodel';
import {UserService} from '../services/user.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-detail.component.html',
    styleUrls: ['../../../../../assets/pages/css/profile.css'],
    providers: [OfficePositionService, TitleService, NumberValidator, DateTimeValidator, NationalService, OfficeService, PositionService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})

export class UserDetailComponent extends BaseFormComponent implements OnInit {
    // @ViewChild(LaborContractListComponent) laborContractList: LaborContractListComponent;
    // @ViewChild(AcademicLevelComponent) academicLevelComponent: AcademicLevelComponent;
    // @ViewChild(InsuranceListComponent) insuranceList: InsuranceListComponent;
    // @ViewChild(TrainingHistoryListComponent) trainingHistoryList: TrainingHistoryListComponent;
    // @ViewChild(EmploymentHistoryListComponent) employmentHistoryList: EmploymentHistoryListComponent;
    // @ViewChild(CommendationDisciplineListComponent) commendationDisciptionList: CommendationDisciplineListComponent;
    // @ViewChild(RecordsManagementFormComponent) recordsFormComponent: RecordsManagementFormComponent;
    @Output() onCloseForm = new EventEmitter<any>();

    pageTitle = 'Chi tiết người dùng';
    formValue = 1;
    formTitle = 'Thông tin nhân viên';
    userInfo = new UserDetailViewModel();
    listUserContact = [];
    listUserTranslation = [];
    contactType = ContactType;
    academicRank = AcademicRank;
    userType = UserType;
    marriedStatus = MarriedStatus;
    gender = Gender;
    userId;

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
                private userService: UserService) {
        super();
    }

    ngOnInit(): void {
        this.subscribers.routeData = this.route.data.subscribe((data: { detail: any }) => {
            const userDetail = data.detail;
            if (userDetail) {
                this.userId = userDetail.id;
                this.userInfo = userDetail;
                if (userDetail.userContacts && userDetail.userContacts.length > 0) {
                    this.listUserContact = userDetail.userContacts;
                }
                if (userDetail.userTranslations && userDetail.userTranslations.length > 0) {
                    this.listUserTranslation = userDetail.userTranslations;
                }
                this.pageTitle = 'Chi tiết thông tin người dùng ' + userDetail.fullName;
            }
        });
        this.appService.setupPage(this.pageId.HR, this.pageId.TITLE, 'Quản lý nhân sự', this.pageTitle);
        this.insertUserContactDefault(this.contactType.mobilePhone);
        this.insertUserContactDefault(this.contactType.email);
    }

    closeForm() {
        this.router.navigate(['/users']);
    }

    showForm(value) {
        this.formValue = value;
        switch (value) {
            case 0: // Show detail
                this.formTitle = 'Chi tiết nhân viên';
                break;
            case 1: // Show Update form
                this.formTitle = 'Thông tin nhân viên';
                break;
            //     case 2: // Show labor contract
            //         this.formTitle = 'Quản lý hợp đồng';
            //         this.laborContractList.getAllContractTypes();
            //         this.laborContractList.search(1);
            //         break;
            //     case 3: // open Academic level
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
            default:
                this.router.navigate(['/users']);
                this.onCloseForm.emit();
                break;
        }
    }

    edit() {
        this.router.navigate([`/users/edit/${this.userId}`]);
    }

    delete() {
        this.userService.delete(this.userId)
            .subscribe(() => {
                this.router.navigate([`/users`]);
                return;
            });
    }

    print() {
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
}
