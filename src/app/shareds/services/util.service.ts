import {FormArray, FormGroup} from '@angular/forms';
import {Injectable, Type, ViewContainerRef} from '@angular/core';
import {isNumber} from 'util';
import * as _ from 'lodash';
import {FilterLink} from '../models/filter-link.model';
import {TimeObject} from '../models/time-object.model';

/**
 * Created by HoangNH on 5/13/2017.
 */
declare var Globalize;

@Injectable()
export class UtilService {
    formatNumberic(value: any, ext?: string) {
        if (isNaN(value)) {
            return '';
        }
        if (parseFloat(value) === 0) {
            return '0';
        }
        if (typeof ext === 'undefined') {
            ext = 'N' + 2;
        }
        if (value == null || value === '') {
            return '';
        }
        value = Globalize.format(value, ext).toString();
        if (
            value.split('.')[1] === '0000' ||
            value.split('.')[1] === '000' ||
            value.split('.')[1] === '00' ||
            value.split('.')[1] === '0'
        ) {
            value = value.split('.')[0];
        }
        return value;
    }

    formatString(message: string, ...args: string[]): string {
        args.forEach((value, index) => {
            const pattern = new RegExp(`\\{${index}\\}`, 'g');
            message = message.replace(pattern, value);
        });
        return message;
    }

    getEditorId(id: string): string {
        return id + new Date().getTime();
    }

    generateRandomNumber(): number {
        return Math.floor(Math.random() * 1000);
    }

    focusElement(selector: string, isId: boolean = true) {

        setTimeout(() => {
            if (isId) {
                const element: any = document.getElementById(selector);
                if (element) {
                    element.focus();
                }
            } else {
                const element: any = document.getElementsByClassName(
                    selector
                )[0];
                if (element) {
                    element.focus();
                }
            }
        }, 200);
    }

    setValueElement(selector: string, isId: boolean = true, value: any) {

        setTimeout(() => {
            if (isId) {
                $(`#${selector}`).val(value);
            } else {
                $(`.${selector}`).val(value);
            }
        }, 200);
    }

    scrollIntoView(selector: string, isCenter?: boolean) {
        const element = document.getElementById(`${selector}`);
        if (element) {
            setTimeout(() => {
                if (isCenter) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
                } else {
                    element.scrollIntoView();
                }
            }, 50);
        }
    }

    renderFormError(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormError(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = '';
            }
        });
        return object;
    }

    renderFormErrorMessage(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormErrorMessage(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = item;
            }
        });
        return object;
    }

    validateFormArray(
        formArray: FormArray,
        formError: any,
        validationMessage: any
    ) {
        return formArray.controls.map((control: FormGroup) => {
            const isValid = this.validate(
                control,
                formError,
                validationMessage
            );
            return {
                languageId: control.value.languageId,
                isValid: isValid
            };
        });
    }

    onValueChanged<T>(
        formGroup: T,
        formErrors: any,
        validationMessages: any,
        isSubmit?: boolean,
        elements?: any,
        data?: any
    ): boolean {
        if (!formGroup) {
            return;
        }
        const form = (<any>formGroup) as FormGroup;
        return this.getFormErrors(
            form,
            formErrors,
            validationMessages,
            isSubmit
        );
    }

    validate<T>(
        formGroup: T,
        formErrors: any,
        validationMessages: any
    ): boolean {
        if (!formGroup) {
            return;
        }
        const form = (<any>formGroup) as FormGroup;
        return this.getFormErrors(form, formErrors, validationMessages, true);
    }

    bitwiseCheck(values: number, valueCheck: number) {
        return (values & valueCheck) === valueCheck;
    }

    initListMonth() {
        let listMonth = [];
        for (let i = 1; i <= 12; i++) {
            listMonth = [...listMonth, i];
        }
        return listMonth;
    }

    initListYear() {
        let listYear = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2016; i <= currentYear; i++) {
            listYear = [...listYear, i];
        }
        return listYear;
    }

    renderLocationFilter(params: FilterLink[]): string {
        let query = '';
        params.forEach((param, index: number) => {
            query += `${index > 0 ? '&' : ''}${param.key}=${
                param.value === undefined || param.value == null
                    ? ''
                    : param.value
                }`;
        });
        return query;
    }

    getHourTextFromMinute(
        minutes: number,
        isFullType: boolean = false
    ): string {
        if (minutes === 0) {
            return '';
        }
        if (minutes < 60) {
            return isFullType ? `0 Tiếng ${minutes} Phút` : `0h${minutes}"`;
        }
        if (minutes > 60) {
            const totalHour = Math.floor(minutes / 60);
            const restMin = minutes % 60;
            return isFullType
                ? `${totalHour} Tiếng ${restMin} Phút`
                : `${totalHour}h${restMin}"`;
        }
        return isFullType ? `1 Tiếng` : `1h`;
    }

    addTimeToTimeObject(
        timeObject: TimeObject,
        minute: number,
        isInLate: boolean
    ): string {
        if (!isNumber(minute) || isNaN(minute)) {
            return '';
        }
        const convertHourToMinutes = timeObject.hour * 60;
        const totalMinutes = convertHourToMinutes + timeObject.minute;
        const minutesUpdated = isInLate
            ? totalMinutes + minute
            : totalMinutes - minute;
        let hour = Math.floor(minutesUpdated / 60);
        const mintue = minutesUpdated % 60;
        hour = hour > 23 ? hour % 24 : hour;
        return `${hour}:${mintue < 10 ? '0' + mintue : mintue}`;
    }

    checkCustomFormValid(
        formModel: any,
        formErrors: any,
        validationMessage: string,
        valid?: Function,
        inValid?: Function
    ) {
        const promise = Object.keys(formModel.controls).map(key => {
            return new Promise((resolve, reject) => {
                // console.log(key + ':', formModel.controls[key].errors);
                resolve(formModel.controls[key].valid);
            });
        });
        return Promise.all(promise).then(values => {
            const failCount = _.countBy(values, value => {
                return !value;
            }).true;
            if (!failCount && valid) {
                valid();
            }
            if (failCount > 0) {
                this.onValueChanged(
                    formModel,
                    formErrors,
                    validationMessage,
                    true
                );
            }
            if (failCount > 0 && inValid) {
                inValid();
            }
        });
    }

    isNumber(obj) {
        return !isNaN(obj - 0) && obj != null;
    }

    loadComponent<T>(viewContainerRef: ViewContainerRef, component: Type<T>) {
    }

    isObject(obj) {
        return (typeof obj === 'object' && !Array.isArray(obj) && obj !== null);
    }

    convertToAbbreviation(str: string) {
        if (str) {
            const split = str.trim().split(' ');
            let result = '';
            _.each(split, (item) => {
                result += this.stripToVietnameChar(item.charAt(0)).toUpperCase();
            });

            return result;
        }
    }

    private stripToVietnameChar(str): string {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    }

    private getFormErrors(
        form: FormGroup,
        formErrors: any,
        validationMessages: any,
        isSubmit?: boolean
    ): boolean {
        let inValidCount = 0;
        let isValid = true;
        for (const field in formErrors) {
            if (
                typeof formErrors[field] === 'object' &&
                field != null &&
                form != null
            ) {
                const newFormGroup = (<any>form.get(field)) as FormGroup;
                if (newFormGroup instanceof FormArray) {
                    newFormGroup.controls.forEach(
                        (control: FormGroup, index: number) => {
                            isValid = this.getFormErrors(
                                control,
                                formErrors[field],
                                validationMessages[field],
                                isSubmit
                            );
                        }
                    );
                } else {
                    isValid = this.getFormErrors(
                        newFormGroup,
                        formErrors[field],
                        validationMessages[field],
                        isSubmit
                    );
                }
            } else {
                if (field != null && form != null) {
                    formErrors[field] = '';
                    const control = form.get(field);
                    if (control && isSubmit) {
                        control.markAsDirty();
                    }
                    if (control && control.dirty && !control.valid) {
                        const messages = validationMessages[field];
                        for (const key in control.errors) {
                            if (control.errors.hasOwnProperty(key)) {
                                formErrors[field] += messages[key];
                                inValidCount++;
                            }
                        }
                    }
                }
            }
        }
        return inValidCount === 0 && isValid;
    }

    renderSuggestionDays() {
        let days = [];
        for (let i = 1; i <= 31; i++) {
            days = [...days, {id: i, name: i}];
        }
        return days;
    }

    renderSuggestionMonths() {
        let months = [];
        for (let i = 1; i <= 12; i++) {
            months = [...months, {id: i, name: i}];
        }
        return months;
    }

    renderListMonth() {
        let listMonths = [];
        for (let i = 1; i <= 12; i++) {
            listMonths = [...listMonths, {
                id: i, name: i.toString()
            }];
        }
        return listMonths;
    }

    renderListYear() {
        const year = 2018;
        const diff = new Date().getFullYear() - year;
        let listYears = [];
        for (let i = 0; i <= diff; i++) {
            const currentYear = year + i;
            listYears = [...listYears, {
                id: currentYear, name: currentYear.toString()
            }];
        }
        return listYears;
    }
}
