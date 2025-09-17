import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { StockMovement, EWM_StorageBin, HandlingUnit } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-movements.component.html'
})
export class StockMovementsComponent implements OnInit {
  movements: StockMovement[] = [];
  selectedMovement: StockMovement = {
    movementType: '',
    sourceBinCode: '',
    destinationBinCode: '',
    handlingUnitID: 0,
    movedQty: 0,
    movementDate: '',
    status: ''
  };
  storageBins: EWM_StorageBin[] = [];
  handlingUnits: HandlingUnit[] = [];
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('StockMovementsComponent initialized');
    this.loadMovements();
    this.loadStorageBins();
    this.loadHandlingUnits();
  }

  loadMovements(): void {
    this.isLoading = true;
    console.log('Loading stock movements from backend...');
    this.apiService.getStockMovements().subscribe({
      next: (data) => {
        console.log('Received stock movements from backend:', data);
        this.movements = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error receiving stock movements from backend:', err);
        this.showAlert('error', `Failed to load movements: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  loadStorageBins(): void {
    console.log('Loading storage bins for select...');
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

  loadHandlingUnits(): void {
    console.log('Loading handling units for select...');
    this.apiService.getHandlingUnits().subscribe({
      next: (data) => {
        console.log('Received handling units from backend:', data);
        this.handlingUnits = data;
      },
      error: (err) => {
        console.log('Error receiving handling units from backend:', err);
        this.showAlert('error', `Failed to load handling units: ${err.message}`);
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
    console.log('resetForm() called - resetting form fields');
    this.selectedMovement = {
      movementType: '',
      sourceBinCode: '',
      destinationBinCode: '',
      handlingUnitID: 0,
      movedQty: 0,
      movementDate: '',
      status: ''
    };
    this.isEditing = false;
  }

  saveMovement(): void {
    console.log('saveMovement() called - form submitted');
    if (!this.selectedMovement.movementType || !this.selectedMovement.sourceBinCode || !this.selectedMovement.destinationBinCode || !this.selectedMovement.handlingUnitID || !this.selectedMovement.movedQty || !this.selectedMovement.movementDate || !this.selectedMovement.status) {
      console.log('Form validation failed - required fields missing:', {
        movementType: this.selectedMovement.movementType,
        sourceBinCode: this.selectedMovement.sourceBinCode,
        destinationBinCode: this.selectedMovement.destinationBinCode,
        handlingUnitID: this.selectedMovement.handlingUnitID,
        movedQty: this.selectedMovement.movedQty,
        movementDate: this.selectedMovement.movementDate,
        status: this.selectedMovement.status
      });
      this.showAlert('error', 'Required fields are missing');
      return;
    }

    // Map to backend DTO structure (movementDate as ISO string for DateTime)
    const movementToSend: any = {
      movementType: this.selectedMovement.movementType,
      sourceBinCode: this.selectedMovement.sourceBinCode,
      destinationBinCode: this.selectedMovement.destinationBinCode,
      handlingUnitID: this.selectedMovement.handlingUnitID,
      movedQty: this.selectedMovement.movedQty,
      movementDate: new Date(this.selectedMovement.movementDate).toISOString(),
      executedBy: this.selectedMovement.executedBy,
      status: this.selectedMovement.status
    };

    this.isLoading = true;
    if (this.isEditing && this.selectedMovement.idStockMovement != null) {
      console.log('Sending updated movement to backend:', movementToSend);
      this.apiService.updateStockMovement(this.selectedMovement.idStockMovement, movementToSend).subscribe({
        next: (updated) => {
          console.log('Received updated movement from backend:', updated);
          this.movements = this.movements.map(m => m.idStockMovement === updated.idStockMovement ? updated : m);
          this.showAlert('success', 'Movement updated successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error updating movement to backend:', err);
          this.showAlert('error', `Failed to update movement: ${err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      console.log('Sending new movement to backend:', movementToSend);
      this.apiService.createStockMovement(movementToSend).subscribe({
        next: (created) => {
          console.log('Received created movement from backend:', created);
          this.movements.push(created);
          this.showAlert('success', 'Movement created successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error creating movement to backend:', err);
          this.showAlert('error', `Failed to create movement: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  editMovement(movement: StockMovement): void {
    console.log('editMovement() called - editing movement:', movement);
    this.selectedMovement = { ...movement };
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteMovement(id: number): void {
    console.log('deleteMovement() called - deleting movement ID:', id);
    if (confirm('Are you sure you want to delete this movement?')) {
      this.isLoading = true;
      console.log('Sending delete request for movement ID to backend:', id);
      this.apiService.deleteStockMovement(id).subscribe({
        next: () => {
          console.log('Delete successful for movement ID:', id);
          this.movements = this.movements.filter(m => m.idStockMovement !== id);
          this.showAlert('success', 'Movement deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error deleting movement from backend:', err);
          this.showAlert('error', `Failed to delete movement: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  showAlert(type: 'success' | 'error', message: string): void {
    console.log('showAlert() called - type:', type, 'message:', message);
    this.alertType = type;
    this.alertMessage = message;
  }
}