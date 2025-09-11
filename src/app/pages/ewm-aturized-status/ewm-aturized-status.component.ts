import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { EWM_Aturized_Status } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ewm-aturized-status',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required for ngModel and *ngIf
  templateUrl: './ewm-aturized-status.component.html'
})
export class EWMAturizedStatusComponent implements OnInit {
  aturizedStatuses: EWM_Aturized_Status[] = [];
  selectedStatus: EWM_Aturized_Status = {
    codeAtorisedStatus: '',
    valueAtorisedStatus: '',
    okStatus: false,
    nokStatus: false,
    allStatus: false
  };
  isFormVisible = false;
  isEditing = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAturizedStatuses();
  }

  loadAturizedStatuses(): void {
    this.apiService.getAturizedStatuses().subscribe({
      next: (data) => (this.aturizedStatuses = data),
      error: (err) => this.showAlert('error', `Failed to load statuses: ${err.message}`)
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.selectedStatus = {
      codeAtorisedStatus: '',
      valueAtorisedStatus: '',
      okStatus: false,
      nokStatus: false,
      allStatus: false
    };
    this.isEditing = false;
  }

  saveStatus(): void {
    if (!this.selectedStatus.codeAtorisedStatus || !this.selectedStatus.valueAtorisedStatus) {
      this.showAlert('error', 'Code and Value are required');
      return;
    }

    if (this.isEditing && this.selectedStatus.idewm_Aturized_Status) {
      // Update
      this.apiService
        .updateAturizedStatus(this.selectedStatus.idewm_Aturized_Status, this.selectedStatus)
        .subscribe({
          next: (updated) => {
            this.aturizedStatuses = this.aturizedStatuses.map((s) =>
              s.idewm_Aturized_Status === updated.idewm_Aturized_Status ? updated : s
            );
            this.showAlert('success', 'Status updated successfully');
            this.toggleForm();
          },
          error: (err) => this.showAlert('error', `Failed to update status: ${err.message}`)
        });
    } else {
      // Create
      this.apiService.createAturizedStatus(this.selectedStatus).subscribe({
        next: (created) => {
          this.aturizedStatuses.push(created);
          this.showAlert('success', 'Status created successfully');
          this.toggleForm();
        },
        error: (err) => this.showAlert('error', `Failed to create status: ${err.message}`)
      });
    }
  }

  editStatus(status: EWM_Aturized_Status): void {
    this.selectedStatus = { ...status }; // Clone to avoid direct mutation
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteStatus(id: number): void {
    if (confirm('Are you sure you want to delete this status?')) {
      this.apiService.deleteAturizedStatus(id).subscribe({
        next: () => {
          this.aturizedStatuses = this.aturizedStatuses.filter((s) => s.idewm_Aturized_Status !== id);
          this.showAlert('success', 'Status deleted successfully');
        },
        error: (err) => this.showAlert('error', `Failed to delete status: ${err.message}`)
      });
    }
  }

  showAlert(type: 'success' | 'error', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000); // Hide alert after 3 seconds
  }
}