import { Component, Input, computed } from '@angular/core';
import { Slide } from '../../models/slide.model';

@Component({
  selector: 'app-carousel-slide',
  standalone: true,
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.scss',
})
export class CarouselSlideComponent {
  @Input({ required: true }) slide!: Slide;

  get formattedText(): { before: string; highlight: string; after: string } {
    const text = this.slide.text;
    const highlight = this.slide.highlightedText;

    if (!highlight || !text.includes(highlight)) {
      return { before: text, highlight: '', after: '' };
    }

    const index = text.indexOf(highlight);
    return {
      before: text.substring(0, index),
      highlight: highlight,
      after: text.substring(index + highlight.length),
    };
  }
}
