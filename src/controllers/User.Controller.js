import UsuarioModel from "../models/usuarios.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/validar.js";

class UserController {  
    async register(req, res, next) {  
        const { first_name, last_name, email, age, password } = req.body;  
       
        try {  
            const existeUsuario = await UsuarioModel.findOne({ 
                first_name,  
                last_name,  
                email,  
                age,  
                password: createHash(password)
            });
            
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }
            
            const nuevoUsuario = new UsuarioModel({  
                first_name,  
                last_name,  
                email,  
                age,  
                password: createHash(password), 
            }); 

            await nuevoUsuario.save();

            const token = jwt.sign({usuario: nuevoUsuario.usuario, email: nuevoUsuario.email, role: nuevoUsuario.role || "user" },  
                process.env.JWT_SECRET || "coderhouse", 
                { expiresIn: "1h" });  

            res.cookie("coderCookieToken", token, { 
                maxAge: 3600000, 
                httpOnly: true 
            });
              
            res.redirect("/api/session/current");  
        } catch (error) {  
            next(error)
            console.error("Error en registro:", error); 
            res.status(500).send(error.message || "Error al registrar el usuario"); 
        }  
    }  

    async login(req, res, next) {  
        const { email, password } = req.body;  
        try {  
            const usuarioEsta = await UsuarioModel({email, password});  
            if (!usuarioEsta) {  
                return res.status(401).send("Credenciales incorrectas"); 
            }  

            if(!isValidPassword(password, usuarioEsta)) {
                return res.status(401).send("Contraseña incorrecta"); 
            }

            const token = jwt.sign({  
                    usuario: usuarioEsta.usuario,  
                    email: usuarioEsta.email,  
                    role: usuarioEsta.role || "user", },  
                process.env.JWT_SECRET || "codehouse", 
                { expiresIn: "1h" }); 

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });  
            res.redirect("/api/session/current");  

        } catch (error) {
            next(error)  
            console.error("Error en login:", error);
            return res.status(500).send("Error del servidor: " + error.message);  
        }  
    }  

    async current(req, res) {  
        if (req.user) {  
            res.render("home", { usuario: req.user.usuario }); 
        } else {  
            res.status(401).send("No autorizado");  
        }  
    }  

    logout(req, res) {  
        res.clearCookie("coderCookieToken");  
        res.redirect("/login");  
    }  
}  

export default new UserController();