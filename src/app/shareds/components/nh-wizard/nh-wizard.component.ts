import {
    AfterContentInit,
    Component, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { NhStepComponent } from './nh-step.component';

@Component({
    selector: 'nh-wizard',
    templateUrl: './nh-wizard.component.html',
    styleUrls: ['./nh-wizard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NhWizardComponent implements OnInit, AfterContentInit, OnDestroy {
    @ContentChildren(NhStepComponent) nhStepComponents: QueryList<NhStepComponent>;
    @Input() currentStep = 1;
    @Input() isFinish = false;
    private _allowNext = false;
    subscribers: any = {};
    isLast = false;
    steps = []; // List all step header
    @Input()
    set allowNext(value) {
        this._allowNext = value;
    }

    get allowNext() {
        return this._allowNext;
    }

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.steps = [];
        this.nhStepComponents.forEach((stepComponent: NhStepComponent, index: number) => {
            // Render list step header
            this.steps.push({
                id: stepComponent.step, title: stepComponent.title,
                description: stepComponent.description,
                icon: stepComponent.icon
            });
            this.updateShowStatus();
            this.subscribers.onNextClick = stepComponent.next.subscribe(() => {
                if (this.allowNext) {
                    this.next();
                }
            });
            this.subscribers.onBackClick = stepComponent.back.subscribe(() => {
                this.back();
            });
            this.subscribers.onFinishClick = stepComponent.finish.subscribe(() => {
            });
            if (index === this.nhStepComponents.length - 1) {
                stepComponent.isLast = true;
            }
        });
    }

    ngOnDestroy() {
        this.subscribers.onNextClick.unsubscribe();
        this.subscribers.onBackClick.unsubscribe();
        this.subscribers.onFinishClick.unsubscribe();
    }

    next() {
        this.currentStep = this.currentStep + 1;
        this.checkLastStep();
        this.updateShowStatus();
    }

    goTo(step: number) {
        this.currentStep = step;
    }

    back() {
        if (this.currentStep === 1) {
            return;
        }


        this.currentStep = this.currentStep - 1;
        this.checkLastStep();
        this.updateShowStatus();
    }

    private checkLastStep() {
        this.isLast = this.nhStepComponents.length === this.currentStep;
    }

    private updateShowStatus() {
        this.nhStepComponents.forEach((stepComponent) => {
            stepComponent.isShow = stepComponent.step === this.currentStep;
        });
    }
}
