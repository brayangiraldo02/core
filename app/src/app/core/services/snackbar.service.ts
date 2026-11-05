import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  SnackbarComponent,
  AppSnackbarData,
  SnackbarVariant,
} from '../../shared/components/snackbar/snackbar.component';

export interface SnackbarOptions {
  title?: string;
  duration?: number;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly defaultHorizontal: MatSnackBarHorizontalPosition = 'right';
  private readonly defaultVertical: MatSnackBarVerticalPosition = 'top';

  private readonly defaultDurations: Record<SnackbarVariant, number> = {
    success: 3500,
    info: 3500,
    warning: 4500,
    error: 5500,
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra un toast de éxito (verde pastel, icono check_circle, 3500ms por defecto)
   */
  success(
    message: string,
    titleOrOptions?: string | SnackbarOptions,
    duration?: number,
  ): MatSnackBarRef<SnackbarComponent> {
    return this.show('success', message, titleOrOptions, duration);
  }

  /**
   * Muestra un toast de error (rojo pastel, icono error, 5500ms por defecto)
   */
  error(
    message: string,
    titleOrOptions?: string | SnackbarOptions,
    duration?: number,
  ): MatSnackBarRef<SnackbarComponent> {
    return this.show('error', message, titleOrOptions, duration);
  }

  /**
   * Muestra un toast de advertencia (ámbar pastel, icono warning, 4500ms por defecto)
   */
  warning(
    message: string,
    titleOrOptions?: string | SnackbarOptions,
    duration?: number,
  ): MatSnackBarRef<SnackbarComponent> {
    return this.show('warning', message, titleOrOptions, duration);
  }

  /**
   * Muestra un toast informativo (azul cielo pastel, icono info, 3500ms por defecto)
   */
  info(
    message: string,
    titleOrOptions?: string | SnackbarOptions,
    duration?: number,
  ): MatSnackBarRef<SnackbarComponent> {
    return this.show('info', message, titleOrOptions, duration);
  }

  /**
   * Compatibilidad con llamadas existentes a openSnackBar
   */
  openSnackBar(
    message: string,
    action: string = 'Cerrar',
    duration: number = 3500,
  ): MatSnackBarRef<SnackbarComponent> {
    return this.info(message, { actionLabel: action, duration });
  }

  /**
   * Apertura genérica con datos y opciones completas
   */
  open(data: AppSnackbarData, options?: SnackbarOptions): MatSnackBarRef<SnackbarComponent> {
    const duration =
      options?.duration !== undefined
        ? options.duration
        : this.defaultDurations[data.variant] || 3500;

    return this.snackBar.openFromComponent(SnackbarComponent, {
      data,
      duration,
      horizontalPosition: options?.horizontalPosition || this.defaultHorizontal,
      verticalPosition: options?.verticalPosition || this.defaultVertical,
      panelClass: ['app-snackbar-panel'],
    });
  }

  /**
   * Cierra programáticamente cualquier snackbar abierto
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }

  private show(
    variant: SnackbarVariant,
    message: string,
    titleOrOptions?: string | SnackbarOptions,
    customDuration?: number,
  ): MatSnackBarRef<SnackbarComponent> {
    let options: SnackbarOptions = {};

    if (typeof titleOrOptions === 'string') {
      options = { title: titleOrOptions };
    } else if (titleOrOptions && typeof titleOrOptions === 'object') {
      options = { ...titleOrOptions };
    }

    if (customDuration !== undefined) {
      options.duration = customDuration;
    }

    const data: AppSnackbarData = {
      variant,
      message,
      title: options.title,
      icon: options.icon,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
    };

    return this.open(data, options);
  }
}
