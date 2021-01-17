import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  fetchProducts(): Observable<any> {
    const path = 'http://localhost:3000/api/products';
    return this.http.get(path);
  }
}
