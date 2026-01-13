import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserResponseDTO } from "../../services/user.service";
import { CustomerResponseDTO } from '../../services/customer.service';
import { SupplierResponseDTO } from '../../services/supplier.service';

@Component({
  selector: 'app-inputEntity-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inputEntity-modal.component.html',
  styleUrl: './inputEntity-modal.component.scss'
})
export class InputEntityModalComponent implements OnInit, OnChanges {

  @Input() isOpen = false;
  @Input() user: UserResponseDTO | null = null;
  @Input() customer: CustomerResponseDTO | null = null;
  @Input() supplier: SupplierResponseDTO | null = null;
  @Input() isUserProfile = false;
  @Input() entityType!: 'cliente' | 'usuario' | 'fornecedor';
  @Input() initialData: any;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserResponseDTO>();
  @Output() changePassword = new EventEmitter<{ userId: number; currentPassword?: string; newPassword: string }>();

  form!: FormGroup;
  isEditMode = false;

  roles = ['Administrador', 'Gerente', 'Orçamentista', 'Comercial'];
  ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  types = ['Público', 'Corporativo', 'Particular'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.isEditMode = !!this.user || !!this.customer || !!this.supplier;
      this.initForm();

      const source =
        this.entityType === 'usuario' ? this.user :
          this.entityType === 'cliente' ? this.customer :
            this.entityType === 'fornecedor' ? this.supplier :
              null;

      if (source) {
        const withMasks: any = {
          ...source,
          phoneNumber: this.applyPhoneMask((source as any).phoneNumber || ''),
          cnpjCpf: this.applyCnpjCpfMask((source as any).cnpjCpf || '')
        };

        this.form.patchValue(withMasks);

        Object.keys(this.form.controls).forEach(key => {
          const control = this.form.get(key);
          control?.markAsDirty();
          control?.updateValueAndValidity({ emitEvent: false });
        });

        setTimeout(() => {
          this.form.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }, 0);
      }
    }

    if (changes['entityType'] && this.isOpen) {
      this.initForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cnpjCpf: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      uf: ['', Validators.required],
      active: [true]
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });

    // Remove todos os extras antes de adicionar novamente
    ['role', 'currentPassword', 'newPassword', 'confirmPassword', 'contactName', 'customerType']
      .forEach(k => {
        if (this.form.get(k)) this.form.removeControl(k);
      });

    if (this.entityType === 'usuario') {
      this.form.addControl('role', new FormControl('Administrador', Validators.required));
      this.form.addControl('currentPassword', new FormControl(''));
      this.form.addControl('newPassword', new FormControl(''));
      this.form.addControl('confirmPassword', new FormControl(''));
    }

    if (this.entityType === 'cliente') {
      this.form.addControl('contactName', new FormControl('', Validators.required));
      this.form.addControl('customerType', new FormControl('', Validators.required));
    }

    if (this.entityType === 'fornecedor') {
      this.form.addControl('contactName', new FormControl('', Validators.required));
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!newPassword && !confirmPassword) return null;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onClose() {
    this.form.reset();
    this.close.emit();
  }

  onSubmit() {
    const requiredFields = this.getRequiredFields();
    let formIsValid = true;

    for (const field of requiredFields) {
      const control = this.form.get(field);
      if (!control || control.invalid) {
        formIsValid = false;
        control?.markAsTouched();
      }
    }

    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        this.form.get('confirmPassword')?.markAsTouched();
        formIsValid = false;
      }
      if (this.isUserProfile && !this.form.get('currentPassword')?.value) {
        this.form.get('currentPassword')?.markAsTouched();
        formIsValid = false;
      }
    }

    if (!formIsValid) return;

    const formValue = this.form.value;
    const data: any = {
      name: formValue.name,
      cnpjCpf: formValue.cnpjCpf,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      address: formValue.address,
      city: formValue.city,
      uf: formValue.uf,
      active: formValue.active
    };

    if (this.entityType === 'usuario') {
      data.role = formValue.role;
    }

    if (this.entityType === 'cliente') {
      data.contactName = formValue.contactName;
      data.customerType = formValue.customerType;
    }

    if (this.entityType === 'fornecedor') {
      data.contactName = formValue.contactName;
    }

    if (this.isEditMode) {
      const id =
        (this.entityType === 'usuario' && this.user?.id) ||
        (this.entityType === 'cliente' && this.customer?.id) ||
        (this.entityType === 'fornecedor' && this.supplier?.id);

      if (id) data.id = id;
    }

    this.save.emit(data);

    if (this.isEditMode && formValue.newPassword) {
      const userId = this.entityType === 'usuario' && this.user?.id;
      if (userId) {
        this.changePassword.emit({
          userId,
          currentPassword: this.isUserProfile ? formValue.currentPassword : undefined,
          newPassword: formValue.newPassword
        });
      }
    }

    this.form.reset();
  }

  private getRequiredFields(): string[] {
    switch (this.entityType) {
      case 'usuario':
        return ['name', 'cnpjCpf', 'phoneNumber', 'email', 'address', 'city', 'uf', 'role'];
      case 'cliente':
        return ['name', 'cnpjCpf', 'phoneNumber', 'email', 'address', 'city', 'uf', 'contactName', 'customerType'];
      case 'fornecedor':
        return ['name', 'cnpjCpf', 'phoneNumber', 'email', 'address', 'city', 'uf', 'contactName'];
      default:
        return [];
    }
  }

  canSubmit(): boolean {
    const requiredFields = this.getRequiredFields();
    for (const field of requiredFields) {
      const control = this.form.get(field);
      if (!control || control.invalid) return false;
    }

    const newPassword = this.form.get('newPassword')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) return false;
      if (this.isUserProfile && !this.form.get('currentPassword')?.value) return false;
    }

    return true;
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

  applyCnpjCpfMask(cnpjCpf: string): string {
    if (!cnpjCpf) return '';

    let value = cnpjCpf.replace(/\D/g, '');

    if (value.length <= 11) {
      if (value.length > 9) {
        return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        return value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
      } else if (value.length > 3) {
        return value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
      } else {
        return value;
      }
    }

    if (value.length > 14) value = value.slice(0, 14);

    if (value.length > 12) {
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
      return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
      return value.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (value.length > 2) {
      return value.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
    }

    return value;
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const maskedValue = this.applyPhoneMask(input.value);
    input.value = maskedValue;
    this.form.patchValue({ phoneNumber: maskedValue });
  }

  onCnpjCpfInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const maskedValue = this.applyCnpjCpfMask(input.value);
    input.value = maskedValue;
    this.form.patchValue({ cnpjCpf: maskedValue });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasPasswordMismatch(): boolean {
    return !!(this.form.hasError('passwordMismatch') &&
      this.form.get('confirmPassword')?.touched);
  }

  hasCurrentPasswordError(): boolean {
    if (!this.isUserProfile) return false;

    const newPass = this.form.get('newPassword')?.value;
    const curPass = this.form.get('currentPassword')?.value;

    return !!(newPass && !curPass);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('email')) return 'E-mail inválido';
    if (field?.hasError('minlength')) return 'Mínimo de caracteres não atendido';
    if (field?.hasError('pattern')) return 'Formato inválido';
    return '';
  }
}
