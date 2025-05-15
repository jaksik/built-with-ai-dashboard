import { Document } from 'mongoose';

export interface Tool extends Document {
  name: string;
  link: string;
  affiliate: string;
  dashboard: string;
  tagline?: string;
  description: string;
  category: string;
}