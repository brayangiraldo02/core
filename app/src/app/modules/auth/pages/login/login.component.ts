import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  logoURL =
    '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  isLoading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.router.navigate(['/dashboard']);

    /* 
    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.authService
      .login(username, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackbarService.openSnackBar(error.error?.detail || 'Error al iniciar sesión');
        },
      });
    */
  }
}
