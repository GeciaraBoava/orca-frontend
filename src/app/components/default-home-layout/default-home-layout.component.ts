import {Component, HostListener, Input, input} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {UserResponseDTO, UserService, UserUpdateRequestDTO} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {EntityModalComponent} from '../../modals/entity-modal.component/entity-modal.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-default-home-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    EntityModalComponent
  ],
  templateUrl: './default-home-layout.component.html',
  styleUrl: './default-home-layout.component.scss',
})
export class DefaultHomeLayoutComponent {
  user!: UserResponseDTO;

  @Input() pageTitle = "";

  protected readonly name = sessionStorage.getItem('name');
  protected readonly role = sessionStorage.getItem('role');
  protected readonly username = sessionStorage.getItem('username');

  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastrService,
    private userService: UserService
    ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('mouseenter')
  onEnter() {
    document.body.classList.add('sidebar-hover');
  }

  @HostListener('mouseleave')
  onLeave() {
    document.body.classList.remove('sidebar-hover');
  }

  isModalOpen = false;
  selectedUser: UserResponseDTO | null = null;
  isLoading = false;

  openUpdateUserModal() {
    const username = sessionStorage.getItem('username');

    if (!username) {
      console.error("Nenhum username encontrado no sessionStorage");
      return;
    }

    this.isLoading = true;

    this.userService.find(username).subscribe({
      next: (response) => {
        this.selectedUser = { ...response };  // clone
        this.isModalOpen = true;
        this.isLoading = false;
        console.log('✏️ Abrindo modal para editar usuário:', this.user);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Erro ao buscar usuário:", err);
      }
    });
  }

  onCloseModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
    console.log('❌ Modal fechado');
  }

  onSaveUser(userData: any) {
    if (this.selectedUser?.id) {
      this.updateUser(this.selectedUser.id, userData);
    }
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
        console.log('✅ Usuário atualizado com sucesso:', response);
        this.user = response;

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

}
