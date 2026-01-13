import {Component, OnInit, Output} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import {InputEntityModalComponent} from '../../modals/inputEntity-modal.component/inputEntity-modal.component';
import {ConfirmModalComponent} from '../../modals/confirm-modal.component/confirm-modal.component';
import {ToastrService} from 'ngx-toastr';
import {
  CustomerRequestDTO,
  CustomerResponseDTO,
  CustomerService,
  CustomerUpdateRequestDTO
} from '../../services/customer.service';
import {
  DefaultCardsLayoutComponent
} from '../../components/default-cards-layout/default-cards-layout.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    DefaultHomeLayoutComponent,
    DefaultTableLayoutComponent,
    InputEntityModalComponent,
    ConfirmModalComponent,
    DefaultCardsLayoutComponent
  ],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss',
})
export class CustomersPageComponent implements OnInit {
  totalCustomers: number = 0;
  activeCustomers: number = 0;
  inactiveCustomers: number = 0;
  tipoCadastro: string = "Clientes";

  customers: CustomerResponseDTO[] = [];

  isModalOpen = false;
  isModalConfirmOpen = false;
  selectedCustomer: CustomerResponseDTO | null = null;
  isLoading = false;

  constructor(
    private toastService: ToastrService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.listAll().subscribe({
      next: (data) => {
        console.log('Cadastros de clientes carregados:', data);
        this.customers = data;
        this.totalCustomers = data.length;
        this.activeCustomers = data.filter(u => u.active).length;
        this.inactiveCustomers = data.filter(u => !u.active).length;
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

  customersColumns: ColumnConfig<CustomerResponseDTO>[] = [
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
    { key: 'customerType', label: 'Tipo', searchable: true, filterable: false },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false, type: 'date' },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false, type: 'date' },
    { key: 'actions', label: 'Ações', type: 'actions' },
  ];

  openCreateCustomerModal() {
    this.selectedCustomer = null;
    this.isModalOpen = true;
    console.log('📝 Abrindo modal para criar usuário');
  }

  openUpdateCustomerModal(customer: CustomerResponseDTO) {
    this.selectedCustomer = { ...customer }; // Clone
    this.isModalOpen = true;
    console.log('✏️ Abrindo modal para editar usuário:', customer);
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedCustomer = null;
    console.log('❌ Modal fechado');
  }

  onSaveCustomer(customerData: any) {
    if (this.selectedCustomer?.id) {
      this.updateCustomer(this.selectedCustomer.id, customerData);
    } else {
      this.createCustomer(customerData);
    }
  }

  private createCustomer(customerData: any) {
    this.isLoading = true;

    const customerRequest: CustomerRequestDTO = {
      name: customerData.name,
      cnpjCpf: customerData.cnpjCpf,
      phoneNumber: customerData.phoneNumber,
      contactName: customerData.contactName,
      email: customerData.email,
      address: customerData.address,
      city: customerData.city,
      uf: customerData.uf,
      customerType: customerData.customerType
    };

    this.customerService.save(customerRequest).subscribe({
      next: (response) => {
        console.log('✅ Cliente cadastrado com sucesso:', response);
        this.customers = [...this.customers, response];
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

  private updateCustomer(id: number, customerData: any) {
    this.isLoading = true;

    const customerUpdateRequest: CustomerUpdateRequestDTO = {
      name: customerData.name,
      cnpjCpf: customerData.cnpjCpf,
      phoneNumber: customerData.phoneNumber,
      contactName: customerData.contactName,
      email: customerData.email,
      address: customerData.address,
      city: customerData.city,
      uf: customerData.uf,
      customerType: customerData.customerType,
      active: customerData.active
    };

    this.customerService.update(id, customerUpdateRequest).subscribe({
      next: (response) => {
        console.log('✅ Cadastro de cliente atualizado com sucesso:', response);

        const index = this.customers.findIndex(u => u.id === id);
        if (index !== -1) {
          this.customers[index] = response;
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
  }

  onToggleCustomerStatus(customer: CustomerResponseDTO) {
    if (!customer.id) return;

    this.isLoading = true;
    this.updateCustomer(customer.id, {...customer, active: !customer.active});

    this.loadCustomers();
  }

  //DELETE
  onDeleteCustomer(customer: CustomerResponseDTO) {
    this.selectedCustomer = customer;
    this.isModalConfirmOpen = true;
  }

  onConfirmDelete() {
    if (!this.selectedCustomer?.id) {return;}

    this.isLoading = true;
    this.isModalConfirmOpen = false;

    this.customerService.delete(this.selectedCustomer.id).subscribe({
      next: () => {
        this.customers = this.customers.filter(u => u.id !== this.selectedCustomer?.id);
        this.toastService.success('Cadastro de Fornecedor deletado com sucesso!');
        this.selectedCustomer = null;
        this.isLoading = false;
        this.onCloseConfirmDelete();
      },
      error: () => {
        this.isLoading = false;
        this.selectedCustomer = null;
        this.toastService.error('Erro ao deletar cadastro de Fornecedor. Tente novamente.');
      }
    });

    this.loadCustomers();
  }

  onCancelDelete() {
    this.isModalConfirmOpen = false;
    this.selectedCustomer = null;
  }

  onCloseConfirmDelete() {
    this.isModalConfirmOpen = false;
    this.selectedCustomer = null;
  }
}
