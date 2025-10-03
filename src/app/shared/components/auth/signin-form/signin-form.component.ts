import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../../auth/auth.service';
import { LoginDto } from '../../../../models/login-dto';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule
  ],
  templateUrl: './signin-form.component.html',
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    const loginData: LoginDto = { email: this.email, password: this.password };
    console.log('Attempting login with:', loginData);

    this.authService.login(loginData).subscribe({
      next: () => {
        console.log('Login success, navigating to dashboard');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        // Add error handling, e.g., show toast message
      }
    });
  }
}