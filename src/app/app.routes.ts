import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home/:id',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'trophie/:id',
        loadComponent: () => import('./components/trophie-page/trophie-page.component').then(m => m.TrophiePageComponent)
    },
    {
        path:'',
        redirectTo: '/home/1',
        pathMatch: 'full'
    },
    {
        path:'**',
        redirectTo: '/home',
        pathMatch: 'full'
     },
];
