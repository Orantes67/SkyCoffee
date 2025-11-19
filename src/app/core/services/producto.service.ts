import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { tap } from 'rxjs/operators'; // ⬅️ Importar el operador tap

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://skycoffe-api.duckdns.org/api/producto';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos y registra la lista recibida.
   */
  getAllProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      tap(productos => {
        console.log('✅ Productos recibidos (getAllProducts):', productos);
      })
    );
  }

  /**
   * Obtiene un producto por ID y registra el producto recibido.
   */
  getProductById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
      tap(producto => {
        console.log(`✅ Producto recibido (getProductById) con ID ${id}:`, producto);
      })
    );
  }

 // ============================================
// MÉTODO CREATEPRODUCT COMPLETO
// ============================================

createProduct(product: Producto, imageFile?: File): Observable<Producto> {
  console.log('🔵 ===== INICIO createProduct (CORREGIDO) =====');
  
  const formData = new FormData();

  // 1. EMPAQUETAR EL JSON: 
  // Convertimos el objeto producto a un Blob tipo JSON.
  // Esto hace que el backend lo reciba igual que en Postman (key: "producto")
  const productoBlob = new Blob([JSON.stringify(product)], { type: 'application/json' });
  formData.append('producto', productoBlob);

  // 2. AGREGAR LA IMAGEN (si existe)
  if (imageFile) {
    formData.append('imagen', imageFile);
  }

  // Depuración para que veas la diferencia en consola
  console.log('📤 Enviando FormData. Claves esperadas: "producto" e "imagen"');
  
  return this.http.post<Producto>(this.apiUrl, formData).pipe(
    tap({
      next: (response) => {
        console.log('✅ Producto creado con éxito:', response);
      },
      error: (error) => {
        console.error('❌ Error al crear:', error);
      }
    })
  );
}


  // ✅ MÉTODO CORREGIDO: Actualiza producto e imagen juntos
  updateProduct(id: number, product: Partial<Producto>, imageFile?: File): Observable<Producto> {
    const formData = new FormData();
    
    // Agregar el producto como JSON string
    formData.append('producto', JSON.stringify(product));
    
    // Agregar la imagen si existe
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, formData).pipe(
        tap(productoActualizado => {
            console.log(`✅ Producto actualizado y recibido como respuesta para ID ${id}:`, productoActualizado);
        })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene productos por categoría y registra la lista recibida.
   */
  getProductsByCategory(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/category/${categoria}`).pipe(
      tap(productos => {
        console.log(`✅ Productos recibidos (getProductsByCategory) para categoría '${categoria}':`, productos);
      })
    );
  }
}