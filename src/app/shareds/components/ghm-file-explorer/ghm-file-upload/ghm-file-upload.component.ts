import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GhmFileUploadService } from './ghm-file-upload.service';

@Component({
    selector: 'ghm-file-upload',
    templateUrl: './ghm-file-upload.component.html',
    styleUrls: ['../ghm-file-explorer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GhmFileUploadComponent implements OnInit {
    @Input() folderId?: number;
    @Input() multiple = true;

    constructor(private ghmFileUploadService: GhmFileUploadService) {

        this.ghmFileUploadService.sent$.subscribe(result => console.log('Start upload'));
        this.ghmFileUploadService.progress$.subscribe(result =>
            console.log(result));
        this.ghmFileUploadService.complete$.subscribe(result => console.log(result));
    }

    ngOnInit() {
    }

    onFileChange(event: any) {
        const files = event.target.files;
        console.log(this.folderId);
        this.ghmFileUploadService.upload(files, {folderId: this.folderId})
            .subscribe((response: any) => console.log(response));
    }

}
