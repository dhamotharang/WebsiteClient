import {
    Component,
    Input,
    Output,
    ElementRef,
    OnInit,
    EventEmitter,
    forwardRef,
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as _ from 'lodash';
import { TreeData } from '../../../view-model/tree-data';

@Component({
    selector: 'nh-dropdown-tree',
    templateUrl: './nh-dropdown-tree.component.html',
    styleUrls: ['./nh-tree.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NHDropdownTreeComponent),
            multi: true
        }
    ]
})
export class NHDropdownTreeComponent implements OnInit, ControlValueAccessor {
    @Input() isMultiple = false;
    @Input() selectedText = '';
    @Input() width = 250;
    @Input() acceptText = 'Đồng ý';
    @Input() cancelText = 'Hủy bỏ';

    @Output() accepted = new EventEmitter();
    @Output() canceled = new EventEmitter();
    @Output() buttonClicked = new EventEmitter();
    @Output() nodeExpanded = new EventEmitter();
    @Output() nodeSelected = new EventEmitter();

    isShow = false;
    selectedTexts: string[] = [];
    selectTitle = '-- Please select --';
    listSelected: TreeData[] = [];

    private _value: string | number;
    private _data: TreeData[];
    private _title: string;

    @Input()
    set title(value: string) {
        this._title = value;
        this.selectTitle = value;
    }

    get title() {
        return this._title;
    }

    constructor(private el: ElementRef) {
    }

    get value() {
        return this._value;
    }

    @Input()
    set value(value: string | number) {
        this._value = value;
        this.setSelectTitle();
    }

    @Input()
    set data(value: TreeData[]) {
        this._data = value;
        this.setSelectTitle();
    }

    get data() {
        return this._data;
    }

    propagateChange: any = () => {
    };

    ngOnInit(): void {
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        this.value = value;
    }

    registerOnTouched() {
    }

    @HostListener('document:click', ['$event'])
    onClick(event) {
        if (!this.el.nativeElement.contains(event.target)) {
            // or some similar check
            this.isShow = false;
        }
    }

    acceptButtonClick() {
        this.isShow = false;
        this.accepted.emit(this.listSelected);
        const selectedNodeName = _(this.listSelected)
            .map('text')
            .value()
            .toString();
        this.selectTitle = selectedNodeName ? selectedNodeName : this.title;
    }

    cancelButtonClick() {
        this.canceled.emit();
        this.isShow = false;
    }

    expandButtonClick() {
    }

    dropdownButtonClick() {
        setTimeout(() => {
            this.isShow = !this.isShow;
            if (!this.isMultiple) {
                this.buttonClicked.emit(this.isShow);
            }
        });
    }

    onNodeSelected(node: TreeData) {
        if (!this.isMultiple) {
            this.isShow = false;
            this.selectTitle = node.text;
            this.propagateChange(node.id);
            this.nodeSelected.emit(node);
        } else {
            if (node.isSelected) {
                const isExists = _.find(this.listSelected, item => {
                    return item.id === node.id;
                });
                if (!isExists) {
                    this.listSelected.push(node);
                }
            } else {
                _.remove(this.listSelected, node);
            }
        }
    }

    onNodeExpanded(node: TreeData) {
        this.nodeExpanded.emit(node);
    }

    selectDefaultNode() {
        this.isShow = false;
        this.selectTitle = this.title;
        this.nodeSelected.emit(null);
        this.propagateChange(null);
        if (this.isMultiple) {
            this.accepted.emit(null);
        }
    }

    private getNodesSelected(data: TreeData[], parentId?: any) {
        const listNodes = _.filter(data, (node: TreeData) => {
            return node.parentId === parentId;
        });
        if (listNodes) {
            _.each(listNodes, (node: TreeData) => {
                if (this.value === node.id) {
                    this.selectedTexts.push(node.text);
                } else {
                    this.getNodesSelected(node.children, node.id);
                }
            });
        }
    }

    private getSelectedNode(data: TreeData[]) {
        const selectedNode = _.find(data, (node: TreeData) => {
            return node.id === this.value;
        });
        if (selectedNode) {
            this.selectTitle = selectedNode.text;
        } else {
            _.each(data, (node: TreeData) => {
                // if (node.id === this.value) {
                //     this.selectTitle = node.text;
                //     return false;
                // } else {
                //     this.selectTitle = this.title;
                this.getSelectedNode(node.children);
                // }
            });
        }

    }

    private setSelectTitle() {
        if (this.isMultiple) {
            this.getNodesSelected(this.data, null);
            this.selectTitle = this.selectedTexts && this.selectedTexts.length > 0
                ? this.selectedTexts.join()
                : this.title;
        } else {
            this.getSelectedNode(this.data);
        }
    }
}
