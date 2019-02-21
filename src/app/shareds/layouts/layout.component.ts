import {
    AfterContentInit,
    Component,
    ComponentFactoryResolver,
    OnInit,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {LayoutDirective} from './layout.directive';
import {Admin1LayoutComponent} from './admin-1/admin-1-layout.component';
import {Admin2LayoutComponent} from './admin-2/admin-2-layout.component';
import {AppService} from '../services/app.service';
import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LayoutComponent implements OnInit {
    @ViewChild(LayoutDirective) layoutDirective: LayoutDirective;

    constructor(private componentFactoryResolve: ComponentFactoryResolver,
                private renderer: Renderer2,
                private route: ActivatedRoute,
                private appService: AppService) {
    }

    ngOnInit() {
        this.appService.layout$.subscribe((layout: string) => {
            switch (layout) {
                case 'layout1':
                    this.loadComponent(Admin1LayoutComponent);
                    break;
                case 'layout2':
                    this.loadComponent(Admin2LayoutComponent);
                    break;
                default:
                    this.loadComponent(Admin1LayoutComponent);
                    break;
            }
        });
        this.initTheme();
    }

    loadComponent(theme: any = Admin1LayoutComponent) {
        const componentFactory = this.componentFactoryResolve.resolveComponentFactory(theme);
        const viewContainerRef = this.layoutDirective.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        // (<Admin1LayoutComponent>componentRef.instance)
    }

    private renderStyleSheetLink(link: string) {
        if (!link) {
            return;
        }

        const linkThemes = document.getElementsByTagName('link');
        const linkThemeTag = _.find(linkThemes, (linkTheme: any) => {
            return linkTheme.hasAttribute('target') && linkTheme.getAttribute('target') === 'theme';
        });

        if (linkThemeTag) {
            linkThemeTag.setAttribute('href', link);
        } else {
            const headTag = document.getElementsByTagName('head')[0];
            const linkTag = document.createElement('link');
            linkTag.rel = 'stylesheet';
            linkTag.type = 'text/css';
            linkTag.href = link;
            linkTag.setAttribute('target', 'theme');
            this.renderer.appendChild(headTag, linkTag);
        }
    }

    // private renderBaseThemeUrl(layout: string) {
    //     switch (layout) {
    //         case 'layout1':
    //             this.baseThemeUrl = '/assets/styles/admin1/themes/';
    //             break;
    //         case 'layout2':
    //             this.baseThemeUrl = '/assets/styles/admin2/themes/';
    //             break;
    //         default:
    //             this.baseThemeUrl = '/assets/styles/admin1/themes/';
    //             break;
    //     }
    // }
    private initTheme() {
        const themeValue = this.appService.theme$.getValue()
        if (themeValue) {
            this.renderStyleSheetLink(this.appService.renderCssUrl(themeValue));
        }
        this.appService.theme$.subscribe((themeName: string) => {
            this.renderStyleSheetLink(this.appService.renderCssUrl(themeName ? themeName : 'default'));
        });
    }
}
