import { Component } from '@angular/core';
import { CellSelectComponent } from "./cell-selection/cell-select.component";
import { CellSelectDragComponent } from "./cell-select-drag/cell-select-drag.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [CellSelectComponent, CellSelectDragComponent]
})
export class App {
  protected title = 'poc-multi-selection';
}
