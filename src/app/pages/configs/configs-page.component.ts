import { Component, OnInit } from '@angular/core';
import { DefaultHomeLayoutComponent } from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import { UnitMeasureService } from '../../services/unitMerasure.service';
import { ToastrService } from 'ngx-toastr';
import { ItemTypeService } from '../../services/itemType.service';
import { MaterialTypeService } from '../../services/materialType.service';
import { finalize, forkJoin, Observable } from 'rxjs';
import { ConfigsModalComponent } from '../../modals/configs-modal.component/configs-modal.component';

interface BaseEntity {
  id: number;
  name: string;
  description: string;
  active: boolean;
  registeredAt?: string;
  updatedAt?: string;
}

interface UpdateService<UpdateDTO, ResponseDTO> {
  update(id: number, dto: UpdateDTO): Observable<ResponseDTO>;
}

interface CrudService<CreateDTO, UpdateDTO, ResponseDTO> extends UpdateService<UpdateDTO, ResponseDTO> {
  listAll(): Observable<ResponseDTO[]>;
  save(dto: CreateDTO): Observable<ResponseDTO>;
  delete(id: number): Observable<void>;
}

type EntityType = 'unitMeasure' | 'materialType' | 'itemType';

interface EntityConfig<T extends BaseEntity> {
  data: T[];
  isOpen: boolean;
  isModalOpen: boolean;
  columns: ColumnConfig<T>[];
  service: CrudService<any, any, T>;
  labels: {
    singular: string;
    plural: string;
  };
}

@Component({
  selector: 'app-configs',
  imports: [
    DefaultHomeLayoutComponent,
    DefaultTableLayoutComponent,
    ConfigsModalComponent
  ],
  templateUrl: './configs-page.component.html',
  styleUrl: './configs-page.component.scss',
})
export class ConfigsPageComponent implements OnInit {
  isLoading = false;
  selectedItem: BaseEntity | null = null;

  entities!: Record<EntityType, EntityConfig<any>>;

  constructor(
    private toastService: ToastrService,
    private unitMeasureService: UnitMeasureService,
    private materialTypeService: MaterialTypeService,
    private itemTypeService: ItemTypeService
  ) {
    this.initializeEntities();
  }

  private initializeEntities(): void {
    this.entities = {
      unitMeasure: {
        data: [],
        isOpen: false,
        isModalOpen: false,
        columns: this.createCommonColumns(),
        service: this.unitMeasureService,
        labels: {
          singular: 'Unidade de medida',
          plural: 'Unidades de medida'
        }
      },
      materialType: {
        data: [],
        isOpen: false,
        isModalOpen: false,
        columns: this.createCommonColumns(),
        service: this.materialTypeService,
        labels: {
          singular: 'Tipo de material',
          plural: 'Tipos de material'
        }
      },
      itemType: {
        data: [],
        isOpen: false,
        isModalOpen: false,
        columns: this.createCommonColumns(),
        service: this.itemTypeService,
        labels: {
          singular: 'Tipo de item',
          plural: 'Tipos de item'
        }
      }
    };
  }

  private createCommonColumns<T extends BaseEntity>(): ColumnConfig<T>[] {
    return [
      { key: 'id', label: 'ID', searchable: true, filterable: false },
      { key: 'name', label: 'Name', searchable: true, filterable: false },
      { key: 'description', label: 'Descrição', searchable: true, filterable: false },
      { key: 'active', label: 'Ativo', searchable: true, filterable: false, type: 'toggle' },
      { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false, type: 'date' },
      { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false, type: 'date' },
      { key: 'actions', label: 'Ações', type: 'actions' },
    ];
  }

  get unitMeasures() { return this.entities.unitMeasure.data; }
  get materialTypes() { return this.entities.materialType.data; }
  get itemTypes() { return this.entities.itemType.data; }

  get isUnitMeasureOpen() { return this.entities.unitMeasure.isOpen; }
  get isMaterialTypesOpen() { return this.entities.materialType.isOpen; }
  get isItemTypesOpen() { return this.entities.itemType.isOpen; }

  get isModalUnitMeasuresOpen() { return this.entities.unitMeasure.isModalOpen; }
  get isModalMaterialTypesOpen() { return this.entities.materialType.isModalOpen; }
  get isModalItemTypesOpen() { return this.entities.itemType.isModalOpen; }

  get unitMeasureColumns() { return this.entities.unitMeasure.columns; }
  get materialTypeColumns() { return this.entities.materialType.columns; }
  get itemTypeColumns() { return this.entities.itemType.columns; }

  toggleSection(type: EntityType): void {
    this.entities[type].isOpen = !this.entities[type].isOpen;
  }

  openModal(type: EntityType): void {
    this.entities[type].isModalOpen = true;
  }

  closeModal(type: EntityType): void {
    this.entities[type].isModalOpen = false;
  }

  openCreateModal(type: EntityType): void {
    this.selectedItem = null;
    this.openModal(type);
  }

  openUpdateModal(item: BaseEntity, type: EntityType): void {
    this.selectedItem = { ...item };
    this.openModal(type);
  }

  onCloseModal(type: EntityType): void {
    this.selectedItem = null;
    this.closeModal(type);
  }

  toggleUnitMeasureSection() { this.toggleSection('unitMeasure'); }
  toggleMaterialTypesSection() { this.toggleSection('materialType'); }
  toggleItemTypesSection() { this.toggleSection('itemType'); }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;

    forkJoin({
      unitMeasures: this.entities.unitMeasure.service.listAll(),
      materialTypes: this.entities.materialType.service.listAll(),
      itemTypes: this.entities.itemType.service.listAll()
    })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (result) => {
          this.entities.unitMeasure.data = result.unitMeasures;
          this.entities.materialType.data = result.materialTypes;
          this.entities.itemType.data = result.itemTypes;
          console.log('✅ Todos os dados carregados com sucesso');
        },
        error: (err) => {
          this.handleError(err, 'Erro ao carregar dados nas tabelas');
        }
      });
  }

  private handleError(err: any, defaultMessage: string): void {
    console.error('❌ Erro:', err);

    const errorMessages: Record<number, string> = {
      403: 'Você não tem permissão para acessar esta funcionalidade',
      404: 'Recurso não encontrado',
      500: 'Erro no servidor. Tente novamente mais tarde.'
    };

    const message = errorMessages[err.status] || defaultMessage;
    this.toastService.error(message);
  }

  private updateItem<T extends BaseEntity>(
    id: number,
    data: Partial<T>,
    type: EntityType
  ): void {
    this.isLoading = true;

    const entity = this.entities[type];
    const itemRequest = {
      type: data.name,
      description: data.description,
      active: data.active
    };

    entity.service.update(id, itemRequest)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (response: T) => {
          const index = entity.data.findIndex((i: T) => i.id === id);
          if (index !== -1) {
            entity.data[index] = response;
          }
          this.toastService.success(`${entity.labels.singular} atualizada com sucesso!`);
          this.onCloseModal(type);
        },
        error: (error) => {
          this.toastService.error(`Erro ao atualizar ${entity.labels.singular.toLowerCase()}. Tente novamente.`);
        }
      });
  }

  onToggleStatus<T extends BaseEntity>(item: T, type: EntityType): void {
    if (!item.id) return;

    const updatedData = { ...item, active: !item.active };
    this.updateItem(item.id, updatedData, type);
  }

  onUpdate(data: BaseEntity, type: EntityType): void {
    if (!data.id) return;
    this.updateItem(data.id, data, type);
  }

  onDelete(item: BaseEntity, type: EntityType): void {
    if (!item.id) return;

    const entity = this.entities[type];
    this.isLoading = true;

    entity.service.delete(item.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: () => {
          entity.data = entity.data.filter((i: BaseEntity) => i.id !== item.id);
          this.toastService.success(`${entity.labels.singular} excluída com sucesso!`);
          this.loadAllData();
        },
        error: (error) => {
          this.handleError(error, `Erro ao excluir ${entity.labels.singular.toLowerCase()}`);
        }
      });
  }

  onSave(data: Omit<BaseEntity, 'id'>, type: EntityType): void {
    const entity = this.entities[type];
    this.isLoading = true;

    entity.service.save(data)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (response: BaseEntity) => {
          entity.data.push(response);
          this.toastService.success(`${entity.labels.singular} criada com sucesso!`);
          this.onCloseModal(type);
        },
        error: (error) => {
          this.handleError(error, `Erro ao criar ${entity.labels.singular.toLowerCase()}`);
        }
      });
  }
}
