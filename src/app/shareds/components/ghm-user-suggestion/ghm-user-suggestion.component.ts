import {
    Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, Renderer2
} from '@angular/core';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GhmUserSuggestionService } from './ghm-user-suggestion.service';
import { Subject } from 'rxjs';
import {
    debounceTime, distinctUntilChanged, switchMap, finalize, tap
} from 'rxjs/operators';

export class UserSuggestion {
    id: string;
    name: string;
    userName: string;
    email: string;
    avatar: string;
    isSelected: boolean;
    isActive: boolean;

    constructor(id?: string, name?: string, userName?: string, email?: string, avatar?: string, isSelected?: boolean) {
        this.id = id;
        this.name = name;
        this.userName = name;
        this.email = email;
        this.avatar = avatar;
        this.isSelected = isSelected;
        this.isActive = false;
    }
}

@Component({
    selector: 'ghm-user-suggestion',
    templateUrl: './ghm-user-suggestion.component.html',
    styleUrls: ['./ghm-user-suggestion.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GhmUserSuggestionComponent),
            multi: true
        },
        GhmUserSuggestionService
    ]
})

export class GhmUserSuggestionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() type = 'input';
    @Input() isMultiple = false;
    @Input() isShowSelected = true;
    @Input() placeholder = 'Vui lòng nhập tên nhân viên cần tìm';
    @Input() noImageFallback = '/assets/images/noavatar.png';

    @Input()
    set selectedUser(value: UserSuggestion) {
        this._selectedUser = value;
    }

    @Input()
    set sources(values: UserSuggestion[]) {
        this._sources = values;
        this.listUsers = values;
    }

    @Input()
    set userId(userId: string) {
        this._userId = userId;
    }

    @Output() userSelected = new EventEmitter();
    @Output() userRemoved = new EventEmitter();
    @Output() keyUpPressed = new EventEmitter();

    private _sources: UserSuggestion[];
    private _userId: string;
    private _isShowSuggestionList: boolean;
    private _subscribers: any = {};
    private _selectedUser: UserSuggestion = null;

    isLoading = false;
    isActive = false;
    keyword: string;
    selectedUsers: UserSuggestion[] = [];
    searchTerms = new Subject<string>();
    listUsers: UserSuggestion[] = [];

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private userSuggestionService: GhmUserSuggestionService) {
    }

    propagateChange: any = () => {
    }

    get selectedUser() {
        return this._selectedUser;
    }

    get userId() {
        return this._userId;
    }

    get isShowListSuggestion() {
        return this._isShowSuggestionList;
    }

    get sources() {
        return this._sources ? this._sources : [];
    }

    ngOnInit() {
        this._subscribers.getUsers = this.searchTerms.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => this.isLoading = true),
            switchMap((term: string) => this.userSuggestionService.search(term)
                .pipe(
                    finalize(() => this.isLoading = false)
                )),
        ).subscribe((result: UserSuggestion[]) => {
            this.listUsers = result;
        });
    }

    ngOnDestroy() {
        this.selectedUser = null;
        this._subscribers.getUsers.unsubscribe();
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(targetElement) {
        if (this.el.nativeElement && !this.el.nativeElement.contains(targetElement.target)) {
            this.isActive = false;
        }
    }

    activeSuggestion() {
        if (this.isActive) {
            return;
        }

        this.isActive = true;
        setTimeout(() => {
            this.searchTerms.next(this.keyword);
        }, 0);
    }

    inputKeyUp(event) {
        const isNavigation = this.navigate(event);
        if (!isNavigation) {
            this.searchTerms.next(this.keyword);
            this.keyUpPressed.emit(event);
        }
    }

    onImageError(user: UserSuggestion) {
        if (user) {
            user.avatar = this.noImageFallback;
        }
    }

    selectUser(user: UserSuggestion) {
        if (!this.isMultiple) {
            this.isActive = false;
            this.keyword = '';
            this.selectedUser = user;
            this.propagateChange(user.id);
            this.userSelected.emit(user);
        } else {
            user.isSelected = !user.isSelected;
            const listSelectedUsers = _.filter(this.listUsers, (userItem: UserSuggestion) => userItem.isSelected);
            this.selectedUsers = listSelectedUsers;
            this.keyword = '';
            this.userSelected.emit(listSelectedUsers);
        }
    }

    removeSelectedUser(user: UserSuggestion) {
        if (this.isMultiple && this.selectedUsers instanceof Array) {
            _.remove(this.selectedUsers, (userItem: UserSuggestion) => userItem.id === user.id);
        } else {
            this.selectedUser = null;
        }
        this.resetActiveStatus();
        this.userRemoved.emit(user);
    }

    writeValue(value) {
        this.userId = value;
    }

    private navigate(key) {
        const keyCode = key.keyCode;
        // Escape
        if (keyCode === 27) {
            this.isActive = false;
            return true;
        }

        if (keyCode === 27 || keyCode === 17 || key.ctrlKey) {
            return true;
        }

        // 37: Left arrow
        // 38: Up arrow
        // 39: Right arrow
        // 40: Down arrow
        // 13: Enter
        if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 13) {
            switch (keyCode) {
                case 37:
                case 38:
                    this.back();
                    break;
                case 39:
                case 40:
                    this.next();
                    break;
                case 13:
                    const selectedItems = this.listUsers.find((user: UserSuggestion) => {
                        return user.isActive;
                    });
                    this.selectUser(selectedItems);
                    break;
            }
            key.preventDefault();
            return true;
        }

        return false;
    }

    private next() {
        let index = this.getActiveUserIndex();
        if (index === -1) {
            const firstUser = this.listUsers[0];
            if (firstUser) {
                firstUser.isActive = true;
            }
        } else {
            index = index < this.listUsers.length - 1 ? index + 1 : 0;
            this.setUserActiveStatus(index);
        }
    }

    private back() {
        let index = this.getActiveUserIndex();
        if (index === -1) {
            const lastUser = this.listUsers[this.listUsers.length - 1];
            if (lastUser) {
                lastUser.isActive = true;
            }
        } else {
            index = index > 0 ? index - 1 : this.listUsers.length - 1;
            this.setUserActiveStatus(index);
        }
    }

    private resetActiveStatus() {
        this.listUsers.forEach((user: UserSuggestion) => user.isActive = false);
    }

    private getActiveUserIndex() {
        return _.findIndex(this.listUsers, (userItem: UserSuggestion) => {
            return userItem.isActive;
        });
    }

    private setUserActiveStatus(index: number) {
        this.listUsers.forEach((userItem: UserSuggestion) => userItem.isActive = false);
        const user = this.listUsers[index];
        if (user) {
            user.isActive = true;
        }
    }

    private resetSelectedStatus() {
        if (this.selectedUsers instanceof Array) {
            _.each(this.selectedUsers, (userItem: UserSuggestion) => {
                userItem.isSelected = false;
            });
        }
    }
}
