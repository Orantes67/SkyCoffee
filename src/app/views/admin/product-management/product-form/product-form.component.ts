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
  errorMessage = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  
  // ✅ Guardar el archivo seleccionado
  selectedFile = signal<File | null>(null);

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

      // Solo se cargan campos del formulario
      this.productForm.patchValue({
        nombre: product.nombre,
        precio: product.precio,
        categoria: product.categoria,
        descripcion: product.descripcion,
        disponible: product.disponible
      });

      // Si hay imagen, mostrar vista previa
      if (product.imagen && typeof product.imagen === 'string') {
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
    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage.set('La imagen no debe superar 10MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Solo se permiten archivos de imagen');
      return;
    }

    // Guardar el archivo
    this.selectedFile.set(file);

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl.set(e.target.result);
    };
    reader.readAsDataURL(file);

    this.errorMessage.set(null);
  }
}

  // ✅ MÉTODO CORREGIDO: Envía todo junto
  onSubmit() {
    if (this.productForm.valid) {
      this.submitting.set(true);
      this.errorMessage.set(null);

      // Obtener los datos del formulario
      const productData = this.productForm.value;

      if (this.isEditMode() && this.productId()) {
        // Actualizar producto
        this.productService.updateProduct(
          this.productId()!, 
          productData, 
          this.selectedFile() || undefined
        ).subscribe({
          next: () => {
            console.log('Producto actualizado exitosamente');
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            this.errorMessage.set(error.error?.message || 'Error al actualizar el producto');
            this.submitting.set(false);
          }
        });
      } else {
        // Crear nuevo producto
        this.productService.createProduct(
          productData, 
          this.selectedFile() || undefined
        ).subscribe({
          next: () => {
            console.log('Producto creado exitosamente');
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            console.error('Error al crear:', error);
            this.errorMessage.set(error.error?.message || 'Error al crear el producto');
            this.submitting.set(false);
          }
        });
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}