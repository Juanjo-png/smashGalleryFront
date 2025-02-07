import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener, inject } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Trofeo } from '../../models/trofeo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TrofeosServiceService } from '../../services/trofeos-service.service';
import { Juego } from '../../models/juego.model';
import { JuegosServiceService } from '../../services/juegos-service.service';
import { SeriesServiceService } from '../../services/series-service.service';
import { Serie } from '../../models/serie.model';

@Component({
  selector: 'app-trophie-page',
  standalone: true,
  imports: [],
  templateUrl: './trophie-page.component.html',
  styleUrl: './trophie-page.component.css'
})
export class TrophiePageComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef; 
  private model: THREE.Object3D | undefined; 
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationId!: number;
  //Trofeo
  trofeo: Trofeo | null = null; // Inicializa como null
  private trofeosService = inject(TrofeosServiceService);
  private juegosService = inject(JuegosServiceService);
  private seriesService = inject(SeriesServiceService);
  private route = inject(ActivatedRoute);
  juego1: Juego | null = null;
  juego2: Juego | null = null;
  idTrofeo: string | null = null;
  numeroTrofeo: number | null = null;
  serie: Serie | null = null;
  nombreSerie: string | undefined = undefined;
  escoger = new Audio("../../../assets/Escoger.wav");

  constructor(private router: Router){
  }

  next(): void {
    if (this.trofeo?.id) {
      this.trofeosService.getTrofeoMayor(this.trofeo.id).subscribe((trofeo) => {
        if (trofeo) {
          this.router.navigate([`/trophie/${trofeo.id}`]);
          this.escoger.currentTime = 0;
          this.escoger.play()
        }
      });
    }
  }
  
  back(): void {
    if (this.trofeo?.id) {
      this.trofeosService.getTrofeoMenor(this.trofeo.id).subscribe((trofeo) => {
        if (trofeo) {
          this.router.navigate([`/trophie/${trofeo.id}`]);
          this.escoger.currentTime = 0;
          this.escoger.play()
        }
      });
    }
  }

  returnHome(): void {
    if (this.serie) {
      this.escoger.currentTime = 0;
      this.escoger.play()
      this.router.navigate([`/home/${this.serie.id}`]);
    }
  }

  ngOnInit() {
    // Escuchar cambios en la URL para actualizar el trofeo
    this.route.paramMap.subscribe(params => {
      this.idTrofeo = params.get('id');
      if (this.idTrofeo) {
        this.numeroTrofeo = parseInt(this.idTrofeo);
        this.cargarTrofeo();
      }
    });
  
    this.initScene(); 
    this.animate();
  }
  
  private cargarTrofeo(): void {
    if (!this.idTrofeo) return;
  
    this.trofeosService.getTrofeo(this.idTrofeo).subscribe((trofeo: any) => {
      this.trofeo = trofeo;
      console.log(trofeo);
  
      if (this.trofeo) {
        this.juegosService.getJuego(this.trofeo.juego).subscribe((juego: any) => {
          this.juego1 = juego;
          console.log(this.juego1);
        });
  
        if (this.trofeo.juego2) {
          this.juegosService.getJuego(this.trofeo.juego2).subscribe((juego: any) => {
            this.juego2 = juego;
            console.log(this.juego2);
          });
        }
  
        this.seriesService.getSerie(this.trofeo.serie).subscribe((data: any) => {
          this.serie = data;
          this.nombreSerie = this.serie?.nombre.replace(/\s+/g, "");
          console.log(this.nombreSerie);
          this.loadModel(); // Cargar el modelo cuando cambia el trofeo
        });
      }
    });
  }  

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId); // Detener el bucle de animación
    this.renderer.dispose(); // Limpiar el renderizador
  }

  private initScene(): void {
    const container = this.container.nativeElement;

    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Controles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    // Ajustar el tamaño al redimensionar la ventana
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private loadModel(): void {
    if (!this.trofeo || !this.trofeo.obj || !this.trofeo.mtl) {
      console.error("Error: Los archivos del modelo no están definidos.");
      return;
    }

  // 🧹 Eliminar el modelo anterior antes de cargar uno nuevo
  if (this.model) {
    this.scene.remove(this.model);
    this.model.traverse((child) => {
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
      if ((child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(mat => mat.dispose()); // ✅ Aquí TypeScript ya sabe que es un array
        } else {
          material.dispose(); // ✅ Si no es array, se descarta normalmente
        }
      }
    });
    this.model = undefined; // Resetear modelo anterior
  }

    const safeNombre = this.trofeo.nombre.replace(/\s+/g, "");
    const modelPath = `../../../assets/models/${this.nombreSerie}/${safeNombre}/`;
    console.log(modelPath);
    const objFile = this.trofeo.obj;
    const mtlFile = this.trofeo.mtl;
  
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(modelPath);
    mtlLoader.load(mtlFile, (materials) => {
      materials.preload();
  
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(modelPath);
      objLoader.load(objFile, (object) => {
        this.scene.add(object);
        this.model = object;
  
        // Ajuste de la cámara
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);
  
        const maxDimension = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxDimension * 1.14;
        this.camera.position.set(center.x, center.y - 1, center.z + cameraDistance);
        this.camera.lookAt(center);
        this.controls.update();
  
        // Configura OrbitControls
        this.controls.enableRotate = true;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
      });
    });
  }
  

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.controls.update(); // Necesario si usas OrbitControls
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const container = this.container.nativeElement;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}
