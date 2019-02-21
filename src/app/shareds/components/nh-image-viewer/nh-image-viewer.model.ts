export class ImageViewer {
    id: string;
    src: string;
    name: string;
    description?: string;

    constructor(id: string, src: string, name?: string, description?: string) {
        this.id = id;
        this.src = src;
        this.name = name;
        this.description = description;
    }
}
