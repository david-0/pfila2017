import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AuthGuard} from "../services/auth-guard.service";
import {LoginComponent} from "../login/login.component";
import {LogoutComponent} from "../logout/logout.component";
import {UserAdminComponent} from "../user-admin/user-admin.component";
import {GroupAdminComponent} from "../group-admin/group-admin.component";
import {RegistrationAdminComponent} from "../registration-admin/registration-admin.component";
import {PasswordChangeComponent} from "../password-change/password-change.component";
import {PasswordChangeConfirmationComponent} from "../password-change-confirmation/password-change-confirmation.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, children: [
    {path: 'users', component: UserAdminComponent, outlet: 'admin'},
    {path: 'groups', component: GroupAdminComponent, outlet: 'admin'},
    {path: 'registrations', component: RegistrationAdminComponent, outlet: 'admin'},
    {path: 'change-password', canActivate: [AuthGuard], component: PasswordChangeComponent, outlet: 'admin'},
    {
      path: 'password-confirmation',
      canActivate: [AuthGuard],
      component: PasswordChangeConfirmationComponent,
      outlet: 'admin'
    },
    {path: '', redirectTo: 'users', pathMatch: 'full', outlet: 'admin'},
  ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'logout', canActivate: [AuthGuard], component: LogoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AdminRouterModule {
}
