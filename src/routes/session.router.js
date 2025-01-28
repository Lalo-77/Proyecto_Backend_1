import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/User.Controller.js";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', passport.authenticate("jwt", { session: false }), UserController.current);
router.post('/logout', UserController.logout);



export default router;
