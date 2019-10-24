import {
    AfterViewInit,
    Component,
    enableProdMode,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var tinymce: any;

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'tinymce',
    template: `
        <div class="form-control tinymce-editor" id="{{elementId}}" *ngIf="inline"
             [ngStyle]="{'height': height + 'px'}">
            <span [innerHTML]="content"></span>
        </div>
        <textarea *ngIf="!inline" id="{{elementId}}" [ngStyle]="{'height': height + 'px'}"
                  value="{{content}}"></textarea>
    `,
    styleUrls: ['./tinymce.component.scss'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TinymceComponent), multi: true}
    ]
})
export class TinymceComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() elementId: string;
    @Input() height: number;
    @Input() inline = false;
    @Input() menu = {
        file: {title: 'File', items: 'newdocument | print'},
        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
        // insert: {title: 'Insert', items: 'link media | template hr '},
        view: {title: 'View', items: 'visualaid | preview | fullscreen '},
        format: {
            title: 'Format',
            items: 'bold italic underline strikethrough superscript subscript | formats | removeformat '
        },
        table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
        tools: {title: 'Tools', items: 'code '}
    };
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onChange = new EventEmitter<any>();
    @Output() onBlur = new EventEmitter<any>();
    editor;
    private _content;
    get content() {
        return this._content;
    }

    @Input()
    set content(val) {
        this._content = val;
    }

    propagateChange: any = () => {
    }

    constructor() {
    }

    ngAfterViewInit() {
        this.initEditor();
    }

    ngOnDestroy() {
        tinymce.remove(`${this.elementId}`);
    }

    initEditor() {

        setTimeout(() => {
            tinymce.remove(`#${this.elementId}`);
            tinymce.init({
                selector: `#${this.elementId}`,
                plugins: ['fullscreen', 'link', 'autolink', 'paste', 'image', 'table', 'textcolor', 'print', 'preview', 'spellchecker',
                    'colorpicker', 'fullscreen', 'code', 'lists', 'wordcount'],
                toolbar: 'insertfile undo redo | | fontselect | fontsizeselect | bold italic ' +
                '| alignleft aligncenter alignright alignjustify ' +
                '| bullist numlist outdent indent | link image | fullscreen | forecolor backcolor',
                fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt',
                skin_url: '/assets/skins/lightgray',
                menu: this.menu,
                inline: this.inline,
                setup: editor => {
                    this.editor = editor;
                    editor.on('keyup', (event) => {
                        const content = editor.getContent();
                        this.content = content;
                        this.propagateChange(content);
                        this.onEditorKeyup.emit({
                            text: editor.getContent({format: 'text'}),
                            content: this.content
                        });
                    });
                    editor.on('change', (event) => {
                        const contentChange = editor.getContent();
                        this.content = contentChange;
                        this.propagateChange(this.content);
                        this.onChange.emit({
                            text: editor.getContent({format: 'text'}),
                            content: this.content
                        });
                    });
                    editor.on('blur', (event) => {
                        const contentChange = editor.getContent();
                        this.content = contentChange;
                        this.propagateChange(this.content);
                        this.onBlur.emit({
                            text: editor.getContent({format: 'text'}),
                            content: this.content
                        });
                    });
                }
            });
        }, 100);
    }

    setContent(content: string) {
        this.content = content;
        const editor = tinymce.get(this.elementId);
        if (editor != null) {
            editor.setContent(this.content != null ? this.content : '');
        }
    }

    append(data: string, editorId?: string) {
        const editor = !editorId ? tinymce.get(this.elementId) : tinymce.get(editorId);
        if (editor != null) {
            editor.execCommand('mceInsertContent', false, data);
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    destroy() {
        tinymce.remove(`#${this.elementId}`);
    }

    writeValue(value) {
        this.content = value;
        const editor = tinymce.get(this.elementId);
        this.initEditor();
    }

    registerOnTouched() {
    }
}
