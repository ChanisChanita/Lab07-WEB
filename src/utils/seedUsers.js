import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    try {
        // Verificar si ya existe un usuario admin con el email anterior
        const oldAdmin = await userRepository.findByEmail('admin@admin.com');
        if (oldAdmin) {
            console.log('Eliminando usuario admin anterior...');
            // En una implementación real, podrías usar User.findByIdAndDelete(oldAdmin._id)
            // Por ahora, solo mostramos el mensaje
        }

        // Verificar si ya existe el nuevo usuario admin
        const existingAdmin = await userRepository.findByEmail('sandra.anchelia@tecsup.edu.pe');
        if (existingAdmin) {
            console.log('Usuario admin sandra.anchelia@tecsup.edu.pe ya existe');
            return;
        }

        // Obtener el rol de admin
        const adminRole = await roleRepository.findByName('admin');
        if (!adminRole) {
            console.error('Rol admin no encontrado. Ejecuta seedRoles primero.');
            return;
        }

        // Encriptar password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashedPassword = await bcrypt.hash('Admin@123', saltRounds);

        console.log('Creando usuario admin con email: sandra.anchelia@tecsup.edu.pe');
        console.log('Password original: Admin@123');

        // Crear usuario admin
        const adminUser = await userRepository.create({
            email: 'sandra.anchelia@tecsup.edu.pe',
            password: hashedPassword,
            name: 'Sandra',
            lastName: 'Anchelia',
            phoneNumber: '+51 987654321',
            birthdate: new Date('2003-01-07'),
            url_profile: 'https://github.com/ChanisChanita',
            adress: '',
            roles: [adminRole._id]
        });

        console.log('Usuario admin creado exitosamente:', adminUser.email);
        console.log('Para iniciar sesión usa:');
        console.log('Email: sandra.anchelia@tecsup.edu.pe');
        console.log('Password: Admin@123');
    } catch (error) {
        console.error('Error al crear usuario admin:', error.message);
        console.error('Stack trace:', error.stack);
    }
}