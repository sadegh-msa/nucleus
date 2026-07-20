import { Component, input } from '@angular/core';

@Component({
  selector: '[loading]',
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  host: {
    '[class.nu-loading]': 'loading()',
    '[class.nu-loading-fullscreen]': "loadingMode() === 'fullscreen'",
  },
})
export class UiLoading {
  loading = input<boolean>(false);
  loadingMode = input<'box' | 'fullscreen'>('box');
}
