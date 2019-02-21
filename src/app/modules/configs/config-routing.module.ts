import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { ClientComponent } from './client/client.component';
import { ClientFormComponent } from './client/client-form.component';
import { ClientService } from './client/client.service';
import { TenantComponent } from './tenant/tenant.component';
import { TenantService } from './tenant/tenant.service';
import { RoleComponent } from './role/role.component';
import { LanguageComponent } from './website/language/language.component';
import { PageService } from './page/page.service';
import { RoleService } from './role/role.service';
import { UserSettingComponent } from './user-setting/user-setting.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { AccountComponent } from './account/account.component';
import { MenuComponent } from './menus/menu.component';
import { MenuService } from './menus/menu.service';
import { WebsiteComponent } from './website/website.component';
import { EmailComponent } from './email/email.component';
import { EmailService } from './email/service/email.service';
import { MenuFormComponent } from './menus/menu-form/menu-form.component';
import { ApproverComponent } from './approver/approver.component';
import { ApproverService } from './approver/approver.service';

const routes: Routes = [
    // {
    //     path: '',
    //     component: LayoutComponent,
    //     canActivate: [AuthGuardService],
    //     children: [
    {
        path: '',
        component: RoleComponent
    },
    {
        path: 'tenants',
        component: TenantComponent,
    },
    {
        path: 'pages',
        component: PageComponent,
        resolve: {
            data: PageService
        }
    },
    {
        path: 'clients',
        resolve: {
            data: ClientService
        },
        component: ClientComponent,
        children: [
            {
                path: 'add-new',
                component: ClientFormComponent
            },
            {
                path: 'edit',
                component: ClientFormComponent
            }
        ]
    },
    {
        path: 'roles',
        resolve: {
            data: RoleService
        },
        component: RoleComponent
    },
    {
        path: 'roles/add',
        component: RoleFormComponent
    },
    {
        path: 'roles/:id',
        component: RoleFormComponent
    },
    {
        path: 'languages',
        component: LanguageComponent
    },
    {
        path: 'settings',
        component: UserSettingComponent
    },
    {
        path: 'accounts',
        component: AccountComponent
    },
    {
        path: 'menus',
        component: MenuComponent,
        resolve: {
            data: MenuService
        }
    },
    {
        path: 'menus/add',
        component: MenuFormComponent,
    },
    {
        path: 'website',
        component: WebsiteComponent
    },
    {
        path: 'emails',
        component: EmailComponent,
        resolve: {
            data: EmailService
        }
    },
    {
        path: 'menus/edit/:id',
        component: MenuFormComponent,
    },
    {
        path: 'approver',
        component: ApproverComponent,
        resolve: {
            data: ApproverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ClientService, TenantService, PageService, RoleService, MenuService, EmailService, ApproverService]
})
export class ConfigRoutingModule {
}
