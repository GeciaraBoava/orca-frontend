import {Component, OnInit} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {ColumnConfig, DefaultTableLayoutComponent} from '../../components/default-table-layout/default-table-layout.component';
import {ToastrService} from 'ngx-toastr';
import {UserRequestDTO, UserResponseDTO, UserService, UserUpdateRequestDTO} from '../../services/user.service';
import {UserModalComponent} from '../../modals/user-modal.component/user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DefaultHomeLayoutComponent, DefaultTableLayoutComponent, UserModalComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {

  users: UserResponseDTO[] = [];
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  constructor(
    private toastService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
    { key: 'phoneNumber', label: 'Celular', searchable: true, filterable: false },
    { key: 'email', label: 'E-mail', searchable: true, filterable: false },
    { key: 'address', label: 'Endereço', searchable: true, filterable: false },
    { key: 'city', label: 'Cidade', searchable: true, filterable: false },
    { key: 'uf', label: 'UF', searchable: true, filterable: false },
    { key: 'active', label: 'Ativo', searchable: true, filterable: false, type: 'toggle' },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false },
    { key: 'actions', label: 'Editar', type: 'actions' },
  ];

  isModalOpen = false;
  selectedUser: UserResponseDTO | null = null;
  isLoading = false;

  openCreateUserModal() {
    this.selectedUser = null;
    this.isModalOpen = true;
    console.log('📝 Abrindo modal para criar usuário');
  }

  openUpdateUserModal(user: UserResponseDTO) {
    this.selectedUser = { ...user }; // Clone
    this.isModalOpen = true;
    console.log('✏️ Abrindo modal para editar usuário:', user);
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
    console.log('❌ Modal fechado');
  }

  onSaveUser(userData: any) {
    if (this.selectedUser?.id) {
      this.updateUser(this.selectedUser.id, userData);
    } else {
      this.createUser(userData);
    }
  }

  private createUser(userData: any) {
    this.isLoading = true;

    const userRequest: UserRequestDTO = {
      role: userData.role,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      uf: userData.uf
    };

    this.userService.save(userRequest).subscribe({
      next: (response) => {
        console.log('✅ Usuário criado com sucesso:', response);
        this.users = [...this.users, response];
        this.onCloseModal();
        this.isLoading = false;
        this.toastService.success('Usuário criado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao criar usuário:', error);
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
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      uf: userData.uf,
      active: userData.active
    };

    this.userService.update(id, userUpdateRequest).subscribe({
      next: (response) => {
        console.log('✅ Usuário atualizado com sucesso:', response);

        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = response;
        }

        this.onCloseModal();
        this.isLoading = false;
        this.toastService.success('Usuário atualizado com sucesso!');
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar usuário:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao atualizar usuário. Tente novamente.');
      }
    });
  }

  onToggleUserStatus(user: UserResponseDTO) {
    if (!user.id) return;

    this.isLoading = true;

    const updatedStatus = !user.active;

    const userUpdateRequest: UserUpdateRequestDTO = {
      password: '',
      role: user.role,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
      city: user.city,
      uf: user.uf,
      active: updatedStatus
    };

    this.userService.update(user.id, userUpdateRequest).subscribe({
      next: (response) => {
        console.log(`✅ Status do usuário ${updatedStatus ? 'ativado' : 'desativado'} com sucesso:`, response);

        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response;
        }

        this.isLoading = false;
        this.toastService.success(`Usuário ${updatedStatus ? 'ativado' : 'desativado'} com sucesso!`);
      },
      error: (error) => {
        console.error('❌ Erro ao alterar status do usuário:', error);
        this.isLoading = false;
        this.toastService.error('Erro ao alterar status. Tente novamente.');
      }
    });
  }
}
