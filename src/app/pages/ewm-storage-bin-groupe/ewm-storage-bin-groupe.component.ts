import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageBin_Groupe, Code_LocationGroup } from '../../models';

interface EnumOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-ewm-storage-bin-groupe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-bin-groupe.component.html'
})
export class EwmStorageBinGroupeComponent implements OnInit {
  storageBinGroupesList: EWM_StorageBin_Groupe[] = [];
  selectedGroupe: EWM_StorageBin_Groupe = {
    codeLocationGroupe: '',
    lib_LocationGroupe: '',
    codeLocationGroupEnum: Code_LocationGroup.RECEPTION // Default to RECEPTION
  };
  isFormVisible = false;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  enumOptions: EnumOption[] = [];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('Component initialized - loading storage bin groupes');
    this.loadStorageBinGroupes();
    this.enumOptions = Object.values(Code_LocationGroup).map(value => ({
      value,
      label: value.replace('_', ' ') // Convert QUALITY_CONTROL to "QUALITY CONTROL"
    }));
    console.log('Enum options initialized:', this.enumOptions);
  }

  loadStorageBinGroupes(): void {
    console.log('Loading Storage Bin Groupes');
    this.apiService.getStorageBinGroupes().subscribe({
      next: (data) => {
        console.log('Loaded data:', data);
        data.forEach(item => {
          console.log(`Item ID: ${item.idLocation_Groupe}, codeLocationGroupEnum: ${item.codeLocationGroupEnum}, type: ${typeof item.codeLocationGroupEnum}`);
        });
        this.storageBinGroupesList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading groupes:', err);
        this.showAlert('error', `Failed to load groupes: ${err.message}`);
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
      codeLocationGroupe: '',
      lib_LocationGroupe: '',
      codeLocationGroupEnum: Code_LocationGroup.RECEPTION
    };
    this.isEditing = false;
  }

  saveGroupe(): void {
    console.log('Saving groupe:', this.selectedGroupe);
    if (!this.selectedGroupe.codeLocationGroupe || !this.selectedGroupe.lib_LocationGroupe) {
      console.warn('Validation failed: Code and Libelle required');
      this.showAlert('error', 'Code and Libelle are required');
      return;
    }

    if (this.isEditing && this.selectedGroupe.idLocation_Groupe) {
      console.log('Updating groupe with ID:', this.selectedGroupe.idLocation_Groupe);
      this.apiService
        .updateStorageBinGroupe(this.selectedGroupe.idLocation_Groupe, this.selectedGroupe)
        .subscribe({
          next: (updated) => {
            console.log('Updated groupe:', updated);
            this.storageBinGroupesList = this.storageBinGroupesList.map((t) =>
              t.idLocation_Groupe === updated.idLocation_Groupe ? updated : t
            );
            this.showAlert('success', 'Groupe updated successfully');
            this.toggleForm();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating groupe:', err);
            this.showAlert('error', `Failed to update groupe: ${err.message}`);
          }
        });
    } else {
      console.log('Creating new groupe');
      this.apiService.createStorageBinGroupe(this.selectedGroupe).subscribe({
        next: (created) => {
          console.log('Created groupe:', created);
          const newGroupe: EWM_StorageBin_Groupe = {
            idLocation_Groupe: created.idLocation_Groupe || 0,
            codeLocationGroupe: created.codeLocationGroupe || this.selectedGroupe.codeLocationGroupe,
            lib_LocationGroupe: created.lib_LocationGroupe || this.selectedGroupe.lib_LocationGroupe,
            codeLocationGroupEnum: created.codeLocationGroupEnum || this.selectedGroupe.codeLocationGroupEnum
          };
          this.storageBinGroupesList.push(newGroupe);
          this.showAlert('success', 'Groupe created successfully');
          this.toggleForm();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating groupe:', err);
          this.showAlert('error', `Failed to create groupe: ${err.message}`);
        }
      });
    }
  }

  editGroupe(groupe: EWM_StorageBin_Groupe): void {
    console.log('Editing groupe:', groupe);
    this.selectedGroupe = { ...groupe };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteGroupe(id: number): void {
    console.log('Initiating delete for ID:', id);
    if (confirm('Are you sure you want to delete this groupe?')) {
      this.apiService.deleteStorageBinGroupe(id).subscribe({
        next: () => {
          console.log('Delete successful for ID:', id);
          this.storageBinGroupesList = this.storageBinGroupesList.filter((t) => t.idLocation_Groupe !== id);
          this.showAlert('success', 'Groupe deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting groupe:', err);
          this.showAlert('error', `Failed to delete groupe: ${err.message}`);
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
      console.warn(`Invalid codeLocationGroupEnum value: ${value}`);
      return 'Unknown';
    }
    const option = this.enumOptions.find(opt => opt.value === value);
    if (!option) {
      console.warn(`No enum option found for codeLocationGroupEnum: ${value}`);
      return 'Unknown';
    }
    return option.label.replace('_', ' '); // Display "QUALITY CONTROL" instead of "QUALITY_CONTROL"
  }
}