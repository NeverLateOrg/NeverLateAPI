import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
});

export interface User {
  id: string;
  email: string;
  name: string;
}
