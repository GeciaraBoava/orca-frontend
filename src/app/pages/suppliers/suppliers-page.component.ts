import {Component, OnInit} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import {ToastrService} from 'ngx-toastr';
import {
  SupplierRequestDTO,
  SupplierResponseDTO, SupplierService,
  SupplierUpdateDTO
} from '../../services/supplier.service';
import {EntityModalComponent} from '../../modals/entity-modal.component/entity-modal.component';
import {ConfirmModalComponent} from '../../modals/confirm-modal.component/confirm-modal.component';
import {
  DefaultCardsLayoutComponent
} from '../../components/default-cards-layout/default-cards-layout.component';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [DefaultHomeLayoutComponent, DefaultTableLayoutComponent, EntityModalComponent, ConfirmModalComponent, DefaultCardsLayoutComponent],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.scss',
})
export class SuppliersPageComponent implements OnInit {

  suppliers: SupplierResponseDTO[] = [];
  totalSuppliers: number = 0;
  activeSuppliers: number = 0;
  inactiveSuppliers: number = 0;
  tipoCadastro: string = "Fornecedores";

  isModalOpen = false;
  isModalConfirmOpen = false;
  selectedSupplier: SupplierResponseDTO | null = null;
  isLoading = false;

  constructor(
    private toastService: ToastrService,
    private supplierService: SupplierService,
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.listAll().subscribe({
      next: (data) => {
        console.log('Cadastros de clientes carregados:', data);
        this.suppliers = data;
        this.totalSuppliers = data.length;
        this.activeSuppliers = data.filter(u => u.active).length;
        this.inactiveSuppliers = data.filter(u => !u.active).length;
      },
      error: (error) => {
        console.error('Erro completo:', error);
        if (error.status === 403) {
          this.toastService.error('Você não tem permissão para acessar esta funcionalidade');
        } else {
          this.toastService.error('Erro ao carregar cadastro de clientes');
        }
      }
    });
  }

  suppliersColumns: ColumnConfig<SupplierResponseDTO>[] = [
    { key: 'id', label: 'ID', searchable: true, filterable: false },
    { key: 'name', label: 'Nome', searchable: true, filterable: false },
    { key: 'cnpjCpf', label: 'CNPJ / CPF', searchable: true, filterable: false },
    { key: 'phoneNumber', label: 'Celular', searchable: true, filterable: false },
    { key: 'contactName', label: 'Nome do Contato', searchable: true, filterable: false },
    { key: 'email', label: 'E-mail', searchable: true, filterable: false },
    { key: 'address', label: 'Endereço', searchable: true, filterable: false },
    { key: 'city', label: 'Cidade', searchable: true, filterable: false },
    { key: 'uf', label: 'UF', searchable: true, filterable: false },
    { key: 'active', label: 'Ativo', searchable: true, filterable: false, type: 'toggle' },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false, type: 'date' },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false, type: 'date' },
    { key: 'actions', label: 'Ações', type: 'actions' },
  ];

  openCreateSupplierModal() {
    this.selectedSupplier = null;
    this.isModalOpen = true;
    console.log('📝 Abrindo modal para criar usuário');
  }

  openUpdateSupplierModal(supplier: SupplierResponseDTO) {
    this.selectedSupplier = { ...supplier }; // Clone
    this.isModalOpen = true;
    console.log('✏️ Abrindo modal para editar usuário:', supplier);
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedSupplier = null;
    console.log('❌ Modal fechado');
  }

  onSaveSupplier(supplierData: any) {
    if (this.selectedSupplier?.id) {
      this.updateSupplier(this.selectedSupplier.id, supplierData);
    } else {
      this.createSupplier(supplierData);
    }

    this.loadSuppliers();
  }

  private createSupplier(supplierData: any) {
    this.isLoading = true;

    const supplierRequest: SupplierRequestDTO = {
      name: supplierData.name,
      cnpjCpf: supplierData.cnpjCpf,
      phoneNumber: supplierData.phoneNumber,
      contactName: supplierData.contactName,
      email: supplierData.email,
      address: supplierData.address,
      city: supplierData.city,
      uf: supplierData.uf
    };

    this.supplierService.save(supplierRequest).subscribe({
      next: (response) => {
        console.log('✅ Cliente cadastrado com sucesso:', response);
        this.suppliers = [...this.suppliers, response];
        this.onCloseModal();
        this.isLoading = false;
        this.toastService.success('Cliente cadastrado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao cadastrar cliente:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao cadastrar cliente. Tente novamente.');
      }
    });
  }

  private updateSupplier(id: number, supplierData: any) {
    this.isLoading = true;

    const supplierUpdateRequest: SupplierUpdateDTO = {
      name: supplierData.name,
      cnpjCpf: supplierData.cnpjCpf,
      phoneNumber: supplierData.phoneNumber,
      contactName: supplierData.contactName,
      email: supplierData.email,
      address: supplierData.address,
      city: supplierData.city,
      uf: supplierData.uf,
      active: supplierData.active
    };

    this.supplierService.update(id, supplierUpdateRequest).subscribe({
      next: (response) => {
        console.log('✅ Cadastro de cliente atualizado com sucesso:', response);

        const index = this.suppliers.findIndex(u => u.id === id);
        if (index !== -1) {
          this.suppliers[index] = response;
        }

        this.onCloseModal();
        this.isLoading = false;
        this.toastService.success('Cadastro de cliente atualizado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar cadastro de cliente:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao atualizar cadastro de cliente. Tente novamente.');
      }
    });

    this.loadSuppliers();
  }

  onToggleSupplierStatus(supplier: SupplierResponseDTO) {
    if (!supplier.id) return;

    this.isLoading = true;
    this.updateSupplier(supplier.id, {...supplier, active: !supplier.active});

    this.loadSuppliers();
  }

  //DELETE
  onDeleteSupplier(supplier: SupplierResponseDTO) {
    this.selectedSupplier = supplier;
    this.isModalConfirmOpen = true;
  }

  onConfirmDelete() {
    if (!this.selectedSupplier?.id) {return;}

    this.isLoading = true;
    this.isModalConfirmOpen = false;

    this.supplierService.delete(this.selectedSupplier.id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(u => u.id !== this.selectedSupplier?.id);
        this.toastService.success('Cadastro de Fornecedor deletado com sucesso!');
        this.selectedSupplier = null;
        this.isLoading = false;
        this.onCloseConfirmDelete();
      },
      error: () => {
        this.isLoading = false;
        this.selectedSupplier = null;
        this.toastService.error('Erro ao deletar cadastro de Fornecedor. Tente novamente.');
      }
    });

    this.loadSuppliers();
  }

  onCancelDelete() {
    this.isModalConfirmOpen = false;
    this.selectedSupplier = null;
  }

  onCloseConfirmDelete() {
    this.isModalConfirmOpen = false;
    this.selectedSupplier = null;
  }
}
