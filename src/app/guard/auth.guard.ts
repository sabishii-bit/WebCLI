import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isDesktop: boolean;

  constructor(private deviceService: DeviceDetectorService, private router: Router) {
    this.isDesktop = this.deviceService.isDesktop();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Auth guard only allows people to be on this site if they're on Desktop
    // We'll change this in the future
    if (this.isDesktop) {
      return true;
    } else {
      this.router.navigateByUrl('/error');
      return this.isDesktop;
    }
  }
  
}
