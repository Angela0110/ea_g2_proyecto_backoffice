import { Component, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../models/user';
import {FormsModule} from '@angular/forms';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe, UserDetailsComponent, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  newUserForm: FormGroup;

  users: User[] = [];
  previous = "<";
  next = ">";
  first_page = true;
  last_page = false;
  user_length = 0;
  page = 0;

  selectedUser?: User;
  userUpdated?: User;
  showAddUserForm: boolean = false;
  isUserSelected: boolean = false;

  constructor( public userService: UserService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      name: this.formBuilder.group({
        first_name: ['', [Validators.required]],
        middle_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]]
      }),
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe (users =>{
      this.users = users;
      console.log(users);
    })
  }
  userLength(): void {
    this.userService.commentLength(this.activity!).subscribe (length =>{
      this.user_length = length;
      if(this.user_length <= (this.page!*5)+5){
        this.last_page = true
      }
    })
  }

  nextPage(): void {
    this.commentLength();
    this.page!++;
    if(this.comment_length <= this.page!*5+5){
      this.last_page = true
    }
    this.first_page = false;
    this.getUser(this.page);
  }

  previousPage(): void{
    this.commentLength();
    this.page!--;
    if(this.page == 0){
      this.first_page = true;
    }
    if(this.comment_length >= this.page!*5+5){
      this.last_page = false;
    }
    this.getUser(this.page);
  }

  getUser(page: any): void{
    this.userService.getUsers().subscribe (users =>{
      console.log(users);
      this.users = users;
    })
  }


  @Output() userSelected = new EventEmitter<boolean>();

  onSelect(user: User): void {
    this.selectedUser = user;
    this.userSelected.emit(true);
  }

  onUserUpdated(user: User): void {
    this.userUpdated = user;
  }

  deselectUser(): void {
    
    if (this.selectedUser && this.userUpdated) {
      const index = this.users.findIndex(user => user._id === this.selectedUser!._id);
      if (index !== -1) {
        this.users[index] = this.userUpdated;
      }
    }
    this.selectedUser = undefined;
    this.userSelected.emit(false); // Emitir false cuando se deselecciona un usuario
  }


  postUser(): void{

    if (this.newUserForm.valid) {
      console.log(this.newUserForm.value)
      this.userService.postUsers(this.newUserForm.value).subscribe((res: any) => {
        console.log("Usuario añadido!!!", res.user);
        this.users.push(res.user);
        this.newUserForm.reset();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario.");
    }
  } 

  showAddUser(state: boolean) {
    this.showAddUserForm = state;
    console.log("Cambio modo edición/lectura", this.showAddUserForm);
  }

  onUserSelected(selected: boolean): void {
    this.isUserSelected = selected;
  }
}
