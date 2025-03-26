// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import

import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule, CardComponent,],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingPageComponent {
  
}
