import { AbstractControl, ValidatorFn } from '@angular/forms';

export function conditionalRequiredValidator(condition: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return condition && !control.value ? {required: true} : null;
    };
}
