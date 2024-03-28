import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [{
    path: 'posts',
    component: PostComponent
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
