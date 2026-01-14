import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {UnitMeasureResponseDTO} from '../../services/unitMeasure.service';
import {MaterialTypeResponseDTO} from '../../services/materialType.service';
import {ItemTypeResponseDTO} from '../../services/itemType.service';

interface BaseResponseDTO {
  id: number;
  name: string;
  description: string;
  active: boolean;
  registeredAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-configs-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configs-modal.component.html',
  styleUrl: './configs-modal.component.scss'
})
export class ConfigsModalComponent implements OnInit, OnChanges {

  @Input() isOpen = false;
  @Input() unitMeasure: UnitMeasureResponseDTO | null = null;
  @Input() materialType: MaterialTypeResponseDTO | null = null;
  @Input() itemType: ItemTypeResponseDTO | null = null;
  @Input() entityType!: 'unitMeasure' | 'materialType' | 'itemType';
  @Input() label!: string;
  @Input() initialData: any;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<BaseResponseDTO>();

  form!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.isEditMode = !!this.unitMeasure || !!this.materialType || !!this.itemType;
      this.initForm();

      const source =
        this.entityType === 'unitMeasure' ? this.unitMeasure :
          this.entityType === 'materialType' ? this.materialType :
            this.entityType === 'itemType' ? this.itemType :
              null;

      if (changes['entityType'] && this.isOpen) {
        this.initForm();
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
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
      name: formValue.name,
      description: formValue.description,
      active: formValue.active
    };

    if (this.isEditMode) {
      const id =
        (this.entityType === 'unitMeasure' && this.unitMeasure?.id) ||
        (this.entityType === 'materialType' && this.materialType?.id) ||
        (this.entityType === 'itemType' && this.itemType?.id);

      if (id) data.id = id;
    }

    this.save.emit(data);

    this.form.reset();
  }

  private getRequiredFields(): string[] {
    return ['name', 'description'];
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
    if (field?.hasError('minlength')) return 'Mínimo de caracteres não atendido';
    if (field?.hasError('pattern')) return 'Formato inválido';
    return '';
  }
}
