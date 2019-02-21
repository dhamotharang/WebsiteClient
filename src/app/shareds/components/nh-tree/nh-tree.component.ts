import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {TreeData} from '../../../view-model/tree-data';

@Component({
    selector: 'nh-tree',
    // template: `
    //     <!-- nh tree -->
    //     <ul [ngClass]="!isChildren ? 'nh-tree nh-root-tree' : 'sub-tree'"
    //         [@toogleTreeSubmenu]="isOpen ? 'sub-tree-open' : 'sub-tree-close'">
    //         <li class="nh-tree-node" *ngFor="let node of data"
    //             [class.selected]="node.isSelected">
    //             <i class="nh-tree-icon"
    //                (click)="expand(node)"
    //                [class.nh-tree-loading]="node.isLoading && node.childCount && node.childCount > 0"
    //                [class.nh-tree-node-close]="!node.state.opened && ((node.childCount && node.childCount > 0)
    //                || (node.children && node.children.length > 0))"
    //                [class.nh-tree-node-open]="node.state.opened && ((node.childCount && node.childCount > 0)
    //                || (node.children && node.children.length > 0))"
    //             ></i>
    //             <!--<i class="nh-tree-icon nh-icon-checkbox nh-icon-child-check" *ngIf="isMultiple"></i>-->
    //             <!-- display when has child -->
    //             <a href="javascript://" (click)="selectNode(node)" [attr.title]="node.text">
    //                 <i class="nh-tree-icon"
    //                    [ngClass]="node.icon ? node.icon + ' nh-custom-icon' : 'nh-tree-icon-folder'"></i> {{ node.text
    //                 }}
    //             </a>
    //             <nh-tree [data]="node.children" [isChildren]="true" [isOpen]="node.state.opened"
    //                      [isMultiple]="isMultiple"
    //                      [lazyLoadURL]="lazyLoadURL"
    //                      [selectedIds]="selectedIds"
    //                      (onSelectNode)="onSelectNode.emit($event)"></nh-tree>
    //         </li>
    //     </ul>
    // `,
    templateUrl: './nh-tree.component.html',
    styleUrls: ['./nh-tree.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('toogleTreeSubmenu', [
            state(
                'sub-tree-open',
                style({
                    height: '*',
                    opacity: '1',
                    display: 'block'
                })
            ),
            state(
                'sub-tree-close',
                style({
                    height: '0',
                    opacity: '0',
                    display: 'none'
                })
            ),
            transition('sub-tree-open => sub-tree-close', [
                animate(
                    150,
                    style({
                        height: '0'
                    })
                )
            ]),
            transition('sub-tree-close => sub-tree-open', [
                animate(
                    150,
                    style({
                        height: '*'
                    })
                )
            ])
        ])
    ]
})
export class NHTreeComponent implements OnInit, OnChanges {
    // @Input() data: TreeData[];
    @Input() isMultiple = false;
    @Input() isChildren = false;
    @Input() isOpen = true;
    @Input() height = 250;
    @Input() lazyLoadURL;
    // @Input() selectedIds = [];

    @Output() nodeSelected = new EventEmitter();
    @Output() nodeExpanded = new EventEmitter();

    private _data: TreeData[] = [];
    private _selectedIds: string[] | number[] = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
    }

    @Input()
    set data(value: TreeData[]) {
        this._data = _.cloneDeep(value);
        setTimeout(() => {
            this.updateSelectedStatus(this.data);
        });
    }

    get data() {
        return this._data;
    }

    @Input()
    set selectedIds(value: string[] | number[]) {
        this._selectedIds = _.cloneDeep(value);
        setTimeout(() => {
            this.updateSelectedStatus(this.data);
        });
    }

    get selectedIds() {
        return this._selectedIds;
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    selectNode(node: TreeData) {
        if (!this.isMultiple) {
            this.resetSelectedNote(this.data, null);
            node.isSelected = true;
        } else {
            node.isSelected = !node.isSelected;
        }
        this.nodeSelected.emit(node);
    }

    expand(node: TreeData) {
        if (this.lazyLoadURL && node.children.length === 0) {
            node.isLoading = true;
            const childrens = this.http.get(`${this.lazyLoadURL}${node.id}`);
            childrens.subscribe((result: any) => {
                node.isLoading = false;
                node.children = result;
                console.log(result);
            });
        }
        node.state.opened = !node.state.opened;
        this.nodeExpanded.emit(node);
    }

    private resetSelectedNote(treeNodes: TreeData[], parentId?: number) {
        if (!treeNodes || treeNodes.length <= 0) {
            return;
        }

        _.each(treeNodes, (node: TreeData) => {
            node.isSelected = false;

            if (node.parentId === parentId) {
                _.each(node.children, (item: TreeData) => {
                    item.isSelected = false;
                    this.resetSelectedNote(item.children, item.id);
                });
            }
        });
    }

    private updateSelectedStatus(nodes: TreeData[], parentId: string | number = null) {
        const parentNodes = _.filter(nodes, (node: TreeData) => {
            return node.parentId === parentId;
        });
        if (parentNodes && parentNodes.length > 0) {
            _.each(parentNodes, (nodeItem: TreeData) => {
                nodeItem.isSelected =
                    this.selectedIds &&
                    this.selectedIds.length > 0 &&
                    this.selectedIds
                        .toString()
                        .indexOf(nodeItem.id.toString()) > -1;

                this.updateSelectedStatus(nodeItem.children, nodeItem.id);
            });
        }
    }
}
