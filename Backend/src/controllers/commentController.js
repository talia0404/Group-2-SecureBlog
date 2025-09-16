/* Readers submit (pending), moderators (editor/admin) approve, public can see approved.
*/
// src/controllers/commentController.js
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { author, text } = req.body; // or derive author from req.user.email
    const { postId } = req.params;
    const c = await Comment.create({ post: postId, author, text, status: 'pending' });
    res.status(201).json(c);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listApproved = async (req, res) => {
  try {
    const { postId } = req.params;
    const list = await Comment.find({ post: postId, status: 'approved' }).sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approve = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId, post: postId });
    if (!comment) return res.status(404).json({ message: 'Not found' });
    comment.status = 'approved';
    await comment.save();
    res.json(comment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
