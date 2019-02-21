import { Injectable } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';


@Injectable()
export class EqualValidator implements Validators {
    constructor() {
    }

    validate(ref: string): ValidatorFn {
        return (c: FormControl) => {
            const v = c.value;
            const to = c.root.get(ref);

            if (to && v !== to.value) {
                return { validateEqual: false };
            }

            return null;
        };
    }

    updateEqualRef(ref: string): ValidatorFn {
        return (c: FormControl) => {
            const v = c.value;
            const r = c.root.get(ref);
            if (r && v === r.value) {
                delete r.errors['validateEqual'];
            }

            if (r && v !== r.value) {
                r.setErrors({ validateEqual: false });
            }

            return null;
        };
    }

    //validate(c: FormControl): { [key: string]: any } {
    //    let v = c.value;
    //    let to = c.root.get("password");

    //    if (to && v !== to.value) {
    //        console.log(to.value, v);
    //        return { validateEqual: false };
    //    }

    //    return null;
    //}
}
