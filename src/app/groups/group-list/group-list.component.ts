import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { ApiService } from '../../shared/services/api.service'; // Adjust path
import { EWM_Parck_DisplayGroupe } from '../../models/ewm-parck-display-groupe.model'; // Adjust path
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  standalone: true, // Added for standalone component
  imports: [CommonModule] // Import CommonModule here to enable *ngFor
})
export class GroupListComponent implements OnInit {
  groups: EWM_Parck_DisplayGroupe[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getParckDisplayGroupes().subscribe(data => {
      this.groups = data;
    });
  }

  goToBins(id: number | undefined) {
    if (id) {
      this.router.navigate(['/bins', id]);
    }
  }

  addGroup() {
    this.router.navigate(['/group-form']);
  }

  editGroup(id: number | undefined) {
    if (id) {
      this.router.navigate(['/group-form', id]);
    }
  }

  deleteGroup(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this group?')) {
      this.apiService.deleteParckDisplayGroupe(id).subscribe(() => {
        this.groups = this.groups.filter(g => g.id !== id);
      });
    }
  }
}