import { inject } from '@angular/core';
import { CanActivateFn , Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
const user  = inject(AuthService).user.value
return user?.token ? true : inject(Router).createUrlTree(["/login"])
};
