export interface User {
    _id: string;
    name: {
      first_name: string,
      middle_name:string,
      last_name:string,
    },
    email:string,
    phone_number:string,
    gender:string,
    activities?: [],
    comments?: [],
    /* totalPages?:number,
    totalUsers?: number, */
  }