import {FileSearchViewModel} from './file-search.viewmodel';
import {FolderSearchViewModel} from './folder-search.viewmodel';
import {Breadcrumb} from '../../../shareds/components/ghm-file-explorer/models/breadcrumb.model';

export class FileFolderSearchViewModel {
    files: FileSearchViewModel[];
    folders: FolderSearchViewModel[];
    totalFiles: number;
    totalFolder: number;
    breadcrumbs: Breadcrumb[];
}
