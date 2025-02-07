import { Injectable } from '@angular/core';
import { Trofeo } from '../models/trofeo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrofeosServiceService {
  private API_Trofeos = `https://smash-gallery-back.vercel.app/trofeo`;

  constructor(private http: HttpClient) { }

  getTrofeos(): Observable<any> {
    return this.http.get(this.API_Trofeos);
  }

  getTrofeo(id: string): Observable<any> {
    return this.http.get(`${this.API_Trofeos}/${id}`);
  }

  getTrofeoMayor(id: string): Observable<any> {
    return this.http.get(`${this.API_Trofeos}/mayor/${id}`);
  }

  getTrofeoMenor(id: string): Observable<any> {
    return this.http.get(`${this.API_Trofeos}/menor/${id}`);
  }

  getTrofeosPorSerie(id: string): Observable<any> {
    return this.http.get(`${this.API_Trofeos}/serie/${id}`);
  }
}
