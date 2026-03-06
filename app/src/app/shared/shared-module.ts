import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MatIconModule, 
    MatCardModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [
    MatIconModule, 
    MatCardModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ],
})
export class SharedModule {}
