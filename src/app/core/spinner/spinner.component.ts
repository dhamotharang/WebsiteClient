import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService, SpinnerState } from './spinner.service';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SpinnerComponent implements OnInit, OnDestroy {
    private spinnerStateChanged: Subscription;
    visible = false;
    message: string;

    constructor(private spinnerService: SpinnerService) {
        this.spinnerStateChanged = this.spinnerService.spinnerState
            .subscribe((state: SpinnerState) => {
                this.visible = state.show;
                this.message = state.message;
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.spinnerStateChanged.unsubscribe();
    }
}
