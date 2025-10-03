import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('Guard: User is logged in, allowing access');
    return true;
  }

  console.log('Guard: User not logged in, redirecting to sign-in');
  router.navigate(['/sign-in']);
  return false;
};