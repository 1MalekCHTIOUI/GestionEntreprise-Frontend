import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../models/role.model';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  userForm!: FormGroup;
  rolesArray: Role[] = [];
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.fetchRoles();
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  fetchRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles: any[]) => {
        console.log(roles);

        this.rolesArray = roles.map((role) => role.name);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onRoleSelect(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    if (selectedIndex === 0) return;

    const selectedRole = this.rolesArray[selectedIndex - 1];

    if (selectedRole) {
      this.userForm.patchValue({ role: selectedRole });
    }
  }

  onSubmit() {
    console.log(this.userForm.value);

    this.userService.createUser(this.userForm.value).subscribe({
      next: (user) => {
        console.log(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
