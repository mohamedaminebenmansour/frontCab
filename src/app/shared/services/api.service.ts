import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  EWM_Aturized_Status,
  EWM_Parck_DisplayGroupe,
  EWM_StorageBinType,
  EWM_StorageBin_Groupe,
  EWM_StorageType,
  EWM_StorageType_Rules,
  EWM_StorageBin,
  EWM_StorageBin_Rules,
  EWM_StorageBin_Details,
  HandlingUnit,
  StockMovement
} from '../../models'; // Create an index.ts in models folder to export all

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5117/api'; // Replace with your ASP.NET API base URL

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error(`Error Code: ${error.status}\nMessage: ${error.message}`));
  }

  // EWM_Aturized_Status CRUD (Fixed inconsistent update URL)
  getAturizedStatuses(): Observable<EWM_Aturized_Status[]> {
    return this.http.get<EWM_Aturized_Status[]>(`${this.apiUrl}/EWMAturizedStatus`)
      .pipe(catchError(this.handleError));
  }
  getAturizedStatus(id: number): Observable<EWM_Aturized_Status> {
    return this.http.get<EWM_Aturized_Status>(`${this.apiUrl}/EWMAturizedStatus/${id}`)
      .pipe(catchError(this.handleError));
  }
  createAturizedStatus(status: EWM_Aturized_Status): Observable<EWM_Aturized_Status> {
    return this.http.post<EWM_Aturized_Status>(`${this.apiUrl}/EWMAturizedStatus`, status, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateAturizedStatus(id: number, status: EWM_Aturized_Status): Observable<EWM_Aturized_Status> {
    return this.http.put<EWM_Aturized_Status>(`${this.apiUrl}/EWMAturizedStatus/${id}`, status, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteAturizedStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/EWMAturizedStatus/${id}`)
      .pipe(catchError(this.handleError));
  }

  // EWM_Parck_DisplayGroupe CRUD (Added EWM_ prefix for consistency)
  getParckDisplayGroupes(): Observable<EWM_Parck_DisplayGroupe[]> {
    return this.http.get<EWM_Parck_DisplayGroupe[]>(`${this.apiUrl}/ParckDisplayGroupe`)
      .pipe(
        tap(data => console.log('API response - getParckDisplayGroupes:', data)),
        catchError(this.handleError)
      );
  }
  getParckDisplayGroupe(id: number): Observable<EWM_Parck_DisplayGroupe> {
    return this.http.get<EWM_Parck_DisplayGroupe>(`${this.apiUrl}/ParckDisplayGroupe/${id}`)
      .pipe(
        tap(data => console.log('API response - getParckDisplayGroupe:', data)),
        catchError(this.handleError)
      );
  }
  createParckDisplayGroupe(groupe: EWM_Parck_DisplayGroupe): Observable<EWM_Parck_DisplayGroupe> {
    return this.http.post<EWM_Parck_DisplayGroupe>(`${this.apiUrl}/ParckDisplayGroupe`, groupe, this.httpOptions)
      .pipe(
        tap(created => console.log('API response - createParckDisplayGroupe:', created)),
        catchError(this.handleError)
      );
  }
  updateParckDisplayGroupe(id: number, groupe: EWM_Parck_DisplayGroupe): Observable<EWM_Parck_DisplayGroupe> {
    return this.http.put<EWM_Parck_DisplayGroupe>(`${this.apiUrl}/ParckDisplayGroupe/${id}`, groupe, this.httpOptions)
      .pipe(
        tap(updated => console.log('API response - updateParckDisplayGroupe:', updated)),
        catchError(this.handleError)
      );
  }
  deleteParckDisplayGroupe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ParckDisplayGroupe/${id}`)
      .pipe(
        tap(() => console.log('API response - deleteParckDisplayGroupe successful for ID:', id)),
        catchError(this.handleError)
      );
  }

  // EWM_StorageBinType CRUD
  getStorageBinTypes(): Observable<EWM_StorageBinType[]> {
    return this.http.get<EWM_StorageBinType[]>(`${this.apiUrl}/StorageBinType`)
      .pipe(catchError(this.handleError));
  }
  getStorageBinType(id: number): Observable<EWM_StorageBinType> {
    return this.http.get<EWM_StorageBinType>(`${this.apiUrl}/StorageBinType/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageBinType(type: EWM_StorageBinType): Observable<EWM_StorageBinType> {
    return this.http.post<EWM_StorageBinType>(`${this.apiUrl}/StorageBinType`, type, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageBinType(id: number, type: EWM_StorageBinType): Observable<EWM_StorageBinType> {
    return this.http.put<EWM_StorageBinType>(`${this.apiUrl}/StorageBinType/${id}`, type, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageBinType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StorageBinType/${id}`)
      .pipe(catchError(this.handleError));
  }

  // EWM_StorageBin_Groupe CRUD (Added EWM_ for consistency)
  getStorageBinGroupes(): Observable<EWM_StorageBin_Groupe[]> {
    return this.http.get<EWM_StorageBin_Groupe[]>(`${this.apiUrl}/EWM_StorageBin_Groupe`)
      .pipe(catchError(this.handleError));
  }
  getStorageBinGroupe(id: number): Observable<EWM_StorageBin_Groupe> {
    return this.http.get<EWM_StorageBin_Groupe>(`${this.apiUrl}/EWM_StorageBin_Groupe/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageBinGroupe(groupe: EWM_StorageBin_Groupe): Observable<EWM_StorageBin_Groupe> {
    return this.http.post<EWM_StorageBin_Groupe>(`${this.apiUrl}/EWM_StorageBin_Groupe`, groupe, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageBinGroupe(id: number, groupe: EWM_StorageBin_Groupe): Observable<EWM_StorageBin_Groupe> {
    return this.http.put<EWM_StorageBin_Groupe>(`${this.apiUrl}/EWM_StorageBin_Groupe/${id}`, groupe, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageBinGroupe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/EWM_StorageBin_Groupe/${id}`)
      .pipe(catchError(this.handleError));
  }

  // EWM_StorageType CRUD (Added EWM_ for consistency)
getStorageTypes(): Observable<EWM_StorageType[]> {
    return this.http.get<EWM_StorageType[]>(`${this.apiUrl}/StorageType`)
      .pipe(
        tap(data => console.log('API response - getStorageTypes:', data)),
        catchError(this.handleError)
      );
  }

  getStorageType(id: number): Observable<EWM_StorageType> {
    return this.http.get<EWM_StorageType>(`${this.apiUrl}/StorageType/${id}`)
      .pipe(
        tap(data => console.log('API response - getStorageType:', data)),
        catchError(this.handleError)
      );
  }

  createStorageType(type: EWM_StorageType): Observable<EWM_StorageType> {
    return this.http.post<EWM_StorageType>(`${this.apiUrl}/StorageType`, type, this.httpOptions)
      .pipe(
        tap(created => console.log('API response - createStorageType:', created)),
        catchError(this.handleError)
      );
  }

  updateStorageType(id: number, type: EWM_StorageType): Observable<EWM_StorageType> {
    return this.http.put<EWM_StorageType>(`${this.apiUrl}/StorageType/${id}`, type, this.httpOptions)
      .pipe(
        tap(updated => console.log('API response - updateStorageType:', updated)),
        catchError(this.handleError)
      );
  }

  deleteStorageType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StorageType/${id}`)
      .pipe(
        tap(() => console.log('API response - deleteStorageType successful for ID:', id)),
        catchError(this.handleError)
      );
  }

  getAturizedStatusesFromStorageType(): Observable<EWM_Aturized_Status[]> {
    return this.http.get<EWM_Aturized_Status[]>(`${this.apiUrl}/EWMAturizedStatus`)
      .pipe(
        tap(data => console.log('API response - getAturizedStatuses:', data)),
        catchError(this.handleError)
      );
  }


  // EWM_StorageType_Rules CRUD (Added EWM_ for consistency)
  getStorageTypeRules(): Observable<EWM_StorageType_Rules[]> {
    return this.http.get<EWM_StorageType_Rules[]>(`${this.apiUrl}/StorageTypeRules`)
      .pipe(catchError(this.handleError));
  }
  getStorageTypeRule(id: number): Observable<EWM_StorageType_Rules> {
    return this.http.get<EWM_StorageType_Rules>(`${this.apiUrl}/StorageTypeRules/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageTypeRule(rule: EWM_StorageType_Rules): Observable<EWM_StorageType_Rules> {
    return this.http.post<EWM_StorageType_Rules>(`${this.apiUrl}/StorageTypeRules`, rule, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageTypeRule(id: number, rule: EWM_StorageType_Rules): Observable<EWM_StorageType_Rules> {
    return this.http.put<EWM_StorageType_Rules>(`${this.apiUrl}/StorageTypeRules/${id}`, rule, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageTypeRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StorageTypeRules/${id}`)
      .pipe(catchError(this.handleError));
  }

  // EWM_StorageBin CRUD (Added EWM_ for consistency)
  getStorageBins(): Observable<EWM_StorageBin[]> {
    return this.http.get<EWM_StorageBin[]>(`${this.apiUrl}/EWM_StorageBin`)
      .pipe(catchError(this.handleError));
  }
  getStorageBin(id: number): Observable<EWM_StorageBin> {
    return this.http.get<EWM_StorageBin>(`${this.apiUrl}/EWM_StorageBin/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageBin(bin: EWM_StorageBin): Observable<EWM_StorageBin> {
    return this.http.post<EWM_StorageBin>(`${this.apiUrl}/EWM_StorageBin`, bin, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageBin(id: number, bin: EWM_StorageBin): Observable<EWM_StorageBin> {
    return this.http.put<EWM_StorageBin>(`${this.apiUrl}/EWM_StorageBin/${id}`, bin, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageBin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/EWM_StorageBin/${id}`)
      .pipe(catchError(this.handleError));
  }
  assignHandlingUnitToBin(binId: number, unitId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/EWM_StorageBin/${binId}/handlingunits/${unitId}`, {}, this.httpOptions)
    .pipe(catchError(this.handleError));
}


  // EWM_StorageBin_Rules CRUD (Added EWM_ for consistency)
  getStorageBinRules(): Observable<EWM_StorageBin_Rules[]> {
    return this.http.get<EWM_StorageBin_Rules[]>(`${this.apiUrl}/StorageBinRules`)
      .pipe(catchError(this.handleError));
  }
  getStorageBinRule(id: number): Observable<EWM_StorageBin_Rules> {
    return this.http.get<EWM_StorageBin_Rules>(`${this.apiUrl}/StorageBinRules/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageBinRule(rule: EWM_StorageBin_Rules): Observable<EWM_StorageBin_Rules> {
    return this.http.post<EWM_StorageBin_Rules>(`${this.apiUrl}/StorageBinRules`, rule, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageBinRule(id: number, rule: EWM_StorageBin_Rules): Observable<EWM_StorageBin_Rules> {
    return this.http.put<EWM_StorageBin_Rules>(`${this.apiUrl}/StorageBinRules/${id}`, rule, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageBinRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StorageBinRules/${id}`)
      .pipe(catchError(this.handleError));
  }

  // EWM_StorageBin_Details CRUD (Added EWM_ for consistency)
  getStorageBinDetails(): Observable<EWM_StorageBin_Details[]> {
    return this.http.get<EWM_StorageBin_Details[]>(`${this.apiUrl}/StorageBinDetails`)
      .pipe(catchError(this.handleError));
  }
  getStorageBinDetail(id: number): Observable<EWM_StorageBin_Details> {
    return this.http.get<EWM_StorageBin_Details>(`${this.apiUrl}/StorageBinDetails/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStorageBinDetail(detail: EWM_StorageBin_Details): Observable<EWM_StorageBin_Details> {
    return this.http.post<EWM_StorageBin_Details>(`${this.apiUrl}/StorageBinDetails`, detail, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStorageBinDetail(id: number, detail: EWM_StorageBin_Details): Observable<EWM_StorageBin_Details> {
    return this.http.put<EWM_StorageBin_Details>(`${this.apiUrl}/StorageBinDetails/${id}`, detail, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStorageBinDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StorageBinDetails/${id}`)
      .pipe(catchError(this.handleError));
  }

  // HandlingUnit CRUD
  getHandlingUnits(): Observable<HandlingUnit[]> {
    return this.http.get<HandlingUnit[]>(`${this.apiUrl}/HandlingUnit`)
      .pipe(catchError(this.handleError));
  }
  getHandlingUnit(id: number): Observable<HandlingUnit> {
    return this.http.get<HandlingUnit>(`${this.apiUrl}/HandlingUnit/${id}`)
      .pipe(catchError(this.handleError));
  }
  createHandlingUnit(unit: HandlingUnit): Observable<HandlingUnit> {
    return this.http.post<HandlingUnit>(`${this.apiUrl}/HandlingUnit`, unit, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateHandlingUnit(id: number, unit: HandlingUnit): Observable<HandlingUnit> {
    return this.http.put<HandlingUnit>(`${this.apiUrl}/HandlingUnit/${id}`, unit, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteHandlingUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/HandlingUnit/${id}`)
      .pipe(catchError(this.handleError));
  }

  // StockMovement CRUD
  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}/StockMovement`)
      .pipe(catchError(this.handleError));
  }
  getStockMovement(id: number): Observable<StockMovement> {
    return this.http.get<StockMovement>(`${this.apiUrl}/StockMovement/${id}`)
      .pipe(catchError(this.handleError));
  }
  createStockMovement(movement: StockMovement): Observable<StockMovement> {
    return this.http.post<StockMovement>(`${this.apiUrl}/StockMovement`, movement, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateStockMovement(id: number, movement: StockMovement): Observable<StockMovement> {
    return this.http.put<StockMovement>(`${this.apiUrl}/StockMovement/${id}`, movement, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  deleteStockMovement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/StockMovement/${id}`)
      .pipe(catchError(this.handleError));
  }
}