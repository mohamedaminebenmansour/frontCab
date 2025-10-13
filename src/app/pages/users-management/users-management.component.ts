import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { UserResponseDto } from '../../models/user-response-dto';
import { UserCreateDto } from '../../models/user-create-dto';
import { UserUpdateDto } from '../../models/user-update-dto';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { AvatarTextComponent } from '../../shared/components/ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent, AvatarTextComponent, CheckboxComponent],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  users: UserResponseDto[] = [];
  tableRowData: any[] = []; // Adapted for template
  showModal: boolean = false;
  isEdit: boolean = false;
  currentUser: UserCreateDto | UserUpdateDto = {
    userName: '',
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: ''
  };
  currentId: string = '';
  selectedRows: string[] = [];
  selectAll: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.tableRowData = data.map(user => ({
          id: user.id,
          user: { initials: user.firstName[0] + user.lastName[0], name: `${user.firstName} ${user.lastName}`, email: user.email },
          avatarColor: 'brand', // Customize if needed
          product: { name: user.roles.join(', '), price: user.phoneNumber || 'N/A', purchaseDate: new Date(user.createdAt).toLocaleDateString() },
          status: { type: user.isConnected ? 'Online' : 'Offline' },
          actions: { delete: true }
        }));
        console.log('Users loaded successfully:', this.tableRowData);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.currentUser = {
      userName: '',
      email: '',
      password: '',
      role: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: ''
    };
    this.showModal = true;
    console.log('Opened create modal');
  }

  openEditModal(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.isEdit = true;
        this.currentId = user.id;
        this.currentUser = {
          userName: user.userName,
          email: user.email,
          password: '', // Not prefilled
          role: user.roles[0] || '', // Assume single role
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber
        };
        this.showModal = true;
        console.log('Opened edit modal for user:', user.id);
      },
      error: (err) => console.error('Error fetching user for edit:', err)
    });
  }

  closeModal(): void {
    this.showModal = false;
    console.log('Modal closed');
  }

  saveUser(): void {
    if (this.isEdit) {
      this.userService.updateUser(this.currentId, this.currentUser as UserUpdateDto).subscribe({
        next: () => {
          console.log('User updated successfully');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => console.error('Error updating user:', err)
      });
    } else {
      this.userService.createUser(this.currentUser as UserCreateDto).subscribe({
        next: (newUser) => {
          console.log('User created successfully:', newUser);
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => console.error('Error creating user:', err)
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }

  handleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRows = this.tableRowData.map(row => row.id);
    } else {
      this.selectedRows = [];
    }
    console.log('Select all toggled:', this.selectAll);
  }

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
    console.log('Row selected:', id);
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Online') return 'success';
    if (type === 'Offline') return 'warning';
    return 'error';
  }
}