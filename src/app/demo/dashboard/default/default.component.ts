// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';

// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { showNotification } from 'src/app/demo/utils/notification';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);

  constructor(private authService: AuthService, private router:Router) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  stats: any = {};
  // total_summary = localStorage.getItem('tubenotes_total_summary');
  total_summary = 0;
  ngOnInit() {
    const token = localStorage.getItem('tubenotes_token');
    if (!token) {
      this.router.navigate(['/login']); // Redirect to login if token is missing
    }
    this.getDashboard();
  }
  
  getDashboard() {
    this.authService.getDashboard().subscribe({
      next: (data) => {
        this.total_summary = data.total_summaries
      },
      error: (err) => {
        console.error('Error fetching prospects:', err);
      }
    });
  }

  
  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Total Summaries',
      amount: this.total_summary,
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '-',
      color: 'text-primary',
      number: this.total_summary,
    },
  ];

}
