import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NhModalService {
    dismiss$ = new Subject();

    constructor() {
    }

    dismiss() {
        this.dismiss$.next();
    }
}
