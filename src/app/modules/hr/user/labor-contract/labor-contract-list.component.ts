import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import { BaseComponent } from '../../../../base.component';
import { LaborContractService } from './labor-contract.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { LaborContract } from './labor-contract.model';
import { FileUpload } from '../../../../shareds/components/nh-upload/nh-upload.model';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'app-user-labor-contract-list',
    templateUrl: './labor-contract-list.component.html',
    providers: [LaborContractService]
})
export class LaborContractListComponent extends BaseComponent implements OnInit {
    @Input() userId: string;
    @Input() allowAdd = false;
    @ViewChild('laborContractDetailModal') detailModal: NhModalComponent;
    isUse: boolean;
    isNext?: boolean;
    contract = new LaborContract();
    listType: { id: number, name: string }[] = [];
    listContract: LaborContract[];
    listAttachment: FileUpload[] = [];

    typeSearch: number;
    fromDateSearch: string;
    toDateSearch: string;
    isShowForm = false;
    isSearchExpires = false;

    constructor(private toastr: ToastrService,
                private laborContractService: LaborContractService) {
        super();
        // this.getPermission(this.appService);
    }

    ngOnInit(): void {
    }

    setUpdate(contract: LaborContract) {
        this.isShowForm = true;
        this.isUpdate = true;
        this.contract = contract;
        this.listAttachment = contract.attachments != null && contract.attachments !== '' ? JSON.parse(contract.attachments) : [];
    }

    delete(contract: LaborContract) {
        let title = `Bạn có chắc chắn muốn xóa hợp đồng mã số: "${contract.no}"`;

        if (contract.isUse) {
            title = `Hợp đồng này hiện đang được sử dụng. Bạn có chắc chắn muốn xóa hợp đồng này không?`;
        }

        // swal({
        //     title: title,
        //     text: 'Lưu ý: sau khi xóa bạn không thể lấy lại được hợp đồng này.',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.laborContractService.delete(contract.id)
        //         .subscribe(result => {
        //             if (result === -1) {
        //                 this.toastr.error(this.formatString(this.message.notExists, 'Thông tin hợp đồng'));
        //                 return;
        //             }
        //
        //             if (result > 0) {
        //                 this.toastr.success(this.formatString(this.message.deleteSuccess, 'hợp đồng'));
        //                 this.search(1);
        //                 return;
        //             }
        //         });
        // }, () => {
        // });
    }

    getAllContractTypes() {
        this.laborContractService.getAllTypes().subscribe((result: any) => this.listType = result);
    }

    addNew() {
        this.isShowForm = true;
        this.contract = new LaborContract();
    }

    onSelectType(type) {
        this.typeSearch = type.map((item) => {
            return item.id;
        }).join(',');
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        if (!this.isSearchExpires) {
            this.laborContractService.search(this.keyword, this.typeSearch, this.userId,
                this.fromDateSearch, this.toDateSearch, this.isUse, this.currentPage, this.pageSize)
                .subscribe((result: any) => {
                    this.isSearching = false;
                    this.listContract = result.items;
                    this.totalRows = result.totalRows;
                });
        } else {
            this.laborContractService.searchExpires(this.keyword, this.typeSearch, this.userId,
                this.isNext, this.fromDateSearch, this.toDateSearch, this.currentPage, this.pageSize)
                .subscribe((result: any) => {
                    this.isSearching = false;
                    this.listContract = result.items;
                    this.totalRows = result.totalRows;
                });
        }
    }

    detail(contract: LaborContract) {
        this.contract = contract;
        this.listAttachment = contract.attachments != null && contract.attachments !== '' ? JSON.parse(contract.attachments) : [];
        this.detailModal.open();
    }

    showUserInfo(userId: string) {
        // console.log(userId);
    }

    downloadAttachment(attachment: any) {
        this.downloading = true;
        this.laborContractService.downloadAttachment(attachment.id, attachment.contentType)
            .pipe(finalize(() => this.downloading = false))
            .subscribe((result: any) => {
                FileSaver.saveAs(result, 'DANH-SACH-HOP-DONG.xlsx');
                const fileURL = URL.createObjectURL(result);
                window.open(fileURL);
            });
    }

    onPageClick(currentPage: number) {
        this.search(currentPage);
    }

    onFormClosed(event) {
        this.isShowForm = false;
        if (event) {
            this.search(1);
        }
    }
}
