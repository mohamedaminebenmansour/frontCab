import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseDto } from '../../models/user-response-dto';
import { UserCreateDto } from '../../models/user-create-dto';
import { UserUpdateDto } from '../../models/user-update-dto';
import { ProfileUpdateDto } from '../../models/profile-update-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserResponseDto> {
    console.log('Fetching current user...');
    return this.http.get<UserResponseDto>(`${this.apiUrl}/user/current`).pipe(
      tap(user => console.log('Current user fetched:', user)),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(() => error);
      })
    );
  }

  getAllUsers(): Observable<UserResponseDto[]> {
    console.log('Fetching all users...');
    return this.http.get<UserResponseDto[]>(`${this.apiUrl}/user`).pipe(
      tap(users => console.log('Users fetched:', users)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(id: string): Observable<UserResponseDto> {
    console.log('Fetching user by ID:', id);
    return this.http.get<UserResponseDto>(`${this.apiUrl}/user/${id}`).pipe(
      tap(user => console.log('User fetched:', user)),
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(createData: UserCreateDto): Observable<UserResponseDto> {
    console.log('Creating user with data:', createData);
    return this.http.post<UserResponseDto>(`${this.apiUrl}/user`, createData).pipe(
      tap(response => console.log('User created successfully:', response)),
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, updateData: UserUpdateDto): Observable<void> {
    console.log('Updating user with ID:', id, 'data:', updateData);
    return this.http.put<void>(`${this.apiUrl}/user/${id}`, updateData).pipe(
      tap(() => console.log('User updated successfully')),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    console.log('Deleting user with ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`).pipe(
      tap(() => console.log('User deleted successfully')),
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(profileData: ProfileUpdateDto): Observable<void> {
    const formData = new FormData();
    if (profileData.email) formData.append('Email', profileData.email);
    if (profileData.firstName) formData.append('FirstName', profileData.firstName);
    if (profileData.lastName) formData.append('LastName', profileData.lastName);
    if (profileData.address) formData.append('Address', profileData.address);
    if (profileData.phoneNumber) formData.append('PhoneNumber', profileData.phoneNumber);
    if (profileData.picture) formData.append('Picture', profileData.picture);

    console.log('Updating profile with data:', profileData);
    return this.http.put<void>(`${this.apiUrl}/user/profile`, formData).pipe(
      tap(() => console.log('Profile updated successfully')),
      catchError(error => {
        console.error('Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }
}