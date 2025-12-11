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
  @Input() isUserProfile = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserResponseDTO>();
  @Output() changePassword = new EventEmitter<{ userId: number; currentPassword?: string; newPassword: string }>();

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
        const userWithMaskedPhone = {
          ...this.user,
          phoneNumber: this.applyPhoneMask(this.user.phoneNumber)
        };
        this.userForm.patchValue(userWithMaskedPhone);

        this.userForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
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
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!newPassword && !confirmPassword) { return null; }

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onClose() {
    this.userForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.isEditMode && this.isUserProfile) {
      const newPassword = this.userForm.get('newPassword')?.value;
      const currentPassword = this.userForm.get('currentPassword')?.value;

      if (newPassword && !currentPassword) {
        this.userForm.get('currentPassword')?.markAsTouched();
        return;
      }
    }

    const newPassword = this.userForm.get('newPassword')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;

    if (newPassword && newPassword !== confirmPassword) {
      this.userForm.get('confirmPassword')?.markAsTouched();
      return;
    }

    const mainFieldsValid = this.userForm.get('name')?.valid &&
      this.userForm.get('email')?.valid &&
      this.userForm.get('phoneNumber')?.valid &&
      this.userForm.get('address')?.valid &&
      this.userForm.get('city')?.valid &&
      this.userForm.get('uf')?.valid &&
      this.userForm.get('role')?.valid;

    if (mainFieldsValid) {
      const formValue = this.userForm.value;

      const userData: any = {
        role: formValue.role,
        name: formValue.name,
        phoneNumber: formValue.phoneNumber,
        email: formValue.email,
        address: formValue.address,
        city: formValue.city,
        uf: formValue.uf,
        active: formValue.active,
        ...(this.isEditMode && this.user ? { id: this.user.id } : {})
      };

      this.save.emit(userData);

      if (this.isEditMode && this.user?.id && formValue.newPassword) {
        this.changePassword.emit({
          userId: this.user.id,
          currentPassword: this.isUserProfile ? formValue.currentPassword : undefined,
          newPassword: formValue.newPassword
        });
      }

      this.userForm.reset();
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

  hasPasswordMismatch(): boolean {
    return this.userForm.hasError('passwordMismatch') &&
      this.userForm.get('confirmPassword')?.touched || false;
  }

  hasCurrentPasswordError(): boolean {
    return this.userForm.hasError('currentPasswordRequired') &&
      this.userForm.get('newPassword')?.touched || false;
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
