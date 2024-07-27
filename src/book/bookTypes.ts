import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  author: User;
  genre: string;
  publicationYear: number;
  coverImage: string;
  file: string;
  copies: number;
  createdAt: Date;
  updatedAt: Date;
}
