import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-default-cards-layout',
  imports: [],
  templateUrl: './default-cards-layout.component.html',
  styleUrl: './default-cards-layout.component.scss',
})
export class DefaultCardsLayoutComponent {
  @Input() tipoCadastro: string = "";
  @Input() total: number = 0;
  @Input() active: number = 0;
  @Input() inactive: number = 0;
}
