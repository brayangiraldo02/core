import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SharedModule } from '../shared/shared-module';
import { FooterComponent } from './components/footer/footer.component';
import { authInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [LayoutComponent, ToolbarComponent, FooterComponent],
  imports: [CommonModule, RouterModule, SharedModule, HttpClientModule],
  exports: [LayoutComponent],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
})
export class CoreModule {}
