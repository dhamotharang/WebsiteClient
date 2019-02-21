import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OfficePositionService } from '../services/office-position.service';
import { BaseComponent } from '../../../../../base.component';

@Component({
    selector: 'app-office-title-list',
    templateUrl: './office-title.component.html',
    providers: [OfficePositionService]
})
export class OfficeTitleComponent extends BaseComponent implements OnInit {
    @Input() officeId: number;
    listTitle = [];
    private searchTerm = new Subject<string>();

    constructor(private toastr: ToastrService,
                private officeTitleService: OfficePositionService) {
        super();
    }

    ngOnInit() {
        // this.searchTerm.subscribe(term => {
        //     this.isSearching = true;
        //     this.keyword = term;
        //     this.officeTitleService.searchTitleByOfficeId(this.keyword, this.officeId, this.currentPage, this.pageSize)
        //         .subscribe((result: any) => {
        //             if (result) {
        //                 this.isSearching = false;
        //                 this.listTitle = result.items;
        //                 this.totalRows = result.totalRows;
        //             }
        //         });
        // });
    }

    onSelectTitle(title) {
        // this.isSaving = true;
        // this.officeTitleService.insert(title.id, this.officeId).subscribe(result => {
        //     this.isSaving = false;
        //
        //     if (result === -1) {
        //         this.toastr.error(`Chức danh ${title.name} đã tồn tại trong phòng ban này. Vui lòng kiểm tra lại`);
        //         return;
        //     }
        //
        //     if (result === -2) {
        //         this.toastr.error('Chức danh không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại hoặc liên hệ với quản trị viên.');
        //         return;
        //     }
        //
        //     if (result === -3) {
        //         this.toastr.error('Thông tin phòng ban không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại hoặc liên hệ với quản trị viên');
        //         return;
        //     }
        //
        //     if (result > 0) {
        //         this.search(1);
        //         this.toastr.success('Thêm chức danh vào phòng ban thành công.');
        //         return;
        //     }
        // });
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.searchTerm.next(this.keyword);
    }

    delete(officeTitle) {
        // swal({
        //     title: `Bạn có chắc chắn muốn xóa chức danh: "${officeTitle.titleName}" ra khỏi phòng ban này không?`,
        //     text: this.message.deleteWarning,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then((isConfirm: boolean) => {
        //     if (isConfirm) {
        //         this.officeTitleService.delete(officeTitle.titleId, officeTitle.officeId).subscribe(result => {
        //             if (result === -1) {
        //                 this.toastr.error(`Chức danh: "${officeTitle.titleName}" không tồn tại trong phòng ban này.`);
        //                 return;
        //             }
        //
        //             if (result === -2) {
        //                 this.toastr.error('Chức danh của phòng ban này đang được người dùng sử dụng. Vui lòng xóa chức danh của người dùng trước khi xóa chức danh trong phòng ban.');
        //                 return;
        //             }
        //
        //             if (result > 0) {
        //                 // this.toastr.success("Xóa chức danh khỏi phòng ban thành công.");
        //                 setTimeout(() => {
        //                     swal({
        //                         title: 'Đã xóa',
        //                         text: 'Xóa chức vụ thành công.',
        //                         type: 'success',
        //                         timer: 1500,
        //                         showConfirmButton: false
        //                     });
        //                 }, 200);
        //                 this.search(this.currentPage);
        //                 return;
        //             }
        //         });
        //     }
        // }, () => {
        // });
    }
}
