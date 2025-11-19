import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,  // ⭐ CRÍTICO: Debe estar aquí
    RouterLink
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // ✅ FormGroup debe ser inicializado en el constructor
  loginForm!: FormGroup;
  
  // ✅ Signals para el estado reactivo
  loading = signal(false);
  errorMessage = signal<string>('');
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ Inicializar el formulario aquí
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading.set(false);
        
        // Redirigir según el rol
        if (response.user.rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Correo o contraseña incorrectos'
        );
        
        // Opcional: Limpiar el password por seguridad
        this.loginForm.get('password')?.reset();
      }
    });
  }

  // Método helper para debugging (puedes eliminarlo después)
  logFormStatus(): void {
    console.log('Form Valid:', this.loginForm.valid);
    console.log('Form Value:', this.loginForm.value);
    console.log('Form Errors:', this.loginForm.errors);
  }
}