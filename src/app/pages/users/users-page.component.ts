import {Component, OnInit} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import {ToastrService} from 'ngx-toastr';
import {UserRequestDTO, UserResponseDTO, UserService, UserUpdateRequestDTO} from '../../services/user.service';
import {InputEntityModalComponent} from '../../modals/inputEntity-modal.component/inputEntity-modal.component';
import {ConfirmModalComponent} from '../../modals/confirm-modal.component/confirm-modal.component';
import {
  DefaultCardsLayoutComponent
} from '../../components/default-cards-layout/default-cards-layout.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DefaultHomeLayoutComponent, DefaultTableLayoutComponent, InputEntityModalComponent, ConfirmModalComponent, DefaultCardsLayoutComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {

  users: UserResponseDTO[] = [];
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;
  tipoCadastro: string = "Usuários";

  isModalOpen = false;
  isModalConfirmOpen = false;
  selectedUser: UserResponseDTO | null = null;
  isLoading = false;
  lastFormData: any = null;

  constructor(
    private toastService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.listAll().subscribe({
      next: (data) => {
        console.log('Usuários carregados:', data);
        this.users = data;
        this.totalUsers = data.length;
        this.activeUsers = data.filter(u => u.active).length;
        this.inactiveUsers = data.filter(u => !u.active).length;
      },
      error: (error) => {
        console.error('Erro completo:', error);
        if (error.status === 403) {
          this.toastService.error('Você não tem permissão para acessar esta funcionalidade');
        } else {
          this.toastService.error('Erro ao carregar usuários');
        }
      }
    });
  }

  userColumns: ColumnConfig<UserResponseDTO>[] = [
    { key: 'id', label: 'ID', searchable: true, filterable: false },
    { key: 'role', label: 'Permissão', searchable: true, filterable: false },
    { key: 'name', label: 'Nome', searchable: true, filterable: false },
    { key: 'cnpjCpf', label: 'CNPJ / CPF', searchable: true, filterable: false },
    { key: 'phoneNumber', label: 'Celular', searchable: true, filterable: false },
    { key: 'email', label: 'E-mail', searchable: true, filterable: false },
    { key: 'address', label: 'Endereço', searchable: true, filterable: false },
    { key: 'city', label: 'Cidade', searchable: true, filterable: false },
    { key: 'uf', label: 'UF', searchable: true, filterable: false },
    { key: 'active', label: 'Ativo', searchable: true, filterable: false, type: 'toggle' },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false, type: 'date' },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false, type: 'date'  },
    { key: 'actions', label: 'Ações', type: 'actions' },
  ];

  openCreateUserModal() {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openUpdateUserModal(user: UserResponseDTO) {
    this.selectedUser = { ...user }; // Clone
    this.isModalOpen = true;
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  onSaveUser(userData: any) {
    this.lastFormData = userData;

    if (this.selectedUser?.id) {
      this.updateUser(this.selectedUser.id, userData);
    } else {
      this.createUser(userData);
    }

    this.loadUsers();
  }

  private createUser(userData: any) {
    this.isLoading = true;

    const userRequest: UserRequestDTO = {
      role: userData.role,
      name: userData.name,
      cnpjCpf: userData.cnpjCpf,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      uf: userData.uf
    };

    this.userService.save(userRequest).subscribe({
      next: (response) => {
        this.users = [...this.users, response];
        this.toastService.success('Usuário criado com sucesso!');
        this.isLoading = false;
        this.onCloseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Erro ao criar usuário. Tente novamente.');
      }
    });
  }

  private updateUser(id: number, userData: any) {
    this.isLoading = true;

    const userUpdateRequest: UserUpdateRequestDTO = {
      password: '',
      role: userData.role,
      name: userData.name,
      cnpjCpf: userData.cnpjCpf,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      uf: userData.uf,
      active: userData.active
    };

    this.userService.update(id, userUpdateRequest).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) { this.users[index] = response; }
        this.toastService.success('Usuário atualizado com sucesso!');
        this.isLoading = false;
        this.onCloseModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Erro ao atualizar usuário. Tente novamente.');
      }
    });

    this.loadUsers();
  }

  onToggleUserStatus(user: UserResponseDTO) {
    if (!user.id) return;

    this.isLoading = true;
    this.updateUser(user.id, { ...user, active: !user.active });

    this.loadUsers();
  }

  onChangePassword(data: { userId: number; currentPassword?: string; newPassword: string }) {
    this.isLoading = true;

    this.userService.updatePassword(data.userId, data.newPassword).subscribe({
      next: () => {
        console.log('✅ Senha alterada com sucesso');
        this.isLoading = false;
        this.toastService.success('Senha alterada com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao alterar senha:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao alterar senha. Tente novamente.');
      }
    });
  }

  //DELETE
  onDeleteUser(user: UserResponseDTO) {
    this.selectedUser = user;
    this.isModalConfirmOpen = true;
    this.loadUsers();
  }

  onConfirmDelete() {
    if (!this.selectedUser?.id) {return;}

    this.isLoading = true;
    this.isModalConfirmOpen = false;

    this.userService.delete(this.selectedUser.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.selectedUser?.id);
        this.toastService.success('Usuário deletado com sucesso!');
        this.selectedUser = null;
        this.isLoading = false;
        this.onCloseConfirmDelete();
      },
      error: () => {
        this.isLoading = false;
        this.selectedUser = null;
        this.toastService.error('Erro ao deletar usuário. Tente novamente.');
      }
    });

    this.loadUsers();
  }

  onCancelDelete() {
    this.isModalConfirmOpen = false;
    this.selectedUser = null;
  }

  onCloseConfirmDelete() {
    this.isModalConfirmOpen = false;
    this.selectedUser = null;
  }

}
