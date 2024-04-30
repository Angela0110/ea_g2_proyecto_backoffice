export interface User {
    _id: string;
    name: string,
    email:string,
    phone_number:string,
    gender:string,
    birthday: Date,
    listActivities?: [],
    activities?: [],
    comments?: [],
    password: string
  }