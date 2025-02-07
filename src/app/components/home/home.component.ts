import { Component, inject, OnInit } from '@angular/core';
import { TrophieCardComponent } from '../trophie-card/trophie-card.component';
import { TrofeosServiceService } from '../../services/trofeos-service.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Trofeo } from '../../models/trofeo.model';
import { SeriesServiceService } from '../../services/series-service.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TrophieCardComponent, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private trofeosService = inject(TrofeosServiceService);
  private seriesService = inject(SeriesServiceService);
  private route = inject(ActivatedRoute);
  trofeos: Trofeo[] = [];
  idSerie: string | null = null;
  numeroSerie: number | null = null;
  nombreSerie: string | null = null
  escoger = new Audio("../../../assets/Escoger.wav");
  musica: HTMLAudioElement;
  musicaActiva: boolean = false;

  constructor(private router: Router){
    if (!(window as any).musicaGlobal) {
      (window as any).musicaGlobal = new Audio('assets/MusicaFondo.mp3'); // Ruta correcta
      (window as any).musicaGlobal.loop = true;
    }

    this.musica = (window as any).musicaGlobal;
  }

  toggleMusica() {
    this.musicaActiva = !this.musicaActiva;
    
    if (this.musicaActiva) {
      this.escoger.currentTime = 0;
      this.escoger.play()
      this.musica.play();
      localStorage.setItem('musicaFondo', 'si');
    } else {
      this.escoger.currentTime = 0;
      this.escoger.play()
      this.musica.pause();
      localStorage.setItem('musicaFondo', 'no');
    }
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const musicaFondo = localStorage.getItem('musicaFondo');
      this.musicaActiva = musicaFondo === 'si';
  
      if (this.musicaActiva) {
        this.musica.play();
      }
  
      this.idSerie = this.route.snapshot.paramMap.get('id');
      console.log(this.idSerie);
      if (this.idSerie) {
        this.numeroSerie = parseInt(this.idSerie)
        this.trofeosService.getTrofeosPorSerie(this.idSerie).subscribe((data:any) =>{
          this.trofeos = data;
        })
        this.seriesService.getSerie(this.idSerie).subscribe((data:any) =>{
          this.nombreSerie = data.nombre;
        })
      }
    })
  }

  next(): void {
    if (this.idSerie) {
      this.seriesService.getSerieMayor(this.idSerie).subscribe((serie) => {
        this.router.navigate([`/home/${serie.id}`]);
        console.log(serie.id);
        this.escoger.currentTime = 0;
        this.escoger.play()
      });
    }
  }
  
  back(): void {
    if (this.idSerie) {
      this.seriesService.getSerieMenor(this.idSerie).subscribe((serie) => {
        this.router.navigate([`/home/${serie.id}`]);
        this.escoger.currentTime = 0;
        this.escoger.play()
      });
    }
  }

  
}
