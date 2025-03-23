import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'nu-auth',
  templateUrl: './auth.component.html',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}
