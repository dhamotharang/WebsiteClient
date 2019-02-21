import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ghm-paging',
    templateUrl: './ghm-paging.component.html',
    styleUrls: ['./ghm-paging.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GhmPagingComponent implements OnInit, OnChanges {
    @Input() totalRows: number;
    @Input() pageSize = 20;
    @Input() isShowSummary = false;
    @Input() pageShow = 5;
    @Input() currentPage = 5;
    @Input() isDisabled = false;
    @Input() pageName = false;
    @Input() summaryMessage: string;

    @Output() pageClick = new EventEmitter();

    isShowPaging = true;
    isShowNext = false;
    isShowPrevious = false;
    totalPage = 0;
    fromPageSummary = 1;
    toPageSummary = 1;

    listPageShow = [];

    constructor() {

    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('totalRows') && changes['totalRows'].currentValue !== 0) {
            this.buildPaging();
        }

        if (changes.hasOwnProperty('totalRows') && changes['totalRows'].currentValue === 0) {
            this.summaryMessage = `Chưa có ${this.pageName} nào để hiển thị.`;
        }
    }

    onClick(currentPage: number) {
        this.currentPage = currentPage;
        this.refreshPaging();
        this.pageClick.emit(currentPage);
    }

    previousClick() {
        this.currentPage -= 1;
        this.refreshPaging();
        this.pageClick.emit(this.currentPage);
    }

    nextClick() {
        this.currentPage += 1;
        this.refreshPaging();
        this.pageClick.emit(this.currentPage);
    }

    buildPaging() {
        let pageForShow = this.pageShow;
        this.totalPage = Math.ceil(this.totalRows / this.pageSize);
        if (this.totalPage <= 1) {
            this.isShowPaging = false;
        } else {
            this.isShowPaging = true;
        }

        if (this.totalPage > 0) {
            this.listPageShow = [];

            if (this.totalPage < this.pageShow) {
                pageForShow = this.totalPage;
            } else {
                pageForShow = this.pageShow;
            }

            for (let i = 1; i <= pageForShow; i++) {
                this.listPageShow.push(i);
            }

            this.isShowPrevious = this.currentPage > 1;
            this.isShowNext = this.currentPage < this.totalPage;
            this.renderSummary();
        }
    }

    refreshPaging() {
        if (this.totalPage > this.pageShow) {
            const pageStep = Math.floor(this.pageShow / 2);
            let previousPage = this.currentPage - (pageStep - (this.pageShow % 2 > 0 ? 0 : 1));
            let nextPage = this.currentPage + pageStep;

            if (previousPage < 1) {
                previousPage = 1;
                nextPage = this.pageShow;
            }

            if (nextPage > this.totalPage) {
                nextPage = this.totalPage;
            }

            if (this.totalPage - this.currentPage < pageStep) {
                previousPage = this.totalPage - this.pageShow + 1;
                nextPage = this.totalPage;
            }

            this.listPageShow = [];

            for (let i = previousPage; i < this.currentPage; i++) {
                this.listPageShow.push(i);
            }

            for (let i = this.currentPage; i <= nextPage; i++) {
                this.listPageShow.push(i);
            }
        }

        this.isShowPrevious = this.currentPage > 1;
        this.isShowNext = this.currentPage < this.totalPage;
        this.renderSummary();
    }

    renderSummary() {
        this.fromPageSummary = (this.currentPage - 1) * this.pageSize + 1;
        this.toPageSummary = this.currentPage * this.pageSize;

        if (this.toPageSummary > this.totalRows) {
            this.toPageSummary = this.totalRows;
        }
        // console.log(this.summaryMessage);
        // this.summaryMessage = `Hiển thị từ ${this.fromPageSummary} đến ${this.toPageSummary} của  ${this.totalRows} ${this.pageName}`;
    }
}
