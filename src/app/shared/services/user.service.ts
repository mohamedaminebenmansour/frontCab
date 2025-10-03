import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseDto } from '../../models/user-response-dto';
import { UserUpdateDto } from '../../models/user-update-dto';
import { ProfileUpdateDto } from '../../models/profile-update-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/user/current`);  // Assume endpoint; adjust if different
  }

  updateUser(id: string, updateData: UserUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${id}`, updateData);
  }

  updateProfile(profileData: ProfileUpdateDto): Observable<void> {
    const formData = new FormData();
    if (profileData.email) formData.append('Email', profileData.email);
    if (profileData.firstName) formData.append('FirstName', profileData.firstName);
    if (profileData.lastName) formData.append('LastName', profileData.lastName);
    if (profileData.address) formData.append('Address', profileData.address);
    if (profileData.phoneNumber) formData.append('PhoneNumber', profileData.phoneNumber);
    if (profileData.picture) formData.append('Picture', profileData.picture);

    return this.http.put<void>(`${this.apiUrl}/user/profile`, formData);
  }
}