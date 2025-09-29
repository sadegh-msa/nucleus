import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: '[showLoading]',
  templateUrl: './show-loading.component.html',
  styleUrl: './show-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nu-loading]': 'showLoading()',
    '[class.nu-loading-fullscreen]': "showLoadingMode() === 'fullscreen'",
  },
})
export class ShowLoadingComponent {
  showLoading = input<boolean>(false);
  showLoadingMode = input<'box' | 'fullscreen'>('box');
}
