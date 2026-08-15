import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-result-data',
  standalone: false,
  templateUrl: './no-result-data.component.html',
  styleUrl: './no-result-data.component.css',
})
export class NoResultDataComponent {
  query = input<string>('');
}
