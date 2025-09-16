/*Route-level clarity mirrors the lab brief: public reads; author-only draft ops; 
editor/admin publish; admin delete.
*/
const router = require('express').Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const { onlyModerators } = require('../middleware/roles');
const c = require('../controllers/commentController');

// Public list (approved)
router.get('/', c.listApproved);

// Add (logged-in reader/any logged-in user)
router.post('/', protect, c.addComment);

// Approve (editor/admin)
router.post('/:commentId/approve', protect, onlyModerators, c.approve);

module.exports = router;
