import { Injectable } from '@angular/core';
import { Juego } from '../models/juego.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeriesServiceService {
  private API_Juegos = `https://smash-gallery-back.vercel.app/serie`;

  constructor(private http: HttpClient) { }

  getSeries(): Observable<any> {
    return this.http.get(this.API_Juegos);
  }

  getSerie(id: string): Observable<any> {
    return this.http.get(`${this.API_Juegos}/${id}`);
  }

  getSerieMayor(id: string): Observable<any> {
    return this.http.get(`${this.API_Juegos}/mayor/${id}`);
  }

  getSerieMenor(id: string): Observable<any> {
    return this.http.get(`${this.API_Juegos}/menor/${id}`);
  }
}
