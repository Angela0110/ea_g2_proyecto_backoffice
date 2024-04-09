import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Comment } from '../models/comment';
import { Activity } from '../models/activity';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() activity?: String;
  @Output() commentsUpdate = new EventEmitter<void>();

  postCommentForm: FormGroup;

  page = 0;
  comments: Comment[] = [];
  test?: String;
  previous = "<";
  next = ">";
  first_page = true;
  last_page = false;
  comment_length = 0;

  constructor( public commentService: CommentService, private formBuilder: FormBuilder){
    this.postCommentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      users: ['', [Validators.required]],
      activities: [''],
      review: ['', [Validators.required]]
    });
  }

  async postComment(): Promise<void>{
    if (this.postCommentForm.valid) {
      this.postCommentForm.value.activities = this.activity;
      console.log(this.postCommentForm.value)
      await this.commentService.postComment(this.postCommentForm.value).subscribe((res: any) => {
        this.comments.unshift(res.comment);
        this.postCommentForm.reset();
        this.commentsUpdate.emit();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario.");
    }
  } 

  ngOnInit(): void {
    this.getComments(this.page);
    this.commentLength();
  }

  commentLength(): void {
    this.commentService.commentLength(this.activity!).subscribe (length =>{
      this.comment_length = length;
      if(this.comment_length <= (this.page!*5)+5){
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
    this.getComments(this.page);
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
    this.getComments(this.page);
  }

  getComments(page: any): void{
    this.commentService.getComments(this.activity!, page).subscribe (comments =>{
      console.log(comments);
      this.comments = comments;
    })
  }

  deleteComment(comment: Comment): void{
    console.log("Eliminando " + comment._id);
    this.commentService.deleteComment(comment._id!).subscribe (res =>{
      console.log(res);
      this.commentsUpdate.emit();
    })
    comment.title = "DELETED";
  }
}
