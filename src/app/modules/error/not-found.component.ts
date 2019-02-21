import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-not-found',
    template: `
        <div class="col-md-12 page-404">
            <div class="number font-green"> 404</div>
            <div class="details">
                <h3>Rất tiếc!</h3>
                <p> Trang bạn đang tìm kiếm không tồn tại.
                    <br>
                    Click vào đây để quay <a href="/"> Về trang chủ. </a></p>
                <!--<form action="#">-->
                <!--<div class="input-group input-medium">-->
                <!--<input type="text" class="form-control" placeholder="keyword...">-->
                <!--<span class="input-group-btn">-->
                <!--<button type="submit" class="btn green">-->
                <!--<i class="fa fa-search"></i>-->
                <!--</button>-->
                <!--</span>-->
                <!--</div>-->
                <!--&lt;!&ndash; /input-group &ndash;&gt;-->
                <!--</form>-->
            </div>
        </div>
    `
})

export class NotFoundComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
