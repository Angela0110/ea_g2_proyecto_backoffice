import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient, private authService: AuthService) { }

  authToken = this.authService.getAuthToken();

  headers = new HttpHeaders({
    'x-access-token': `${this.authToken}`
  });

  postComment(newComment: Comment){
    return this.http.post<void>('http://127.0.0.1:3000/comment', newComment);
  }

  getComments(activityID: String, page: number) {
    return this.http.get<Comment[]>('http://127.0.0.1:3000/comment/' + activityID + '/' + page);
  }

  getComment(commentID: String) {
    return this.http.get<Comment>('http://127.0.0.1:3000/comment/' + commentID);
  }

  commentLength(activityID: String) {
    return this.http.get<number>('http://127.0.0.1:3000/commentlength/' + activityID);
  }

  deleteComment(commentID: String) {
    return this.http.delete<void>('http://127.0.0.1:3000/comment/' + commentID, { headers: this.headers });
  }

  updateComment(editComment : Comment) {
    return this.http.put('http://127.0.0.1:3000/comment/'+ editComment._id, editComment, { headers: this.headers });
  }

}
