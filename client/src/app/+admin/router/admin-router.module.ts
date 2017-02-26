import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AuthGuard} from "../auth-guard.service";
import {LoginComponent} from "../login/login.component";
import {LogoutComponent} from "../logout/logout.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AdminRouterModule {
}
