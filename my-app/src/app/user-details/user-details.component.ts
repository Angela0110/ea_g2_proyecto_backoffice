import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';;
import { User } from '../models/user';
import { Post } from '../models/post';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, PostDetailsComponent, ReactiveFormsModule],
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  @Input() user?: User;
  @Output() deselect = new EventEmitter<void>();
  @Output() showPostDetails = new EventEmitter<Post>();
  @Output() userUpdated = new EventEmitter<User>();
  @Output() postSelected = new EventEmitter<boolean>();

  editUserForm: FormGroup;
  selectedPost?: Post;
  postUpdated?: Post;


  posts: Post[] = [];

  editUser: User=   {  '_id': '',
  'name': {
   'first_name': '',
   'middle_name':'',
   'last_name': '',
 },
 'email':'@gmail.com',
 'phone_number':'',
 'gender':''
};


constructor(public userService: UserService, public postService: PostService, private formBuilder: FormBuilder) {
  this.editUserForm = this.formBuilder.group({
    name: this.formBuilder.group({
      first_name: ['', [Validators.required]],
      middle_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]]
    }),
    email: ['', [Validators.required, Validators.email]],
    phone_number: ['', [Validators.required]],
    gender: ['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

public updateFormWithUserData(user: User): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editUserForm.patchValue({
    name: {
      first_name: user.name.first_name,
      middle_name: user.name.middle_name,
      last_name: user.name.last_name
    },
    email: user.email,
    phone_number: user.phone_number,
    gender: user.gender
  });
}

  update: boolean= false;
  isPostSelected: boolean = false;

  ngOnInit() {
    if (this.user) {
      this.updateFormWithUserData(this.user);
    } 
    
    this.posts = this.user?.posts ?? [];
  }
 
  onPostUpdated(post: Post): void {
    this.postUpdated = post;
  }

  showPost(post: Post): void {
    this.showPostDetails.emit(post);
  }

  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateUser(): void {

    const formData = this.editUserForm.value;
    this.editUser = {
      _id: this.user?._id!, // Usamos el _id del usuario actual
      name: {
        first_name: formData.name.first_name,
        middle_name: formData.name.middle_name,
        last_name: formData.name.last_name
      },
      email: formData.email,
      phone_number: formData.phone_number,
      gender: formData.gender
    };

    this.userService.updateUser(this.editUser).subscribe (editUser =>{
      this.user =   {
        '_id': this.editUser?._id!,
      'name': {
       'first_name': this.editUser?.name.first_name!,
       'middle_name': this.editUser?.name.middle_name!,
       'last_name': this.editUser?.name.last_name!,
     },
     'email':this.editUser?.email!,
     'phone_number':this.editUser?.phone_number!,
     'gender': this.editUser?.gender! 
    } 
      this.userUpdated.emit(this.editUser);
    });
  }

  onSelect(post: Post): void {
    this.selectedPost = post;
    this.isPostSelected = true;
    this.postSelected.emit(true);
  }

  deselectPost(): void {
    if (this.selectedPost && this.postUpdated) {
      const index = this.posts.findIndex(post => post._id === this.selectedPost!._id);
      if (index !== -1) {
        this.posts[index] = this.postUpdated;
      }
    }
     
    this.selectedPost = undefined;
    this.isPostSelected = false;
    this.postSelected.emit(false); // Emitir false cuando se deselecciona un usuario
  }

}
