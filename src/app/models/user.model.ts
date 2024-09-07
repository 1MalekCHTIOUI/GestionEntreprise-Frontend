export interface User {
  id: number;
  name: string;
  email: string;
  roles: any[];
}

interface Role {
  id: number;
  name: string;
}
