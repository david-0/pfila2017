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
import {RegistrationComponent} from "../../+registration/registration/registration.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, children: [
    {path: 'users', canActivate: [AuthGuard], component: UserAdminComponent},
    {path: 'groups', canActivate: [AuthGuard], component: GroupAdminComponent},
    {path: 'registrations', canActivate: [AuthGuard], component: RegistrationAdminComponent},
    {path: 'change-person/:id', canActivate: [AuthGuard], component: RegistrationComponent},
    {path: 'change-password', canActivate: [AuthGuard], component: PasswordChangeComponent},
    {
      path: 'password-confirmation',
      canActivate: [AuthGuard],
      component: PasswordChangeConfirmationComponent,
    },
    {path: '', redirectTo: 'registrations', pathMatch: 'full'},
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
