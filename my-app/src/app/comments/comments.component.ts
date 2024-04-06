import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Comment } from '../models/comment';
import { Activity } from '../models/activity';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [NgIf, UpperCasePipe, CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() activity?: String;

  comment: Comment =  {  '_id': '',
  'title':'',
  'content':'',
  'users':'',
  'activities':'',
  'review': 0
  };

  page?: number;
  comments: Comment[] = [];
  test?: String;

  constructor( public commentService: CommentService, private formBuilder: FormBuilder){
   
  }

  ngOnInit(): void {
    this.page = 0;
    this.commentService.getComments(this.activity!, this.page).subscribe (comments =>{
      console.log(comments);
      this.comments = comments;
      console.log(this.comments);
    })
  }
}
