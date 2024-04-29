import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Activity } from '../models/activity';
import { ActivityService } from '../services/activity.service';
import { CommentsComponent } from '../comments/comments.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule, FormsModule, CommentsComponent],
  standalone: true,
})
export class ActivityDetailsComponent {
  @Input() activity?: Activity;
  @Output() deselect = new EventEmitter<void>();
  @Output() activityUpdated = new EventEmitter<Activity>();

  editActivityForm: FormGroup;

  ActivityID?: string;

  rating:number = 0;

  users : User[] = [];

  user: User =  {  '_id': '',
  'name': '',
  'email':'@gmail.com',
  'phone_number':'',
  'gender':'',
  'birthday': new Date()
  };

  editActivity: Activity=   {  '_id': this.user._id,
  'name': '',
  'description': '',
  'rate': 0,
  'owner': this.user,
  'comments': [],
  'listUsers': [],
  'date': new Date(),
  'active': true
};


constructor(public activityService: ActivityService, private formBuilder: FormBuilder) {
  this.editActivityForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

refreshActivity(): void {
  this.activityService.getActivity(this.activity?._id!).subscribe((res: any) => {
    // Actualizar actividad en el componente
    this.activity = res.data;
    this.rating = +this.activity!.rate!.toFixed(1);

    this.activityUpdated.emit(this.activity);

    // Actualizar el formulario con los datos de la actividad actualizada
    this.updateFormWithActivityData(this.activity!);
  });
}

public updateFormWithActivityData(activity: Activity): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editActivityForm.patchValue({
    //_id: activity._id,
    name: activity.name,
    description: activity.description
  });
}

  update: boolean= false;


  ngOnInit() {
    if (this.activity) {
      this.rating = +this.activity.rate!.toFixed(1);
      this.ActivityID = this.activity._id;
      this.updateFormWithActivityData(this.activity);
    };

    if (this.activity?.listUsers) {
      this.users = this.activity.listUsers;
    } 

    if (this.activity?.owner) {
      // Asigna this.activity.owner a this.user solo si this.activity.owner no es undefined
      this.user = this.activity.owner;
    }  
  }
 
  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateActivity(): void {

    const formData = this.editActivityForm.value;
    this.editActivity = {
      _id: this.activity?._id!, // Usamos el _id de la activity actual
      name: formData.name,
      description: formData.description,
      rate: formData.rate,
      owner: formData.owner,
      comments: formData.comments,
      listUsers: formData.listUsers,
      date: formData.data,
      active: formData.active
    };

    this.activityService.updateActivity(this.editActivity).subscribe (editActivity =>{
      this.activity =   {
        '_id': this.activity?._id!, // Usamos el _id de la activity actual
        'name': this.editActivity.name,
        'description': this.editActivity.description,
        'rate': this.editActivity.rate,
        'owner': this.editActivity.owner,
        'comments': this.editActivity.comments,
        'listUsers': this.editActivity.listUsers,
        'date': this.editActivity.date,
        'active': this.editActivity.active
    } 
      this.activityUpdated.emit(this.editActivity);
    });
  } 

}
