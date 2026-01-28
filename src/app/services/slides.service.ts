import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Slide } from '../models/slide.model';

@Injectable({
  providedIn: 'root',
})
export class SlidesService {
  private readonly slides: Slide[] = [
    {
      id: 1,
      title: 'WinzUp Loyalty Program',
      text: 'Get up to 35% in rewards: daily rakeback, weekly cashback and level-up bonuses',
      highlightedText: '35% in rewards:',
      titleSingleLine: true,
      ctaLabel: 'Join now',
      bgImageUrl: '/winzup-bg-mob.webp',
      mainImageUrl: '/winzup_mob.png',
    },
    {
      id: 2,
      title: "Valentine's Fortune\nDrops",
      text: 'Trigger random prizes and win a share of €30,000!',
      highlightedText: '€30,000',
      titleSingleLine: true,
      ctaLabel: 'Learn more',
      bgImageUrl: '/ValentinesFortuneDrops_mob-bg.png',
      mainImageUrl: '/ValentinesFortuneDrops_mob-pic.png',
    },
    {
      id: 3,
      title: 'Wheel of Winz',
      text: 'Spin the wheel to win up to €15,000 weekly',
      highlightedText: '€15,000',
      titleSingleLine: true,
      textSingleLine: false,
      ctaLabel: 'Spin now',
      bgImageUrl: '/wheel-mob-bg.webp',
      mainImageUrl: '/wheel-mob.png',
      bgSize: 'cover',
      bgPosition: 'center 30%',
    },
  ];

  getSlides(): Observable<Slide[]> {
    return of(this.slides).pipe(delay(800));
  }
}
