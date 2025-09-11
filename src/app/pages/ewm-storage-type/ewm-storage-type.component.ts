import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageType, EWM_Aturized_Status } from '../../models';

@Component({
  selector: 'app-ewm-storage-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-type.component.html'
})
export class EwmStorageTypeComponent implements OnInit {
  storageTypesList: EWM_StorageType[] = [];
  selectedType: EWM_StorageType = {
    code: '',
    lib: '',
    validateByQuality: false,
    withCheckAuthorizedStatus: false,
    noInputRewinding: false,
    isIncomplete: false,
    idewmAturizedStatus: undefined
  };
  aturizedStatuses: EWM_Aturized_Status[] = [];
  isFormVisible = false;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Component initialized - loading storage types and aturized statuses');
    this.loadStorageTypes();
    this.loadAturizedStatuses();
  }

  loadStorageTypes(): void {
    console.log('Loading Storage Types');
    this.apiService.getStorageTypes().subscribe({
      next: (data) => {
        console.log('Loaded storage types:', data);
        data.forEach(item => {
          console.log(`Item ID: ${item.id}, idewmAturizedStatus: ${item.idewmAturizedStatus}`);
        });
        this.storageTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading storage types:', err);
        this.showAlert('error', `Failed to load storage types: ${err.message}`);
      }
    });
  }

  loadAturizedStatuses(): void {
    console.log('Loading Aturized Statuses');
    this.apiService.getAturizedStatusesFromStorageType().subscribe({
      next: (data) => {
        console.log('Loaded aturized statuses:', data);
        this.aturizedStatuses = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading aturized statuses:', err);
        this.showAlert('error', `Failed to load aturized statuses: ${err.message}`);
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
    this.selectedType = {
      code: '',
      lib: '',
      validateByQuality: true,
      withCheckAuthorizedStatus: false,
      noInputRewinding: false,
      isIncomplete: false,
      idewmAturizedStatus: undefined
    };
    this.isEditing = false;
  }

  saveType(): void {
    console.log('Saving type:', this.selectedType);
    if (!this.selectedType.code || !this.selectedType.lib) {
      console.warn('Validation failed: Code and Libelle required');
      this.showAlert('error', 'Code and Libelle are required');
      return;
    }

    const typeToSend: EWM_StorageType = {
      ...this.selectedType,
      idewmAturizedStatus: this.selectedType.idewmAturizedStatus || undefined,
      codeAuthorizedStatus: this.selectedType.codeAuthorizedStatus || undefined
    };

    if (this.isEditing && this.selectedType.id) {
      console.log('Updating type with ID:', this.selectedType.id);
      this.apiService
        .updateStorageType(this.selectedType.id, typeToSend)
        .subscribe({
          next: (updated) => {
            console.log('Updated type:', updated);
            this.storageTypesList = this.storageTypesList.map((t) =>
              t.id === updated.id ? updated : t
            );
            this.showAlert('success', 'Storage Type updated successfully');
            this.toggleForm();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating type:', err);
            this.showAlert('error', `Failed to update type: ${err.message}`);
          }
        });
    } else {
      console.log('Creating new type');
      this.apiService.createStorageType(typeToSend).subscribe({
        next: (created) => {
          console.log('Created type:', created);
          this.storageTypesList.push(created);
          this.showAlert('success', 'Storage Type created successfully');
          this.toggleForm();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating type:', err);
          this.showAlert('error', `Failed to create type: ${err.message}`);
        }
      });
    }
  }

  editType(type: EWM_StorageType): void {
    console.log('Editing type:', type);
    this.selectedType = { ...type };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteType(id: number): void {
    console.log('Initiating delete for ID:', id);
    if (confirm('Are you sure you want to delete this storage type?')) {
      this.apiService.deleteStorageType(id).subscribe({
        next: () => {
          console.log('Delete successful for ID:', id);
          this.storageTypesList = this.storageTypesList.filter((t) => t.id !== id);
          this.showAlert('success', 'Storage Type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting type:', err);
          this.showAlert('error', `Failed to delete type: ${err.message}`);
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
      this.cdr.detectChanges();
    }, 3000);
  }

  getAturizedStatusLabel(id: number | undefined): string {
    if (!id) {
      return '-';
    }
    const status = this.aturizedStatuses.find(s => s.idewm_Aturized_Status === id);
    return status ? status.valueAtorisedStatus : 'Unknown';
  }
}