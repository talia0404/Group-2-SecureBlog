/*Map each action to a role. Authors create/edit only their own drafts; 
editors/admins publish; only admin hard-deletes; everyone can read published.
*/
// src/controllers/postController.js
const Post = require('../models/Post');
const { isAuthorRole } = require('../middleware/roles');

exports.createDraft = async (req, res) => {
  try {
    if (!isAuthorRole(req.user.role)) return res.status(403).json({ message: 'Authors only' });
    const { title, body, image } = req.body;
    const post = await Post.create({
      title, body, image, author: req.user.id, status: 'draft'
    });
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDraft = async (req, res) => {
  try {
    // req.resource provided by requireOwnership(Post)
    const post = req.resource;
    if (post.status !== 'draft') {
      return res.status(403).json({ message: 'Only drafts editable by author' });
    }
    const { title, body, image } = req.body;
    if (title != null) post.title = title;
    if (body  != null) post.body  = body;
    if (image != null) post.image = image;
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Not found' });
    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listPublished = async (_req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).sort({ publishedAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublished = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId, status: 'published' });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
