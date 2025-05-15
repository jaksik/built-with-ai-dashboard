import mongoose from 'mongoose';

export interface IArticle {
  _id: mongoose.Types.ObjectId;
  title: string;
  link: string;
  image?: string;
  source: string;
  publishedAt: Date;
  time: string;
  articleType: string;
  searchTerm: string;
  createdAt: Date;
  used: boolean;
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
  image: {
    type: String,
    default: null
  },
  source: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  articleType: {
    type: String,
    required: true
  },
  searchTerm: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  used: {
    type: Boolean,
    default: false
  }
});

export default mongoose.models.articles || mongoose.model('articles', ArticleSchema);