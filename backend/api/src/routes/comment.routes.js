import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/authentication.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:mediaType/:postId").get(getComments).post(addComment);
router.route("/:commentId").delete(deleteComment).patch(updateComment);

export default router