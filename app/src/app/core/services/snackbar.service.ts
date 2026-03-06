import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string = 'Cerrar', duration: number = 5000) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration
    });
  }
}
