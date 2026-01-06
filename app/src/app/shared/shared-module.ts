import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatIconModule, MatCardModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  exports: [MatIconModule, MatCardModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class SharedModule {}
