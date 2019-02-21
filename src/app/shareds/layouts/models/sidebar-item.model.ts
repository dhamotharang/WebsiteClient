export class SidebarItem {
    id: number;
    name: string;
    bgColor: string;
    childCount: number;
    icon: string;
    idPath: string;
    orderPath: string;
    parentId?: number;
    url: string;
    isActive: boolean;
    isOpen: boolean;
    children: SidebarItem[];

    constructor(id: number, name: string, bgColor: string, childCount: number, icon: string, idPath: string,
                orderPath: string, url: string, parentId?: number, children?: SidebarItem[]) {
        this.id = id;
        this.name = name;
        this.bgColor = bgColor;
        this.childCount = childCount;
        this.icon = icon;
        this.idPath = idPath;
        this.orderPath = orderPath;
        this.url = url;
        this.parentId = parentId;
        this.children = children;
        this.isActive = false;
        this.isOpen = false;
    }
}
