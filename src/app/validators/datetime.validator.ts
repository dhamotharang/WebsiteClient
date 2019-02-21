import { Injectable } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

@Injectable()
export class DateTimeValidator implements Validators {
    isValid(c: FormControl) {
        if (c && c.value && c.value != null) {
            const isValid = moment(c.value, [
                'DD/MM/YYYY',
                'DD/MM/YYYY HH:mm',
                'DD/MM/YYYY HH:mm:ss',
                'DD/MM/YYYY HH:mm Z',
                'DD-MM-YYYY',
                'DD-MM-YYYY HH:mm',
                'DD-MM-YYYY HH:mm:ss',
                'DD-MM-YYYY HH:mm Z',
                'MM/DD/YYYY',
                'MM/DD/YYYY HH:mm',
                'MM/DD/YYYY HH:mm:ss',
                'MM/DD/YYYY HH:mm Z',
                'MM-DD-YYYY',
                'MM-DD-YYYY HH:mm',
                'MM-DD-YYYY HH:mm:ss',
                'MM-DD-YYYY HH:mm Z',
            ]).isValid() || moment(c.value, [
                'DD/MM/YYYY',
                'DD/MM/YYYY HH:mm',
                'DD/MM/YYYY HH:mm:ss',
                'DD/MM/YYYY HH:mm Z',
                'DD-MM-YYYY',
                'DD-MM-YYYY HH:mm',
                'DD-MM-YYYY HH:mm:ss',
                'DD-MM-YYYY HH:mm Z',
                'MM/DD/YYYY',
                'MM/DD/YYYY HH:mm',
                'MM/DD/YYYY HH:mm:ss',
                'MM/DD/YYYY HH:mm Z',
                'MM-DD-YYYY',
                'MM-DD-YYYY HH:mm',
                'MM-DD-YYYY HH:mm:ss',
                'MM-DD-YYYY HH:mm Z',
            ]).isValid();
            if (!isValid) {
                return { isValid: false };
            }
        }
        return null;
    }

    notBefore(ref: string): ValidatorFn {
        return (c: FormControl) => {
            const v = c.value;
            const r = c.root.get(ref);

            if (r && r.value) {
                if (moment(v, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]).isBefore(moment(r.value, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]))) {
                    return { notBefore: false };
                }
            }

            return null;
        };
    }

    notAfter(ref: string): ValidatorFn {
        return (c: FormControl) => {
            const v = c.value;
            const r = c.root.get(ref);

            if (r && r.value) {
                if (moment(v, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]).isAfter(moment(r.value, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]))) {
                    return { notAfter: false };
                }
            }

            return null;
        };
    }

    notEqual(ref: string): ValidatorFn {
        return (c: FormControl) => {
            const v = c.value;
            const r = c.root.get(ref);

            if (r && r.value) {
                if (moment(r.value, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]).isSame(moment(v, [
                    'DD/MM/YYYY',
                    'DD/MM/YYYY HH:mm',
                    'DD/MM/YYYY HH:mm:ss',
                    'DD/MM/YYYY HH:mm Z',
                    'DD-MM-YYYY',
                    'DD-MM-YYYY HH:mm',
                    'DD-MM-YYYY HH:mm:ss',
                    'DD-MM-YYYY HH:mm Z',
                    'MM/DD/YYYY',
                    'MM/DD/YYYY HH:mm',
                    'MM/DD/YYYY HH:mm:ss',
                    'MM/DD/YYYY HH:mm Z',
                    'MM-DD-YYYY',
                    'MM-DD-YYYY HH:mm',
                    'MM-DD-YYYY HH:mm:ss',
                    'MM-DD-YYYY HH:mm Z',
                ]))) {
                    return { notEqual: false };
                }
            }

            return null;
        };
    }
}
