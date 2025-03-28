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




  chartOptionsec = {
    title: {
      text: 'Customized Line Chart',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#048FFB',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (params: any) => {
        let value = params[0].value;
        return `<strong>Value:</strong> ${value}`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5', 'Point 6'],
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Data Series',
        type: 'line',
        smooth: true, // Makes the curve smooth
        showSymbol: true, // Shows dots on data points
        symbolSize: 8, // Increase dot size
        itemStyle: {
          normal: {
            color: (params: any) => params.dataIndex < 3 ? '#048FFB' : '#ff5733', // Blue first half, Red second half
            borderColor: '#fff',
            borderWidth: 2
          }
        },
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#048FFB' },
              { offset: 0.5, color: '#ff5733' },
              { offset: 0.51, color: '#ff5733' },
              { offset: 1, color: '#ff5733' }
            ]
          }
        },
        areaStyle: {
          opacity: 0.2, // Light filled area under the curve
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(4, 143, 251, 0.5)' },
              { offset: 1, color: 'rgba(255, 87, 51, 0.2)' }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#000',
            borderWidth: 2
          }
        },
        animationDuration: 1500, // Smooth animation
        animationEasing: 'cubicOut',
        data: [190, 195, 200, 210, 220, 230, 240, 250, 260, 270, 280],
      }
    ]
  };

  
  chartOptionsecx= {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Stock Price',
        type: 'line',
        data: [190, 195, 200, 210, 220, 230, 240, 250, 260, 270, 280],
        lineStyle: {
          color: {
            type: 'linear',
            x: 0, // left to right
            y: 0,
            x2: 1, // full width
            y2: 0,
            colorStops: [
              { offset: 0, color: '#048FFB' },  // 0% - Blue
              { offset: 0.49, color: '#ff5733' }, // 49% - Still Blue
              { offset: 0.51, color: '#ff5733' }, // 51% - Now Red
              { offset: 1, color: '#ff5733' }  // 100% - Fully Red
            ]
          },
          width: 3 // Optional: Adjust thickness
        },
        itemStyle: {
          color: (params: any) => params.dataIndex < 3 ? '#048FFB' : '#ff5733'
        },
        // lineStyle: {
        //   color: (params: any) => params.dataIndex < 3 ? '#ffffff' : '#ff5733'
        // }
      }
    ]
  };

  // Line Chart Data for Each Stock
  chartSeries = [
    [
      {
        name: "Actual",
        data: [
          { x: "Point 1", y: 190 },
          { x: "Point 2", y: 195 },
          { x: "Point 3", y: 200 },
          { x: "Point 4", y: 210 },
          { x: "Point 5", y: 220 },
          { x: "Point 6", y: 230 },
          { x: "Point 7", y: null } // Connects to predicted
        ],
        color: "#008FFB" // Blue for actual
      },
      {
        name: "Predicted",
        data: [
          { x: "Point 6", y: 230 }, // Start from the last actual point
          { x: "Point 7", y: 240 },
          { x: "Point 8", y: 250 },
          { x: "Point 9", y: 260 },
          { x: "Point 10", y: 270 },
          { x: "Point 11", y: 280 }
        ],
        color: "#FF4560" // Red for predicted
      }
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
        this.fetching = false;
        console.log('the insight');
        console.log(this.insight);
      },
      error: (err) => {
        console.error('Error fetching Analysis:', err);
      }
    });
  }

}
