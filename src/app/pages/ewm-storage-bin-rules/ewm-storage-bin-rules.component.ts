import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageBin_Rules, EWM_StorageType } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ewm-storage-bin-rules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ewm-storage-bin-rules.component.html'
})
export class EWMStorageBinRulesComponent implements OnInit {
  rules: EWM_StorageBin_Rules[] = [];
  selectedRule: EWM_StorageBin_Rules = {
    ewm_CodeLocation_FROM: '',
    allowTranferTO: '',
    blockTranferTO: ''
  };
  selectedAllowTo: string[] = [];
  storageTypes: EWM_StorageType[] = [];
  isFormVisible = false;
  isEditing = false;
  isLoading = false;
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRules();
    this.loadStorageTypes();
  }

  loadRules(): void {
    this.isLoading = true;
    console.log('Loading storage bin rules from backend...');
    this.apiService.getStorageBinRules().subscribe({
      next: (data) => {
        console.log('Received storage bin rules from backend:', data);
        this.rules = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error receiving storage bin rules from backend:', err);
        this.showAlert('error', `Failed to load rules: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  loadStorageTypes(): void {
    this.isLoading = true;
    console.log('Loading storage types from backend...');
    this.apiService.getStorageTypes().subscribe({
      next: (data) => {
        console.log('Received storage types from backend:', data);
        this.storageTypes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error receiving storage types from backend:', err);
        this.showAlert('error', `Failed to load storage types: ${err.message}`);
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.selectedRule = {
      ewm_CodeLocation_FROM: '',
      allowTranferTO: '',
      blockTranferTO: ''
    };
    this.selectedAllowTo = [];
    this.isEditing = false;
  }

  toggleAllow(type: EWM_StorageType, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && type.code) {
      const code = type.code;
      if (target.checked) {
        if (!this.selectedAllowTo.includes(code)) {
          this.selectedAllowTo.push(code);
        }
      } else {
        this.selectedAllowTo = this.selectedAllowTo.filter(t => t !== code);
      }
      this.selectedRule.allowTranferTO = this.selectedAllowTo.join(',');
      console.log('Updated selected allow transfers:', this.selectedAllowTo);
    }
  }

  saveRule(): void {
    if (!this.selectedRule.ewm_CodeLocation_FROM) {
      this.showAlert('error', 'From Location is required');
      return;
    }
    if (!this.selectedAllowTo.length) {
      this.showAlert('error', 'At least one allowed transfer location is required');
      return;
    }

    const ruleToSend: EWM_StorageBin_Rules = {
      ...this.selectedRule,
      allowTranferTO: this.selectedAllowTo.join(',')
    };

    this.isLoading = true;
    if (this.isEditing && this.selectedRule.idemw_Location_Rules != null) {
      console.log('Sending updated rule to backend:', ruleToSend);
      this.apiService
        .updateStorageBinRule(this.selectedRule.idemw_Location_Rules, ruleToSend)
        .subscribe({
          next: (updated) => {
            console.log('Received updated rule from backend:', updated);
            this.rules = this.rules.map((r) =>
              r.idemw_Location_Rules === updated.idemw_Location_Rules ? updated : r
            );
            this.showAlert('success', 'Rule updated successfully');
            this.toggleForm();
            this.isLoading = false;
          },
          error: (err) => {
            console.log('Error updating rule to backend:', err);
            this.showAlert('error', `Failed to update rule: ${err.message}`);
            this.isLoading = false;
          }
        });
    } else {
      console.log('Sending new rule to backend:', ruleToSend);
      this.apiService.createStorageBinRule(ruleToSend).subscribe({
        next: (created) => {
          console.log('Received created rule from backend:', created);
          this.rules.push(created);
          this.showAlert('success', 'Rule created successfully');
          this.toggleForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error creating rule to backend:', err);
          this.showAlert('error', `Failed to create rule: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  editRule(rule: EWM_StorageBin_Rules): void {
    this.selectedRule = { ...rule };
    this.selectedAllowTo = rule.allowTranferTO ? rule.allowTranferTO.split(',') : [];
    this.isEditing = true;
    this.isFormVisible = true;
  }

  deleteRule(id: number): void {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.isLoading = true;
      console.log('Sending delete request for rule ID to backend:', id);
      this.apiService.deleteStorageBinRule(id).subscribe({
        next: () => {
          console.log('Delete successful for rule ID:', id);
          this.rules = this.rules.filter((r) => r.idemw_Location_Rules !== id);
          this.showAlert('success', 'Rule deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          console.log('Error deleting rule from backend:', err);
          this.showAlert('error', `Failed to delete rule: ${err.message}`);
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