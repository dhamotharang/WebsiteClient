import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Observable } from 'rxjs';
import { DestroySubscribers } from '../../decorator/destroy-subscribes.decorator';

@Component({
    selector: 'app-admin-1-layout',
    templateUrl: 'admin-1-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles/layout.css', './styles/custom.css', './styles/themes/default.min.css']
})

@DestroySubscribers()
export class Admin1LayoutComponent implements OnDestroy, AfterViewInit {
    @ViewChild('header') header: ElementRef;
    @ViewChild('container') container: ElementRef;
    @ViewChild('pageContent') pageContent: ElementRef;

    pageTitle$: Observable<string>;
    moduleTitle$: Observable<string>;

    constructor(private renderer: Renderer2,
                private appService: AppService) {
        // this.pageTitle$ = this.appService.pageTitle$.pipe();
        // this.moduleTitle$ = this.appService.moduleTitle$.pipe();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.calculateContentHeight();
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
        this.calculateContentHeight();
    }



    private calculateContentHeight() {
        const windowHeight = window.innerHeight;
        const pageContentElement = this.pageContent.nativeElement;
        this.renderer.setStyle(pageContentElement, 'height', `${windowHeight - 50}px`);
    }
}
