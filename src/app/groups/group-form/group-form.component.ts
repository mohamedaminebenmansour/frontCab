import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service'; // Adjust path
import { EWM_Parck_DisplayGroupe } from '../../models/ewm-parck-display-groupe.model'; // Adjust path
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  imports: [ReactiveFormsModule]
})
export class GroupFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id: number | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.apiService.getParckDisplayGroupe(this.id).subscribe(data => {
        this.form.patchValue({
          code: data.code,
          libelle: data.libelle,
          description: data.description
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const group: EWM_Parck_DisplayGroupe = {
        id: this.id || undefined,
        code: this.form.value.code,
        libelle: this.form.value.libelle,
        description: this.form.value.description
      };
      if (this.isEdit && this.id) {
        this.apiService.updateParckDisplayGroupe(this.id, group).subscribe(() => {
          this.router.navigate(['/groups']);
        });
      } else {
        this.apiService.createParckDisplayGroupe(group).subscribe(() => {
          this.router.navigate(['/groups']);
        });
      }
    }
  }
}