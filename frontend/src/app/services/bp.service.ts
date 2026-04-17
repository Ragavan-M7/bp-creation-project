// src/app/services/bp.service.ts
// Centralises all HTTP calls to the backend API
// Injected into components via Angular DI

import { Injectable }       from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable }       from 'rxjs';
import { BusinessPartner, ApiResponse } from '../models/business-partner.model';

@Injectable({ providedIn: 'root' })
export class BpService {

  // Change this if your backend runs on a different port
  private readonly baseUrl = 'http://localhost:3000/api/bp';

  constructor(private http: HttpClient) {}

  // GET /api/bp → returns array of all partners
  getAll(search = '', status = ''): Observable<ApiResponse<BusinessPartner[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<BusinessPartner[]>>(this.baseUrl, { params });
  }

  // GET /api/bp/:id → returns one partner
  getById(id: number): Observable<ApiResponse<BusinessPartner>> {
    return this.http.get<ApiResponse<BusinessPartner>>(`${this.baseUrl}/${id}`);
  }

  // POST /api/bp → creates a new partner
  create(bp: BusinessPartner): Observable<ApiResponse<BusinessPartner>> {
    return this.http.post<ApiResponse<BusinessPartner>>(this.baseUrl, bp);
  }

  // PUT /api/bp/:id → updates existing partner
  update(id: number, bp: BusinessPartner): Observable<ApiResponse<BusinessPartner>> {
    return this.http.put<ApiResponse<BusinessPartner>>(`${this.baseUrl}/${id}`, bp);
  }

  // DELETE /api/bp/:id → removes a partner
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
