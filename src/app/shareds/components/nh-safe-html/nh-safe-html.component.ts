/**
 * Created by Nam on 4/20/2017.
 */
import { Component, Input, Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

@Component({
    selector: 'nh-safeHtml',
    template: `
    <div [innerHtml]="html | safeHtml">
    </div>
  `,
})

export class NhSafeHtmlComponent {
    @Input() html: string;
    constructor() {
    }
}

