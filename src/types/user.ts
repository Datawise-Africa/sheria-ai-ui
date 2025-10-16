export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: string;
  createdAt?: Date;
}
