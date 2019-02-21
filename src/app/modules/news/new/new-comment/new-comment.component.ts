import {Component, Input} from '@angular/core';
import {TreeComment} from '../model/tree-comment.model';

@Component({
    selector: 'app-new-comment',
    templateUrl: './new-comment.component.html',
    styleUrls: ['./new-comment.scss']
})

export class NewCommentComponent {
    @Input() comments: TreeComment[];

    constructor() {
    }
}
