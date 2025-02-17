import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/User.Controller.js";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', passport.authenticate("jwt", { session: false }), UserController.current);
router.post('/logout', UserController.logout);

//Ruta exclusiva para admins: 
router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado!"); 
    } 
    res.render("admin"); 
})

export default router;