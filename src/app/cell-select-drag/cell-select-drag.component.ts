import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CellSelectDragDirective,
  CellEvent,
} from './cell-select-drag.directive';

interface Cell {
  day: number;
  location: number;
}

@Component({
    selector: 'app-cell-select-drag',
    templateUrl: 'cell-select-drag.component.html',
    imports: [CommonModule, CellSelectDragDirective],
    styleUrls: ['./cell-select-drag.component.scss'],
})
export class CellSelectDragComponent {
    days = Array.from({ length: 30 }, (_, i) => i + 1);
    locations = Array.from({ length: 20 }, (_, i) => i + 1);

    selectedCells: Cell[] = [];
    lastSelectedCell: Cell | null = null;

    private isDragging = false;
    private dragStartCell: Cell | null = null;

    private readonly cellsMap = new Map<string, Cell>();

    constructor() {
        this.days.forEach((day) => {
            this.locations.forEach((loc) => {
                this.cellsMap.set(this.key(day, loc), { day, location: loc });
            });
        });
    }

    // @HostListener('document:mouseup', ['$event'])
    // handleDocumentMouseUp(event: MouseEvent) {
    //     if (this.isDragging) {
    //         this.isDragging = false;
    //         this.dragStartCell = null;
    //         this.lastSelectedCell = null; // Clear last selected to avoid unintended shift behavior after drag
    //     }
    // }

    private key(day: number, location: number): string {
        return `${day}_${location}`;
    }

    isSelected(day: number, location: number): boolean {
        return this.selectedCells.some(
            (c) => c.day === day && c.location === location
        );
    }

    private getCellIndex(cell: Cell) {
        return {
            dayIndex: this.days.indexOf(cell.day),
            locIndex: this.locations.indexOf(cell.location),
        };
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

    private selectRange(from: Cell, to: Cell, append = false) {
        const fromIdx = this.getCellIndex(from);
        const toIdx = this.getCellIndex(to);

        const dayStart = Math.min(fromIdx.dayIndex, toIdx.dayIndex);
        const dayEnd = Math.max(fromIdx.dayIndex, toIdx.dayIndex);
        const locStart = Math.min(fromIdx.locIndex, toIdx.locIndex);
        const locEnd = Math.max(fromIdx.locIndex, toIdx.locIndex);

        const rangeCells: Cell[] = [];

        for (let d = dayStart; d <= dayEnd; d++) {
            for (let l = locStart; l <= locEnd; l++) {
                const cell = this.cellsMap.get(
                    this.key(this.days[d], this.locations[l])
                );
                if (cell) rangeCells.push(cell);
            }
        }

        if (append) {
            const existingKeys = new Set(
                this.selectedCells.map((c) => this.key(c.day, c.location))
            );
            rangeCells.forEach((c) => {
                if (!existingKeys.has(this.key(c.day, c.location))) {
                    this.selectedCells.push(c);
                }
            });
        } else {
            this.selectedCells = rangeCells;
        }
    }

    handleCellEvent(event: CellEvent) {
        const clickedCell: Cell = { day: event.day, location: event.location };

        switch (event.eventType) {
            case 'mousedown':
                console.log('mousedown');
                this.handleMouseDown(event, clickedCell);
                break;

            case 'mouseover':
                this.handleMouseOver(clickedCell);
                break;

            case 'mouseup':
                console.log(event.eventType);
                this.handleMouseUp(clickedCell);
                break;

            case 'click':
                console.log(event.eventType);
                this.handleClick(event, clickedCell);
                break;
        }
    }

    private handleMouseDown(event: CellEvent, clickedCell: Cell) {
        this.isDragging = true;
        this.dragStartCell = clickedCell;

        if (event.shiftKey && this.lastSelectedCell) {
            this.selectRange(this.lastSelectedCell, clickedCell);
        } else if (event.ctrlKey) {
            if (this.isSelected(clickedCell.day, clickedCell.location)) {
                this.removeSelectedCell(clickedCell);
            } else {
                this.selectedCells.push(clickedCell);
            }
            this.lastSelectedCell = clickedCell;
        } else {
            this.selectedCells = [clickedCell];
            this.lastSelectedCell = clickedCell;
        }
    }

    private handleMouseOver(clickedCell: Cell) {
        if (this.isDragging && this.dragStartCell) {
            this.selectRange(this.dragStartCell, clickedCell);
        }
    }

    private handleMouseUp(clickedCell: Cell) {
        if (this.isDragging) {
            this.isDragging = false;
            this.lastSelectedCell = clickedCell;
            this.dragStartCell = null;
        }
    }

    private handleClick(event: CellEvent, clickedCell: Cell) {
        if (!this.isDragging) {
            if (event.shiftKey && this.lastSelectedCell) {
                this.selectRange(this.lastSelectedCell, clickedCell);
            } else if (event.ctrlKey) {
                if (this.isSelected(clickedCell.day, clickedCell.location)) {
                    this.removeSelectedCell(clickedCell);
                } else {
                    this.selectedCells.push(clickedCell);
                }
                this.lastSelectedCell = clickedCell;
            } else {
                this.selectedCells = [clickedCell];
                this.lastSelectedCell = clickedCell;
            }
        }
    }
}

