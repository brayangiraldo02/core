import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfGeneratorViewComponent } from './pages/pdf-generator-view/pdf-generator-view.component';

const routes: Routes = [
  {
    path: '',
    component: PdfGeneratorViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
