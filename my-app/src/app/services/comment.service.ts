import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  getComments(activityID: String, page: number) {
    return this.http.get<Comment[]>('http://127.0.0.1:3000/comment/' + activityID + '/' + page);
  }

  postComent(newActivity : Comment |undefined) {
    return this.http.post('http://127.0.0.1:3000/activity', newActivity);
  }

  updateComent(editActivity : Comment) {
    return this.http.put('http://127.0.0.1:3000/activity/'+ editActivity._id, editActivity);
  }

}
