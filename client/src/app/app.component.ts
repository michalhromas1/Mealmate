import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  products: Observable<any>;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.products = this.apiService.fetchProducts();
  }
}
