import { Router } from 'express';
import {
    getSubscriptionDetail,
    createSubscription,
    deleteSubscription,
    getSubscribedChannelsList,
    getUserChannelSubscribersList,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:channelId")
    .post(createSubscription)
    .get(getSubscriptionDetail)

router.route("/:subscriptionId")
    .delete(deleteSubscription)

router.route("/SubscribersList/:channelId")
    .get(getUserChannelSubscribersList);// own subscriber

router.route("/SubscribtionList/:subscriberId")
    .get(getSubscribedChannelsList)



export default router