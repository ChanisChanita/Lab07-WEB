import userRepository from '../repositories/UserRepository.js';

class UserService {

    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        console.log('UserService.getById llamado con ID:', id);
        
        const user = await userRepository.findById(id);
        if (!user) {
            console.log('Usuario no encontrado para ID:', id);
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        
        console.log('Usuario encontrado en BD:', user);
        console.log('Roles del usuario:', user.roles);
        
        const result = {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            url_profile: user.url_profile,
            adress: user.adress,
            roles: user.roles.map(r => r.name)
        };
        
        console.log('Resultado a devolver:', result);
        return result;
    }
}

export default new UserService();
