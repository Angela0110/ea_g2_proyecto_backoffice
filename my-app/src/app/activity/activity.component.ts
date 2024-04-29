import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule, NgIf, UpperCasePipe} from '@angular/common';
import { Activity } from '../models/activity';
import { ActivityService } from '../services/activity.service';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  imports: [ NgIf, UpperCasePipe, CommonModule, ActivityDetailsComponent, ReactiveFormsModule, NgxPaginationModule],
  standalone: true,
})
export class ActivityComponent {
  @Input() activity?: Activity;
  @Output() goBack = new EventEmitter<void>();
  @Input() totalActivities:any;
  @Input()currentPage:any;
  @Input()limit:any=2;
  @Input()total:any;
  @Output()
  pageChange!: EventEmitter<number>;
  totalPages:any;
  activities: Activity[] = [];
  page: number=1;
  action:any;
  limitActivities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  newActivityForm: FormGroup;

  selectedActivity?: Activity;
  activityUpdated?: Activity;
  showAddActivityForm: boolean = false;
  isActivitySelected: boolean = false;

  constructor( public activityService: ActivityService, private formBuilder: FormBuilder // Inyectamos el FormBuilder
  ) {
    this.newActivityForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.activityService.getActivities(this.page,this.limit).subscribe (activities =>{
       this.action= activities;
       this.totalPages=this.action.totalPages;
       this.total=this.action.totalActivity;
       this.activities=this.action.activities
       console.log(this.activities);

       
      console.log(activities);
    })
  }
  handlePageChange(event: number): void {

    this.page = event;
    console.log(this.page);
    this.ngOnInit();
  }

  handleLimitChange(event: any): void {
    this.limit = event.target.value;
    this.page = 1;
    this.ngOnInit();
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


  postActivity(): void{

    if (this.newActivityForm.valid) {
      console.log(this.newActivityForm.value)
      this.activityService.postActivity(this.newActivityForm.value).subscribe((res: any) => {
        console.log("Actividad añadido!!!", res.activity);
        this.activities.push(res.activity);
        this.newActivityForm.reset();
      });
    } else {
      console.error("El formulario no es válido. No se puede agregar el usuario."); // Sería usuario o actividad????
    }
  }  

  showAddActivity(state: boolean) {
    this.showAddActivityForm = state;
    console.log("Cambio modo edición/lectura", this.showAddActivityForm);
  } 

  onActivitySelected(selected: boolean): void {
    this.isActivitySelected = selected;
  }
}