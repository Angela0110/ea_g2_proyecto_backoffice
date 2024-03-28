import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  getPosts() {
    return this.http.get<Post[]>('http://127.0.0.1:3000/post');
  }

  postPost(newPost : Post |undefined) {
    return this.http.post('http://127.0.0.1:3000/post', newPost);
  }

  updatePost(editPost : Post) {
    return this.http.put('http://127.0.0.1:3000/post/'+ editPost._id, editPost);
  }

}
