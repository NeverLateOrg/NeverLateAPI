import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  lastname: String,
  firstname: String,
  password: String,
});

export interface User {
  id: string;
  email: string;
  lastname: string;
  firstname: string;
  password: string;
}
