import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {MaterialResponseDTO} from '../../services/material.service';
import {MaterialTypeResponseDTO, MaterialTypeService} from '../../services/materialType.service';
import {UnitMeasureResponseDTO, UnitMeasureService} from '../../services/unitMeasure.service';

@Component({
  selector: 'app-material-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-modal.component.html',
  styleUrl: './material-modal.component.scss'
})
export class MaterialModalComponent implements OnInit, OnChanges {

  @Input() isOpen = false;
  @Input() material: MaterialResponseDTO | null = null;
  @Input() initialData: any;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form!: FormGroup;
  isEditMode = false;
  displayPrice = '';

  materialTypes: MaterialTypeResponseDTO[] = [];
  unitMeasures: UnitMeasureResponseDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private materialTypeService: MaterialTypeService,
    private unitMeasureService: UnitMeasureService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDropdowns();
  }

  initForm() {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      materialTypeId: ['', Validators.required],
      unitMeasureId: ['', Validators.required],
      currentPrice: ['', Validators.required],
      active: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.isEditMode = !!this.material;

      if (this.isEditMode && this.material) {
        this.fillFormWithMaterial();
      } else {
        this.form.reset({ active: true });
        this.displayPrice = '';
      }
    }
  }

  private fillFormWithMaterial() {
    const price = this.formatToPtBr(this.material!.currentPrice);

    this.form.patchValue({
      description: this.material?.description,

      materialTypeId: this.material?.materialTypeId,
      unitMeasureId: this.material?.unitMeasureId,

      currentPrice: price,
      active: this.material?.active
    });

    this.displayPrice = price;

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsPristine();
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private loadDropdowns() {
    this.materialTypeService.listAll().subscribe({
      next: data => (this.materialTypes = data)
    });

    this.unitMeasureService.listAll().subscribe({
      next: data => (this.unitMeasures = data)
    });
  }

  onClose() {
    this.form.reset();
    this.displayPrice = '';
    this.close.emit();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const priceNumber = this.convertToNumber(formValue.currentPrice);

    const data: any = {
      description: formValue.description,
      materialTypeId: Number(formValue.materialTypeId),
      unitMeasureId: Number(formValue.unitMeasureId),
      currentPrice: priceNumber,
      active: formValue.active
    };

    if (this.isEditMode && this.material?.id) {
      data.id = this.material.id;
    }

    this.save.emit(data);

    this.form.reset();
    this.displayPrice = '';
  }

  private convertToNumber(brValue: string): number {
    if (!brValue) return 0;
    return Number(brValue.replace(/\./g, '').replace(',', '.'));
  }

  formatToPtBr(value: number | string | null): string {
    if (value == null) return '0,00';

    const num = typeof value === 'string'
      ? Number(value)
      : value;

    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let onlyNumbers = input.value.replace(/\D/g, '');

    if (!onlyNumbers) {
      this.displayPrice = '';
      this.form.get('currentPrice')?.setValue('');
      return;
    }

    onlyNumbers = onlyNumbers.padStart(3, '0');

    const integerPart = onlyNumbers.slice(0, onlyNumbers.length - 2);
    const decimalPart = onlyNumbers.slice(onlyNumbers.length - 2);
    const intPartNumber = parseInt(integerPart, 10);

    this.displayPrice = intPartNumber.toLocaleString('pt-BR') + ',' + decimalPart;
    input.value = this.displayPrice;

    const backendValue = Number(`${intPartNumber}.${decimalPart}`);
    this.form.get('currentPrice')?.setValue(this.displayPrice);

    setTimeout(() => {
      input.selectionStart = input.selectionEnd = input.value.length;
    });
  }

  canSubmit(): boolean {
    return this.form.valid;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('minlength')) return 'Mínimo de caracteres não atendido';

    return 'Valor inválido';
  }
}
