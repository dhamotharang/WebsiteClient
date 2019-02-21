import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-error-permission',
    template: `
        <div class="col-md-12 page-500">
            <div class=" number font-red"> 401</div>
            <div class=" details">
                <h3>Từ chối truy cập.</h3>
                <p> Rất tiếc! bạn không có quyền thực hiện chức năng này.
                    <br></p>
                <p>
                    <a href="/" class="btn red btn-outline"> Trở về trang chủ </a>
                    <br></p>
            </div>
        </div>
    `,
})

export class ErrorPermissionComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
