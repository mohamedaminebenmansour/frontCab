import { Component, OnInit } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { UserService } from '../../../../shared/services/user.service'; // Assuming this service exists
import { UserResponseDto } from '../../../../models/user-response-dto'; // Assuming this DTO exists
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent],
  standalone: true // If using standalone components; adjust if module-based
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  user: UserResponseDto | null = null;

  constructor(private userService: UserService, private router: Router,private authService : AuthService) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Fetch user error:', err);
        // Optionally handle redirect to login if unauthorized
      }
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Clear any local storage or auth tokens if applicable
        localStorage.removeItem('authToken'); // Example; adjust based on your auth setup
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/signin']); // Proceed to login even on error
      }
    });
    this.closeDropdown();
  }
}