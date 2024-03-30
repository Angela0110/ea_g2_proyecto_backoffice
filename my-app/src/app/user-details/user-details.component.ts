import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';;
import { User } from '../models/user';
import { Activity } from '../models/activity';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  imports: [FormsModule, NgIf, UpperCasePipe, CommonModule, ActivityDetailsComponent, ReactiveFormsModule],
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  @Input() user?: User;
  @Output() deselect = new EventEmitter<void>();
  @Output() showPostDetails = new EventEmitter<Activity>();
  @Output() userUpdated = new EventEmitter<User>();
  @Output() activitySelected = new EventEmitter<boolean>();

  editUserForm: FormGroup;
  selectedActivity?: Activity;
  activityUpdated?: Activity;


  activities: Activity[] = [];

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
  showActivityDetails: any;


constructor(public userService: UserService, public activityService: ActivityService, private formBuilder: FormBuilder) {
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
  isActivitySelected: boolean = false;

  ngOnInit() {
    if (this.user) {
      this.updateFormWithUserData(this.user);
    } 
    
    this.activities = this.user?.activities ?? [];
  }
 
  onActivityUpdated(activity: Activity): void {
    this.activityUpdated = activity;
  }

  showActivity(activity: Activity): void {
    this.showActivityDetails.emit(activity);
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

  onSelect(activity: Activity): void {
    this.selectedActivity = activity;
    this.isActivitySelected = true;
    this.activitySelected.emit(true);
  }

  deselectActivity(): void {
    if (this.selectedActivity && this.activityUpdated) {
      const index = this.activities.findIndex(post => post._id === this.selectedActivity!._id);
      if (index !== -1) {
        this.activities[index] = this.activityUpdated;
      }
    }
     
    this.selectedActivity = undefined;
    this.isActivitySelected = false;
    this.activitySelected.emit(false); // Emitir false cuando se deselecciona un usuario
  }

}
