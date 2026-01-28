import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export type SwipeDirection = 'prev' | 'next';

@Directive({
  selector: '[appCarouselGesture]',
  standalone: true,
})
export class CarouselGestureDirective {
  @Input() swipeThresholdPx = 50;

  @Output() dragStart = new EventEmitter<void>();
  @Output() dragMove = new EventEmitter<number>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() swipe = new EventEmitter<SwipeDirection>();

  private dragging = false;
  private startX = 0;
  private lastX = 0;
  private pointerId: number | null = null;
  private pointerActive = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.pointerActive = true;
    this.dragging = true;
    this.startX = event.clientX;
    this.lastX = event.clientX;
    this.pointerId = event.pointerId;

    this.host.nativeElement.setPointerCapture(event.pointerId);
    this.dragStart.emit();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;

    this.lastX = event.clientX;
    const deltaX = this.lastX - this.startX;
    const width = this.host.nativeElement.clientWidth || window.innerWidth;
    const offsetPct = (deltaX / width) * 100;
    this.dragMove.emit(offsetPct);
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;

    this.finishPointer(event);
  }

  @HostListener('pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;

    this.finishPointer(event, true);
  }

  @HostListener('pointerleave', ['$event'])
  onPointerLeave(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;

    this.finishPointer(event, true);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.pointerActive) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.dragging = true;
    this.startX = touch.clientX;
    this.lastX = touch.clientX;
    this.dragStart.emit();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.pointerActive || !this.dragging) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.lastX = touch.clientX;
    const deltaX = this.lastX - this.startX;
    const width = this.host.nativeElement.clientWidth || window.innerWidth;
    const offsetPct = (deltaX / width) * 100;
    this.dragMove.emit(offsetPct);
  }

  @HostListener('touchend')
  onTouchEnd(): void {
    if (this.pointerActive || !this.dragging) return;

    this.finishTouch();
  }

  @HostListener('touchcancel')
  onTouchCancel(): void {
    if (this.pointerActive || !this.dragging) return;

    this.finishTouch(true);
  }

  private finishPointer(event: PointerEvent, cancelled = false): void {
    const deltaX = this.lastX - this.startX;
    this.releasePointer(event);
    this.finishGesture(deltaX, cancelled);
  }

  private finishTouch(cancelled = false): void {
    const deltaX = this.lastX - this.startX;
    this.finishGesture(deltaX, cancelled);
  }

  private finishGesture(deltaX: number, cancelled: boolean): void {
    this.dragging = false;

    if (!cancelled && Math.abs(deltaX) > this.swipeThresholdPx) {
      this.swipe.emit(deltaX > 0 ? 'prev' : 'next');
    }

    this.dragEnd.emit();
  }

  private releasePointer(event: PointerEvent): void {
    if (this.pointerId === null) return;

    try {
      this.host.nativeElement.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore if already released
    }

    this.pointerId = null;
    this.pointerActive = false;
  }
}
