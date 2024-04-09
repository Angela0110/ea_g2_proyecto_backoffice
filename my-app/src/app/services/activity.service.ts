import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http:HttpClient) { }

  getActivity(id : String) {
    return this.http.get<Activity>('http://127.0.0.1:3000/activity/' + id);
  }

  getActivities() {
    return this.http.get<Activity[]>('http://127.0.0.1:3000/activity');
  }

  postActivity(newActivity : Activity |undefined) {
    return this.http.post('http://127.0.0.1:3000/activity', newActivity);
  }

  updateActivity(editActivity : Activity) {
    return this.http.put('http://127.0.0.1:3000/activity/'+ editActivity._id, editActivity);
  }

}
