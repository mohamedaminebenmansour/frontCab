import { Component , OnInit} from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';

import { FormsModule } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { UserResponseDto } from '../../../../models/user-response-dto';
import { ProfileUpdateDto } from '../../../../models/profile-update-dto';
import { LabelComponent } from "../../form/label/label.component";

@Component({
  selector: 'app-user-meta-card',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    InputFieldComponent,
    ButtonComponent,
    FormsModule,
    LabelComponent
],
  templateUrl: './user-meta-card.component.html'
})
export class UserMetaCardComponent implements OnInit {
  isOpen = false;
  user!: UserResponseDto;  // Dynamic from backend
  selectedFile: File | null = null;

  constructor(public modal: ModalService, private userService: UserService) {}

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
        this.modal.closeModal();
      },
      error: (err) => console.error('Update error:', err)
    });
  }

  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }
}