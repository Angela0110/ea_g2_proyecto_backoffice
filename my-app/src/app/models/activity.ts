import { User } from "./user";

export interface Activity {
    _id?: string;
    name: string;
    description: string;
    rate?: number;
    owner: User;
    listUsers?: [];
    comments?: [];
    date: Date;
    active: boolean;
  }