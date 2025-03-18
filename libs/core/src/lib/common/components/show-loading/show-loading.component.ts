import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: '[showLoading]',
  templateUrl: './show-loading.component.html',
  styleUrl: './show-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowLoadingComponent {
  showLoading = input<boolean>(false);
  showLoadingMode = input<'box' | 'fullscreen'>('box');

  @HostBinding('class.scr-loading')
  get hasLoadingStyleClass() {
    return this.showLoading();
  }

  @HostBinding('class.scr-loading-fullscreen')
  get hasFullscreenStyleClass() {
    return this.showLoadingMode() === 'fullscreen';
  }
}
