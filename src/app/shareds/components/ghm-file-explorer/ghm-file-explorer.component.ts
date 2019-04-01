import {
    Component,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ExplorerItem } from './explorer-item.model';
import { Subject } from 'rxjs';
import { delay, repeat, takeUntil } from 'rxjs/operators';
import { UtilService } from '../../services/util.service';
import * as _ from 'lodash';
import { GhmNewFolderComponent } from './ghm-new-folder/ghm-new-folder.component';
import { GhmFileUploadService } from './ghm-file-upload/ghm-file-upload.service';
import { ActionResultViewModel } from '../../view-models/action-result.viewmodel';
import { FileViewModel } from './view-models/file.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { GhmFileExplorerService } from './ghm-file-explorer.service';
import { CurrentDirectoryViewModel } from './view-models/current-directory.viewmodel';
import { FolderViewModel } from './view-models/folder.viewmodel';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Folder } from '../../../modules/folders/model/folder.model';
import { Breadcrumb } from './models/breadcrumb.model';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'ghm-file-explorer',
    templateUrl: './ghm-file-explorer.component.html',
    styleUrls: ['./ghm-file-explorer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GhmFileExplorerComponent implements OnInit, OnDestroy {
    @ViewChild('ghmExplorerTemplate') templateRef: TemplateRef<any>;
    @ViewChild(GhmNewFolderComponent) ghmNewFolderComponent: GhmNewFolderComponent;

    @Input() buttonText: string;
    @Input() multiple = false;
    @Input() confirmText = 'Confirm';
    @Input() closeText = 'Close';

    @Input() buttonClass = 'blue';
    @Input() footerClass = 'blue';

    @Input() headerTitle = 'GHMSoft file explorer';
    @Input() showCloseButton = true;

    @Output() itemSelected = new EventEmitter();
    @Output() acceptSelected = new EventEmitter();

    selectItem$ = new Subject();
    openItem$ = new Subject();

    currentFolderId?: number;
    isMultipleSelected = false;

    // 0: List 1: Grid
    isGridView = true;
    explorerItems: ExplorerItem[] = [];
    breadcrumbs: Breadcrumb[] = [];

    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private utilService: UtilService,
                private toastr: ToastrService,
                private viewContainerRef: ViewContainerRef,
                private ghmFileUploadService: GhmFileUploadService,
                private ghmFileExplorerService: GhmFileExplorerService,
                private overlay: Overlay) {

        this.selectItem$
            .pipe(
                delay(200),
                takeUntil(this.openItem$),
                repeat())
            .subscribe((explorerItem: ExplorerItem) => {
                if (this.multiple) {
                    // Set item is selected to true.
                    this.changeSelectedStatus(explorerItem);
                } else {
                    // Emit selected item.
                    this.itemSelected.emit(explorerItem);
                    this.dismissModal();
                }
            });

        this.openItem$.subscribe((explorerItem: ExplorerItem) => {
            if (this.multiple) {
                explorerItem.isSelected = !explorerItem.isSelected;
            }
            if (explorerItem.type === 'folder') {
                // Set id to current folder id then get all item inside folder.
                this.currentFolderId = explorerItem.id as number;
                this.getCurrentDirectory();
                this.createBreadcrumb(explorerItem);
            } else {
                this.itemSelected.emit(explorerItem);
                this.dismissModal();
            }
        });

        this.ghmFileUploadService.complete$
            .subscribe((result: ActionResultViewModel<FileViewModel[]>) => {
                if (result.code <= 0) {
                    this.toastr.error(result.message);
                    return;
                } else {
                    const files = result.data;
                    const explorerItems = files.map((file: FileViewModel) => {
                        return new ExplorerItem(file.id, file.name, file.type, file.createTime, file.size, file.creatorId,
                            file.creatorFullName, file.creatorAvatar, file.extension, file.url, this.renderFileUrl(file.url));
                    });
                    explorerItems.forEach((explorerItem: ExplorerItem) => {
                        this.explorerItems.push(explorerItem);
                    });
                }
            });
    }

    @HostListener('window:resize', ['$event'])
    windowResize(e) {
        if (this.overlayRef.hasAttached()) {
            this.calculatePositionStrategy();
        }
    }

    ngOnInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            hasBackdrop: true
        });
    }

    ngOnDestroy() {
        this.overlayRef.dispose();
    }

    onSaveFolderSuccessful(folder: Folder) {
        const explorerItemInfo = _.find(this.explorerItems, (explorerItem: ExplorerItem) => {
            return folder.id === explorerItem.id;
        });

        if (explorerItemInfo) {
            explorerItemInfo.name = folder.name;
        } else {
            this.explorerItems.push(new ExplorerItem(folder.id, folder.name, 'folder', folder.createTime, null,
                folder.creatorId, folder.creatorFullName, folder.creatorAvatar, 'folder'));
        }
    }

    changeSelectedStatus(explorerItem: ExplorerItem) {
        explorerItem.isSelected = !explorerItem.isSelected;
        this.setMultipleCheck();
    }

    showExplorer() {
        if (this.overlayRef && !this.overlayRef.hasAttached()) {
            this.overlayRef.attach(new TemplatePortal(this.templateRef, this.viewContainerRef));
            this.calculatePositionStrategy();

            // Get all file and folder.
            this.getCurrentDirectory();
        }
    }

    showDirectory(breadcrumb?: Breadcrumb) {
        this.currentFolderId = !breadcrumb ? null : breadcrumb.id as number;
        this.reRenderBreadcrumb(breadcrumb);
        this.getCurrentDirectory();
    }

    createNewFolder() {
        this.ghmNewFolderComponent.add(this.currentFolderId);
    }

    closeModal() {
        this.overlayRef.detach();
    }

    selectItem(explorerItem: ExplorerItem) {
        this.selectItem$.next(explorerItem);
    }

    openItem(explorerItem: ExplorerItem) {
        this.openItem$.next(explorerItem);
    }

    confirmSelect() {
        const selectedItems = _.filter(this.explorerItems, (explorerItem: ExplorerItem) => {
            return explorerItem.isSelected;
        });
        this.acceptSelected.emit(selectedItems);
        this.dismissModal();
    }

    private calculatePositionStrategy() {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const elementRect = this.overlayRef.overlayElement.getBoundingClientRect();
        if (elementRect) {
            const elementWidth = elementRect.width;
            const elementHeight = elementRect.height;
            const left = (windowWidth - elementWidth) / 2;
            const top = (windowHeight - elementHeight) / 2;
            this.positionStrategy.top(top + 'px');
            this.positionStrategy.left(left + 'px');
            this.positionStrategy.apply();
        }
    }

    private setMultipleCheck() {
        const countSelectedItems = _.countBy(this.explorerItems, (explorerItem: ExplorerItem) => {
            return explorerItem.isSelected;
        });
        this.isMultipleSelected = countSelectedItems.true > 0;
    }

    private renderFileUrl(url: string) {
        // return `${environment.fileUrl}${url}`;
        return url;
    }

    private getCurrentDirectory() {
        this.explorerItems = [];
        this.ghmFileExplorerService.getCurrentDirectory(this.currentFolderId)
            .subscribe((result: CurrentDirectoryViewModel) => {
                const explorerItems = [];
                if (result.files) {
                    const files = result.files.map((file: FileViewModel) => {
                        return new ExplorerItem(file.id, file.name, file.type, file.createTime, file.size,
                            file.creatorId, file.creatorFullName, file.creatorAvatar, file.extension, file.url,
                            this.renderFileUrl(file.url));
                    });
                    files.forEach((file: ExplorerItem) => {
                        explorerItems.push(file);
                    });
                }

                if (result.folders) {
                    const folders = result.folders.map((folder: FolderViewModel) => {
                        return new ExplorerItem(folder.id, folder.name, 'folder', folder.createTime, 0,
                            folder.creatorId, folder.creatorFullName, folder.creatorAvatar, 'folder');
                    });
                    folders.forEach((folder: ExplorerItem) => {
                        explorerItems.push(folder);
                    });
                }
                this.explorerItems = explorerItems;
            });
    }

    private createBreadcrumb(explorerItem: ExplorerItem) {
        const existingBreadcrumb = _.find(this.breadcrumbs, (breadcrumb: Breadcrumb) => {
            return breadcrumb.id === explorerItem.id;
        });

        if (!existingBreadcrumb) {
            this.breadcrumbs.push(new Breadcrumb(explorerItem.id, explorerItem.name));
        }
    }

    private reRenderBreadcrumb(breadcrumb: Breadcrumb) {
        const index = this.breadcrumbs.indexOf(breadcrumb);
        this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    }

    private dismissModal() {
        this.overlayRef.detach();
    }
}
