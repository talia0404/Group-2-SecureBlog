/*Route-level clarity mirrors the lab brief: public reads; author-only draft ops; 
editor/admin publish; admin delete.
*/
const router = require('express').Router();
const Post = require('../models/Post');
const { protect, requireOwnership } = require('../middleware/authMiddleware');
const { onlyPublishers, onlyAdmins } = require('../middleware/roles');
const ctrl = require('../controllers/postController');

// Public reads
router.get('/', ctrl.listPublished);
router.get('/:postId', ctrl.getPublished);

// Author actions
router.post('/', protect, ctrl.createDraft);
router.put('/:postId', protect, requireOwnership(Post), ctrl.updateDraft);

// Publish (editor/admin)
router.post('/:postId/publish', protect, onlyPublishers, ctrl.publishPost);

// Hard delete (admin)
router.delete('/:postId', protect, onlyAdmins, ctrl.deletePost);

module.exports = router;
