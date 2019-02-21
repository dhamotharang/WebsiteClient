import {Component, OnInit, Inject, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {finalize, map} from 'rxjs/operators';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {HelperService} from '../../../shareds/services/helper.service';
import {AcademicRank, Gender, User, UserStatus} from './models/user.model';
import {TreeData} from '../../../view-model/tree-data';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {UtilService} from '../../../shareds/services/util.service';
import {UserService} from './services/user.service';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {OfficeService} from '../organization/office/services/office.service';
import {BaseListComponent} from '../../../base-list.component';
import {UserSearchViewModel} from './models/user-search.viewmodel';
import {PositionService} from '../organization/position/position.service';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {ISearchResult} from '../../../interfaces/isearch.result';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, OfficeService, PositionService
    ],
})

export class UserComponent extends BaseListComponent<UserSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('searchModel') searchModel: NhModalComponent;
    listUserStatus = [];
    listPosition = [];
    listMonth = [];
    listYear = [];
    status;
    officeIdSearch;
    officeIdPathSearch;
    officeNameSearch: string;
    positionId;
    genderId;
    month;
    year;
    academicRankId;
    downloading = false;
    officeTree: TreeData[] = [];
    userStatus = UserStatus;
    academicRank = AcademicRank;
    gender = Gender;
    height;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private helperService: HelperService,
                private utilService: UtilService,
                private userService: UserService,
                private positionService: PositionService,
                private officeService: OfficeService) {
        super();
        this.renderPosition();
        this.renderListUserStatus();
        this.renderListMonth();
        this.renderListYear();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.HR, this.pageId.USER, 'Quản lý nhân viên', 'Danh sách nhân viên');

        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<UserSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.positionId = params.position ? params.position : '';
            this.status = params.status ? params.status : '';
            this.officeIdPathSearch = params.officeIdPath ? params.officeIdPath : '';
            this.officeNameSearch = params.officeName ? params.officeName : '';
            this.genderId = params.gender ? parseInt(params.gender) : '';
            this.month = params.month ? parseInt(params.month) : '';
            this.year = params.year ? parseInt(params.year) : '';
            this.academicRankId = params.academicRank ? parseInt(params.academicRank) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
        this.reloadTree();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 270;
    }
    edit(user: UserSearchViewModel) {
        this.router.navigate([`/users/edit/${user.id}`]);
    }

    setUpdate(userId: string) {
    }

    detail(userId: string) {
        this.router.navigate([`/users/detail/${userId}`]);
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.userService.search(this.keyword, this.positionId, this.status, this.officeIdPathSearch, this.genderId,
            this.month, this.year, this.academicRankId, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((data: ISearchResult<UserSearchViewModel>) => {
                    this.totalRows = data.totalRows;
                    return data.items;
                }));
    }

    // Trigger from other components
    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    onSelectOffice(office: TreeData) {
        if (office) {
            this.officeIdPathSearch = office.data.idPath;
            this.officeIdSearch = office.id;
            this.officeNameSearch = office.text;
        } else {
            this.officeIdPathSearch = '';
            this.officeIdSearch = null;
        }
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.officeIdPathSearch = '';
        this.officeIdSearch = null;
        this.officeNameSearch = '';
        this.status = null;
        this.positionId = '';
        this.genderId = null;
        this.month = null;
        this.year = null;
        this.academicRankId = null;
        this.search(1);
    }

    selectAcademicRank(value) {
    }

    searchAdvanced() {
        this.search(1);
        this.searchModel.dismiss();
    }

    import() {
    }

    export() {
        this.downloading = true;
        this.userService.export(this.officeIdPathSearch)
            .subscribe(result => {
                this.downloading = false;
                FileSaver.saveAs(result, 'DANH_SACH_NHAN_VIEN.xlsx');
                const fileURL = URL.createObjectURL(result);
                window.open(fileURL);
            });
    }

    exportLaborContract() {
        this.downloading = true;
        this.userService.exportLabor(this.officeIdPathSearch)
            .subscribe(result => {
                this.downloading = false;
                FileSaver.saveAs(result, 'HOP_DONG_LAO_DONG.xlsx');
                const fileURL = URL.createObjectURL(result);
                window.open(fileURL);
            });
    }

    exportRecord() {
        this.downloading = true;
        this.userService.exportRecord(this.officeIdPathSearch)
            .subscribe(result => {
                this.downloading = false;
                FileSaver.saveAs(result, 'HO_SO_GIAY_TO.xlsx');
                const fileURL = URL.createObjectURL(result);
                window.open(fileURL);
            });
    }

    exportAssessment() {
    }

    onSelectStatus(status) {
        this.status = status.map((item) => {
            return item.id;
        }).join(',');
    }

    delete(id: string) {
        this.userService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    print(user: User) {
        this.userService.getDetail(user.id).subscribe(x => {
            const userInfo = x;
            if (userInfo) {
                const style = `
                            .user-info-print-container {
                                position: relative;
                                padding: 0 30px;
                            }

                            .user-info-print-container .header {
                                text-align: center;
                            }

                            .user-info-print-container .header img {
                                width: 75%;
                            }

                            .user-info-print-container .footer {
                                position: fixed;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                            }

                            .user-info-print-container .footer img {
                                width: 100%;
                            }

                            .user-info-print-container .title {
                                font-size: 20px;
                                font-weight: bold;
                                text-align: center;
                                margin-top: 15px;
                                margin-bottom: 20px;
                            }

                            .user-info-print-container .avatar-container {
                                width: 20%;
                                float: left;
                                text-align: center;
                            }

                            .user-info-print-container .avatar-container img {
                                width: 100%;
                            }

                            .user-info-print-container .avatar-container .full-name {
                                font-weight: bold;
                                margin-top: 15px;
                                text-transform: uppercase;
                            }

                            .user-info-print-container .avatar-container img{
                                border-radius: 50%;
                            }

                            .user-info-print-container .info-container {
                                width: 80%;
                                float: left;
                            }

                            .user-info-print-container .info-container table {
                                width: 100%;
                            }

                            .user-info-print-container .info-container table tr td {
                                padding: 4px 10px;
                            }
                            .user-info-print-container .info-container table tr td.w20 {
                                width:100px;
                            }
                            .user-info-print-container .info-container table tr td.w30 {
                                width:30%;
                            }
                            .user-info-print-container table td div{
                                    padding: 2px 3px;
                                    width: 100%;
                                    border: 1px solid #999;
                                    min-height: 25px; width: 100%;
                            }
                            `;
                const content = `
                        `;

                this.helperService.openPrintWindow('Thông tin nhân viên', content, style);
            } else {
                this.toastr.error('Thông tin người dùng không tồn tại. Vui lòng kiểm tra lại');
                return;
            }
        });
    }

    private reloadTree() {
        this.officeService.getTree().subscribe((result: any) => {
            this.officeTree = result;
        });
    }

    private renderPosition() {
        this.positionService.getAllActivated().subscribe((result: any) => {
            this.listPosition = result;
        });
    }

    private renderStatusName(list) {
        _.each(list, (item: any) => {
            item.statusName = item.status === this.userStatus.collaborators ? 'Dịch vụ - CTV'
                : item.status === this.userStatus.apprentice ? 'Học việc'
                    : item.status === this.userStatus.probation ? 'Thử việc'
                        : item.status === this.userStatus.official ? 'Chính thức'
                            : item.status === this.userStatus.maternity ? 'Thai sản'
                                : item.status === this.userStatus.discontinue ? 'Thôi việc'
                                    : item.status === this.userStatus.retirement ? 'Nghỉ hưu'
                                        : 'Chưa xác định';
        });

        return list;
    }

    private renderListUserStatus() {
        this.listUserStatus = [
            {id: this.userStatus.collaborators, name: 'Dịch vụ - CTV'},
            {id: this.userStatus.apprentice, name: 'Học việc'},
            {id: this.userStatus.probation, name: 'Thử việc'},
            {id: this.userStatus.official, name: 'Chính thức'},
            {id: this.userStatus.maternity, name: 'Thai sản'},
            {id: this.userStatus.discontinue, name: 'Thôi việc'},
            {id: this.userStatus.retirement, name: 'Nghỉ hưu'},
        ];
    }

    private renderListMonth() {
        this.listMonth = [];
        for (let i = 1; i <= 12; i++) {
            this.listMonth.push({
                id: i,
                name: 'Tháng ' + i,
            });
        }
        return this.listMonth;
    }

    private renderListYear() {
        this.listYear = [];
        for (let i = 1900; i <= new Date().getFullYear(); i++) {
            this.listYear.push({
                id: i,
                name: 'Năm' + i,
            });
        }
        return this.listYear;
    }

    private renderFilterLink() {
        const path = '/users';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('position', this.positionId),
            new FilterLink('officeIdPath', this.officeIdPathSearch),
            new FilterLink('gender', this.genderId),
            new FilterLink('month', this.month),
            new FilterLink('year', this.year),
            new FilterLink('academicRank', this.academicRankId),
            new FilterLink('status', this.status),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
