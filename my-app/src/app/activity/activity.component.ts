import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Activity } from '../models/activity';
import { ActivityService } from '../services/activity.service';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ActivityDetailsComponent],
  standalone: true,
})
export class ActivityComponent {
  @Input() activity?: Activity;
  @Output() goBack = new EventEmitter<void>();

  activities: Activity[] = [];

  selectedActivity?: Activity;
  activityUpdated?: Activity;
  showAddActivityForm: boolean = false;
  isActivitySelected: boolean = false;

  constructor( public activityService: ActivityService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
  ) {
   
  }

  ngOnInit(): void {
    this.activityService.getActivities().subscribe (activities =>{
      this.activities = activities;
      console.log("ujoik"+activities)
    })
  }

  @Output() activitySelected = new EventEmitter<boolean>();

  onSelect(activity: Activity): void {
    this.selectedActivity = activity;
    this.activitySelected.emit(true);
  }

  onActivityUpdated(activity: Activity): void {
    this.activityUpdated = activity;
  }

  deselectActivity(): void {
    
    if (this.selectedActivity && this.activityUpdated) {
      const index = this.activities.findIndex(activity => activity._id === this.selectedActivity!._id);
      if (index !== -1) {
        this.activities[index] = this.activityUpdated;
      }
    }
    this.selectedActivity = undefined;
    this.activitySelected.emit(false); // Emitir false cuando se deselecciona un usuario
  }


 /*  postActivity(): void{

    if (this.newActivityForm.valid) {
      console.log(this.newActivityForm.value)
      this.activityService.postActivity(this.newActivityForm.value).subscribe((res: any) => {
        console.log("Usuario añadido!!!", res.user);
        this.activities.push(res.user);
        this.newActivityForm.reset();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario.");
    }
  }  */

 /*  showAddActivity(state: boolean) {
    this.showAddActivityForm = state;
    console.log("Cambio modo edición/lectura", this.showAddActivityForm);
  } */

  onActivitySelected(selected: boolean): void {
    this.isActivitySelected = selected;
  }
}