import { Injectable } from '@angular/core';
import { Juego } from '../models/juego.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JuegosServiceService {
  private API_Juegos = `https://smash-gallery-back.vercel.app/juego`;

  constructor(private http: HttpClient) { }

  getJuegos(): Observable<any> {
    return this.http.get(this.API_Juegos);
  }

  getJuego(id: string): Observable<any> {
    return this.http.get(`${this.API_Juegos}/${id}`);
  }
}
