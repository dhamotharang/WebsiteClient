/**
 * @deprecated: This interface will be replace in next version. Please use SearchResultViewModel instead.
 */
export interface ISearchResult<TEntity> {
    code?: number;
    message?: string;
    items: TEntity[];
    totalRows: number;
}
