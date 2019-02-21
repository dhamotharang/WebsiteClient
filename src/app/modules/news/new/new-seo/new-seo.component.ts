import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-new-seo',
    template: `<p><b> SeoLink </b>: {{seoLink}}</p>
               <p><b> Meta Title</b>: <a>{{title}}</a></p>
               <p><b> MetaDescription </b>: {{description}}</p>
               <p><b> MetaKeyword</b>: {{metaKeyword}}</p>`
})

export class NewSeoComponent {
    @Input() title;
    @Input() description;
    @Input() seoLink;
    @Input() metaKeyword;
}
