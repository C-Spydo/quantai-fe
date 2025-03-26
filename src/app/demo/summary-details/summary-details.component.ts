// angular import
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/videoService';
import { showNotification } from '../utils/notification';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-sample-page',
  imports: [CommonModule, CardComponent, FormsModule,],
  templateUrl: './summary-details.component.html',
  styleUrls: ['./summary-details.component.scss']
})
export class SummaryDetailsPageComponent {

  constructor(private videoService: VideoService,) {}

  videoData: any = null;
  data: any = null;

  videoSummary: string = '';
  speechSynthesis = window.speechSynthesis;
  utterance = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: string = '';
  volume: number = 0.5;
  volumeDisplay: number = 50;
  isPaused: boolean = false;

  publishedDate = "";

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;


animatedViews = 0;

  ngOnInit() {
    this.loadVoices();
    this.utterance.text = this.videoSummary;
    this.utterance.volume = this.volume;
    this.data = JSON.parse(localStorage.getItem('tubenotes_selectedSummary'));
    this.videoData = this.data.metadata;
    this.animatedViews = this.videoData.views;
    console.log('Got the video data');
    
    this.videoSummary = this.data.note;
  }

  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.selectedVoice = this.voices[0].name;
      this.utterance.voice = this.voices[0];
    }
    speechSynthesis.onvoiceschanged = () => {
      this.voices = this.speechSynthesis.getVoices();
      if (!this.selectedVoice) {
        this.selectedVoice = this.voices[0]?.name || '';
        this.utterance.voice = this.voices[0];
      }
    };
  }


  animateViews() {
    let start = 0;
    let end = this.videoData.views || 0;
    let duration = 2000; // 2 seconds
    let stepTime = Math.abs(Math.floor(duration / end));

    let counter = setInterval(() => {
      if (start >= end) {
        clearInterval(counter);
      } else {
        start += Math.ceil(end / 100); // Smooth increment
        this.animatedViews = start;
      }
    }, stepTime);
  }

  playSummary() {
    if (this.isPaused) {
      // Resume from pause
      this.speechSynthesis.resume();
    } else {
      // Start from beginning
      this.utterance.text = this.videoSummary;
      this.utterance.volume = this.volume;
      this.utterance.voice = this.voices.find(v => v.name === this.selectedVoice) || this.utterance.voice;
      this.speechSynthesis.speak(this.utterance);
    }
    this.isPaused = false;
  }

  pauseSummary() {
    this.speechSynthesis.pause();
    this.isPaused = true;
  }

  stopSummary() {
    this.speechSynthesis.cancel();
    this.isPaused = false;
  }

  adjustVolume() {
    this.volume = this.volumeDisplay /100;
    this.utterance.volume = this.volume;
  }

  changeVoice() {
    this.utterance.voice = this.voices.find(v => v.name === this.selectedVoice) || this.utterance.voice;
  }

  downloadPDF() {
    const content = this.pdfContent.nativeElement;

    html2canvas(content, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('summary.pdf');
    });
  }
}
