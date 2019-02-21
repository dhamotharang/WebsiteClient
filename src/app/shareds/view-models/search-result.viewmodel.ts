export interface SearchResultViewModel<TEntity> {
    code?: number;
    message?: string;
    items: TEntity[];
    totalRows: number;
}
