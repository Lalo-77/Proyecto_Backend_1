//import UserRepository from "../repositories/User.Repository.js";
import { userDao } from "../dao/cart.dao.js";
import { createHash, isValidPassword } from "../herramientas/validar.js";


class UserService {
    async registerUser(userData) {
         const existeUsuario = await UserRepository.getUserByEmail(userData.email);
         
         if(existeUsuario) throw new Error("El usuario ya existe");

         userData.password = createHash(userData.password);
         return await UserRepository.createUser(userData);
    }


    async loginUser(email, password){
        const user = await UserRepository.getUserByEmail(email);
        if (!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas");
        return user;
    }
}

export default new UserService();