import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { EWM_StorageBin } from '../../models/ewm-storage-bin.model';

@Component({
  selector: 'app-bin-form',
  templateUrl: './bin-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class BinFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  groupId: number | null = null;
  binId: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      ewm_Lib_CodeLocation: ['', Validators.required],
      codeLocationGroupe: [''],
      ewm_Code_StorageType: ['', Validators.required],
      codeStorageBinType: [''],
      code_FIFO_Groupe: [''],
      atorizedStatus: [''],
      item: [''],
      bulding: [''],
      capacity: [0, Validators.required],
      qualityValidationMadatoryToAssign: [false],
      staticLocation: [false],
      dynamicLocation: [false],
      exacticLocation: [false]
    });
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.binId = Number(this.route.snapshot.paramMap.get('binId'));
    if (this.binId) {
      this.isEdit = true;
      this.apiService.getStorageBin(this.binId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit() {
    if (this.form.valid && this.groupId) {
      const bin: EWM_StorageBin = {
        ...this.form.value,
        idewm_Location: this.binId || undefined,
        idewm_Parck_DisplayGroupe: this.groupId
      };
      if (this.isEdit && this.binId) {
        this.apiService.updateStorageBin(this.binId, bin).subscribe(() => {
          this.router.navigate(['/bins', this.groupId]);
        });
      } else {
        this.apiService.createStorageBin(bin).subscribe(() => {
          this.router.navigate(['/bins', this.groupId]);
        });
      }
    }
  }
}