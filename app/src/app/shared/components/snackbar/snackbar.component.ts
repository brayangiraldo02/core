import { Component, Inject, Optional } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

export interface AppSnackbarData {
  variant: SnackbarVariant;
  message: string;
  title?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

@Component({
  selector: 'app-snackbar',
  standalone: false,
  templateUrl: './snackbar.component.html',
  host: {
    class: 'block w-full',
  },
})
export class SnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Optional() @Inject(MAT_SNACK_BAR_DATA) public data?: AppSnackbarData,
  ) {}

  get variant(): SnackbarVariant {
    return this.data?.variant || 'info';
  }

  get iconName(): string {
    if (this.data?.icon) {
      return this.data.icon;
    }
    switch (this.variant) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  get borderClass(): string {
    switch (this.variant) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'warning':
        return 'border-amber-200';
      case 'info':
      default:
        return 'border-sky-200';
    }
  }

  get iconBoxClass(): string {
    switch (this.variant) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'warning':
        return 'bg-amber-100 text-amber-600';
      case 'info':
      default:
        return 'bg-sky-100 text-sky-600';
    }
  }

  close(): void {
    if (this.data?.onAction) {
      this.data.onAction();
    }
    this.snackBarRef.dismiss();
  }
}
