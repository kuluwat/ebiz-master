import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screen/login/login.component';
import { EbizhomeComponent } from './master/ebizhome/ebizhome.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,pathMatch: "full"
  },
  // {
  //   path: '/home',
  //   component: EbizhomeComponent,pathMatch: "full"
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
