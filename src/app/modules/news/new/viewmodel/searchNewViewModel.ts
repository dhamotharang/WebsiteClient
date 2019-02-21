import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {NewsSearchViewModel} from './news-search.viewmodel';

export class SearchNewViewModel {
    searchResult: SearchResultViewModel<NewsSearchViewModel>;
    isApprove: boolean;
}
