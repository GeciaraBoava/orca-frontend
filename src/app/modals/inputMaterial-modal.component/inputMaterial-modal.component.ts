import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserResponseDTO} from "../../services/user.service";

import {MaterialResponseDTO} from '../../services/material.service';
import {MaterialTypeResponseDTO, MaterialTypeService} from '../../services/materialType.service';
import {UnitMeasureResponseDTO, UnitMeasureService} from '../../services/unitMerasure.service';

@Component({
  selector: 'app-inputMaterial-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inputMaterial-modal.component.html',
  styleUrl: './inputMaterial-modal.component.scss'
})
export class InputMaterialModalComponent implements OnInit, OnChanges {

  @Input() isOpen = false;
  @Input() material: MaterialResponseDTO | null = null;
  @Input() initialData: any;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserResponseDTO>();

  form!: FormGroup;
  isEditMode = false;
  displayPrice = '';

  materialTypes: MaterialTypeResponseDTO[] = [];
  unitMeasures: UnitMeasureResponseDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private materialTypeService: MaterialTypeService,
    private unitmeasureService: UnitMeasureService
  ) {}

  ngOnInit() {
    this.initForm();

    if (this.initialData) {
      this.form.patchValue(this.initialData);

      const currentPrice = this.initialData.currentPrice;
      if (currentPrice != null) {
        const [integer, decimal] = currentPrice.toString().split('.');
        const intPart = parseInt(integer, 10).toLocaleString('pt-BR');
        const decPart = decimal?.padEnd(2, '0') ?? '00';
        this.displayPrice = `${intPart},${decPart}`;

        this.form.get('currentPrice')?.setValue(currentPrice);
      }
    }

    this.materialTypeService.listAll().subscribe({
      next: data => { this.materialTypes = data; },
    });
    this.unitmeasureService.listAll().subscribe({
      next: data => { this.unitMeasures = data; },
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.initForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      materialTypeId: ['', Validators.required],
      unitMeasureId: ['', Validators.required],
      currentPrice: ['', Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      active: [true]
    });
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

    if (!formIsValid) return;

    const formValue = this.form.value;
    const data: any = {
      description: formValue.description,
      materialTypeId: formValue.materialTypeId,
      unitMeasureId: formValue.unitMeasureId,
      currentPrice: formValue.currentPrice,
      active: formValue.active
    };

    this.save.emit(data);
    this.form.reset();
  }

  private getRequiredFields(): string[] {
    return ['description', 'materialTypeId', 'unitMeasureId', 'currentPrice'];
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;

    let onlyNumbers = input.value.replace(/\D/g, '');

    if (!onlyNumbers) {
      this.displayPrice = '';
      this.form.get('currentPrice')?.setValue(null);
      return;
    }

    onlyNumbers = onlyNumbers.padStart(3, '0');

    const integerPart = onlyNumbers.slice(0, onlyNumbers.length - 2);
    const decimalPart = onlyNumbers.slice(onlyNumbers.length - 2);
    const intPartNumber = parseInt(integerPart, 10);

    this.displayPrice = intPartNumber.toLocaleString('pt-BR') + ',' + decimalPart;
    input.value = this.displayPrice;

    const backendValue = intPartNumber + '.' + decimalPart;
    this.form.get('currentPrice')?.setValue(backendValue);

    this.form.get('currentPrice')?.markAsDirty();
    this.form.get('currentPrice')?.markAsTouched();

    setTimeout(() => {
      input.selectionStart = input.selectionEnd = input.value.length;
    });
  }


  canSubmit(): boolean {
    const requiredFields = this.getRequiredFields();
    for (const field of requiredFields) {
      const control = this.form.get(field);
      if (!control || control.invalid) return false;
    }

    return true;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('email')) return 'E-mail inválido';
    if (field?.hasError('minlength')) return 'Mínimo de caracteres não atendido';
    if (field?.hasError('pattern')) return 'Formato inválido';
    if (field?.hasError('currentPrice')) return 'Formato de valor inválido';
    return '';
  }
}
