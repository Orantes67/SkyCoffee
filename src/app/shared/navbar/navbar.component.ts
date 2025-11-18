import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  currentUser = computed(() => this.authService.currentUser());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isAdmin = computed(() => this.authService.isAdmin());

  constructor(private authService: AuthService) {}

  // Devuelve la primera letra del nombre o vacío
  firstLetter(): string {
    return this.currentUser()?.nombre?.charAt(0).toUpperCase() || '';
  }

  // Devuelve el primer nombre del usuario o cadena vacía
  firstName(): string {
    return this.currentUser()?.nombre?.split(' ')[0] || '';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(val => !val);
    this.userMenuOpen.set(false);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.update(val => !val);
  }

  closeUserMenu() {
    this.userMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
  }
}
