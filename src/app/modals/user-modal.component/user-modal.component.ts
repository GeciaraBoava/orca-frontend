import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface UserResponseDTO {
  id?: number;
  role: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  uf: string;
  active: boolean;
  registeredAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() user: UserResponseDTO | null = null; // null = cadastro, com dados = edição
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserResponseDTO>();

  userForm!: FormGroup;
  isEditMode = false;

  roles = ['Administrador', 'Gerente', 'Orçamentista', 'Comercial'];
  ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isEditMode = !!this.user;
      this.initForm();
      if (this.user) {
        // Aplica a máscara no telefone antes de preencher o formulário
        const userWithMaskedPhone = {
          ...this.user,
          phoneNumber: this.applyPhoneMask(this.user.phoneNumber)
        };
        this.userForm.patchValue(userWithMaskedPhone);
      }
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      role: ['USER', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      uf: ['', Validators.required],
      active: [true],

      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator // Validador customizado
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!newPassword && !confirmPassword) {
      return null;
    }

    if (newPassword && !formGroup.get('currentPassword')?.value) {
      return { currentPasswordRequired: true };
    }

    // Verifica se as senhas coincidem
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onClose() {
    this.userForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      const userData: UserResponseDTO = {
        ...formValue,
        ...(this.isEditMode && this.user ? { id: this.user.id } : {})
      };

      // if (this.isEditMode && formValue.newPassword) {
      //   userData.password = formValue.newPassword;
      //   userData.currentPassword = formValue.currentPassword;
      // }

      this.save.emit(userData);
      this.userForm.reset();
      this.close.emit();
    } else {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  applyPhoneMask(phone: string): string {
    if (!phone) return '';

    let value = phone.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      return value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      return value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      return value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      return value.replace(/^(\d*)/, '($1');
    }

    return value;
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const maskedValue = this.applyPhoneMask(input.value);
    input.value = maskedValue;
    this.userForm.patchValue({ phoneNumber: maskedValue });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('email')) return 'E-mail inválido';
    if (field?.hasError('minlength')) return 'Mínimo de 3 caracteres';
    if (field?.hasError('pattern')) return 'Formato inválido';
    return '';
  }
}
