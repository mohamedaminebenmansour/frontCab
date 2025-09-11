import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { EWM_Parck_DisplayGroupe } from '../../models';

@Component({
  selector: 'app-ewm-parck-display-groupe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-parck-display-groupe.component.html'
})
export class EWMParckDisplayGroupeComponent implements OnInit {
  parckDisplayGroupes: EWM_Parck_DisplayGroupe[] = [];
  selectedGroupe: EWM_Parck_DisplayGroupe = {
    code: '',
    libelle: '',
    description: ''
  };
  isFormVisible = false;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('Component initialized - loading groups');
    this.loadParckDisplayGroupes();
  }

  loadParckDisplayGroupes(): void {
    console.log('Loading Parck Display Groupes');
    this.apiService.getParckDisplayGroupes().subscribe({
      next: (data) => {
        console.log('Loaded data:', data);
        this.parckDisplayGroupes = data;
      },
      error: (err) => {
        console.error('Error loading groups:', err);
        this.showAlert('error', `Failed to load groups: ${err.message}`);
      }
    });
  }

  toggleForm(): void {
    console.log('Toggling form visibility:', !this.isFormVisible);
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  resetForm(): void {
    console.log('Resetting form');
    this.selectedGroupe = {
      code: '',
      libelle: '',
      description: ''
    };
    this.isEditing = false;
  }

  saveGroupe(): void {
    console.log('Saving groupe:', this.selectedGroupe);
    if (!this.selectedGroupe.code || !this.selectedGroupe.libelle) {
      console.warn('Validation failed: Code and Libelle required');
      this.showAlert('error', 'Code and Libelle are required');
      return;
    }

    if (this.isEditing && this.selectedGroupe.id) {
      console.log('Updating groupe with ID:', this.selectedGroupe.id);
      this.apiService
        .updateParckDisplayGroupe(this.selectedGroupe.id, this.selectedGroupe)
        .subscribe({
          next: (updated) => {
            console.log('Updated group:', updated);
            this.parckDisplayGroupes = this.parckDisplayGroupes.map((g) =>
              g.id === updated.id ? updated : g
            );
            this.showAlert('success', 'Group updated successfully');
            this.toggleForm();
          },
          error: (err) => {
            console.error('Error updating group:', err);
            this.showAlert('error', `Failed to update group: ${err.message}`);
          }
        });
    } else {
      console.log('Creating new groupe');
      this.apiService.createParckDisplayGroupe(this.selectedGroupe).subscribe({
        next: (created) => {
          console.log('Created group:', created);
          this.parckDisplayGroupes.push(created);
          this.showAlert('success', 'Group created successfully');
          this.toggleForm();
        },
        error: (err) => {
          console.error('Error creating group:', err);
          this.showAlert('error', `Failed to create group: ${err.message}`);
        }
      });
    }
  }

  editGroupe(groupe: EWM_Parck_DisplayGroupe): void {
    console.log('Editing groupe:', groupe);
    this.selectedGroupe = { ...groupe };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteGroupe(id: number): void {
    console.log('Initiating delete for ID:', id);
    if (confirm('Are you sure you want to delete this group?')) {
      this.apiService.deleteParckDisplayGroupe(id).subscribe({
        next: () => {
          console.log('Delete successful for ID:', id);
          this.parckDisplayGroupes = this.parckDisplayGroupes.filter((g) => g.id !== id);
          this.showAlert('success', 'Group deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting group:', err);
          this.showAlert('error', `Failed to delete group: ${err.message}`);
        }
      });
    } else {
      console.log('Delete cancelled for ID:', id);
    }
  }

  showAlert(type: 'success' | 'error', message: string): void {
    console.log('Showing alert:', type, message);
    this.alertType = type;
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
}