import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  
  products = signal<Producto[]>([]);
  filteredProducts = signal<Producto[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);

  // --- Estadísticas (computed) ---
  totalCount = computed(() => this.products().length);

  bebidasCount = computed(() =>
    this.products().filter(p => p.categoria === 'bebida').length
  );

  postresCount = computed(() =>
    this.products().filter(p => p.categoria === 'postre').length
  );

  disponiblesCount = computed(() =>
    this.products().filter(p => p.disponible !== false).length
  );

  constructor(private productService: ProductoService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const availableProducts = products.filter(p => p.disponible !== false);
        this.products.set(availableProducts);
        this.filteredProducts.set(availableProducts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar el menú. Por favor, intenta más tarde.');
        this.loading.set(false);
      }
    });
  }

  filterByCategory(category: string | null) {
    this.selectedCategory.set(category);
    if (category) {
      this.filteredProducts.set(
        this.products().filter(p => p.categoria === category)
      );
    } else {
      this.filteredProducts.set(this.products());
    }
  }

  getCategoryButtonClass(category: string | null): string {
    const isSelected = this.selectedCategory() === category;
    return isSelected
      ? 'bg-amber-600 text-white shadow-lg'
      : 'bg-white text-gray-700 hover:bg-amber-100 shadow';
  }

  getCategoryBadgeClass(categoria: string): string {
    const baseClass = 'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm';
    const colorMap: Record<string, string> = {
      bebida: 'bg-blue-500/90 text-white',
      postre: 'bg-pink-500/90 text-white',
      snack: 'bg-orange-500/90 text-white',
      otros: 'bg-purple-500/90 text-white'
    };
    return `${baseClass} ${colorMap[categoria] || 'bg-gray-500/90 text-white'}`;
  }

  getCategoryLabel(categoria: string): string {
    const labels: Record<string, string> = {
      bebida: 'Bebida',
      postre: 'Postre',
      snack: 'Snack',
      otros: 'Otros'
    };
    return labels[categoria] || categoria;
  }

  getCategoryEmoji(categoria: string): string {
    const emojis: Record<string, string> = {
      bebida: '☕',
      postre: '🍰',
      snack: '🥐',
      otros: '🍽️'
    };
    return emojis[categoria] || '📦';
  }
}
