import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  postComment(newComment: Comment){
    return this.http.post<void>('http://127.0.0.1:3000/comment', newComment);
  }

  getComments(activityID: String, page: number) {
    return this.http.get<Comment[]>('http://127.0.0.1:3000/comment/' + activityID + '/' + page);
  }

  commentLength(activityID: String) {
    return this.http.get<number>('http://127.0.0.1:3000/commentlength/' + activityID);
  }

  deleteComment(commentID: String) {
    return this.http.delete<void>('http://127.0.0.1:3000/comment/' + commentID);
  }

}
