import { User } from "./user";

export interface Activity {
    _id?: string;
    name: string;
    //avatar?: string;
    description: string;
    rate?: number;
    owner: User;
    comments?: User;
    active: boolean;
  }