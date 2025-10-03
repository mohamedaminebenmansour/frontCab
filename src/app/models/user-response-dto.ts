export interface UserResponseDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  profilePicture: string;
  isConnected: boolean;
  createdAt: Date;
  lastUpdated: Date | null;
  roles: string[];
}