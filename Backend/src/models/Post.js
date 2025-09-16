/*Posts need states to enforce who can edit/publish/delete. 
Authors own drafts; editors/admins can publish; only admin hard-deletes.*/

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body:  { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    publishedAt: { type: Date },
    image: { type: String }, // optional (base64/URL)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
