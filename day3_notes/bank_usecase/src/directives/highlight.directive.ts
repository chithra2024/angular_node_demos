import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.highlightText();
  }

  private highlightText() {
    const text = this.elementRef.nativeElement.innerText;
    const highlightedText = `<span style="background-color: yellow">${text}</span>`;
    this.elementRef.nativeElement.innerHTML = highlightedText;
  }

}