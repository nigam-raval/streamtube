import { Router } from 'express';
import {
    getPostLike,
    createLike,
    deleteLike
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:mediaType/:postId")
.post(createLike)
.get(getPostLike);

router.route("/:likeId")
.delete(deleteLike);


export default router