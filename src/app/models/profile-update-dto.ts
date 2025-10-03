export interface ProfileUpdateDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  picture?: File;  // For file upload
}