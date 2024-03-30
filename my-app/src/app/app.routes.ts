import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [{
    path: 'activities',
    component: ActivityComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
 
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

export class AppRoutingModule { };
