import {Component, OnInit} from '@angular/core';
import {DefaultHomeLayoutComponent} from '../../components/default-home-layout/default-home-layout.component';
import {
  ColumnConfig,
  DefaultTableLayoutComponent
} from '../../components/default-table-layout/default-table-layout.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RegisterService} from '../../services/register.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserResponseDTO, UserService} from '../../services/user.service';

interface RegisterForm {
  password: FormControl;
  role: FormControl;
  name: FormControl;
  phoneNumber: FormControl;
  email: FormControl;
  address: FormControl;
  city: FormControl;
  uf: FormControl;
}

@Component({
  selector: 'app-users',
  imports: [
    DefaultHomeLayoutComponent,
    ReactiveFormsModule,
    DefaultTableLayoutComponent
  ],
  providers: [
    RegisterService
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  ngOnInit(): void {
    const token = localStorage.getItem("token");

    if (token) {
      // Decodifica o JWT para ver as roles
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Roles do usuário:', payload.roles || payload.authorities);
    }

    this.userService.listAll().subscribe({
      next: (data) => {
        console.log('RECEBIDO DO BACKEND:', data);
        this.users = data;
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

  users: UserResponseDTO[] = [];
  userColumns: ColumnConfig<UserResponseDTO>[] = [
    { key: 'id', label: 'ID', searchable: true, filterable: false },
    { key: 'role', label: 'Permissão', searchable: true, filterable: false },
    { key: 'name', label: 'Nome', searchable: true, filterable: false },
    { key: 'phoneNumber', label: 'Celular', searchable: true, filterable: false },
    { key: 'email', label: 'E-mail', searchable: true, filterable: false },
    { key: 'address', label: 'Endereço', searchable: true, filterable: false },
    { key: 'city', label: 'Cidade', searchable: true, filterable: false },
    { key: 'uf', label: 'UF', searchable: true, filterable: false },
    { key: 'active', label: 'Ativo', searchable: true, filterable: false },
    { key: 'registeredAt', label: 'Data de registro', searchable: true, filterable: false },
    { key: 'updatedAt', label: 'Última atualização', searchable: true, filterable: false },
  ];

  registerForm!: FormGroup<RegisterForm>;

  constructor(
    private router: Router,
    private toastService: ToastrService,
    private userService: UserService
  ) {
    this.registerForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(11)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required, Validators.minLength(6)]),
      city: new FormControl('', [Validators.required, Validators.minLength(3)]),
      uf: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    })
  }

  submit() {
    this.userService.register(
      this.registerForm.value.password,
      this.registerForm.value.role,
      this.registerForm.value.name,
      this.registerForm.value.phoneNumber,
      this.registerForm.value.email,
      this.registerForm.value.address,
      this.registerForm.value.city,
      this.registerForm.value.uf
    ).subscribe({
      next: () => {
        this.toastService.success('Register successfully');
        this.router.navigate(['/users']);
      },
      error: () => this.toastService.error('Register failed.'),
    })
  }
}
