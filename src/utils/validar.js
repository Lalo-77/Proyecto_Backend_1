import bcrypt from 'bcrypt';  

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
    //console.log("Tipo de dato de password:", typeof password);
    //console.log("Tipo de dato de hash:", typeof user);

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };