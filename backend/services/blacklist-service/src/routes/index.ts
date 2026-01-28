import express from 'express';
import { BlacklistController } from '../controllers/blacklistController';

const router = express.Router();


const controller = new BlacklistController();

router.post("/tokens", controller.BlacklistToken)
router.post("/tokens/check", controller.CheckToken)
router.post("/users", controller.BlacklistUser)
router.delete("/users/:userId/remove", controller.RemoveUser)
router.get("/users/:userId/check", controller.CheckUser)

export default router