import {Injectable} from "@angular/core";
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from "@angular/router";
import {AuthenticationService} from "./authentication.service";
import {UserType} from "../../../../../server/entities/user-type";

@Injectable()
export class AdminOrStandardGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkUserTpye();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkUserTpye(): boolean {
    if (this.authenticationService.loggedIn()) {
      let userType: UserType = this.authenticationService.getLoggedInUserType();
      return userType === UserType.ADMIN || userType === UserType.STANDARD;
    }
    return false;
  }
}
