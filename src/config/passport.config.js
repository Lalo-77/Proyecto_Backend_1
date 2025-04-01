import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UsuarioModel from "../models/usuarios.model.js";
import dotenv from "dotenv";

dotenv.config();

const initializePassport = () => {
    const cookieExtractor = (req) => {
        let token = null;
        if(req && req.cookies) {
            token = req.cookies["coderCookieToken"];        
        }
        return token;
    };
    
    const options = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()]),
        secretOrkey: process.env.SECRET_KEY || "default_secet", 
    };
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrkey: process.env.SECRET_KEY,
    };
    
    passport.use(
        new JWTStrategy( options, async(jwt_payload, done) => {
            try {
                if(!jwt_payload.id) {
                    return done(null, false, { message: "Token invalido" });
                }
                const user = await UsuarioModel.findById(jwt_payload.id);
                if(!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);

    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UsuarioModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null)
        }
    });
}
    
export default initializePassport;