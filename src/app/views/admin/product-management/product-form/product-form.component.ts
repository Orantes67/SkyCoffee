// src/app/features/admin/product-management/product-form/product-form.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  isEditMode = signal(false);
  productId = signal<number | null>(null);
  submitting = signal(false);
  uploadingImage = signal(false);
  errorMessage = signal<string | null>(null);
  previewUrl = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private productService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: [''],
      disponible: [true]
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        if (product.imagen) {
          this.previewUrl.set(product.imagen);
        }
      },
      error: () => {
        this.errorMessage.set('Error al cargar el producto');
      }
    });
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
      this.productService.uploadProductImage(file).subscribe({
        next: (response) => {
          this.productForm.patchValue({ imagen: response.url });
          this.uploadingImage.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al subir la imagen');
          this.uploadingImage.set(false);
        }
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.submitting.set(true);
      this.errorMessage.set(null);

      const productData = this.productForm.value;

      if (this.isEditMode() && this.productId()) {
        this.productService.updateProduct(this.productId()!, productData).subscribe({
          next: () => this.router.navigate(['/admin/products']),
          error: () => {
            this.errorMessage.set('Error al actualizar el producto');
            this.submitting.set(false);
          }
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => this.router.navigate(['/admin/products']),
          error: () => {
            this.errorMessage.set('Error al crear el producto');
            this.submitting.set(false);
          }
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
