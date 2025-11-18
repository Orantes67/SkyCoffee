// src/app/features/admin/usuario-management/usuario-form/usuario-form.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/ usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html'
})
export class usuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEditMode = signal(false);
  usuarioId = signal<number | null>(null);
  submitting = signal(false);
  uploadingImage = signal(false);
  errorMessage = signal<string | null>(null);
  previewUrl = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      rol: ['cliente', Validators.required],
      foto_perfil: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.usuarioId.set(+id);
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.loadusuario(+id);
    }
  }

  loadusuario(id: number) {
    this.UsuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          rol: usuario.rol,
          foto_perfil: usuario.foto_perfil
        });
        if (usuario.foto_perfil) {
          this.previewUrl.set(usuario.foto_perfil);
        }
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar el usuario');
        console.error(err);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Preview local
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      this.uploadingImage.set(true);
      this.UsuarioService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.usuarioForm.patchValue({ foto_perfil: response.url });
          this.uploadingImage.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Error al subir la imagen');
          this.uploadingImage.set(false);
          console.error(err);
        }
      });
    }
  }

  onSubmit() {
    if (this.usuarioForm.valid) {
      this.submitting.set(true);
      this.errorMessage.set(null);

      const usuarioData = this.usuarioForm.value;

      if (this.isEditMode() && this.usuarioId()) {
        // Actualizar
        this.UsuarioService.updateUsuario(this.usuarioId()!, usuarioData).subscribe({
          next: () => {
            this.router.navigate(['/admin/usuarios']);
          },
          error: (err) => {
            this.errorMessage.set('Error al actualizar el usuario');
            this.submitting.set(false);
            console.error(err);
          }
        });
      } else {
        // Crear nuevo
        this.UsuarioService.createUsuario(usuarioData).subscribe({
          next: () => {
            this.router.navigate(['/admin/usuarios']);
          },
          error: (err) => {
            this.errorMessage.set('Error al crear el usuario');
            this.submitting.set(false);
            console.error(err);
          }
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/admin/usuarios']);
  }
}
