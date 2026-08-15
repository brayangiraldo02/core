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
    const u = this.authService.user;
    return (u?.name || (u as any)?.nombre || 'USUARIO').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
