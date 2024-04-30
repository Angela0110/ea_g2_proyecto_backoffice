import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, UpperCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';;
import { User } from '../models/user';
import { Activity } from '../models/activity';
import { Comment } from '../models/comment';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { CommentDetailsComponent } from '../comment-details/comment-details.component';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, ActivityDetailsComponent, CommentDetailsComponent, ReactiveFormsModule],
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  @Input() user?: User;
  @Output() deselect = new EventEmitter<void>();
  @Output() showPostDetails = new EventEmitter<Activity>();
  @Output() userUpdated = new EventEmitter<User>();
  @Output() activitySelected = new EventEmitter<boolean>();
  @Output() commentSelected = new EventEmitter<boolean>();

  editUserForm: FormGroup;
  selectedActivity?: Activity;
  activityUpdated?: Activity;
  selectedComment?: Comment;
  commentUpdated?: Comment;

  activities: Activity[] = [];
  comments: Comment[] = [];
  listActivities: Activity[] = [];

  editUser: User = {
    '_id': '',
    'name': '',
    'email': '@gmail.com',
    'phone_number': '',
    'gender': '',
    'birthday': new Date(),
    'password': ''
  };

  showActivityDetails: any;
  showCommentDetails: any;

  constructor(public userService: UserService, public activityService: ActivityService, private formBuilder: FormBuilder) {
    this.editUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
  }

  public updateFormWithUserData(user: User): void {
    // Actualizar los valores del formulario con los datos del usuario
    this.editUserForm.patchValue({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender,
      birthday: user.birthday,
      password: user.password
    });
  }

  update: boolean = false;
  isActivitySelected: boolean = false;
  isCommentSelected: boolean = false;


  ngOnInit() {
    if (this.user) {
      this.updateFormWithUserData(this.user);
    }

    this.activities = this.user?.activities ?? [];
    this.comments = this.user?.comments ?? [];
    this.listActivities = this.user?.listActivities ?? [];
  }

  onActivityUpdated(activity: Activity): void {
    this.activityUpdated = activity;
  }

  showActivity(activity: Activity): void {
    this.showActivityDetails.emit(activity);
  }

  onCommentUpdated(comment: Comment): void {
    this.commentUpdated = comment;
  }

  showComment(comment: Comment): void {
    this.showCommentDetails.emit(comment);
  }

  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateUser(): void {

    const formData = this.editUserForm.value;
    this.editUser = {
      _id: this.user?._id!, // Usamos el _id del usuario actual
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      gender: formData.gender,
      birthday: formData.birthday,
      password: formData.password
    };

    this.userService.updateUser(this.editUser).subscribe(editUser => {
      this.user = {
        '_id': this.editUser?._id!,
        'name': this.editUser?.name!,
        'email': this.editUser?.email!,
        'phone_number': this.editUser?.phone_number!,
        'gender': this.editUser?.gender!,
        'birthday': this.editUser?.birthday!,
        'password': this.editUser?.password!
      }
      this.userUpdated.emit(this.editUser);
    });
  }

  onSelect(activity: Activity): void {
    this.selectedActivity = activity;
    this.isActivitySelected = true;
    this.activitySelected.emit(true);
  }

  deselectActivity(): void {
    if (this.selectedActivity && this.activityUpdated) {
      const index = this.activities.findIndex(activity => activity._id === this.selectedActivity!._id);
      if (index !== -1) {
        this.activities[index] = this.activityUpdated;
      }
    }

    this.selectedActivity = undefined;
    this.isActivitySelected = false;
    this.activitySelected.emit(false);
  }

  onSelectComment(comment: Comment): void {
    this.selectedComment = comment;
    this.isCommentSelected = true;
    this.commentSelected.emit(true);
  }

  deselectComment(): void {
    if (this.selectedComment && this.commentUpdated) {
      const index = this.comments.findIndex(comment => comment._id === this.selectedComment!._id);
      if (index !== -1) {
        this.comments[index] = this.commentUpdated;
      }
    }

    this.selectedComment = undefined;
    this.isCommentSelected = false;
    this.commentSelected.emit(false);
  }

}
