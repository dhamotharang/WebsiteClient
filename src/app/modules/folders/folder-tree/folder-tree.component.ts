import {Component, Input} from '@angular/core';
import {TreeData} from '../../../view-model/tree-data';

@Component({
    selector: 'app-folder-tree',
    templateUrl: './folder-tree.component.html',
    styleUrls: ['../folder.scss']
})

export class FolderTreeComponent {
    @Input() listData: TreeData[];

    constructor() {
    }
}