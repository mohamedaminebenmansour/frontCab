import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('authGuard: User is logged in, allowing access');
    return true;
  }

  console.log('authGuard: User not logged in, redirecting to sign-in');
  router.navigate(['/sign-in']);
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];
  const userRoles = authService.getRoles();  // Assume your AuthService has getRoles() returning string[]

  console.log('roleGuard: Expected roles:', expectedRoles);
  console.log('roleGuard: User roles:', userRoles);

  if (expectedRoles.some(role => userRoles.includes(role))) {
    console.log('roleGuard: Access granted for matching role');
    return true;
  } else {
    console.log('roleGuard: Access denied, redirecting to sign-in');
    router.navigate(['/sign-in']);
    return false;
  }
};