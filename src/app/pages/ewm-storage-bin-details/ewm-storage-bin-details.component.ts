import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageBin_Details, EWM_StorageBin } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ewm-storage-bin-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-bin-details.component.html'
})
export class EwmStorageBinDetailsComponent implements OnInit {
  details: EWM_StorageBin_Details[] = [];
  selectedDetail: EWM_StorageBin_Details = {
    ewm_CodeLocation: '',
    sequenceInLocation: 0,
    initialQty: 0,
    actualQty: 0,
    initialWeight: 0,
    actualWeight: 0
  };
  storageBins: EWM_StorageBin[] = [];
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDetails();
    this.loadStorageBins();
  }

  loadDetails(): void {
    this.isLoading = true;
    console.log('Loading storage bin details from backend...');
    this.apiService.getStorageBinDetails().subscribe({
      next: (data) => {
        console.log('Received storage bin details from backend:', data);
        this.details = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error receiving storage bin details from backend:', err);
        this.showAlert('error', `Failed to load details: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  loadStorageBins(): void {
    console.log('Loading storage bins from backend...');
    this.apiService.getStorageBins().subscribe({
      next: (data) => {
        console.log('Received storage bins from backend:', data);
        this.storageBins = data;
      },
      error: (err) => {
        console.log('Error receiving storage bins from backend:', err);
        this.showAlert('error', `Failed to load storage bins: ${err.message}`);
      }
    });
  }

  toggleForm(): void {
    console.log('toggleForm() called - toggling form visibility');
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.selectedDetail = {
      ewm_CodeLocation: '',
      sequenceInLocation: 0,
      initialQty: 0,
      actualQty: 0,
      initialWeight: 0,
      actualWeight: 0
    };
    this.isEditing = false;
  }

  saveDetail(): void {
    console.log('saveDetail() called - form submitted');
    // Only validate required fields
    if (!this.selectedDetail.ewm_CodeLocation || 
        !this.selectedDetail.sequenceInLocation || 
        !this.selectedDetail.initialQty || 
        !this.selectedDetail.actualQty || 
        !this.selectedDetail.initialWeight || 
        !this.selectedDetail.actualWeight) {
      console.log('Form validation failed - required fields missing');
      this.showAlert('error', 'Required fields are missing');
      return;
    }

    // Map to backend DTO structure
    const detailToSend: any = {
      ewm_CodeLocation: this.selectedDetail.ewm_CodeLocation,
      sequenceInLocation: this.selectedDetail.sequenceInLocation,
      stockageDate: this.selectedDetail.stockageDate,
      status: this.selectedDetail.status,
      item: this.selectedDetail.item,
      serialNumber: this.selectedDetail.serialNumber,
      handlingUnit: this.selectedDetail.handlingUnit,
      productionDate: this.selectedDetail.productionDate,
      initialQty: this.selectedDetail.initialQty,
      actualQty: this.selectedDetail.actualQty,
      initialWeight: this.selectedDetail.initialWeight,
      actualWeight: this.selectedDetail.actualWeight
    };

    this.isLoading = true;
    if (this.isEditing && this.selectedDetail.idLocation_Details != null) {
      console.log('Sending updated detail to backend:', detailToSend);
      this.apiService.updateStorageBinDetail(this.selectedDetail.idLocation_Details, detailToSend).subscribe({
        next: (updated) => {
          console.log('Received updated detail from backend:', updated);
          this.details = this.details.map(d => d.idLocation_Details === updated.idLocation_Details ? updated : d);
          this.showAlert('success', 'Detail updated successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error updating detail to backend:', err);
          this.showAlert('error', `Failed to update detail: ${err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Sending new detail to backend:', detailToSend);
      this.apiService.createStorageBinDetail(detailToSend).subscribe({
        next: (created) => {
          console.log('Received created detail from backend:', created);
          this.details.push(created);
          this.showAlert('success', 'Detail created successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error creating detail to backend:', err);
          this.showAlert('error', `Failed to create detail: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  editDetail(detail: EWM_StorageBin_Details): void {
    this.selectedDetail = { ...detail };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteDetail(id: number): void {
    if (confirm('Are you sure you want to delete this detail?')) {
      this.isLoading = true;
      console.log('Sending delete request for detail ID to backend:', id);
      this.apiService.deleteStorageBinDetail(id).subscribe({
        next: () => {
          console.log('Delete successful for detail ID:', id);
          this.details = this.details.filter(d => d.idLocation_Details !== id);
          this.showAlert('success', 'Detail deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error deleting detail from backend:', err);
          this.showAlert('error', `Failed to delete detail: ${err.message}`);
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