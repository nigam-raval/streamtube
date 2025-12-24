import { Router } from "express";
import { getCurrentUserBalance, tranferMoney } from "../controllers/transcation.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getCurrentUserBalance)
router.route("/send").post(tranferMoney)

export default router