import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../base-list.component';
import {FileSearchViewModel, ViewType} from './viewmodels/file-search.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {IPageId, PAGE_ID} from '../../configs/page-id.config';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from '../../shareds/services/util.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {FilterLink} from '../../shareds/models/filter-link.model';
import {HelperService} from '../../shareds/services/helper.service';
import {FolderService} from './service/folder.service';
import {FolderFormComponent} from './folder-form/folder-form.component';
import {FileFormComponent} from './file-form/file-form.component';
import {finalize} from 'rxjs/operators';
import {FileService} from './service/file.service';
import {TreeData} from '../../view-model/tree-data';
import * as _ from 'lodash';
import {FolderSearchViewModel} from './viewmodels/folder-search.viewmodel';
import {FileFolderSearchViewModel} from './viewmodels/file-folder-search.viewmodel';
import {ActionResultViewModel} from '../../shareds/view-models/action-result.viewmodel';
import {FileViewModel} from '../../shareds/components/ghm-file-explorer/view-models/file.viewmodel';
import {GhmFileUploadService} from '../../shareds/components/ghm-file-explorer/ghm-file-upload/ghm-file-upload.service';
import {ToastrService} from 'ngx-toastr';
import {Files} from './model/file.model';
import {Breadcrumb} from '../../shareds/components/ghm-file-explorer/models/breadcrumb.model';
import {SliderImageComponent} from './slider-image/slider-image.component';
import {Folder} from './model/folder.model';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.component.html',
    styleUrls: ['./folder.scss'],
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, FolderService, FileService]
})

export class FolderComponent extends BaseListComponent<FileFolderSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(FolderFormComponent) folderFormComponent: FolderFormComponent;
    @ViewChild(FileFormComponent) fileFormComponent: FileFormComponent;
    @ViewChild(SliderImageComponent) sliderImageComponent: SliderImageComponent;
    listFile: FileSearchViewModel[];
    listFolder: FolderSearchViewModel[];
    listFolderSelect: any[];
    height;
    folderId;
    isSelectAll;
    urlLoadFolder;
    folderTree: TreeData[];
    viewType = ViewType;
    type;
    listBreadcrumb: Breadcrumb[] = [];
    isSearchName;
    isClickInputFolder;
    listFolderRoot: FolderSearchViewModel[];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private location: Location,
                private ghmFileUploadService: GhmFileUploadService,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef,
                private fileService: FileService,
                private folderService: FolderService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.FOLDER, 'Quản lý folder', 'Danh sách folder');
        this.subscribers.data = this.route.data.subscribe((data: { data: FileFolderSearchViewModel }) => {
            if (data.data) {
                this.isSearching = false;
                this.listFolder = data.data.folders;
                this.listFile = data.data.files;
                this.listBreadcrumb = data.data.breadcrumbs;
                this.isSearchName = false;
            }
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.folderId = params.folderId ? parseInt(params.folderId) : '';
            this.type = params.type ? parseInt(params.type) : ViewType.list;
        });

        if (!this.folderId) {
            this.listFolderRoot = this.listFolder;
            this.folderTree = this.renderFolderTree(this.listFolderRoot);
        }

        this.urlLoadFolder = `${this.appConfig.FILE_MANAGEMENT}folders/children/`;

        this.ghmFileUploadService.complete$
            .subscribe((result: ActionResultViewModel<FileViewModel[]>) => {
                if (result.code <= 0) {
                    this.toastr.error(result.message);
                    return;
                } else {
                    this.search();
                }
            });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 300;
        if (this.folderId && this.folderId > 0) {
            this.getFolderFoot();
        }
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 300;
    }

    addFolder() {
        this.folderFormComponent.folderId = this.folderId;
        this.folderFormComponent.add();
    }

    searchByName(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.folderService.searchByName(this.keyword, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false)).subscribe((result: FileFolderSearchViewModel) => {
            this.listFolder = result.folders;
            this.listFile = result.files;
            this.totalRows = result.totalFolder > result.totalFiles ? result.totalFolder : result.totalFiles;
            this.listBreadcrumb = [];
            this.isSearchName = true;
        });
    }

    search() {
        this.renderLink();
        this.folderService.search(this.folderId)
            .pipe(finalize(() => this.isSearching = false)).subscribe((result: FileFolderSearchViewModel) => {
            this.listFolder = result.folders;
            this.listFile = result.files;
            this.isSearchName = false;
            this.listBreadcrumb = result.breadcrumbs;
        });
    }

    checkAll() {
        // if (this.listFileAndFolder) {
        //     _.each(this.listFileAndFolder, (item: FileSearchViewmodel) => {
        //         item.isCheck = this.isSelectAll;
        //     });
        //     this.getFolderIdSelect();
        // }
    }

    checkFolder(folder: FileSearchViewModel) {
        // this.getFolderIdSelect();
        // if (this.listFolderSelect && this.listFileAndFolder && this.listFileAndFolder.length === this.listFolderSelect.length) {
        //     this.isSelectAll = true;
        // } else {
        //     this.isSelectAll = false;
        // }
    }

    clickFolder(item: FolderSearchViewModel) {
        this.showFolderDetail(item);
    }

    clickInputFolder(item: FolderSearchViewModel) {
        this.isClickInputFolder = true;
    }

    edit(id: any, isFolder: boolean) {
        if (isFolder) {
            this.folderFormComponent.edit(id);
        } else {
            this.fileFormComponent.edit(id);
        }
    }

    delete(id: any, isFolder: boolean) {
        if (isFolder) {
            this.folderService.delete(id).subscribe(() => {
                _.remove(this.listFolderRoot, (item: FolderSearchViewModel) => {
                    return item.id === id;
                });

                _.remove(this.listFolder, (item: FolderSearchViewModel) => {
                    return item.id === id;
                });

                this.folderTree = this.renderFolderTree(this.listFolderRoot);
            });
        } else {
            this.fileService.delete(id).subscribe(() => {
                _.remove(this.listFile, (item: FileSearchViewModel) => {
                    return item.id === id;
                });
            });
        }
    }

    onSelectNode(value: TreeData) {
        if (value) {
            this.folderId = value.id;
            this.search();
        }
    }

    showFolderInHome() {
        this.folderId = null;
        this.listBreadcrumb = [];
        this.search();
    }

    showFolderDetail(item: FolderSearchViewModel) {
        if (this.isClickInputFolder) {
            this.isClickInputFolder = false;
        } else {
            this.folderId = item.id;
            this.search();
        }
    }

    showFileDetail(item: FileSearchViewModel) {
        this.sliderImageComponent.imageSelect = item;
        this.sliderImageComponent.listImage = _.filter(this.listFile, (file: FileSearchViewModel) => {
            return file.isImage;
        });
        this.sliderImageComponent.show();
    }

    updateFolderName(item: FolderSearchViewModel) {
        if (!item.name || !item.name.trim()) {
            this.toastr.error('Please enter folder name');
            return;
        }
        this.folderService.updateName(item.id, item.concurrencyStamp, item.name).subscribe(() => {
            item.isEditName = false;
            const folderInTree = _.first(_.filter(this.listFolderRoot, (folder: FolderSearchViewModel) => {
                return folder.id === item.id;
            }));
            if (folderInTree) {
                folderInTree.name = item.name;
                this.folderTree = this.renderFolderTree(this.listFolderRoot);
            }

            const folderInList = _.first(_.filter(this.listFolder, (folder: FolderSearchViewModel) => {
                return folder.id === item.id;
            }));
            if (folderInList) {
                folderInList.name = item.name;
            }
        });
    }

    saveSuccessFolder(value: Folder) {
        if (value) {
            if (value.id) {
                const folderInTree = _.first(_.filter(this.listFolderRoot, (folder: FolderSearchViewModel) => {
                    return folder.id === value.id;
                }));
                if (folderInTree) {
                    folderInTree.name = value.name;
                }

                const folderInList = _.first(_.filter(this.listFolder, (folder: FolderSearchViewModel) => {
                    return folder.id === value.id;
                }));
                if (folderInList) {
                    folderInList.name = value.name;
                }
            } else {
                const folderInsert = new FolderSearchViewModel(value.id, value.name, value.parentId, true, false);
                this.listFolderRoot.push(folderInsert);
            }

            this.folderTree = this.renderFolderTree(this.listFolderRoot);
        }
    }

    updateFileName(item: FileSearchViewModel) {
        if (!item.name || !item.name.trim()) {
            this.toastr.error('Please enter file name');
            return;
        }
        const file = new Files(item.name, item.folderId, item.concurrencyStamp);
        this.fileService.update(item.id, file).subscribe(() => {
            item.isEditName = false;
        });
    }

    onViewType() {
        this.type = this.type === ViewType.gird ? ViewType.list : ViewType.gird;
        this.renderLink();
    }

    showByBreadcrumb(folderId: number) {
        this.folderId = folderId;
        this.search();
    }

    expandedFolder(value: TreeData) {
        if (value) {
            this.folderService.getChildren(value.id).subscribe((result: FolderSearchViewModel[]) => {
                const children = this.renderFolderTree(result, value.id);
                value.children = children;
            });
        }
    }

    private renderBreadcrumb(idPath: string) {
        this.listBreadcrumb = [];
        if (idPath) {
            if (idPath.indexOf('.') > -1) {
                const list = idPath.split('.');
                if (list && list.length > 0) {
                    _.each(list, (item: string) => {
                        const breadCrumbItem = {
                            id: item,
                            name: item,
                        };
                        this.listBreadcrumb.push(breadCrumbItem);
                    });
                }
            } else {
                const breadcrumb = {
                    id: idPath,
                    name: idPath,
                };

                this.listBreadcrumb.push(breadcrumb);
            }
        } else {
            this.listBreadcrumb = [];
        }
    }

    private getFolderFoot() {
        this.folderService.search(null).subscribe((result: FileFolderSearchViewModel) => {
            const listFolder = result.folders;
            this.listFolderRoot = result.folders;
            this.folderTree = this.renderFolderTree(this.listFolderRoot);
        });
    }

    private renderFolderTree(listData: FolderSearchViewModel[], id?: number) {
        if (listData && listData.length > 0) {
            const folderTree = [];
            _.each(listData, (folder: FolderSearchViewModel) => {
                const tree: TreeData = {
                    id: folder.id,
                    text: folder.name,
                    parentId: folder.parentId,
                    idPath: folder.idPath,
                    data: folder,
                    childCount: folder.childCount,
                    icon: null,
                    isSelected: false,
                    open: true,
                    isLoading: false,
                    state: {
                        opened: false,
                        selected: false,
                        disabled: false,
                    },
                    children: []
                };

                folderTree.push(tree);
            });

            return folderTree;
        }
    }

    private renderLink() {
        const path = '/folders';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('type', this.type),
            new FilterLink('folderId', this.folderId),
        ]);
        this.location.go(path, query);
    }

    private getFolderIdSelect() {
        // this.listFolderSelect = _.map(_.filter(this.listFileAndFolder, (item: FileSearchViewmodel) => {
        //     return item.isCheck;
        // }), (folderSelect => {
        //     return folderSelect.id && folderSelect.isFolder;
        // }));
    }
}
