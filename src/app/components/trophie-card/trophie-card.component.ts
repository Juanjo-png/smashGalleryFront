import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-trophie-card',
  standalone: true,
  imports: [],
  templateUrl: './trophie-card.component.html',
  styleUrl: './trophie-card.component.css'
})
export class TrophieCardComponent {
  @Input() name: string = 'Trofeo';
  @Input() imagePath: string = '../../../assets/images/previews/1.png';
  seleccionar = new Audio("../../../assets/Seleccionar.wav");

  @HostListener('mouseenter')
  playsoundeffect():void{
    this.seleccionar.currentTime = 0;
    this.seleccionar.play();
  }
}
