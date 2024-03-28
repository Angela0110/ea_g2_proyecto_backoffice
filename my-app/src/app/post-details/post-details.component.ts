import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
})
export class PostDetailsComponent {
  @Input() post?: Post;
  @Output() deselect = new EventEmitter<void>();
  @Output() postUpdated = new EventEmitter<Post>();

  editPostForm: FormGroup;

  user: User =  {  '_id': '',
  'name': {
   'first_name': '',
   'middle_name':'',
   'last_name': '',
 },
  'email':'@gmail.com',
  'phone_number':'',
  'gender':''
  };

  posts: Post[] = [];

  editPost: Post=   {  '_id': '',
  'author': this.user,
  'title': '',
  'content':''
};


constructor(public postService: PostService, private formBuilder: FormBuilder) {
  this.editPostForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    author: ['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

public updateFormWithPostData(post: Post): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editPostForm.patchValue({
    _id: post._id,
    author: post.author,
    title: post.title,
    content: post.content
  });
}

  update: boolean= false;


  ngOnInit() {
    if (this.post) {
      this.updateFormWithPostData(this.post);
    };

    if (this.post?.author) {
      // Asigna this.post.author a this.user solo si this.post.author no es undefined
      this.user = this.post.author;
  }  }
 
  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updatePost(): void {

    const formData = this.editPostForm.value;
    this.editPost = {
      _id: this.post?._id!, // Usamos el _id del post actual
      author: formData.author,
      title: formData.title,
      content: formData.content
    };

    this.postService.updatePost(this.editPost).subscribe (editPost =>{
      this.post =   {
        '_id': this.editPost?._id!,
        'author': this.editPost?.author!,
        'title': this.editPost?.title!,
        'content': this.editPost?.content!
    } 
      this.postUpdated.emit(this.editPost);
    });
  } 

}
