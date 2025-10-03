import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../shared/services/user.service'; // Assume this exists and calls /api/user/current
import { UserResponseDto } from '../../models/user-response-dto';
import { ProfileUpdateDto } from '../../models/profile-update-dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit {
  isOpen = false;
  user!: UserResponseDto;  // Dynamic from backend
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        console.log('User fetched:', this.user);  // Test log
      },
      error: (err) => console.error('Fetch error:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  handleSave() {
    const updateData: ProfileUpdateDto = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      address: this.user.address,
      picture: this.selectedFile || undefined
    };

    this.userService.updateProfile(updateData).subscribe({
      next: () => {
        console.log('Update successful');
        this.fetchUser();  // Refresh
        this.closeModal();
      },
      error: (err) => console.error('Update error:', err)
    });
  }

  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }
}