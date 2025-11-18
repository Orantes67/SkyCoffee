// src/app/features/auth/register/register.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['cliente']
    });
  }

  togglePassword() {
    this.showPassword.update(val => !val);
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    const widths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500'
    ];
    return `${widths[strength - 1]} ${colors[strength - 1]}`;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    return texts[strength - 1] || '';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    const colors = [
      'text-red-600',
      'text-orange-600',
      'text-yellow-600',
      'text-lime-600',
      'text-green-600'
    ];
    return colors[strength - 1] || '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage.set('Cuenta creada exitosamente. Redirigiendo...');
          setTimeout(() => this.router.navigate(['/menu']), 1500);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.error?.message || 'Error al crear la cuenta. Intenta nuevamente.'
          );
        }
      });
    }
  }
}
