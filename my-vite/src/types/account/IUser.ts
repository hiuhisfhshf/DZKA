export interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  image_small?: string | null;
  image_medium?: string | null;
  image_large?: string | null;
}

export interface IUserCreatePayload {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  image?: File;
}

export interface IUserUpdatePayload {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  image?: File | null;
}


