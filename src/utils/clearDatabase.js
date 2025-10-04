import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Role from '../models/Role.js';

dotenv.config();

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Limpiar colecciones
        await User.deleteMany({});
        await Role.deleteMany({});
        
        console.log('Base de datos limpiada exitosamente');
        console.log('- Usuarios eliminados');
        console.log('- Roles eliminados');
        
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    } catch (error) {
        console.error('Error al limpiar la base de datos:', error);
        process.exit(1);
    }
}

clearDatabase();