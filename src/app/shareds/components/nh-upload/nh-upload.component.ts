import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

import {FileUpload} from './nh-upload.model';
import {NhUploadService} from './nh-upload.service';
import * as _ from 'lodash';

declare var swal: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nh-upload',
    template: `
        <form>
            <span *ngIf="!multiple">
                <div class="fileinput fileinput-new cm-mg-0" data-provides="fileinput" *ngIf="type == 'button'"
                     (change)="add($event)">
                    <span [class]="classBtn">
                        <i *ngIf="!uploading" [class]="iconSelect"></i>
                        <i class="fa fa-pulse fa-spinner" *ngIf="uploading"></i>
                        <input type="hidden"/>
                        <input type="file" [id]="id"/>
                        {{ selectText }}
                    </span>
                    <button type="button" [class]="classBtn" *ngIf="!autoUpload" [disabled]="!file">
                        <i *ngIf="!uploading" [class]="iconUpload"></i>
                        {{ uploadText }}
                    </button>
                </div>
                <div class="fileinput fileinput-new cm-mgb-0" data-provides="fileinput" *ngIf="type === 'buttongroup'">
                    <div class="input-group input-large">
                        <div class="form-control uneditable-input input-fixed input-medium" data-trigger="fileinput">
                            <span class="fileinput-filename">{{ text }}</span>
                        </div>
                        <span class="input-group-addon btn default btn-file">
                            <i [class]="iconUpload" *ngIf="file && !file.isUploading"></i>
                            <i class="fa fa-spinner fa-pulse" *ngIf="file && file.isUploading"></i>
                            <span class="fileinput-new">{{ text ? changeText : uploadText }}</span>
                            <input type="hidden" value=""/><input type="file" name="" [id]="id" (change)="add($event)">
                        </span>
                        <a href="javascript:;" class="input-group-addon btn red" data-dismiss="fileinput" *ngIf="text"
                           (click)="deleteFile()">{{ deleteText }}</a>
                    </div>
                </div>
            </span><!-- end single -->

            <span *ngIf="multiple">
                <div class="fileinput fileinput-new cm-mgb-0" data-provides="fileinput" *ngIf="type == 'button'"
                     (change)="add($event)">
                    <span [class]="classBtn">
                        <i *ngIf="!uploading" [class]="iconSelect"></i>
                        <i class="fa fa-pulse fa-spinner" *ngIf="uploading"></i>
                        <input type="hidden"/>
                        <input type="file" [id]="id" multiple/>
                        {{ selectText }}
                    </span>
                    <button type="button" [class]="classBtn" *ngIf="!autoUpload" [disabled]="!file">
                        <i *ngIf="!uploading" [class]="iconUpload"></i>
                        {{ uploadText }}
                    </button>
                </div>
                <div class="fileinput fileinput-new cm-mgb-0" data-provides="fileinput" *ngIf="type === 'buttongroup'">
                    <div class="input-group input-large">
                        <div class="form-control uneditable-input input-fixed input-medium" data-trigger="fileinput">
                            <span class="fileinput-filename">{{ text }}</span>
                        </div>
                        <span class="input-group-addon btn default btn-file">
                            <i [class]="iconUpload" *ngIf="file && !file.isUploading"></i>
                            <i class="fa fa-spinner fa-pulse" *ngIf="file && file.isUploading"></i>
                            <span class="fileinput-new">{{ text ? changeText : uploadText }}</span>
                            <input type="hidden" value=""/><input type="file" name="" multiple [id]="id"
                                                                  (change)="add($event)">
                        </span>
                        <a href="javascript:;" class="input-group-addon btn red" data-dismiss="fileinput" *ngIf="text"
                           (click)="deleteFile()">{{ deleteText }}</a>
                    </div>
                </div>
            </span><!-- end multiple -->
        </form>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NhUploadComponent), multi: true }
    ]
})

export class NhUploadComponent implements OnChanges, ControlValueAccessor {
    @Input() id: string = new Date().getMilliseconds().toLocaleString();
    @Input() url: string;
    @Input() type = 'button'; // Button - Button Group
    @Input() showPreivew = true;
    @Input() autoUpload = true;
    @Input() iconUpload = 'fa fa-cloud-upload';
    @Input() iconSelect = 'fa fa-television';
    @Input() selectText = 'Chọn file từ máy tính';
    @Input() changeText = 'Thay đổi';
    @Input() uploadText = 'Tải file lên';
    @Input() deleteText = 'Xóa file';
    @Input() singleRequest = true;
    @Input() multiple = false;
    @Input() text = '';
    @Input() allowFileTypes = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.rar', '.zip'];
    @Input() isAttchImage = false;
    @Input() classBtn = 'btn btn-primary btn-file';

    @Output() onAdd = new EventEmitter();
    @Output() onAbort = new EventEmitter();
    @Output() onComplete = new EventEmitter();
    @Output() onError = new EventEmitter();
    @Output() onProgress = new EventEmitter();
    @Output() onStart = new EventEmitter();
    @Output() onStop = new EventEmitter();
    @Output() onDelete = new EventEmitter();

    uploading;
    listFilesUpload: FileUpload[] = [];

    propagateChange: any = () => {
    }

    constructor(private el: ElementRef,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private uploadService: NhUploadService) {
        this.id = this.isAttchImage === true ? `file-upload-image-${new Date().getTime()}` : `file-upload-${new Date().getTime()}`;
        this.uploadService.url = this.url;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('url')) {
            if (changes['url'].currentValue) {
                this.uploadService.url = changes['url'].currentValue;
            }
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
    }

    writeValue(value) {
        this.text = value;
    }

    add(event) {
        const files = event.target.files;
        this.listFilesUpload = [];
        if (this.multiple) {
            _.each(files, (file: any, index) => {
                if (!this.validateFileType(files)) {
                    this.toastr.error('Tệp tin tải lên không đúng định dạng');
                } else {
                    this.listFilesUpload.push(new FileUpload(file.name, file.size, file));
                }
            });

            if (this.autoUpload) {
                this.upload();
            }
        } else {
            if (!this.validateFileType(files)) {
                this.toastr.error('Tệp tin tải lên không đúng định dạng');
                return;
            }

            this.listFilesUpload = [];
            this.listFilesUpload.push(new FileUpload(files[0].name, files[0].size, files[0]));
            if (this.autoUpload) {
                this.upload();
            }
        }
    }

    upload() {
        if (this.listFilesUpload.length <= 0) {
            this.toastr.error('Vui lòng chọn ít nhất một tệp tin tải lên');
            return;
        }

        this.uploadService.upload(this.listFilesUpload)
            .subscribe(x => {
                if (x.data === -1) {
                    this.toastr.error('Vui lòng chọn ít nhất 1 ảnh');
                    this.onComplete.emit(null);
                    return;
                }

                if (x.data === -2) {
                    this.toastr.error('Ảnh tải lên không đúng định dạng. Vui lòng kiểm tra lại');
                    this.onComplete.emit(null);
                    return;
                }

                if (x.data === -3) {
                    this.toastr.error('Ảnh tải lên không được vượt quá 5MB');
                    this.onComplete.emit(null);
                    return;
                }

                (<HTMLFormElement>$(`#${this.id}`).wrap('<form>').closest('form').get(0)).reset();
                $(`#${this.id}`).unwrap();
                const data = JSON.parse(x.data);
                switch (x.status) {
                    case 'complete':
                        this.onComplete.emit(!this.multiple ? data[0] : data);
                        break;
                    case 'error':
                        this.onError.emit(JSON.parse(x.data));
                        break;
                    case 'abort':
                        this.onAbort.emit(JSON.parse(x.data));
                        break;
                }
            });
    }

    abort(file: FileUpload) {

    }

    deleteFile() {
        this.onDelete.emit();
        this.text == null;
    }

    delete(fileUpload: FileUpload) {
        swal({
            title: `Bạn có chắc chắn muốn xóa tệp tin: "${fileUpload.originalName}"`,
            text: 'Lưu ý: sau khi xóa bạn không thể lấy lại tệp tin này.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ'
        }, (isConfirm: boolean) => {
            if (isConfirm) {
                _.remove(this.listFilesUpload, (item) => {
                    return item === fileUpload;
                });
            }
        });
    }

    private validateFileType(files) {
        const file = files[0];
        const regex = /(?:\.([^.]+))?$/; // Regex get extension
        const ext = regex.exec(file.name)[1];
        if (ext) {
            return this.allowFileTypes.indexOf(`.${ext.toLowerCase()}`) !== -1;
        }
        return false;
    }
}
