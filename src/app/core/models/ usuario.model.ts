export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  telefono: string;
  foto_perfil?: string;
  rol: 'admin' | 'cliente';
  password?: string;
}
