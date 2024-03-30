import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Activity } from '../models/activity';
import { ActivityService } from '../services/activity.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
})
export class ActivityDetailsComponent {
  @Input() activity?: Activity;
  @Output() deselect = new EventEmitter<void>();
  @Output() activityUpdated = new EventEmitter<Activity>();

  editActivityForm: FormGroup;

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

  activities: Activity[] = [];

  editActivity: Activity=   {  '_id': this.user,
  'name': '',
  'description': '',
  'rate': 0,
  'owner': this.user,
  'comments': this.user,
  'active': false,
};


constructor(public activityService: ActivityService, private formBuilder: FormBuilder) {
  this.editActivityForm = this.formBuilder.group({
    //title: ['', [Validators.required]],
    //content: ['', [Validators.required]],
    //author: ['', [Validators.required]]
  });

  // Comprobar si hay un usuario recibido como entrada y actualizar el formulario si es necesario
}

public updateFormWithActivityData(activity: Activity): void {
  // Actualizar los valores del formulario con los datos del usuario
  this.editActivityForm.patchValue({
    _id: activity._id,
    name: activity.name,
  });
}

  update: boolean= false;


  ngOnInit() {
    if (this.activity) {
      this.updateFormWithActivityData(this.activity);
    };

    if (this.activity?.owner) {
      // Asigna this.activity.owner a this.user solo si this.activity.owner no es undefined
      this.user = this.activity.owner;
  }  }
 
  updateEdit(state: boolean) {
    this.update = state;
    console.log("Cambio modo edición/lectura", this.update);
  }

  updateActivity(): void {

    const formData = this.editActivityForm.value;
    this.editActivity = {
      _id: this.activity?._id!, // Usamos el _id de la activity actual
      //author: formData.author,
      //title: formData.title,
      //content: formData.content
      name: formData.content,
      description: formData.content,
      rate: formData.number,
      owner: formData.author,
      comments: formData.content,
      active: formData.boolean
    };

    this.activityService.updateActivity(this.editActivity).subscribe (editActivity =>{
      this.activity =   {
        _id: this.activity?._id!, // Usamos el _id de la activity actual
        //author: formData.author,
        //title: formData.title,
        //content: formData.content
        name: formData.content,
        description: formData.content,
        rate: formData.number,
        owner: formData.author,
        comments: formData.content,
        active: formData.boolean
    } 
      this.activityUpdated.emit(this.editActivity);
    });
  } 

}
