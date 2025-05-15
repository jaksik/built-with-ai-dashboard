import mongoose from 'mongoose';

export interface ITool {
  _id: mongoose.Types.ObjectId;
  name: string;
  link: string;
  affiliate?: string;
  dashboard?: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  active: boolean;
  clicks: number;
}

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    trim: true
  },
  affiliate: {
    type: String,
    trim: true
  },
    dashboard: {
    type: String,
    trim: true
  },
    tagline: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
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

export default mongoose.models.tools || mongoose.model('tools', ToolSchema);