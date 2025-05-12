import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
      })
    );
  }
}