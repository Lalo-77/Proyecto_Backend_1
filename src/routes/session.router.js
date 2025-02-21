import { Router } from "express";
import passport from "passport";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/validar.js";
import { userDao } from "../dao/user.dao.js";
import UserController from "../controllers/User.Controller.js";

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', passport.authenticate("jwt", { session: false }), UserController.current);
router.post('/logout', UserController.logout);

// Ruta Current:

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {

    if (req.user) {
        res.render("home", { usuario: req.user.usuario });
    } else {
        res.status(401).send("No autorizado");
    }
})

// Logout 

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
})

//Ruta exclusiva para admins: 
router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado!"); 
    } 
    res.render("admin"); 
})

export default router;