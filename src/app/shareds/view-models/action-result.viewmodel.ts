export interface ActionResultViewModel<T = null> {
    code: number;
    message: string;
    title?: string;
    data?: T;
}
