import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }


  getUsers() {
    return this.http.get<User[]>('http://127.0.0.1:3000/user');
  }

  postUsers(newUser : User |undefined) {
    return this.http.post('http://127.0.0.1:3000/user', newUser);
  }
  
  updateUser(editUser : User) {
    return this.http.put('http://127.0.0.1:3000/user/'+ editUser._id, editUser);
  }
}
