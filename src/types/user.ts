export interface User {
  _id: string;
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  name?: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}
