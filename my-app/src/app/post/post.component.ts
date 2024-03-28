import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, PostDetailsComponent],
  standalone: true,
})
export class PostComponent {
  @Input() post?: Post;
  @Output() goBack = new EventEmitter<void>();

  posts: Post[] = [];

  selectedPost?: Post;
  postUpdated?: Post;
  showAddPostForm: boolean = false;
  isPostSelected: boolean = false;

  constructor( public postService: PostService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
  ) {
   
  }

  ngOnInit(): void {
    this.postService.getPosts().subscribe (posts =>{
      this.posts = posts;
      console.log("ujoik"+posts)
    })
  }

  @Output() postSelected = new EventEmitter<boolean>();

  onSelect(post: Post): void {
    this.selectedPost = post;
    this.postSelected.emit(true);
  }

  onPostUpdated(post: Post): void {
    this.postUpdated = post;
  }

  deselectPost(): void {
    
    if (this.selectedPost && this.postUpdated) {
      const index = this.posts.findIndex(post => post._id === this.selectedPost!._id);
      if (index !== -1) {
        this.posts[index] = this.postUpdated;
      }
    }
    this.selectedPost = undefined;
    this.postSelected.emit(false); // Emitir false cuando se deselecciona un usuario
  }


 /*  postPost(): void{

    if (this.newPostForm.valid) {
      console.log(this.newPostForm.value)
      this.postService.postPost(this.newPostForm.value).subscribe((res: any) => {
        console.log("Usuario añadido!!!", res.user);
        this.posts.push(res.user);
        this.newPostForm.reset();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario.");
    }
  }  */

 /*  showAddPost(state: boolean) {
    this.showAddPostForm = state;
    console.log("Cambio modo edición/lectura", this.showAddPostForm);
  } */

  onPostSelected(selected: boolean): void {
    this.isPostSelected = selected;
  }
}