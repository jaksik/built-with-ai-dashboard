import mongoose from 'mongoose';

export interface IScrape {
  _id: mongoose.Types.ObjectId;
  title: string;
  link: string;
  source: string;
  publishedAt: Date;
  category: string;
  createdAt: Date;
  imported?: boolean;
}

const ScrapesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imported: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.scrapes || mongoose.model('scrapes', ScrapesSchema);