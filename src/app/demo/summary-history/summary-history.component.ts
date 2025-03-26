import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/videoService';
// Project Import
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { showNotification } from '../utils/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'summary-history',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './summary-history.component.html',
  styleUrls: ['./summary-history.component.scss']
})
export class SummaryHistoryPageComponent {
  searchTerm: string = '';
  sortColumn: string = '';
  sortAsc: boolean = true;

  summaries: any[] = [];
  


  constructor(private videoService: VideoService, private router:Router) {}

  ngOnInit() {
    this.loadSummaries();
  }

  loadSummaries() {
    this.videoService.fetchSummaryHistory().subscribe({
      next: (data) => {
        this.summaries = data.notebooks;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching prospects:', err);
      }
    });
  }


  filteredSummaries() {
    return this.summaries
      .filter(mail =>
        Object.values(mail).some(value =>
          value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (!this.sortColumn) return 0;
        const valA = a[this.sortColumn as keyof typeof a];
        const valB = b[this.sortColumn as keyof typeof a];
        return this.sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
  }
  openSummaryDetails(summary: any) {
    localStorage.setItem('tubenotes_selectedSummary', JSON.stringify(summary));
    this.router.navigate(['/summary-details']);
  }

  deleteSummary(summary){
    this.videoService.deleteSummary(summary.id).subscribe({
      next: (data) => {
        showNotification(true,"Summary deleted")
        this.loadSummaries();
      },
      error: (err) => {
        showNotification(false,"Unabled to delete summary")
        console.error('Error fetching prospects:', err);
      }
    });
  }

  selectedSummary: any = null;

}


