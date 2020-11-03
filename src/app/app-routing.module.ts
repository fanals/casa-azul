import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  }, {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  }, {
    path: 'restaurant',
    loadChildren: () => import('./pages/restaurant/restaurant.module').then( m => m.RestaurantPageModule)
  }, {
    path: 'table/:id',
    loadChildren: () => import('./pages/table/table.module').then( m => m.TablePageModule)
  }, {
    path: 'employees',
    loadChildren: () => import('./pages/employees/employees.module').then( m => m.EmployeesPageModule)
  }, {
    path: 'waiter-select-table',
    loadChildren: () => import('./pages/waiter/waiter-select-table/waiter-select-table.module').then( m => m.WaiterSelectTablePageModule)
  }, {
    path: 'waiter-select-food',
    loadChildren: () => import('./pages/waiter/waiter-select-food/waiter-select-food.module').then( m => m.WaiterSelectFoodPageModule)
  },
  {
    path: 'console',
    loadChildren: () => import('./pages/console/console.module').then( m => m.ConsolePageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'totaltoday',
    loadChildren: () => import('./pages/totaltoday/totaltoday.module').then( m => m.TotaltodayPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./pages/overview/overview.module').then( m => m.OverviewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
