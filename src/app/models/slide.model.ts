export interface Slide {
  id: number;
  title: string;
  text: string;
  highlightedText?: string;
  titleSingleLine?: boolean;
  textSingleLine?: boolean;
  ctaLabel: string;
  bgImageUrl: string;
  mainImageUrl: string;
  bgSize?: string;
  bgPosition?: string;
}
