import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editMode = signal(false);
  saving = signal(false);
  uploadingImage = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UsuarioService
  ) {}

  get currentUser() {
  return this.authService.currentUser;
}


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const user = this.currentUser();
    this.profileForm = this.fb.group({
      nombre: [user?.nombre || '', Validators.required],
      correo: [user?.correo || '', [Validators.required, Validators.email]],
      telefono: [user?.telefono || '', Validators.required],
      foto_perfil: [user?.foto_perfil || '']
    });
  }

  enableEditMode() {
    this.editMode.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  cancelEdit() {
    this.editMode.set(false);
    this.initForm();
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
      };
      reader.readAsDataURL(file);

      this.uploadingImage.set(true);
      this.userService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.profileForm.patchValue({ foto_perfil: response.url });
          this.uploadingImage.set(false);

          if (this.currentUser()?.id) {
            this.userService.updateUsuario(this.currentUser()!.id!, { foto_perfil: response.url }).subscribe({
              next: (updatedUser) => {
                this.authService.currentUser.set(updatedUser);
              }
            });
          }
        },
        error: () => {
          this.errorMessage.set('Error al subir la imagen');
          this.uploadingImage.set(false);
        }
      });
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser()?.id) {
      this.saving.set(true);
      this.errorMessage.set(null);

      this.userService.updateUsuario(this.currentUser()!.id!, this.profileForm.value).subscribe({
        next: (updatedUser) => {
          this.authService.currentUser.set(updatedUser);
          this.successMessage.set('Perfil actualizado correctamente');
          this.saving.set(false);
          this.editMode.set(false);
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: () => {
          this.errorMessage.set('Error al actualizar el perfil');
          this.saving.set(false);
        }
      });
    }
  }
}
