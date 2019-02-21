import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {BaseListComponent} from '../../../../base-list.component';
import {ContactType, UserContact} from '../models/user-contact.model';
import {UserService} from '../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/internal/operators';
import {IActionResultResponse} from '../../../../interfaces/iaction-result-response.result';

@Component({
    selector: 'app-user-contact',
    templateUrl: './user-contact.component.html'
})

export class UserContactComponent extends BaseListComponent<UserContact> implements OnInit {
    @Input() userId: string;
    @Input() listUserContacts: UserContact[] = [];
    @Input() type;
    @Input() isUpdate;
    @Input() label;
    @Input() placeholder;
    @Input() isDetail = false;
    @Output() onSelectUserContact = new EventEmitter<UserContact[]>();
    contactType = ContactType;

    constructor(private toastr: ToastrService,
                private userService: UserService) {
        super();
    }

    ngOnInit() {
    }

    add(userContact: UserContact) {
        if (userContact.contactValue === '' || userContact.contactValue === undefined) {
            return this.toastr.error(this.label + ' is not empty!');
        }
        if (userContact.contactValue && this.type === this.contactType.email && !this.validateEmail(userContact.contactValue)) {
            return;
        }
        if (userContact.contactValue && this.type === this.contactType.mobilePhone && !this.validatePhoneNumber(userContact.contactValue)) {
            return;
        }
        const countUserContact = _.filter(this.listUserContacts, (item: UserContact) => {
            return item.contactType === userContact.contactType && item.contactValue === userContact.contactValue;
        });
        if (countUserContact && countUserContact.length > 1) {
            return this.toastr.error(this.label + ' already exists!');
        }
        if (!this.userId || userContact.id) {
            const userContactInsert = new UserContact();
            userContactInsert.contactValue = '';
            userContactInsert.contactType = this.type;
            userContactInsert.userId = this.userId;
            userContactInsert.id = '';
            this.listUserContacts.push(userContactInsert);
            this.onSelectUserContact.emit(this.listUserContacts);
        }
    }

    delete(userContact: UserContact) {
        if (userContact) {
            if (!this.userId || !userContact.id) {
                _.remove(this.listUserContacts, (item: UserContact) => {
                    return item.contactValue === userContact.contactValue && item.contactType === userContact.contactType;
                });
                this.onSelectUserContact.emit(this.listUserContacts);
            } else {
                this.userService.deleteUserContact(userContact.id).subscribe(() => {
                    _.remove(this.listUserContacts, (item: UserContact) => {
                        return item.contactValue === userContact.contactValue && item.contactType === userContact.contactType;
                    });
                    this.onSelectUserContact.emit(this.listUserContacts);
                });
            }
        }
    }

    onKeyPress(userContact: UserContact, event) {
        if (event.keyCode === 13) {
            if (this.userId && this.isUpdate) {
                this.updateUserContact(userContact);
            } else {
                this.add(userContact);
            }
            event.preventDefault();
        }
    }

    updateUserContact(userContact: UserContact) {
        if (userContact.contactValue === '' || userContact.contactValue === undefined) {
            return this.toastr.error(this.label + ' is not empty!');
        }

        if (userContact.contactValue && this.type === this.contactType.email && !this.validateEmail(userContact.contactValue)) {
            return;
        }
        if (userContact.contactValue && this.type === this.contactType.mobilePhone && !this.validatePhoneNumber(userContact.contactValue)) {
            return;
        }
        const countUserContact = _.filter(this.listUserContacts, (item: UserContact) => {
            return item.contactType === userContact.contactType && item.contactValue === userContact.contactValue;
        });
        if (countUserContact && countUserContact.length > 1) {
            return this.toastr.error(this.label + ' already exists!');
        }
        if (this.userId) {
            userContact.userId = this.userId;
            if (userContact.id) {
                this.userService.updateUserContact(userContact.id, userContact).subscribe((result: any) => {
                    this.onSelectUserContact.emit(this.listUserContacts);
                });
            } else {
                this.userService.insertUserContact(userContact).pipe(finalize(() => {
                }))
                    .subscribe((result: IActionResultResponse) => {
                        userContact.id = result.data;
                        const userContactInsert = new UserContact();
                        userContactInsert.contactValue = '';
                        userContactInsert.contactType = this.type;
                        userContactInsert.userId = this.userId;
                        userContactInsert.id = '';
                        this.listUserContacts.push(userContactInsert);
                        this.onSelectUserContact.emit(this.listUserContacts);
                    });
            }
        }
    }

    private removeContact(contactId: string) {
        _.remove(this.listUserContacts, (contact: UserContact) => {
            return contact.id === contactId;
        });
    }

    private validateEmail(email) {
        const re = /^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
        return re.test(email);
    }

    private validatePhoneNumber(phoneNumber) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
        return re.test(phoneNumber);
    }
}
