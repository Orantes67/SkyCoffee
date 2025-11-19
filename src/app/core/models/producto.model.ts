export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
  imagen: File | string;
  disponible?: boolean; 
}
