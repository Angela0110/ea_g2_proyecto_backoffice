import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UsersComponent } from '../users/users.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,  private authService: AuthService) { }

  getAuthTokenHeader(): HttpHeaders {
    const authToken = this.authService.getAuthToken();
    return new HttpHeaders({
      'x-access-token': `${authToken}`
    });
  }

  getUsers(page: Number, limit: Number) {
    return this.http.get<User[]>('http://127.0.0.1:3000/user/'+ page + '/' + limit);
  }

  postUsers(newUser : User |undefined) {
    return this.http.post('http://127.0.0.1:3000/user', newUser);
  }
  
  updateUser(editUser : User) {
    return this.http.put('http://127.0.0.1:3000/user/'+ editUser._id, editUser, { headers: this.getAuthTokenHeader() });
  }
}
