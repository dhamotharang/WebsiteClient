﻿import { IMessage } from './interfaces/imessage';
import { BriefUser } from './view-model/brief-user';
import { Observable } from 'rxjs';

export module String {
    export let format: any;
}

export class BaseComponent {
    isSaving = false;
    isUpdate = false;
    isShowForm = false;
    isLoading = false;
    isSearching = false;
    message: IMessage;
    totalRows = 0;
    currentPage = 1;
    pageSize = 20;
    isSubmitted = false;
    keyword = '';
    isActiveSearch = null;
    pageTitle = '';
    errorMessage: string;
    formErrors: any = {};
    validationMessages: any = {};
    isHasInsertPermission = false;
    isHasUpdatePermission = false;
    isHasDeletePermission = false;
    isHasPrintPermission = false;
    isHasApprovePermission = false;
    isHasExportPermission = false;
    isHasViewPermission = false;
    isHasReportPermission = false;
    currentUser: BriefUser;
    subscribers: any = {};
    downloading = false;
    totalRows$: Observable<number>;
    dateTimeValidFormat = [
        'DD/MM/YYYY',
        'DD/MM/YYYY HH:mm',
        'DD/MM/YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm Z',
        'DD-MM-YYYY',
        'DD-MM-YYYY HH:mm',
        'DD-MM-YYYY HH:mm:ss',
        'DD-MM-YYYY HH:mm Z',
        // --------------------
        'MM/DD/YYYY',
        'MM/DD/YYYY HH:mm',
        'MM/DD/YYYY HH:mm:ss',
        'MM/DD/YYYY HH:mm Z',
        'MM-DD-YYYY',
        'MM-DD-YYYY HH:mm',
        'MM-DD-YYYY HH:mm:ss',
        'MM-DD-YYYY HH:mm Z',
        // --------------------
        'YYYY/MM/DD',
        'YYYY/MM/DD HH:mm',
        'YYYY/MM/DD HH:mm:ss',
        'YYYY/MM/DD HH:mm Z',
        'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm Z',
        // --------------------
        'YYYY/DD/MM',
        'YYYY/DD/MM HH:mm',
        'YYYY/DD/MM HH:mm:ss',
        'YYYY/DD/MM HH:mm Z',
        'YYYY-DD-MM',
        'YYYY-DD-MM HH:mm',
        'YYYY-DD-MM HH:mm:ss',
        'YYYY-DD-MM HH:mm Z',
    ];

    constructor() {
    }

    resetAfterSave() {
        this.isSaving = false;
        this.isSubmitted = false;
    }

    formatString(message: string, ...args: string[]) {
        args.forEach((value, index) => {
            const pattern = new RegExp(`\\{${index}\\}`, 'g');
            message = message.replace(pattern, value);
        });
        return message;
    }

    // showWarningBox(title: string, message: string) {
    //     this.showAlertBox(title, message, 'warning');
    // }
    //
    // showSuccessBox(title: string, message: string) {
    //     this.showAlertBox(title, message, 'success');
    // }
    //
    // showDangerBox(title: string, message: string) {
    //     this.showAlertBox(title, message, 'error');
    // }
    //
    // showInfoBox(title: string, message: string) {
    //     this.showAlertBox(title, message, 'info');
    // }

    // showAlertBox(title: string, message: string, type: any = 'success') {
    //     setTimeout(() => {
    //         swal({
    //             title: title,
    //             text: message,
    //             type: type,
    //             timer: 1500,
    //             showConfirmButton: false
    //         }).then(() => {
    //         }, () => {
    //         });
    //     });
    // }

    getListOrderNumber(currentPage, pageSize, index): number {
        return (currentPage - 1) * pageSize + index + 1;
    }

    // getPermission(appService: AppService) {
    //     // setTimeout(() => {
    //     //     this.isHasViewPermission = appService.checkPermission(PERMISSION_VALUE_DI.view);
    //     //     this.isHasInsertPermission = appService.checkPermission(PERMISSION_VALUE_DI.insert);
    //     //     this.isHasUpdatePermission = appService.checkPermission(PERMISSION_VALUE_DI.update);
    //     //     this.isHasDeletePermission = appService.checkPermission(PERMISSION_VALUE_DI.delete);
    //     //     this.isHasExportPermission = appService.checkPermission(PERMISSION_VALUE_DI.export);
    //     //     this.isHasPrintPermission = appService.checkPermission(PERMISSION_VALUE_DI.print);
    //     //     this.isHasApprovePermission = appService.checkPermission(PERMISSION_VALUE_DI.approve);
    //     //     this.isHasReportPermission = appService.checkPermission(PERMISSION_VALUE_DI.report);
    //     // });
    // }

    // renderFormError(args: string[]) {
    //     let object = {};
    //     args.forEach((item) => {
    //         object[item] = "";
    //     });
    //     return object;
    // }
    // private getFormErrors(form: FormGroup, formErrors: any, validationMessages: any): boolean {
    //     let isValid = true;
    //     debugger;
    //     for (const field in formErrors) {
    //         if (typeof(formErrors[field]) === "object" && field != null && form != null) {
    //             let newFormGroup = <any>form.get(field) as FormGroup;
    //             isValid = this.getFormErrors(newFormGroup, formErrors[field], validationMessages[field]);
    //         } else {
    //             if (field != null && form != null) {
    //                 formErrors[field] = "";
    //                 const control = form.get(field);
    //                 if (control && (control.dirty || (this.isSubmitted && control.pristine)) && !control.valid) {
    //                     const messages = validationMessages[field];
    //                     for (const key in control.errors) {
    //                         formErrors[field] += messages[key] + " ";
    //                         isValid = false;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //
    //     return isValid;
    // }
}
