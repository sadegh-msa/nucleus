import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from '@nucleus/fabric';
import { NuPanelService } from '@nucleus/panel';
import { appMenuItems } from './app.menu';

@Component({
    imports: [RouterOutlet],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly #panelService = inject(NuPanelService);

  ngOnInit() {
    this.#panelService.mainMenu.set(structuredClone(appMenuItems) as MenuItem[]);
  }
}
