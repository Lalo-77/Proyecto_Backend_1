import UsuarioModel  from "../models/usuarios.model.js";

class UserDao {
    constructor(model){
        this.model = model;
    }
       async register(user) {
        try {
            return await this.model.create(user);
        } catch (error) {
            throw new Error(error);
        }
       } 
       async login(email, password){
            try {
                return await this.model.findOne({email, password})
            } catch (error) {
                throw new Error(error);
            }
       }
    }

export const userDao = new UserDao(UsuarioModel);