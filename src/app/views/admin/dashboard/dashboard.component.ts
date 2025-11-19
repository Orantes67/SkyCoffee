import { Component, OnInit, signal } from '@angular/core';
import { RouterLink,Router } from '@angular/router'; // ✅ Importar RouterLink
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [RouterLink] // ✅ Agregar a imports
})
export class DashboardComponent implements OnInit {
  stats = signal({
    totalProducts: 0,
    availableProducts: 0,
    bebidas: 0,
    postres: 0,
    snacks: 0,
    avgPrice: '0.00'
  });

  constructor(
    private productService: ProductoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  currentUser() {
    return this.authService.currentUser();
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const availableCount = products.filter(p => p.disponible !== false).length;
        const bebidasCount = products.filter(p => p.categoria === 'bebida').length;
        const postresCount = products.filter(p => p.categoria === 'postre').length;
        const snacksCount = products.filter(p => p.categoria === 'snack').length;

        const totalPrice = products.reduce((sum, p) => sum + p.precio, 0);
        const avgPrice = products.length > 0 ? (totalPrice / products.length).toFixed(2) : '0.00';

        this.stats.update(s => ({
          ...s,
          totalProducts: products.length,
          availableProducts: availableCount,
          bebidas: bebidasCount,
          postres: postresCount,
          snacks: snacksCount,
          avgPrice
        }));
      }
    });
  }
  
}