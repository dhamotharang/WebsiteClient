import { Injectable } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';

@Injectable()
export class NumberValidator implements Validators {
    constructor() {
    }

    isValid(c: FormControl) {
        if (c && c.value && c.value != null) {
            if (isNaN(parseFloat(c.value)) || !isFinite(c.value)) {
                return { isValid: false };
            }
        }
        return null;
    }

    greaterThan(value: number): ValidatorFn {
        return (c: FormControl) => {
            if (value !== undefined && c.value) {
                if (c.value <= value) {
                    return { greaterThan: false };
                }
            }

            return null;
        };
    }

    lessThan(value: number) {
        return (c: FormControl) => {
            if (value && c.value) {
                if (c.value >= value) {
                    return { lessThan: false };
                }
            }

            return null;
        };
    }

    range(value: { fromValue: number, toValue: number }): ValidatorFn {
        return (c: FormControl) => {
            if (value && c.value) {
                if (c.value < value.fromValue || c.value > value.toValue) {
                    return { invalidRange: false };
                }
            }

            return null;
        };
    }
}
