import { FileViewModel } from './file.viewmodel';
import { FolderViewModel } from './folder.viewmodel';

export interface CurrentDirectoryViewModel {
    files: FileViewModel[];
    folders: FolderViewModel[];
}
