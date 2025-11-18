import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword.update(val => !val);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.user.rol === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/menu']);
          }
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Correo o contraseña incorrectos');
        }
      });
    }
  }
}
