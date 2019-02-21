import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shareds/services/app.service';

@Component({
    selector: 'app-user-setting',
    templateUrl: './user-setting.component.html'
})

export class UserSettingComponent implements OnInit {
    themes = ['default', 'blue', 'darkblue', 'grey', 'light', 'light2'];
    currentTheme: string;

    constructor(private appService: AppService) {
    }

    ngOnInit() {
        this.currentTheme = this.appService.theme$.getValue();
    }

    chooseTheme(themeName: string) {
        this.appService.changeTheme(themeName);
    }


}
