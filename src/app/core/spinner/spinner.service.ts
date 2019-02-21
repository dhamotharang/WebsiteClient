import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface SpinnerState {
    show: boolean;
    message?: string;
}

@Injectable()
export class SpinnerService {
    spinnerState = new BehaviorSubject<SpinnerState>({
        show: false,
        message: ''
    });

    constructor() {
    }

    show(message?: string) {
        this.spinnerState.next(<SpinnerState>{
            show: true,
            message: message
        });
    }

    hide() {
        this.spinnerState.next(<SpinnerState>{show: false});
    }
}
