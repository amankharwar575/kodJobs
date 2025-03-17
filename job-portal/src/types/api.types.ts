export interface User {
  id: number;
  username: string;
  email: string;
  dob: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  link: string;
}

export interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
}

export interface ApiError {
  message: string;
} 