import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SlidesService } from '../../services/slides.service';
import { Slide } from '../../models/slide.model';
import { CarouselSlideComponent } from '../carousel-slide/carousel-slide.component';
import {
  CarouselGestureDirective,
  SwipeDirection,
} from './carousel-gesture.directive';

const AUTOPLAY_INTERVAL = 10000; // 10 seconds
const SWIPE_THRESHOLD = 50;

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselSlideComponent, CarouselGestureDirective],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
  readonly slides = signal<Slide[]>([]);
  readonly loading = signal(true);
  readonly currentIndex = signal(1);
  readonly isAnimating = signal(false);
  readonly dragOffsetPct = signal(0);
  readonly transitionDisabled = signal(false);
  readonly swipeThreshold = SWIPE_THRESHOLD;

  private slidesSubscription?: Subscription;
  private autoplayTimerId: ReturnType<typeof setInterval> | null = null;
  private swipeHappened = false;

  readonly displaySlides = computed(() => {
    const s = this.slides();
    if (s.length === 0) return [];
    return [s[s.length - 1], ...s, s[0]];
  });

  readonly trackTransform = computed(() => {
    const offset = -this.currentIndex() * 100;
    return `translateX(calc(${offset}vw + ${this.dragOffsetPct()}vw))`;
  });

  readonly realSlideIndex = computed(() => {
    const idx = this.currentIndex();
    const total = this.slides().length;
    if (idx === 0) return total - 1;
    if (idx === total + 1) return 0;
    return idx - 1;
  });

  constructor(private slidesService: SlidesService) {}

  ngOnInit(): void {
    this.loadSlides();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.slidesSubscription?.unsubscribe();
  }

  private loadSlides(): void {
    this.slidesSubscription = this.slidesService
      .getSlides()
      .subscribe((slides) => {
        this.slides.set(slides);
        this.loading.set(false);
        this.startAutoplay();
      });
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayTimerId = setInterval(() => {
      if (!this.isAnimating() && this.slides().length > 1) {
        this.goToNextAuto();
      }
    }, AUTOPLAY_INTERVAL);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimerId !== null) {
      clearInterval(this.autoplayTimerId);
      this.autoplayTimerId = null;
    }
  }

  private resetAutoplay(): void {
    this.startAutoplay();
  }

  onTransitionEnd(): void {
    const total = this.slides().length;
    const idx = this.currentIndex();

    if (idx === 0) {
      this.transitionDisabled.set(true);
      requestAnimationFrame(() => {
        this.currentIndex.set(total);
        this.dragOffsetPct.set(0);
        requestAnimationFrame(() => {
          this.transitionDisabled.set(false);
          this.isAnimating.set(false);
        });
      });
      return;
    } else if (idx === total + 1) {
      this.transitionDisabled.set(true);
      requestAnimationFrame(() => {
        this.currentIndex.set(1);
        this.dragOffsetPct.set(0);
        requestAnimationFrame(() => {
          this.transitionDisabled.set(false);
          this.isAnimating.set(false);
        });
      });
      return;
    }

    this.dragOffsetPct.set(0);
    this.isAnimating.set(false);
  }

  goToSlide(index: number): void {
    if (this.isAnimating()) return;
    this.isAnimating.set(true);
    this.currentIndex.set(index);
    this.resetAutoplay();
  }

  private goToNextAuto(): void {
    const total = this.slides().length;
    if (total === 0 || this.isAnimating()) return;
    this.isAnimating.set(true);
    this.currentIndex.set(this.currentIndex() + 1);
  }

  goToNext(): void {
    const total = this.slides().length;
    if (total === 0 || this.isAnimating()) return;
    this.isAnimating.set(true);
    this.currentIndex.set(this.currentIndex() + 1);
    this.resetAutoplay();
  }

  goToPrev(): void {
    const total = this.slides().length;
    if (total === 0 || this.isAnimating()) return;
    this.isAnimating.set(true);
    this.currentIndex.set(this.currentIndex() - 1);
    this.resetAutoplay();
  }

  onDragStart(): void {
    if (this.isAnimating()) return;
    this.swipeHappened = false;
    this.transitionDisabled.set(true);
    this.dragOffsetPct.set(0);
    this.stopAutoplay();
  }

  onDragMove(offsetPct: number): void {
    if (this.isAnimating()) return;
    this.dragOffsetPct.set(offsetPct);
  }

  onSwipe(direction: SwipeDirection): void {
    if (this.isAnimating()) return;
    this.swipeHappened = true;
    this.isAnimating.set(true);
    this.transitionDisabled.set(false);
    this.dragOffsetPct.set(0);

    if (direction === 'prev') {
      this.currentIndex.set(this.currentIndex() - 1);
    } else {
      this.currentIndex.set(this.currentIndex() + 1);
    }

    this.resetAutoplay();
  }

  onDragEnd(): void {
    this.dragOffsetPct.set(0);
    this.transitionDisabled.set(false);

    if (!this.swipeHappened) {
      this.startAutoplay();
    }
  }
}
