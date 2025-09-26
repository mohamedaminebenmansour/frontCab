import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { EWM_Parck_DisplayGroupe } from '../../models/ewm-parck-display-groupe.model';
import { EWM_StorageBin } from '../../models/ewm-storage-bin.model'; // Updated import
import { HandlingUnit } from '../../models/handling-unit.model'; // Updated import

import { EWM_StorageType } from '../../models/ewm-storage-type.model';
import { EWM_StorageBinType } from '../../models/ewm-storage-bin-type.model';
import { EWM_StorageBin_Groupe } from '../../models/ewm-storage-bin-groupe.model';
import { EWM_Aturized_Status } from '../../models/ewm-aturized-status.model'; // Assume this model exists
import { CommonModule, DatePipe } from '@angular/common'; // For pipes and directives
import { FormsModule } from '@angular/forms'; // For ngModel
import { RouterModule } from '@angular/router'; // For ActivatedRoute

@Component({
  selector: 'app-bin-list',
  standalone: true, // Make standalone for direct imports
  imports: [CommonModule, FormsModule, RouterModule], // Essential for bindings, pipes, and routing
  templateUrl: './bin-list.component.html',
  styleUrls: ['./bin-list.component.css'],
  providers: [DatePipe] // If needed for custom pipe usage
})
export class BinListComponent implements OnInit {
  group: EWM_Parck_DisplayGroupe | null = null;
  bins: EWM_StorageBin[] = [];
  selectedBin: EWM_StorageBin = this.resetBinObject();
  storageTypes: EWM_StorageType[] = [];
  binTypes: EWM_StorageBinType[] = [];
  binGroups: EWM_StorageBin_Groupe[] = [];
  atorizedStatuses: EWM_Aturized_Status[] = [];
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  isHUFormVisible = false;
  selectedHU: HandlingUnit = this.resetHUObject();
  currentBin: EWM_StorageBin | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadGroup(id);
    }
    this.loadStorageTypes();
    this.loadBinTypes();
    this.loadBinGroups();
    this.loadAtorizedStatuses();
  }

  loadGroup(id: number): void {
    this.isLoading = true;
    this.apiService.getParckDisplayGroupe(id).subscribe({
      next: (data) => {
        this.group = data;
        // Instead of using data.storageBins, fetch full bins from getStorageBins and filter
        this.loadBinsForGroup();
      },
      error: (err) => {
        this.showAlert('error', `Failed to load group: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  loadBinsForGroup(): void {
    this.apiService.getStorageBins().subscribe({
      next: (allBins) => {
        this.bins = allBins.filter(bin => bin.codeEwm_DisplayParckGroupe === this.group?.code) || [];
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

  loadAtorizedStatuses(): void {
    this.apiService.getAturizedStatuses().subscribe({
      next: (data) => {
        this.atorizedStatuses = data.map((d: any) => ({
          idewm_Atorized_Status: d.idewm_Atorized_Status || d.id,
          codeAtorisedStatus: d.codeAtorisedStatus || d.idewm_Atorized_Status,
          valueAtorisedStatus: d.valueAtorisedStatus || `OK: ${d.okStatus || 'N/A'} | NOK: ${d.nokStatus || 'N/A'} | All: ${d.allStatus || 'N/A'}`,
          okStatus: d.okStatus,
          nokStatus: d.nokStatus,
          allStatus: d.allStatus
        }));
      },
      error: (err) => this.showAlert('error', `Failed to load atorized statuses: ${err.message}`)
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.selectedBin = this.resetBinObject();
      this.isEditing = false;
    } else if (!this.isEditing) {
      this.selectedBin.codeEwm_DisplayParckGroupe = this.group?.code || ''; // Pre-set direct relationship
    }
  }

  resetBinObject(): EWM_StorageBin {
    return {
      ewm_Lib_CodeLocation: '',
      codeLocationGroupe: '',
      ewm_Code_StorageType: '',
      codeStorageBinType: '',
      codeEwm_DisplayParckGroupe: '',
      code_FIFO_Groupe: '',
      atorizedStatus: '',
      item: '',
      bulding: '',
      capacity: 0,
      qualityValidationMadatoryToAssign: false,
      staticLocation: false,
      dynamicLocation: false,
      exacticLocation: false
    };
  }

  saveBin(): void {
    if (!this.validateBin()) {
      this.showAlert('error', 'Required fields are missing or invalid');
      return;
    }

    const binToSend = { ...this.selectedBin }; // Map to DTO if needed

    this.isLoading = true;
    if (this.isEditing && this.selectedBin.idewm_Location != null) {
      this.apiService.updateStorageBin(this.selectedBin.idewm_Location, binToSend).subscribe({
        next: () => {
          this.reloadGroup();
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
      this.apiService.createStorageBin(binToSend).subscribe({
        next: () => {
          this.reloadGroup();
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

  validateBin(): boolean {
    return !!this.selectedBin.ewm_Lib_CodeLocation &&
           !!this.selectedBin.ewm_Code_StorageType &&
           !!this.selectedBin.codeStorageBinType &&
           !!this.selectedBin.codeEwm_DisplayParckGroupe &&
           !!this.selectedBin.atorizedStatus &&
           (this.selectedBin.capacity||0) > 0; //(hu.quantity || 0),
  }

  editBin(bin: EWM_StorageBin): void {
    this.selectedBin = { ...bin };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteBin(id: number | undefined): void {
    if (id == null || !confirm('Are you sure you want to delete this bin?')) return;
    this.isLoading = true;
    this.apiService.deleteStorageBin(id).subscribe({
      next: () => {
        this.reloadGroup();
        this.showAlert('success', 'Bin deleted successfully');
        this.isLoading = false;
      },
      error: (err) => {
        this.showAlert('error', `Failed to delete bin: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  openHUForm(bin: EWM_StorageBin): void {
    this.currentBin = bin;
    this.selectedHU = this.resetHUObject();
    this.selectedHU.storageBinCode = bin.ewm_Lib_CodeLocation; // Automatically set for assignment
    this.isHUFormVisible = true;
  }

  resetHUObject(): HandlingUnit {
    return {
      serialNumber: '',
      item: '',
      quantity: 0,
      weight: 0,
      productionDate: '',
      status: '',
      storageBinCode: ''
    };
  }

  validateHU(): boolean {
    return !!this.selectedHU.serialNumber &&
           !!this.selectedHU.item &&
           (this.selectedHU.quantity || 0) > 0 &&
           (this.selectedHU.weight || 0) > 0 &&
           !!this.selectedHU.productionDate &&
           !!this.selectedHU.status &&
           !!this.selectedHU.storageBinCode;
  }

  saveHandlingUnit(): void {
    if (!this.validateHU() || !this.currentBin) {
      console.log('Debug: saveHandlingUnit validation failed. Details below:');
      console.log('Overall validateHU result:', this.validateHU());
      console.log('currentBin exists:', !!this.currentBin);
      console.log('idewm_Location value:', this.currentBin?.idewm_Location);
      console.log('HU Fields Check:');
      console.log('- serialNumber:', this.selectedHU.serialNumber, '| Valid:', !!this.selectedHU.serialNumber);
      console.log('- item:', this.selectedHU.item, '| Valid:', !!this.selectedHU.item);
      console.log('- quantity:', this.selectedHU.quantity, '| Valid:', (this.selectedHU.quantity || 0) > 0);
      console.log('- weight:', this.selectedHU.weight, '| Valid:', (this.selectedHU.weight || 0) > 0);
      console.log('- productionDate:', this.selectedHU.productionDate, '| Valid:', !!this.selectedHU.productionDate);
      console.log('- status:', this.selectedHU.status, '| Valid:', !!this.selectedHU.status);
      console.log('- storageBinCode:', this.selectedHU.storageBinCode, '| Valid:', !!this.selectedHU.storageBinCode);
      this.showAlert('error', 'Required fields are missing or invalid');
      return;
    }

    const huToSend = { ...this.selectedHU }; // Includes storageBinCode for automatic assignment

    this.isLoading = true;
    this.apiService.createHandlingUnit(huToSend).subscribe({
      next: (createdHU) => {
        this.reloadGroup();
        this.showAlert('success', 'Handling Unit created and assigned successfully');
        this.isHUFormVisible = false;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.showAlert('error', `Failed to create handling unit: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  reloadGroup(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadGroup(id);
  }

  showAlert(type: 'success' | 'error', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
    setTimeout(() => { this.alertMessage = null; this.alertType = null; }, 5000); // Auto-dismiss after 5s
  }

  calculateOccupancy(bin: EWM_StorageBin): number {
    if (!bin.handlingUnits || bin.handlingUnits.length === 0 || !bin.capacity) {
      return 0;
    }
    const totalQuantity = bin.handlingUnits.reduce((sum, hu) => sum + (hu.quantity || 0), 0);
    const occupancy = Math.min(100, Math.floor((totalQuantity / bin.capacity) * 100));
    return occupancy;
  }

  getHUsCount(bin: EWM_StorageBin): number {
    const count = bin.handlingUnits?.length || 0;
    return count;
  }

  getStatus(bin: EWM_StorageBin): string {
    const occ = this.calculateOccupancy(bin);
    const status = occ > 80 ? '🟢 Full' : '🟡 Open';
    return status;
    // Alternative: if (bin.atorizedStatus === '1002') return '🟢 Full';
  }
}