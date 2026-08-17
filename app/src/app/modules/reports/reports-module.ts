import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing-module';
import { PdfGeneratorViewComponent } from './pages/pdf-generator-view/pdf-generator-view.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [PdfGeneratorViewComponent],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
