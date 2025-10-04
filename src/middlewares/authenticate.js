import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        console.log('Header de autorización:', header);

        if (!header || !header.startsWith('Bearer ')) 
            return res.status(401).json({ message: 'No autorizado' });

        const token = header.split(' ')[1];
        console.log('Token extraído:', token.substring(0, 20) + '...');
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Payload del token:', payload);

        req.userId = payload.sub;
        req.userRoles = payload.roles || [];
        
        console.log('Usuario ID:', req.userId);
        console.log('Roles del usuario:', req.userRoles);
        
        next();

    } catch (err) {
        console.log('Error en autenticación:', err.message);
        return res.status(401).json({ message: 'Token no válido o caducado' });
    }
}
