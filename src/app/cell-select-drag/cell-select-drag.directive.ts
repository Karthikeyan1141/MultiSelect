import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export interface CellEvent {
  day: number;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  eventType: 'click' | 'mousedown' | 'mouseover' | 'mouseup';
}

@Directive({
  selector: '[cellSelectDrag]',
  standalone: true,
})
export class CellSelectDragDirective {
  @Input() day!: number;
  @Input() location!: number;

  @Output() cellEvent = new EventEmitter<CellEvent>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.cellEvent.emit({
      day: this.day,
      location: this.location,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey,
      eventType: 'click',
    });
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!(event.shiftKey || (event.ctrlKey || event.metaKey))) {
      this.cellEvent.emit({
        day: this.day,
        location: this.location,
        ctrlKey: event.ctrlKey || event.metaKey,
        shiftKey: event.shiftKey,
        eventType: 'mousedown',
      });
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    this.cellEvent.emit({
      day: this.day,
      location: this.location,
      ctrlKey: event.ctrlKey || event.metaKey,
      shiftKey: event.shiftKey,
      eventType: 'mouseover',
    });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!(event.shiftKey || (event.ctrlKey || event.metaKey))) {
      this.cellEvent.emit({
        day: this.day,
        location: this.location,
        ctrlKey: event.ctrlKey || event.metaKey,
        shiftKey: event.shiftKey,
        eventType: 'mouseup',
      });
    }
  }
}
