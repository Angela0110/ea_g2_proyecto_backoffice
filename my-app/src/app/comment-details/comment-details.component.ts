import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../models/comment';
import { CommentService } from '../services/comment.service';
import { ActivityService } from '../services/activity.service';
import { NgIf } from '@angular/common';
import { Activity } from '../models/activity';
import { User } from '../models/user';

@Component({
  selector: 'app-comment-details',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './comment-details.component.html',
  styleUrl: './comment-details.component.css'
})
export class CommentDetailsComponent {
  @Input() comment?: Comment;
  @Output() deselect = new EventEmitter<void>();
  @Output() commentUpdated = new EventEmitter<Comment>();

  editCommentForm: FormGroup;

  CommentID?: String;

  user: User =  {  '_id': '',
  'name': '',
  'email':'@gmail.com',
  'phone_number':'',
  'gender':'',
  'birthday': new Date()
  };

  activity: Activity=   {  '_id': '',
  'name': '',
  'description': '',
  'rate': 0,
  'owner': this.user,
  'listUsers': [],
  'comments': [],
  'date': new Date(),
  'active': true
  };

  editComment: Comment=   {  '_id': '',
 'title':'',
 'content':'',
 'activities': this.activity,
 'users': this.user,
 'review':0
  };

constructor(public commentService: CommentService, private formBuilder: FormBuilder, public activityService: ActivityService) {
  this.editCommentForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    review:['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

public updateFormWithCommentData(comment: Comment): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editCommentForm.patchValue({
    //_id: activity._id,
    title: comment.title,
    content: comment.content,
    review: comment.review
  });
}

  update: boolean= false;


  ngOnInit() {
    if (this.comment && this.comment._id) {
      this.CommentID = this.comment._id;
      console.log(this.comment._id)

      this.commentService.getComment(this.CommentID).subscribe(
        (res: any) => {
          this.comment = res.data;
            
          // Actualiza el formulario con los datos del comentario
          this.updateFormWithCommentData(this.comment!);
  
          // Actualiza la actividad con los datos de las actividades del comentario
          this.activity = this.comment!.activities;
        },
        (error) => {
          console.error('Error al obtener el comentario:', error);
        }
      );
    }
  }
 
  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateComment(): void {

    const formData = this.editCommentForm.value;
    this.editComment = {
      _id: this.comment?._id!, // Usamos el _id de la activity actual
      title: formData.title,
      content: formData.content,
      users: formData.users,
      review: formData.review,
      activities: formData.activities
    };

    this.commentService.updateComment(this.editComment).subscribe (editComment =>{
      this.comment =   {
        '_id': this.comment?._id!, // Usamos el _id de la activity actual
        'title': this.editComment.title,
        'content': this.editComment.content,
        'users': this.editComment.users,
        'review': this.editComment.review,
        'activities': this.editComment.activities,
    } 
      this.commentUpdated.emit(this.editComment);
    });
  } 
}
