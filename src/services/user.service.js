import UserRepository from "../repositories/User.Repository.js";
import { createHash, isValidPassword } from "../utils/validar.js";

class UserService {
    async register(userData) {
         const existeUsuario = await UserRepository.getUserByEmail(userData.email);
         
         if(existeUsuario) throw new Error("El usuario ya existe");

         userData.password = createHash(userData.password);
         return await UserRepository.createUser(userData);
    }

    
async login(email, password){
        const usuario = await UserRepository.getUserByEmail(email);
        if (!usuario || !isValidPassword( usuario), password) throw new Error("Credenciales incorrectas");
        return usuario;
    }
}

export default new UserService();