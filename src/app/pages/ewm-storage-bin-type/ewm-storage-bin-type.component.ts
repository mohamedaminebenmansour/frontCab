import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageBinType, StorageBinType } from '../../models';

interface EnumOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-ewm-storage-bin-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-bin-type.component.html'
})
export class EwmStorageBinTypeComponent implements OnInit {
  storageBinTypesList: EWM_StorageBinType[] = [];
  selectedType: EWM_StorageBinType = {
    codeStorageBinType: '',
    lib_LocationType: '',
    storageBinType: StorageBinType.STANDARD // Default to STANDARD
  };
  isFormVisible = false;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  enumOptions: EnumOption[] = [];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Component initialized - loading storage bin types');
    this.loadStorageBinTypes();
    this.enumOptions = Object.values(StorageBinType).map(value => ({
      value,
      label: value
    }));
    console.log('Enum options initialized:', this.enumOptions);
  }

  loadStorageBinTypes(): void {
    console.log('Loading Storage Bin Types');
    this.apiService.getStorageBinTypes().subscribe({
      next: (data) => {
        console.log('Loaded data:', data);
        data.forEach(item => {
          console.log(`Item ID: ${item.idLocationType}, storageBinType: ${item.storageBinType}, type: ${typeof item.storageBinType}`);
        });
        this.storageBinTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading types:', err);
        this.showAlert('error', `Failed to load types: ${err.message}`);
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
      codeStorageBinType: '',
      lib_LocationType: '',
      storageBinType: StorageBinType.STANDARD
    };
    this.isEditing = false;
  }

  saveType(): void {
    console.log('Saving type:', this.selectedType);
    if (!this.selectedType.codeStorageBinType || !this.selectedType.lib_LocationType) {
      console.warn('Validation failed: Code and Libelle required');
      this.showAlert('error', 'Code and Libelle are required');
      return;
    }

    if (this.isEditing && this.selectedType.idLocationType) {
      console.log('Updating type with ID:', this.selectedType.idLocationType);
      this.apiService
        .updateStorageBinType(this.selectedType.idLocationType, this.selectedType)
        .subscribe({
          next: (updated) => {
            console.log('Updated type:', updated);
            this.storageBinTypesList = this.storageBinTypesList.map((t) =>
              t.idLocationType === updated.idLocationType ? updated : t
            );
            this.showAlert('success', 'Type updated successfully');
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
      this.apiService.createStorageBinType(this.selectedType).subscribe({
        next: (created) => {
          console.log('Created type:', created);
          const newType: EWM_StorageBinType = {
            idLocationType: created.idLocationType || 0,
            codeStorageBinType: created.codeStorageBinType || this.selectedType.codeStorageBinType,
            lib_LocationType: created.lib_LocationType || this.selectedType.lib_LocationType,
            storageBinType: created.storageBinType || this.selectedType.storageBinType
          };
          this.storageBinTypesList.push(newType);
          this.showAlert('success', 'Type created successfully');
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

  editType(type: EWM_StorageBinType): void {
    console.log('Editing type:', type);
    this.selectedType = { ...type };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteType(id: number): void {
    console.log('Initiating delete for ID:', id);
    if (confirm('Are you sure you want to delete this type?')) {
      this.apiService.deleteStorageBinType(id).subscribe({
        next: () => {
          console.log('Delete successful for ID:', id);
          this.storageBinTypesList = this.storageBinTypesList.filter((t) => t.idLocationType !== id);
          this.showAlert('success', 'Type deleted successfully');
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

  getEnumLabel(value: string | undefined): string {
    if (!value) {
      console.warn(`Invalid storageBinType value: ${value}`);
      return 'Unknown';
    }
    const option = this.enumOptions.find(opt => opt.value === value);
    if (!option) {
      console.warn(`No enum option found for storageBinType: ${value}`);
      return 'Unknown';
    }
    return option.label;
  }
}