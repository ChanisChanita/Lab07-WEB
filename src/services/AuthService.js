import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

    async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile, adress, roles = ['user'] }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        //lógica par encriptar el password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(password, saltRounds);

        // Asignar los role ids
        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        const user = await userRepository.create({ 
            email, 
            password: hashed, 
            name, 
            lastName,
            phoneNumber,
            birthdate: new Date(birthdate),
            url_profile,
            adress,
            roles: roleDocs 
        });

        return {
                id: user._id,
                email: user.email,
                name: user.name,
                lastName: user.lastName
            };
    }

    async signIn({ email, password }) {
        console.log('Intento de login con email:', email);
        
        const user = await userRepository.findByEmail(email);
        if (!user) {
            console.log('Usuario no encontrado para email:', email);
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        console.log('Usuario encontrado:', user.email);
        console.log('Comparando password...');
        
        const ok = await bcrypt.compare(password, user.password);
        console.log('Resultado de comparación de password:', ok);
        
        if (!ok) {
            console.log('Password incorrecto para usuario:', email);
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        console.log('Login exitoso, generando token...');
        console.log('Roles del usuario para JWT:', user.roles.map(r => r.name));

        const token = jwt.sign({ 
            sub: user._id, 
            roles: user.roles.map(r => r.name) }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            }
        );
        
        console.log('Token generado exitosamente');
        // console.log("Verify:", jwt.verify(token, process.env.JWT_SECRET));

        return { token };
    }
}

export default new AuthService();
