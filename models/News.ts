import mongoose from 'mongoose';

export interface INews {
  _id: mongoose.Types.ObjectId;
  title: string;
  link: string;
  source: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  createdAt: Date;
  active: boolean;
  clicks: number;
}

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

export default mongoose.models.news || mongoose.model('news', NewsSchema);