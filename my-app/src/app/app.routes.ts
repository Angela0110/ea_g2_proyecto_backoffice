import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [{
    path: 'activities',
    component: ActivityComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

export class AppRoutingModule { };
