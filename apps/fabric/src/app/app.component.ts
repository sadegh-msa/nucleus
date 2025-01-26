import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanelService } from '@fabric/panel';
import { MenuItem } from '@fabric/ui';
import { appMenuItems } from './app.menu';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #panelService = inject(PanelService);

  ngOnInit() {
    this.#panelService.mainMenu.set(structuredClone(appMenuItems) as MenuItem[]);
  }
}
