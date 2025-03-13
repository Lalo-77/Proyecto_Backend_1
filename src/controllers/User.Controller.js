import UsuarioModel from "../models/usuarios.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/validar.js";

class UserController {
  async register(req, res, next) {
      const { first_name, last_name, email, password, age } = req.body;

    try {
      const existeUsuario = await UsuarioModel.findOne(req.body);

        if (existeUsuario) {
          return res.status(400).send("El usuario ya existe");
        }
        const nuevoUsuario = new UsuarioModel({
          first_name,
          last_name,
          email,
          password: createHash(password),
          age,
        })

       await nuevoUsuario.save();

    const token = jwt.sign(
        {
          usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
          email: nuevoUsuario.email,
          role: nuevoUsuario.role,
        },

        process.env.JWT_SECRET || "codehouse",
        { expiresIn: "1h" }
      );
      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/session/current");
    } catch (error) {
      next(error);
      console.error("Error en registro:", error);
      res.status(500).send(error.message || "Error al registrar el usuario");
    }
  }

  async login(req, res, next) {
    const { usuario, password } = req.body;

    try {
      const usuarioEsta = await UsuarioModel.findOne({ usuario });

      if (!usuarioEsta) {
        return res.status(401).send("Usuario no valido");
      }

      if (!isValidPassword(password, usuarioEsta)) {
        return res.status(401).send("Contraseña incorrecta");
      }
      console.log("Usuario encontrado:", usuarioEsta);
      console.log("Contraseña válida:", isValidPassword(password, usuarioEsta));

      const token = jwt.sign(
        {
          usuario: usuarioEsta.usuario,
          email: usuarioEsta.email,
          role: usuarioEsta.role,
        },
        process.env.JWT_SECRET || "codehouse",
        { expiresIn: "1h" }
      );

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.redirect("/api/session/current");
    } catch (error) {
      next(error);
      console.error("Error en login:", error);
      return res.status(500).send("Error del servidor: " + error.message);
    }
  }

  async current(req, res) {
    try {
      if (req.user) {
        res.render("home", { usuario: req.user.usuario });
        console.log("usuario", req.user);
        
      } else {
        res.status(401).send("No autorizado");
      }
    } catch (error) {
      console.log("Error en current", error);
      res.status(500).json({ message: "Error interno en el servidor" });
    }
  }

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    try {
      if (req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado!");
      }
      res.render("admin");
    } catch (error) {
      console.log("Error en admin", error);
    }
  }
}  

export default new UserController();