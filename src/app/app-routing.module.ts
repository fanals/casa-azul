import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '',
    redirectTo: 'restaurant',
    pathMatch: 'full'
  }, {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  }, {
    path: 'restaurant',
    loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
