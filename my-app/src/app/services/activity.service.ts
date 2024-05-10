import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from '../models/activity';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http:HttpClient, private authService: AuthService) { }

  getAuthTokenHeader(): HttpHeaders {
    const authToken = this.authService.getAuthToken();
    return new HttpHeaders({
      'x-access-token': `${authToken}`
    });
  }

  getActivity(id : String) {
    return this.http.get<Activity>('http://127.0.0.1:3000/activity/' + id);
  }

  getActivities(page:Number,limit:Number) {
    return this.http.get<Activity[]>('http://127.0.0.1:3000/activity/'+ page + '/' + limit);
  }

  postActivity(newActivity : Activity |undefined) {
    return this.http.post('http://127.0.0.1:3000/activity', newActivity);
  }

  updateActivity(editActivity : Activity) {
    return this.http.put('http://127.0.0.1:3000/activity/'+ editActivity._id, editActivity, { headers: this.getAuthTokenHeader() });
  }

  participateActivity(userId : String, activityId : String){
    return this.http.put('http://127.0.0.1:3000/activity/'+ userId + '/' + activityId, null, { headers: this.getAuthTokenHeader() });
  }

}
