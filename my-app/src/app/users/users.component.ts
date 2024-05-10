import { Component, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../models/user';
import {FormsModule} from '@angular/forms';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe} from '@angular/common';
import { NgxPaginationModule, PaginatePipe, PaginationControlsComponent, PaginationControlsDirective, PaginationService,PaginatePipeArgs,Page, PaginationInstance,PipeState, } from 'ngx-pagination';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe, UserDetailsComponent, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
@Input() totalUsers:any;
@Input()currentPage:any;
@Input()limit:any=2;
@Input()total:any;
  @Output()
  pageChange!: EventEmitter<number>;
totalPages:any;


  newUserForm: FormGroup;
  users: User[] = [];
  user:any;
 

  count:number=0;
  page: number=1 ;
  limitUsers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Limit to 10 users
  

  selectedUser?: User;
  userUpdated?: User;
  showAddUserForm: boolean = false;
  isUserSelected: boolean = false;

  constructor( public userService: UserService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
    this.userService.getUsers(this.page, this.limit).subscribe (users =>{
      console.log("users",users);
    this.user=users;
    this.totalPages=this.user.totalPages;
    this.total=this.user.totalUser;
    this.users=this.user.users
   
    })
  }

  handlePageChange(event: number): void {
    console.log(this.count);
    this.page = event;
    console.log(this.page);
    this.ngOnInit();
  }

  handleLimitChange(event: any): void {
    this.limit = event.target.value;
    this.page = 1;
    this.ngOnInit();
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
