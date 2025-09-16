/*Comment moderation is classic RBAC: 
anyone submits (pending), editors/admins approve.
*/

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: String, required: true, trim: true }, // or ref to User
    text:   { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
