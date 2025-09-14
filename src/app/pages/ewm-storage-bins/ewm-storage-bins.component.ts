import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service'; // Adjust path if needed
import { EWM_StorageBin, EWM_StorageType, EWM_StorageBinType, EWM_StorageBin_Groupe, EWM_Parck_DisplayGroupe, EWM_Aturized_Status } from '../../models'; // Adjust path if needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ewm-storage-bins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-bins.component.html'
})
export class EwmStorageBinsComponent implements OnInit {
  bins: EWM_StorageBin[] = [];
  selectedBin: EWM_StorageBin = {
    ewm_Lib_CodeLocation: '',
    ewm_Code_StorageType: '',
    codeStorageBinType: '',
    codeEwm_DisplayParckGroupe: '',
    atorizedStatus: '',
    capacity: 0,
    qualityValidationMadatoryToAssign: false,
    staticLocation: false,
    dynamicLocation: false,
    exacticLocation: false
  };
  storageTypes: EWM_StorageType[] = [];
  binTypes: EWM_StorageBinType[] = [];
  binGroups: EWM_StorageBin_Groupe[] = [];
  parckGroups: EWM_Parck_DisplayGroupe[] = [];
  atorizedStatuses: EWM_Aturized_Status[] = [];
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBins();
    this.loadStorageTypes();
    this.loadBinTypes();
    this.loadBinGroups();
    this.loadParckGroups();
    this.loadAtorizedStatuses();
  }

  loadBins(): void {
    this.isLoading = true;
    this.apiService.getStorageBins().subscribe({
      next: (data) => {
        this.bins = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.showAlert('error', `Failed to load bins: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  loadStorageTypes(): void {
    this.apiService.getStorageTypes().subscribe({
      next: (data) => this.storageTypes = data,
      error: (err) => this.showAlert('error', `Failed to load storage types: ${err.message}`)
    });
  }

  loadBinTypes(): void {
    this.apiService.getStorageBinTypes().subscribe({
      next: (data) => this.binTypes = data,
      error: (err) => this.showAlert('error', `Failed to load bin types: ${err.message}`)
    });
  }

  loadBinGroups(): void {
    this.apiService.getStorageBinGroupes().subscribe({
      next: (data) => this.binGroups = data,
      error: (err) => this.showAlert('error', `Failed to load bin groups: ${err.message}`)
    });
  }

  loadParckGroups(): void {
    this.apiService.getParckDisplayGroupes().subscribe({
      next: (data) => this.parckGroups = data,
      error: (err) => this.showAlert('error', `Failed to load parck groups: ${err.message}`)
    });
  }

  loadAtorizedStatuses(): void {
    this.apiService.getAturizedStatuses().subscribe({
      next: (data) => {
        console.log('Received raw atorized statuses from backend:', data);
        this.atorizedStatuses = data.map((d: any) => ({
          idewm_Aturized_Status: d.idewM_Aturized_Status || d.idewm_Aturized_Status || d.id,
          codeAtorisedStatus: d.idewM_Aturized_Status.toString(),  // Use ID as code since actual code is null
          valueAtorisedStatus: `OK: ${d.okStatus || 'N/A'} | NOK: ${d.nokStatus || 'N/A'} | All: ${d.allStatus || 'N/A'}`,  // Generate value from flags
          okStatus: d.okStatus,
          nokStatus: d.nokStatus,
          allStatus: d.allStatus
        }));
        console.log('Mapped atorized statuses:', this.atorizedStatuses);
      },
      error: (err) => this.showAlert('error', `Failed to load atorized statuses: ${err.message}`)
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.selectedBin = {
      ewm_Lib_CodeLocation: '',
      ewm_Code_StorageType: '',
      codeStorageBinType: '',
      codeEwm_DisplayParckGroupe: '',
      atorizedStatus: '',
      capacity: 0,
      qualityValidationMadatoryToAssign: false,
      staticLocation: false,
      dynamicLocation: false,
      exacticLocation: false
    };
    this.isEditing = false;
  }

  saveBin(): void {
    if (!this.selectedBin.ewm_Lib_CodeLocation || !this.selectedBin.ewm_Code_StorageType || !this.selectedBin.codeStorageBinType || !this.selectedBin.codeEwm_DisplayParckGroupe || !this.selectedBin.atorizedStatus || !this.selectedBin.capacity) {
      this.showAlert('error', 'Required fields are missing');
      return;
    }

    if (!this.selectedBin.atorizedStatus || this.selectedBin.atorizedStatus === 'undefined') {
      this.showAlert('error', 'Please select a valid authorized status');
      return;
    }

    // Map to backend DTO structure (to handle any casing/wording mismatches)
    const binToSend: any = {
      idewM_Location: this.selectedBin.idewm_Location,
      ewm_Lib_CodeLocation: this.selectedBin.ewm_Lib_CodeLocation,
      codeLocationGroupe: this.selectedBin.codeLocationGroupe,
      ewM_Code_StorageType: this.selectedBin.ewm_Code_StorageType,
      codeStorageBinType: this.selectedBin.codeStorageBinType,
      codeEwm_DisplayParckGroupe: this.selectedBin.codeEwm_DisplayParckGroupe,
      code_FIFO_Groupe: this.selectedBin.code_FIFO_Groupe,
      atorizedStatus: this.selectedBin.atorizedStatus,
      item: this.selectedBin.item,
      bulding: this.selectedBin.bulding,
      capacity: this.selectedBin.capacity,
      qualityValidationMadatoryToAssign: this.selectedBin.qualityValidationMadatoryToAssign,
      staticLocation: this.selectedBin.staticLocation,
      dynamicLocation: this.selectedBin.dynamicLocation,
      exacticLocation: this.selectedBin.exacticLocation
    };

    this.isLoading = true;
    if (this.isEditing && this.selectedBin.idewm_Location != null) {
      console.log('Sending updated bin to backend:', binToSend);
      this.apiService.updateStorageBin(this.selectedBin.idewm_Location, binToSend).subscribe({
        next: (updated) => {
          this.bins = this.bins.map(b => b.idewm_Location === updated.idewm_Location ? updated : b);
          this.showAlert('success', 'Bin updated successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.showAlert('error', `Failed to update bin: ${err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Sending new bin to backend:', binToSend);
      this.apiService.createStorageBin(binToSend).subscribe({
        next: (created) => {
          this.bins.push(created);
          this.showAlert('success', 'Bin created successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.showAlert('error', `Failed to create bin: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  editBin(bin: EWM_StorageBin): void {
    this.selectedBin = { ...bin };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteBin(id: number): void {
    if (confirm('Are you sure you want to delete this bin?')) {
      this.isLoading = true;
      this.apiService.deleteStorageBin(id).subscribe({
        next: () => {
          this.bins = this.bins.filter(b => b.idewm_Location !== id);
          this.showAlert('success', 'Bin deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          this.showAlert('error', `Failed to delete bin: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  showAlert(type: 'success' | 'error', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
  }
}