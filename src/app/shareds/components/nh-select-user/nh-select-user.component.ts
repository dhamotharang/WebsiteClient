import {
    Component, ElementRef, Renderer, Inject,
    OnInit, Input, Output, EventEmitter, ViewChild, HostListener
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAppConfig } from '../../../interfaces/iapp-config';
import { NhSelectUserService } from './nh-select-user.service';
import { APP_CONFIG } from '../../../configs/app.config';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'nh-select-user',
    templateUrl: './nh-select-user.component.html',
    styleUrls: ['./nh-select-user.less']
})
export class NhSelectUserComponent implements OnInit {
    @ViewChild('keyword', {static: true}) keywordElement: ElementRef;
    @Input() type = 'link'; // link, listUser
    @Input() url = 'user/search-suggest-user';
    @Input() text: string;
    @Input() defaultText: string;
    @Input() isMultiple = false;
    @Output() onSelectUser = new EventEmitter();
    @Output() onRemoveUser = new EventEmitter();
    isShowPopup = false;
    keyword: string;
    isSearching = false;
    tabValue = 0;
    totalUser = 0;
    listUsers = [];
    searchTerm = new BehaviorSubject<string>(null);

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private el: ElementRef, private renderer: Renderer,
        private service: NhSelectUserService) {
    }

    ngOnInit(): void {
        this.searchTerm
            .pipe(debounceTime(500))
            .subscribe((term: string) => {
                if (term != null) {
                    this.search(term);
                }
            });
    }

    onSearchKeyUp(event) {
        this.tabValue = 1;
        this.searchTerm.next(event.target.value);
        if (event.key === 'Enter') {
            event.preventDefault();
            return;
        }
    }

    onTabClick(tabType) {
        this.tabValue = tabType;
    }

    search(keyword: string) {
        this.isSearching = true;
        this.service.searchUser(keyword, this.url).subscribe((result: any) => {
            this.isSearching = false;
            this.totalUser = result.totalRows;
            this.listUsers = result.items;
        });
    }

    selectUser(user) {
        if (!this.isMultiple) {
            this.isShowPopup = false;
        }
        this.onSelectUser.emit(user);
    }

    removeSelectedUser() {
        this.text = null;
        this.onRemoveUser.emit();
    }

    showPopup() {
        this.isShowPopup = !this.isShowPopup;
        if (this.isShowPopup) {
            setTimeout(() => {
                if (this.keywordElement) {
                    this.renderer.invokeElementMethod(this.keywordElement.nativeElement, 'focus');
                }
            }, 500);
        }
    }

    @HostListener('document:click', ['$event'])
    onClick(event) {
        if (!this.el.nativeElement.contains(event.target)) {
            this.isShowPopup = false;
        }
    }

    formSubmit() {
        console.log('formsubmit');
        alert('ok');
    }
}
