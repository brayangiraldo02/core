import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  private authService = inject(AuthService);

  get userName(): string {
    return this.authService.user?.nombre?.toUpperCase() || 'ADMINISTRADOR';
  }

  logout(): void {
    this.authService.logout();
  }
}
