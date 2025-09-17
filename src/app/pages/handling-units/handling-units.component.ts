import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { HandlingUnit } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-handling-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './handling-units.component.html'
})
export class HandlingUnitsComponent implements OnInit {
  units: HandlingUnit[] = [];
  selectedUnit: HandlingUnit = {
    serialNumber: '',
    quantity: 0,
    weight: 0,
    productionDate: '',
    status: ''
  };
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.isLoading = true;
    console.log('Loading handling units from backend...');
    this.apiService.getHandlingUnits().subscribe({
      next: (data) => {
        console.log('Received handling units from backend:', data);
        this.units = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error receiving handling units from backend:', err);
        this.showAlert('error', `Failed to load units: ${err.message}`);
        this.isLoading = false;
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
    this.selectedUnit = {
      serialNumber: '',
      quantity: 0,
      weight: 0,
      productionDate: '',
      status: ''
    };
    this.isEditing = false;
  }

  saveUnit(): void {
    console.log('saveUnit() called - form submitted');
    if (!this.selectedUnit.serialNumber || !this.selectedUnit.quantity || !this.selectedUnit.weight || !this.selectedUnit.productionDate || !this.selectedUnit.status) {
      console.log('Form validation failed - required fields missing');
      this.showAlert('error', 'Required fields are missing');
      return;
    }

    // Map to backend DTO structure (productionDate as ISO string for DateTime)
    const unitToSend: any = {
      serialNumber: this.selectedUnit.serialNumber,
      item: this.selectedUnit.item,
      quantity: this.selectedUnit.quantity,
      weight: this.selectedUnit.weight,
      productionDate: new Date(this.selectedUnit.productionDate).toISOString(), // Convert to ISO for backend
      status: this.selectedUnit.status
    };

    this.isLoading = true;
    if (this.isEditing && this.selectedUnit.idHandlingUnit != null) {
      console.log('Sending updated unit to backend:', unitToSend);
      this.apiService.updateHandlingUnit(this.selectedUnit.idHandlingUnit, unitToSend).subscribe({
        next: (updated) => {
          console.log('Received updated unit from backend:', updated);
          this.units = this.units.map(u => u.idHandlingUnit === updated.idHandlingUnit ? updated : u);
          this.showAlert('success', 'Unit updated successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error updating unit to backend:', err);
          this.showAlert('error', `Failed to update unit: ${err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Sending new unit to backend:', unitToSend);
      this.apiService.createHandlingUnit(unitToSend).subscribe({
        next: (created) => {
          console.log('Received created unit from backend:', created);
          this.units.push(created);
          this.showAlert('success', 'Unit created successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error creating unit to backend:', err);
          this.showAlert('error', `Failed to create unit: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  editUnit(unit: HandlingUnit): void {
    this.selectedUnit = { ...unit };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteUnit(id: number): void {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.isLoading = true;
      console.log('Sending delete request for unit ID to backend:', id);
      this.apiService.deleteHandlingUnit(id).subscribe({
        next: () => {
          console.log('Delete successful for unit ID:', id);
          this.units = this.units.filter(u => u.idHandlingUnit !== id);
          this.showAlert('success', 'Unit deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error deleting unit from backend:', err);
          this.showAlert('error', `Failed to delete unit: ${err.message}`);
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