import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Tem certeza que deseja continuar?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() confirmType: 'danger' | 'warning' | 'success' = 'danger';

  @Output() confirmAction = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();

  confirm() {
    this.confirmAction.emit();
  }

  cancel() {
    this.cancelAction.emit();
  }
}
