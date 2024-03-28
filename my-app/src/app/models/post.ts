import { User } from "./user";

export interface Post {
    _id?: string;
    author: User;
    title: string;
    content: string;
  }