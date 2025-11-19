// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

// Tus componentes existentes
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { HomeComponent } from './views/public/home/home.component';

export const routes: Routes = [
  // ========================================
  // RUTAS PÚBLICAS (tus componentes actuales)
  // ========================================
  {
    path: '',
    component: HomeComponent,
    title: 'SkyCoffee - Inicio'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'SkyCoffee - Inicio'
  },
  
  // ========================================
  // AUTENTICACIÓN (tus componentes)
  // ========================================
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - SkyCoffee'
  },
  {
    path: 'singup', // Mantuve tu ortografía
    component: RegisterComponent,
    title: 'Registro - SkyCoffee'
  },
  {
    path: 'register', // Alias por si lo llaman así
    redirectTo: 'singup',
    pathMatch: 'full'
  },

  // ========================================
  // MENÚ Y UBICACIÓN (lazy loading)
  // ========================================
  {
    path: 'menu',
    loadComponent: () => import('./views/public/menu/menu.component')
      .then(m => m.MenuComponent),
    title: 'Menú - SkyCoffee'
  },
  {
    path: 'location',
    loadComponent: () => import('./views/public/location/location.component')
      .then(m => m.LocationComponent),
    title: 'Ubicación - SkyCoffee'
  },

  // ========================================
  // PERFIL DE USUARIO (requiere autenticación)
  // ========================================
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./views/client/profile/profile.component')
      .then(m => m.ProfileComponent),
    title: 'Mi Perfil - SkyCoffee'
  },

  // ========================================
  // PANEL ADMINISTRATIVO (solo admin)
  // ========================================
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard - Admin'
      },
   
      
      // Gestión de Productos
      {
        path: 'products',
        loadComponent: () => import('./views/admin/product-management/product-lis/product-lis.component')
          .then(m => m.ProductLisComponent),
        title: 'Gestión de Productos'
      },
      {
        path: 'products/new',
        loadComponent: () => import('./views/admin/product-management/product-form/product-form.component')
          .then(m => m.ProductFormComponent),
        title: 'Nuevo Producto'
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./views/admin/product-management/product-form/product-form.component')
          .then(m => m.ProductFormComponent),
        title: 'Editar Producto'
      }
    ]
  },

  // ========================================
  // 404 - Página no encontrada
  // ========================================
  {
    path: '**',
    loadComponent: () => import('./views/public/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: 'Página no encontrada'
  }
];