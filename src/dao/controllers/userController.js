import userService from "../../services/user.service.js";
import jwt from "jsonwebtoken";
import session from "express-session";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, age, password} = req.body;

        try {
            const nuevoUsuario = await userService.registerUser({first_name, last_name, email, age, password});

            const token = jwt.sign({
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role
            }, "coderhouse", {expiresIn: "1h"});

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/session/current");
        } catch (error) {
            res.status(500).send("Error del server");
        }
    }
    
    async login(req, res) {  
        const { email, password } = req.body;  
    
        try {  
            if (!email || !password) {  
                return res.status(400).send("El email y el password son requeridos");  
            }  
            const user = await userService.loginUser(email, password);  

            if (!user) {  
                return res.status(401).send("El email o el password invalidos");  
            }  
            const token = jwt.sign({  
                usuario: `${user.first_name} ${user.last_name}`,  
                email: user.email,  
                role: user.role  
            }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });  
    
            res.cookie("coderCookieToken", token, {  
                maxAge: 3600000,  
                httpOnly: true  
            });  
            return res.redirect("/api/session/current");  
        } catch (error) {  
            console.error("Error del login:", error); 
            return res.status(500).send("Error del server");  
        }  
    }
    async current(req, res) {
        if(req.user) {
            const user = req.user;
            const userDTO = new UserDTO(user); 
            res.render("home", {user: userDTO});
        } else {
            res.send("No autorizado");
        }
    }
    logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }
}

export default new UserController();