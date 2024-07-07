import mongoose from 'mongoose';
import { Review } from './type';

const commentSchema = new mongoose.Schema<Review>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the user model (if using Mongoose population)
      required: false,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'recipe', // Reference to the recipe model (if using Mongoose population)
      required: false,
    },
    content: {
      type: String,
      required: function() {
        return this.type === 'comment'; // Content is required if type is 'comment'
      },
    },
    rating: {
      type: String,
      required: function() {
        return this.type === 'rating'; // Rating is required if type is 'rating'
      },
    },
    user: {
      type: String,
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: ['rating', 'comment'],
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model('review', commentSchema);
