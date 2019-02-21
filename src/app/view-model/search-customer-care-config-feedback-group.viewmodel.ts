
export class SearchFeedbackGroupViewModel {
    id: number;
    name: string;
    description: string;
    isRequiredNote: boolean;
    parentId: number;
    parentName: string;
    idPath: string;
    level: number;
    type: number;
    isCalculate: boolean;
    isChildren: boolean;
    isClickButton = false;
    isCheck = false;
    satisfaction: number;
    note = '';
    isShowDetail = false;
}
