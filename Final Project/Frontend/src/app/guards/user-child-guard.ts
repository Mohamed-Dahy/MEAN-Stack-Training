import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const userChildGuard: CanActivateChildFn = (childRoute, state) => {
   const user = inject(AuthService).user.value;

  return user?.token ? true : inject(Router).createUrlTree(["/signin"]);

};
