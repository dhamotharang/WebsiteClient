export class TreeData {
    id: any;
    parentId?: any;
    text: string;
    isSelected: boolean;
    open: boolean;
    idPath: string;
    icon?: string;
    data?: any;
    state: IState;
    childCount?: number;
    isLoading: boolean;
    children?: TreeData[];

    constructor(
        id?: number,
        parentId?: number,
        text?: string,
        isSelected?: boolean,
        open?: boolean,
        idPath?: string,
        icon?: string,
        data?: any,
        state?: IState,
        childCount?: number,
        isLoading?: boolean,
        children?: TreeData[]
    ) {
        this.id = id;
        this.parentId = parentId;
        this.text = text;
        this.isSelected = isSelected;
        this.open = open;
        this.idPath = idPath;
        this.icon = icon;
        this.data = data;
        this.state = state
            ? state
            : {
                  opened: false,
                  selected: false,
                  disabled: false
              };
        this.childCount = childCount;
        this.isLoading = isLoading;
        this.children = children;
    }
}

export interface IState {
    opened?: boolean;
    selected?: boolean;
    disabled?: boolean;
}
