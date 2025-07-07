import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellSelectDirective, CellClickEvent } from './cell-select.directive';

interface Cell {
  day: number;
  location: number;
}

@Component({
  selector: 'app-cell-select',
  templateUrl: './cell-select.component.html',
  imports: [CommonModule, CellSelectDirective],
  styleUrls: ['./cell-select.component.scss'],
})
export class CellSelectComponent {
  days = Array.from({ length: 30 }, (_, i) => i + 1);
  locations = Array.from({ length: 20 }, (_, i) => i + 1);

  selectedCells: Cell[] = [];
  lastSelectedCell: Cell | null = null;

  private readonly cellsMap = new Map<string, Cell>();

  constructor() {
    this.days.forEach((day) => {
      this.locations.forEach((location) => {
        this.cellsMap.set(this.key(day, location), { day, location });
      });
    });
  }

  private key(day: number, location: number): string {
    return `${day}_${location}`;
  }

  isSelected(day: number, location: number): boolean {
    return this.selectedCells.some(
      (c) => c.day === day && c.location === location
    );
  }

  private addSelectedCell(cell: Cell) {
    if (!this.isSelected(cell.day, cell.location)) {
      this.selectedCells.push(cell);
    }
  }

  private removeSelectedCell(cell: Cell) {
    this.selectedCells = this.selectedCells.filter(
      (c) => !(c.day === cell.day && c.location === cell.location)
    );
  }

  private clearSelection() {
    this.selectedCells = [];
  }

  private getCellIndex(cell: Cell) {
    return {
      dayIndex: this.days.indexOf(cell.day),
      locIndex: this.locations.indexOf(cell.location),
    };
  }

  private selectRange(from: Cell, to: Cell) {
    const fromIdx = this.getCellIndex(from);
    const toIdx = this.getCellIndex(to);

    const dayStart = Math.min(fromIdx.dayIndex, toIdx.dayIndex);
    const dayEnd = Math.max(fromIdx.dayIndex, toIdx.dayIndex);
    const locStart = Math.min(fromIdx.locIndex, toIdx.locIndex);
    const locEnd = Math.max(fromIdx.locIndex, toIdx.locIndex);

    const newSelection: Cell[] = [];

    for (let dayI = dayStart; dayI <= dayEnd; dayI++) {
      for (let locI = locStart; locI <= locEnd; locI++) {
        const cell = this.cellsMap.get(
          this.key(this.days[dayI], this.locations[locI])
        );
        if (cell) {
          newSelection.push(cell);
        }
      }
    }
    this.selectedCells = newSelection;
  }

  onCellClick(event: CellClickEvent) {
    const clickedCell = { day: event.day, location: event.location };

    if (event.shiftKey && this.lastSelectedCell) {
      // Shift selects range from lastSelectedCell to clickedCell
      this.selectRange(this.lastSelectedCell, clickedCell);
    } else if (event.ctrlKey) {
      // Ctrl toggles cell in selection
      if (this.isSelected(clickedCell.day, clickedCell.location)) {
        this.removeSelectedCell(clickedCell);
      } else {
        this.selectedCells.push(clickedCell);
      }
      this.lastSelectedCell = clickedCell;
    } else {
      // Simple click clears selection and selects clickedCell only
      this.selectedCells = [clickedCell];
      this.lastSelectedCell = clickedCell;
    }
  }
}
