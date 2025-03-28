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
import { AnalysisService } from 'src/app/services/analysisService';
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { ApexOptions } from "apexcharts"; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts/core'; 
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

echarts.use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    ChartComponent,
    NgApexchartsModule,
    FormsModule,
    NgxEchartsModule
  ],
  providers: [
    { provide: NGX_ECHARTS_CONFIG, useValue: { echarts } } // Ensure ECharts is properly provided
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);

  constructor(private authService: AuthService, 
    private router: Router,
    private analysisService: AnalysisService
  ) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  activeStockTab = 0;  // Active stock (AMZN, TSLA, GOOG)
  activeSubTab = 0;    // Active section inside summary card
  isGuest = false;
  insight = '';
  chat_id;
  predictedPrices: any[] = [];
  stockPrices: any[] = [];
  fetching = true;
  chartOptionsStock: any;
  chartOptionsPredicted: any;



  // Main Stocks Tab
  stocks = [
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "GOOG", name: "Google" },
    { symbol: "MSFT", name: "Microsoft" }
  ];

  // Sub Tabs inside Stock Summary
  subTabs = [
    { label: "Stock Prices" },
    { label: "Predicted Prices" },
    { label: "Insight" },
    { label: "Feedback" }
  ];



  feedbackText = "";

  setActiveStock(index: number) {
    this.activeStockTab = index;
    this.activeSubTab = 0; // Reset sub-tab when switching stocks
    this.getAnalysis();
  }

  setActiveSubTab(index: number) {
    this.activeSubTab = index;
  }

  submitFeedback() {
    console.log(`Feedback for ${this.stocks[this.activeStockTab].symbol}:`, this.feedbackText);
  }


  ngOnInit() {
    const token = localStorage.getItem('quantai_token');
    if (!token) {
      localStorage.setItem('quantai_guest','true');
      this.isGuest = true;
    }
    this.getAnalysis();
  }

  getAnalysis(){
    let payload: any = {};
    payload.stock = this.stocks[this.activeStockTab].symbol;
    if(!this.isGuest) {
      const userId = localStorage.getItem('quantai_id');
      if (userId) payload.user_id = parseInt(userId, 10);
    }

    this.analysisService.startChat(payload).subscribe({
      next: (data) => {
        this.predictedPrices = data.predicted_prices;
        this.stockPrices = data.stock_prices;
        this.chat_id = data.chat_id;
        this.insight = data.analysis;
        this.generateCharts();
      },
      error: (err) => {
        console.error('Error fetching Analysis:', err);
      }
    });
  }

  async generateCharts() {
    await this.generateStockPriceChart();
    await this.generatePredictedPriceChart();
    this.fetching = false;
  }

  generateStockPriceChart(){
    this.stockPrices = this.stockPrices.slice().reverse();
    const categories = this.stockPrices.map(item => item.date);
    const prices = this.stockPrices.map(item => item.price);

    // Define the chart options
    this.chartOptionsStock = {
      series: [
        {
          name: 'Stock Price',
          data: prices
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: categories,
        labels: {
          rotate: -45
        }
      },
      yaxis: {
        title: {
          text: 'Price (USD)'
        }
      },
      tooltip: {
        enabled: true,
        x: {
          format: 'dd MMM yyyy'
        }
      }
    };
  
  }

  generatePredictedPriceChart(){
    // API response (converted to numbers)
    this.predictedPrices = this.predictedPrices
      .map(price => Number(price.replace(',', '')));

    // Generate X-axis labels dynamically (Point 1, Point 2, etc.)
    const categories = this.predictedPrices.map((_, index) => `Point ${index + 1}`);

    // Define chart options
    this.chartOptionsPredicted = {
      series: [
        {
          name: 'Predicted Price',
          data: this.predictedPrices
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: true }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: categories,
        labels: { rotate: -45 }
      },
      yaxis: {
        title: { text: 'Price (USD)' }
      },
      tooltip: {
        enabled: true
      }
    };
  
  }

}
