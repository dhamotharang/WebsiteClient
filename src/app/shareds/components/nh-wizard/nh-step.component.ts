import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'nh-step',
    templateUrl: './nh-step.component.html'
})
export class NhStepComponent implements OnInit {
    @Input() step: number;
    @Input() title: string;
    @Input() description: string;
    @Input() isValid = true;
    @Input() isLoading = false;
    @Input() icon = '';
    @Input() backLabel = 'Quay lại';
    @Input() nextLabel = 'Tiếp theo';
    @Input() finishLabel = 'Hoàn thành';
    @Output() next = new EventEmitter();
    @Output() back = new EventEmitter();
    @Output() finish = new EventEmitter();
    isShow = false;
    isFinish = false;
    isLast = false;

    constructor() {
    }

    ngOnInit() {
    }

    goNext() {
        this.next.emit(this.step);
    }

    goBack() {
        this.back.emit(this.step);
    }

    goFinish() {
        this.finish.emit(this.step);
    }
}
