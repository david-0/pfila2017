import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {InfoComponent} from './info/info.component';
import {TeamComponent} from './team/team.component';
import {RegistrationComponent} from './registration/registration.component';
import {ConfirmationComponent} from "./confirmation/confirmation.component";


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},

  {path: 'home', component: HomeComponent},
  {path: 'info', component: InfoComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'confirmation/:id', component: ConfirmationComponent},
  {path: 'team', component: TeamComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRouteModule {
}