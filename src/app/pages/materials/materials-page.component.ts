import {Component, OnInit} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import {ToastrService} from 'ngx-toastr';
import {
  MaterialRequestDTO,
  MaterialResponseDTO,
  MaterialService,
  MaterialUpdateDTO
} from '../../services/material.service';
import {ConfirmModalComponent} from '../../modals/confirm-modal.component/confirm-modal.component';
import {MaterialModalComponent} from '../../modals/material-modal.component/material-modal.component';
import {DefaultCardsLayoutComponent} from '../../components/default-cards-layout/default-cards-layout.component';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [DefaultHomeLayoutComponent, DefaultTableLayoutComponent, ConfirmModalComponent, MaterialModalComponent, DefaultCardsLayoutComponent],
  templateUrl: './materials-page.component.html',
  styleUrl: './materials-page.component.scss',
})
export class MaterialsPageComponent implements OnInit {

  materials: MaterialResponseDTO[] = [];
  totalMaterials: number = 0;
  activeMaterials: number = 0;
  inactiveMaterials: number = 0;
  tipoCadastro: string = "Materiais";

  isModalOpen = false;
  isModalConfirmOpen = false;
  selectedMaterial: MaterialResponseDTO | null = null;
  isLoading = false;
  lastFormData: any = null;

  constructor(
    private toastService: ToastrService,
    private materialService: MaterialService,
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  private loadMaterials(): void {
    this.materialService.listAll().subscribe({
      next: (data) => {
        console.log('Materiais carregados:', data);
        this.materials = data;
        this.totalMaterials = data.length;
        this.activeMaterials = data.filter(u => u.active).length;
        this.inactiveMaterials = data.filter(u => !u.active).length;
      },
      error: (error) => {
        console.error('Erro completo:', error);
        if (error.status === 403) {
          this.toastService.error('Você não tem permissão para acessar esta funcionalidade');
        } else {
          this.toastService.error('Erro ao carregar materiais');
        }
      }
    });
  }

  materialColumns: ColumnConfig<MaterialResponseDTO>[] = [
    { key: 'id', label: 'ID', searchable: true, filterable: false },
    { key: 'description', label: 'Descrição', searchable: true, filterable: false },
    { key: 'materialTypeDescription', label: 'Tipo de material', searchable: true, filterable: false },
    { key: 'unitMeasureDescription', label: 'Unidade de medida', searchable: true, filterable: false },
    { key: 'currentPrice', label: 'Preço atual', searchable: true, filterable: false },
    { key: 'active', label: 'Ativo', searchable: true, filterable: false, type: 'toggle' },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false, type: 'date' },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false, type: 'date' },
    { key: 'actions', label: 'Ações', type: 'actions' },
  ];

  openCreateMaterialModal() {
    this.selectedMaterial = null;
    this.isModalOpen = true;
  }

  openUpdateMaterialModal(material: MaterialResponseDTO) {
    this.selectedMaterial = { ...material }; // Clone
    this.isModalOpen = true;
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedMaterial = null;
  }

  onSaveMaterial(materialData: any) {
    this.lastFormData = materialData;

    if (this.selectedMaterial?.id) {
      this.updateMaterial(this.selectedMaterial.id, materialData);
    } else {
      this.createMaterial(materialData);
    }

    this.loadMaterials();
  }

  private createMaterial(materialData: any) {
    this.isLoading = true;

    const materialRequest: MaterialRequestDTO = {
      description: materialData.description,
      materialTypeId: materialData.materialTypeId,
      unitMeasureId: materialData.unitMeasureId,
      currentPrice: materialData.currentPrice
    };

    this.materialService.save(materialRequest).subscribe({
      next: (response) => {
        this.materials = [...this.materials, response];
        this.toastService.success('Material cadastrado com sucesso!');
        this.isLoading = false;
        this.onCloseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Erro ao cadastrar material. Tente novamente.');
      }
    });
  }

  private updateMaterial(id: number, materialData: any) {
    this.isLoading = true;

    const materialUpdateRequest: MaterialUpdateDTO = {
      description: materialData.description,
      materialTypeId: materialData.materialTypeId,
      unitMeasureId: materialData.unitMeasureId,
      currentPrice: materialData.currentPrice,
      active: materialData.active
    };

    this.materialService.update(id, materialUpdateRequest).subscribe({
      next: (response) => {
        const index = this.materials.findIndex(u => u.id === id);
        if (index !== -1) { this.materials[index] = response; }
        this.toastService.success('Cadastro de material atualizado com sucesso!');
        this.isLoading = false;
        this.onCloseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Erro ao atualizar cadastro de material. Tente novamente.');
      }
    });

    this.loadMaterials();
  }

  onToggleMaterialStatus(material: MaterialResponseDTO) {
    if (!material.id) return;

    this.isLoading = true;
    this.updateMaterial(material.id, { ...material, active: !material.active });

    this.loadMaterials();
  }

  onDeleteMaterial(material: MaterialResponseDTO) {
    this.selectedMaterial = material;
    this.isModalConfirmOpen = true;
    this.loadMaterials();
  }

  onConfirmDelete() {
    if (!this.selectedMaterial?.id) {return;}

    this.isLoading = true;
    this.isModalConfirmOpen = false;

    this.materialService.delete(this.selectedMaterial.id).subscribe({
      next: () => {
        this.materials = this.materials.filter(u => u.id !== this.selectedMaterial?.id);
        this.toastService.success('Material deletado com sucesso!');
        this.selectedMaterial = null;
        this.isLoading = false;
        this.onCloseConfirmDelete();
      },
      error: () => {
        this.isLoading = false;
        this.selectedMaterial = null;
        this.toastService.error('Erro ao deletar material. Tente novamente.');
      }
    });

    this.loadMaterials();
  }

  onCancelDelete() {
    this.isModalConfirmOpen = false;
    this.selectedMaterial = null;
  }

  onCloseConfirmDelete() {
    this.isModalConfirmOpen = false;
    this.selectedMaterial = null;
  }

}
