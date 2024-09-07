import { UserService } from './../services/user.service';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../models/role.model';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  userForm!: FormGroup;
  rolesArray: Role[] = [];
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      role: [''],
    });
  }

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchUser();
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

  fetchUser() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.userService.getUser(id).subscribe({
      next: (user: any) => {
        console.log(user);
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          password: null,
          role: user.roles[0].name,
        });
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
    const id = this.activatedRoute.snapshot.params['id'];

    // this.userForm.value.role = this.userForm.value.role
    //   .map((role: any) => role.name)
    //   .join('');
    console.log(this.userForm.value);
    const formData = new FormData();
    for (const key in this.userForm.value) {
      if (this.userForm.value.hasOwnProperty(key)) {
        formData.append(key, this.userForm.value[key]);
      }
    }

    this.userService.updateUser(id, formData).subscribe({
      next: (user) => {
        console.log(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
