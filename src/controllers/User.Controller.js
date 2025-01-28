import userService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";

class UserController {  
    async register(req, res) {  
        const { first_name, last_name, email, age, password } = req.body;  

        try {  
            const nuevoUsuario = await userService.registerUser({  
                first_name,  
                last_name,  
                email,  
                age,  
                password,  
            });  

            const token = jwt.sign(  
                {  
                    usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,  
                    email: nuevoUsuario.email,  
                    role: nuevoUsuario.role || "user",  
                },  
                process.env.JWT_SECRET || "codehouse", // Maneja la clave del token de forma segura  
                { expiresIn: "1h" }  
            );  

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });  
            res.redirect("/api/session/current");  
        } catch (error) {  
            console.error("Error en registro:", error); // Log de error para depuración  
            res.status(400).send(error.message || "Error al registrar el usuario"); // Muestra el mensaje real de error  
        }  
    }  

    async login(req, res) {  
        const { email, password } = req.body;  

        try {  
            const user = await userService.loginUser(email, password);  
            if (!user) {  
                return res.status(401).send("Credenciales incorrectas"); // Mejor mensaje  
            }  

            const token = jwt.sign(  
                {  
                    usuario: `${user.first_name} ${user.last_name}`,  
                    email: user.email,  
                    role: user.role || "user", // Verifica el rol  
                },  
                process.env.JWT_SECRET || "codehouse", // Maneja la clave del token de forma segura  
                { expiresIn: "1h" }  
            );  

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });  
            res.redirect("/api/session/current");  
        } catch (error) {  
            console.error("Error en login:", error); // Log de error para depuración  
            return res.status(500).send("Error del servidor: " + error.message); // Mostrar error real  
        }  
    }  

    async current(req, res) {  
        if (req.user) {  
            const user = req.user;  
            const userDTO = new UserDTO(user);  
            res.render("home", { user: userDTO });  
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