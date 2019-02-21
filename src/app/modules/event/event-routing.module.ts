import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventService } from './event.service';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventRegisterListComponent } from './event-register-list/event-register-list.component';
import {EventAlbumComponent} from './event-album/event-album.component';

const routes: Routes = [
    {
        path: '',
        component: EventListComponent,
        resolve: {
            data: EventService
        }
    },
    {
        path: 'add',
        component: EventFormComponent
    },
    {
        path: 'edit/:id',
        component: EventFormComponent
    },
    {
        path: 'detail/:id',
        component: EventDetailComponent
    },
    {
        path: 'register/:id',
        component: EventRegisterListComponent
    },
    {
        path: 'album/:id',
        component: EventAlbumComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [EventService]
})
export class EventRoutingModule {
}
