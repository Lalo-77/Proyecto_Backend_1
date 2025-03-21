import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/validar.js";


  export const register = async (user) => {
    try {
      const { email, password, isGitHub } = user;
      const existeUsuario = await this.getUserByEmail(email);
        if (existeUsuario) throw new Error("El usuario ua existe");
         if(isGitHub) { 
      const newUser = await this.dao.register(user);
        return newUser;
      }
      const newUser = await this.dao.register({
        ...user,
        password: createHash(password),

      });
      return newUser;
    } catch (error) {
      throw error;
  }  
};

export const login = async (email, password) => {
  try {
    const userExist = await userDao.getUserByEmail(email);
      if (!userExist) throw new Error("El usuario no existe");
    const passVaid = isValidPassword(password, userExist);
      if (!passVaid) throw new Error("Contraseña incorrecta");
    return userExist;
  } catch (error) {
    throw error;
  }
};

export const getByEmail = async (email) => {
  try {
    return await userDao.getByEmail(email);
  } catch (error) {
    throw new Error(error);
  }
};

export const getById = async (id) => {
  try {
    return await userDao.getById(id);
  } catch (error) {
    throw new Error(error);
  }
};