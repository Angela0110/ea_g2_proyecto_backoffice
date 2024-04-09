import { Activity } from "./activity";
import { User } from "./user";

export interface Comment {
  _id?: String;
  title: String;
  content: String;
  users: User;
  activities: Activity;
  review: number; 
}