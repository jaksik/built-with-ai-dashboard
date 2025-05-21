import mongoose from 'mongoose';

export interface IArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  link: string;
  source: string;
  publishedAt: Date;
  category: string;
  createdAt: Date;
}

const ArticleSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.articles || mongoose.model('articles', ArticleSchema);