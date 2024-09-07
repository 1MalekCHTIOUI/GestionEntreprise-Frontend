import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../models/user.model';
import { RoleService } from '../services/role.service';
import { PermissionService } from '../services/permission.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
})
export class ListUsersComponent {
  users: User[] = [];
  permissions: any[] = [];
  selectedPermissions: any[] = [];
  roleName: string = '';

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.getPermissions();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log(users);

        this.users = users;
      },
      error: (error) => {
        console.error(error);
      },
    });
  } // Check if a permission is selected
  isSelected(permission: string): boolean {
    return this.selectedPermissions.includes(permission);
  }

  // Toggle permission selection
  togglePermission(permission: string): void {
    const index = this.selectedPermissions.indexOf(permission);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1); // Deselect permission
    } else {
      this.selectedPermissions.push(permission); // Select permission
    }
  }

  onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getPermissions() {
    this.permissionService.getPermissions().subscribe({
      next: (permissions) => {
        console.log(permissions);
        this.permissions = permissions.data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onCreateRole() {
    const role = {
      name: this.roleName,
      permission: this.selectedPermissions.map((permission) => permission.id),
    };
    console.log(role);

    this.roleService.createRole(role).subscribe({
      next: (role) => {
        console.log(role);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
