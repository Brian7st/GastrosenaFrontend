import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[autoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    queueMicrotask(() => this.elementRef.nativeElement.focus());
  }
}
