import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoComponent } from './videos/video.component';
import { VideoService } from './videos/video.service';
import { GalleryComponent } from './gallery/gallery.component';
import { PhotoService } from './photo/photo.service';
import { PhotoComponent } from './photo/photo.component';
import { AlbumFormComponent } from './photo/album-form/album-form.component';

const routes: Routes = [
    {
        path: '',
        component: GalleryComponent,
        resolve: {
            data: VideoService
        }
    },
    {
        path: 'album',
        component: PhotoComponent,
        resolve: {
            data: PhotoService
        }
    },
    {
        path: 'album/add',
        component: AlbumFormComponent,
    },
    {
        path: 'album/edit/:id',
        component: AlbumFormComponent,
    },
    {
        path: 'video',
        component: VideoComponent,
        resolve: {
            data: VideoService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [VideoService, PhotoService]
})
export class GalleryRoutingModule {
}
