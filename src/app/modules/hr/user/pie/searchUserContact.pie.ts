import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {UserContact} from '../models/user-contact.model';
import * as _ from 'lodash';

@Pipe({
    name: 'searchUserContact',
    pure: false
})

@Injectable()
export class SearchUserContactPipe implements PipeTransform {
    transform(listUserContact: UserContact[], value: number): any[] {
        if (!listUserContact) {
            return [];
        }
        listUserContact = _.filter(listUserContact, (item: UserContact) => item.contactType === value);
        return listUserContact;
    }
}
