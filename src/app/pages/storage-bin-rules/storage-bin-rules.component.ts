import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Add this import for ngModel
import { ApiService } from '../../shared/services/api.service'; // Adjust path as needed
import { EWM_StorageBin_Rules, EWM_StorageBin } from '../../models'; // Adjust path

@Component({
  selector: 'app-storage-bin-rules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Add FormsModule here
  templateUrl: './storage-bin-rules.component.html',
})
export class StorageBinRulesComponent implements OnInit {
  rules: EWM_StorageBin_Rules[] = [];
  filteredRules: EWM_StorageBin_Rules[] = [];
  binCodes: string[] = [];
  ruleForm: FormGroup;
  showModal = false;
  isEditMode = false;
  selectedId?: number;
  filterType = 'All';
  searchTerm = '';

  // Checkbox states: { [code: string]: { allowed: boolean, blocked: boolean } }
  locationStates: { [key: string]: { allowed: boolean; blocked: boolean } } = {};

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.ruleForm = this.fb.group({
      ewm_CodeLocation_FROM: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRules();
    this.loadBinCodes();
  }

  loadRules(): void {
    this.apiService.getStorageBinRules().subscribe((rules) => {
      this.rules = rules;
      this.applyFilters();
    });
  }

  loadBinCodes(): void {
    this.apiService.getStorageBins().subscribe((bins) => {
      this.binCodes = [...new Set(bins.map((bin) => bin.ewm_Lib_CodeLocation).filter(Boolean))]; // Unique codes
      this.resetLocationStates();
    });
  }

  applyFilters(): void {
    let temp = this.rules;
    if (this.filterType !== 'All') {
      temp = temp.filter((rule) => rule.ewm_CodeLocation_FROM === this.filterType);
    }
    if (this.searchTerm) {
      const lowerSearch = this.searchTerm.toLowerCase();
      temp = temp.filter(
        (rule) =>
          rule.ewm_CodeLocation_FROM.toLowerCase().includes(lowerSearch) ||
          rule.allowTranferTO?.toLowerCase().includes(lowerSearch) ||
          rule.blockTranferTO?.toLowerCase().includes(lowerSearch)
      );
    }
    this.filteredRules = temp;
  }

  openModal(rule?: EWM_StorageBin_Rules): void {
    this.resetLocationStates();
    if (rule) {
      this.isEditMode = true;
      this.selectedId = rule.idemw_Location_Rules;
      this.ruleForm.patchValue({ ewm_CodeLocation_FROM: rule.ewm_CodeLocation_FROM });
      const allowedSet = new Set((rule.allowTranferTO||'').split(',').map((s) => s.trim()).filter(Boolean));
      const blockedSet = new Set((rule.blockTranferTO||'').split(',').map((s) => s.trim()).filter(Boolean));
      this.binCodes.forEach((code) => {
        this.locationStates[code] = {
          allowed: allowedSet.has(code),
          blocked: blockedSet.has(code),
        };
      });
    } else {
      this.isEditMode = false;
      this.selectedId = undefined;
      this.ruleForm.reset();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.ruleForm.valid) {
      const allowed = this.binCodes.filter((code) => this.locationStates[code]?.allowed).join(',');
      const blocked = this.binCodes.filter((code) => this.locationStates[code]?.blocked).join(',');
      const rule: EWM_StorageBin_Rules = {
        ...this.ruleForm.value,
        allowTranferTO: allowed,
        blockTranferTO: blocked,
      };
      if (this.isEditMode && this.selectedId) {
        this.apiService.updateStorageBinRule(this.selectedId, rule).subscribe(() => {
          this.loadRules();
          this.closeModal();
        });
      } else {
        this.apiService.createStorageBinRule(rule).subscribe(() => {
          this.loadRules();
          this.closeModal();
        });
      }
    }
  }

  deleteRule(id: number): void {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.apiService.deleteStorageBinRule(id).subscribe(() => this.loadRules());
    }
  }

  toggleAllowed(code: string, checked: boolean): void {
    if (!this.locationStates[code]) return;
    this.locationStates[code].allowed = checked;
    if (checked) this.locationStates[code].blocked = false; // Enforce exclusivity
  }

  toggleBlocked(code: string, checked: boolean): void {
    if (!this.locationStates[code]) return;
    this.locationStates[code].blocked = checked;
    if (checked) this.locationStates[code].allowed = false; // Enforce exclusivity
  }

  private resetLocationStates(): void {
    this.binCodes.forEach((code) => {
      this.locationStates[code] = { allowed: false, blocked: false };
    });
  }

  private resetForm(): void {
    this.ruleForm.reset();
    this.isEditMode = false;
    this.selectedId = undefined;
    this.resetLocationStates();
  }
}