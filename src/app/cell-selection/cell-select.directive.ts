import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface CellClickEvent {
  day: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
}

@Directive({
  selector: '[cellMultiSelect]',
  standalone: true
})
export class CellSelectDirective {
  @Input() day!: number;
  @Input() location!: number;

  @Output() cellClick = new EventEmitter<CellClickEvent>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.cellClick.emit({
      day: this.day,
      location: this.location,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey
    });
  }
}