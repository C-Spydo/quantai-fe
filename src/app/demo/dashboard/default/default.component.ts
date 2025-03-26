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
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { ApexOptions } from "apexcharts"; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    ChartComponent,
    NgApexchartsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);

  constructor(private authService: AuthService, private router: Router) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  activeStockTab = 0;  // Active stock (AMZN, TSLA, GOOG)
  activeSubTab = 0;    // Active section inside summary card

  // Main Stocks Tab
  stocks = [
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "GOOG", name: "Google" }
  ];

  // Sub Tabs inside Stock Summary
  subTabs = [
    { label: "Price Trends" },
    { label: "Volatility Analysis" },
    { label: "Sentiment Analysis" },
    { label: "Sector Performance" },
    { label: "Insight" },
    { label: "Feedback" }
  ];

  // Line Chart Data for Each Stock
  chartSeries = [
    [ 
      { name: "Actual", data: [190, 195, 200, 210, 220, 230] },
      { name: "Predicted", data: [230, 240, 250, 260, 270, 280] }
    ],
    [ 
      { name: "Actual", data: [120, 125, 130, 140, 150, 160] },
      { name: "Predicted", data: [160, 170, 180, 190, 200, 210] }
    ],
    [ 
      { name: "Actual", data: [2900, 2950, 3000, 3100, 3200, 3300] },
      { name: "Predicted", data: [3300, 3400, 3500, 3600, 3700, 3800] }
    ]
  ];

  chartOptions = {
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    tooltip: { enabled: true }
  };

  // Candlestick Chart Data for Each Stock
  chartSeriesb = [
    [ 
      { name: "Stock Price", data: [{ x: "2024-03-01", y: [190, 200, 185, 195] }] }
    ],
    [ 
      { name: "Stock Price", data: [{ x: "2024-03-01", y: [120, 130, 110, 125] }] }
    ],
    [ 
      { name: "Stock Price", data: [{ x: "2024-03-01", y: [2900, 3000, 2800, 2950] }] }
    ]
  ];

  chartOptionsb: { xaxis: ApexXAxis; tooltip: { enabled: boolean } } = {
    xaxis: { type: "datetime" },  // ✅ TypeScript will now recognize "datetime"
    tooltip: { enabled: true }
  };

  // Sentiment Analysis Data
  sentimentSeries = [
    [45, 30, 25], // AMZN
    [55, 20, 25], // TSLA
    [50, 25, 25]  // GOOG
  ];

  // Sector Performance Data
  sectorSeries = [
    [{ name: "Growth", data: [5.6, 3.2, 8.4, 2.9, 6.5] }],
    [{ name: "Growth", data: [4.5, 2.8, 7.1, 3.5, 6.2] }],
    [{ name: "Growth", data: [6.2, 3.9, 8.9, 2.4, 7.3] }]
  ];

  // AI-Generated Insights for Each Stock
  insightText = [
    "Amazon's stock is showing steady growth with moderate volatility.",
    "Tesla's stock is experiencing higher fluctuations, suggesting a riskier investment.",
    "Google's stock has shown strong upward momentum, making it a promising long-term hold."
  ];

  feedbackText = "";

  setActiveStock(index: number) {
    this.activeStockTab = index;
    this.activeSubTab = 0; // Reset sub-tab when switching stocks
  }

  setActiveSubTab(index: number) {
    this.activeSubTab = index;
  }

  submitFeedback() {
    console.log(`Feedback for ${this.stocks[this.activeStockTab].symbol}:`, this.feedbackText);
  }


  ngOnInit() {}

}
