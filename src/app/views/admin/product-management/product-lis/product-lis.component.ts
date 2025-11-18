// src/app/features/admin/Producto-management/Producto-list/Producto-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../../core/services/producto.service';
import { Producto } from '../../../../core/models/producto.model';

@Component({
  selector: 'app-producto-lis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-lis.component.html'
})
export class ProductLisComponent implements OnInit {
  Productos = signal<Producto[]>([]);
  filteredProducts = signal<Producto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showDeleteModal = signal(false);
  productoToDelete = signal<Producto | null>(null);
  selectedCategory = signal<string | null>(null);

  constructor(private ProductoService: ProductoService) {}

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.loading.set(true);
    this.ProductoService.getAllProducts().subscribe({
      next: (productos) => {
        this.Productos.set(productos);
        this.filteredProducts.set(productos);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los Productoos');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory.set(category);
    if (category) {
      this.filteredProducts.set(
        this.Productos().filter(p => p.categoria === category)
      );
    } else {
      this.filteredProducts.set(this.Productos());
    }
  }

  getCategoryButtonClass(category: string | null): string {
    const isSelected = this.selectedCategory() === category;
    return isSelected
      ? 'bg-green-600 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  }

  getCategoryBadgeClass(categoria: string): string {
    const baseClass = 'absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold';
    const colorMap: { [key: string]: string } = {
      'bebida': 'bg-blue-500 text-white',
      'postre': 'bg-pink-500 text-white',
      'snack': 'bg-orange-500 text-white',
      'otros': 'bg-purple-500 text-white'
    };
    return `${baseClass} ${colorMap[categoria] || 'bg-gray-500 text-white'}`;
  }

  getCategoryLabel(categoria: string): string {
    const labels: { [key: string]: string } = {
      'bebida': 'Bebida',
      'postre': 'Postre',
      'snack': 'Snack',
      'otros': 'Otros'
    };
    return labels[categoria] || categoria;
  }

  confirmDelete(Producto: Producto) {
    this.productoToDelete.set(Producto);
    this.showDeleteModal.set(true);
  }

  cancelDelete() {
    this.showDeleteModal.set(false);
    this.productoToDelete.set(null);
  }

  deleteProducto() {
    const Producto = this.productoToDelete();
    if (Producto && Producto.id) {
      this.ProductoService.deleteProduct(Producto.id).subscribe({
        next: () => {
          this.Productos.update(Productos => Productos.filter(p => p.id !== Producto.id));
          this.filterByCategory(this.selectedCategory());
          this.showDeleteModal.set(false);
          this.productoToDelete.set(null);
        },
        error: (err) => {
          this.error.set('Error al eliminar el Productoo');
          console.error(err);
        }
      });
    }
  }
}
